import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LoaderCircle, MapPin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { MapCulturePreview } from "@/components/MapCulturePreview";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { cityMarkers, type CityMarker } from "@/data/home";
import {
  GRAND_CANAL_CITY_SLUGS,
  getAdjacentMapCity,
  getMapCity,
  withSelectedMapCity,
} from "@/lib/map-explorer";
import { cn } from "@/lib/utils";
import type { City, CitySlug } from "@/types/city";

type Position = [number, number];

type GeoGeometry =
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] };

type GeoFeature = {
  type: "Feature";
  properties: { name: string; adcode: number };
  geometry: GeoGeometry;
};

type GeoFeatureCollection = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const VIEWBOX_WIDTH = 620;
const VIEWBOX_HEIGHT = 660;
const MAP_PADDING = 34;
const LONGITUDE_FACTOR = Math.cos((33 * Math.PI) / 180);

function toMapPoint([longitude, latitude]: Position): Position {
  return [longitude * LONGITUDE_FACTOR, -latitude];
}

function collectPositions(value: unknown, positions: Position[]) {
  if (!Array.isArray(value)) return;

  if (
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    positions.push(value as Position);
    return;
  }

  value.forEach((entry) => collectPositions(entry, positions));
}

function getBounds(features: GeoFeature[]): Bounds {
  const positions: Position[] = [];

  features.forEach((feature) =>
    collectPositions(feature.geometry.coordinates, positions),
  );

  const projected = positions.map(toMapPoint);

  return projected.reduce<Bounds>(
    (bounds, [x, y]) => ({
      minX: Math.min(bounds.minX, x),
      maxX: Math.max(bounds.maxX, x),
      minY: Math.min(bounds.minY, y),
      maxY: Math.max(bounds.maxY, y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
}

function project(position: Position, bounds: Bounds): Position {
  const [mapX, mapY] = toMapPoint(position);

  const availableWidth = VIEWBOX_WIDTH - MAP_PADDING * 2;
  const availableHeight = VIEWBOX_HEIGHT - MAP_PADDING * 2;

  const scale = Math.min(
    availableWidth / (bounds.maxX - bounds.minX),
    availableHeight / (bounds.maxY - bounds.minY),
  );

  const renderedWidth = (bounds.maxX - bounds.minX) * scale;
  const renderedHeight = (bounds.maxY - bounds.minY) * scale;

  const offsetX = (VIEWBOX_WIDTH - renderedWidth) / 2;
  const offsetY = (VIEWBOX_HEIGHT - renderedHeight) / 2;

  return [
    (mapX - bounds.minX) * scale + offsetX,
    (mapY - bounds.minY) * scale + offsetY,
  ];
}

function ringToPath(ring: Position[], bounds: Bounds) {
  return ring
    .map((position, index) => {
      const [x, y] = project(position, bounds);

      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

function geometryToPath(geometry: GeoGeometry, bounds: Bounds) {
  if (geometry.type === "Polygon") {
    return geometry.coordinates
      .map((ring) => ringToPath(ring, bounds))
      .join(" ");
  }

  return geometry.coordinates
    .flatMap((polygon) =>
      polygon.map((ring) => ringToPath(ring, bounds)),
    )
    .join(" ");
}

function routeToPath(cities: CityMarker[], bounds: Bounds) {
  return cities
    .map((city, index) => {
      const [x, y] = project(city.coordinates, bounds);

      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function JiangsuMapExplorer() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [searchParams, setSearchParams] = useSearchParams();

  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [mapError, setMapError] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<CityMarker | null>(null);
  const [focusedCitySlug, setFocusedCitySlug] =
    useState<CitySlug | null>(null);

  const [announcement, setAnnouncement] = useState("");
  const [culturePreview, setCulturePreview] = useState<City | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const markerRefs =
    useRef<Partial<Record<CitySlug, SVGGElement | null>>>({});

  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const previewRequestRef = useRef(0);

  const selectedCity = useMemo(
    () => getMapCity(searchParams.get("city")),
    [searchParams],
  );

  const displayedCity = hoveredCity ?? selectedCity;

  const isTemporaryPreview =
    hoveredCity !== null &&
    hoveredCity.slug !== selectedCity.slug;

  useEffect(() => {
    let cancelled = false;

    fetch("/data/jiangsu-cities.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Map data could not be loaded");
        }

        return response.json() as Promise<GeoFeatureCollection>;
      })
      .then((data) => {
        if (!cancelled) {
          setFeatures(data.features);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      culturePreview &&
      culturePreview.slug !== selectedCity.slug
    ) {
      setCulturePreview(null);
    }
  }, [culturePreview, selectedCity.slug]);

  const bounds = useMemo(
    () => (features.length ? getBounds(features) : null),
    [features],
  );

  const canalPath = useMemo(() => {
    if (!bounds) return "";

    const canalCities = GRAND_CANAL_CITY_SLUGS.map((slug) =>
      getMapCity(slug),
    );

    return routeToPath(canalCities, bounds);
  }, [bounds]);

  function commitCity(city: CityMarker, moveFocus = false) {
    setSearchParams(
      withSelectedMapCity(searchParams, city.slug),
      {
        preventScrollReset: true,
        replace: true,
      },
    );

    setHoveredCity(null);
    setCulturePreview(null);
    setPreviewError(false);

    setAnnouncement(
      language === "zh"
        ? `已选择${city.name.zh}：${city.label.zh}`
        : `${city.name.en} selected: ${city.label.en}`,
    );

    if (moveFocus) {
      window.requestAnimationFrame(() =>
        markerRefs.current[city.slug]?.focus(),
      );
    }
  }

  function handleMarkerKeyDown(
    event: ReactKeyboardEvent<SVGGElement>,
    city: CityMarker,
  ) {
    let nextCity: CityMarker | null = null;

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      nextCity = getAdjacentMapCity(city.slug, -1);
    } else if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      nextCity = getAdjacentMapCity(city.slug, 1);
    } else if (event.key === "Home") {
      nextCity = cityMarkers[0];
    } else if (event.key === "End") {
      nextCity = cityMarkers[cityMarkers.length - 1];
    } else if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      commitCity(city);
      return;
    }

    if (nextCity) {
      event.preventDefault();
      commitCity(nextCity, true);
    }
  }

  async function openCulturePreview() {
    const cityToOpen = displayedCity;

    commitCity(cityToOpen);

    const requestId = ++previewRequestRef.current;

    setPreviewLoading(true);
    setPreviewError(false);

    try {
      const { getCityBySlug } =
        await import("@/data/cities");

      const city = getCityBySlug(cityToOpen.slug);

      if (!city) {
        throw new Error("City data could not be found");
      }

      if (previewRequestRef.current !== requestId) {
        return;
      }

      setCulturePreview(city);

      window.requestAnimationFrame(() =>
        previewHeadingRef.current?.focus(),
      );
    } catch {
      if (previewRequestRef.current === requestId) {
        setPreviewError(true);
      }
    } finally {
      if (previewRequestRef.current === requestId) {
        setPreviewLoading(false);
      }
    }
  }

  function closeCulturePreview() {
    previewRequestRef.current += 1;

    setCulturePreview(null);
    setPreviewLoading(false);
    setPreviewError(false);

    window.requestAnimationFrame(() =>
      previewButtonRef.current?.focus(),
    );
  }

  return (
    <section
      aria-labelledby="city-map-title"
      className="relative min-h-[590px] lg:pl-4"
      id="cities"
    >
      {/* 地图标题 */}
      <div
        className="
          mb-5
          flex items-end justify-between
          gap-4
          border-b border-[#C1DDDB]/25
          pb-5
        "
      >
        <div>
          <p
            className="
              flex items-center gap-2
              text-xs font-semibold uppercase
              tracking-[0.18em]
              text-[#EAC459]
            "
          >
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#EAC459]/70"
            />

            {language === "zh"
              ? "沿水而行"
              : "Follow the water"}
          </p>

          <h2
            className="
              mt-2
              font-display
              text-2xl font-semibold
              text-[#EAF1F9]
            "
            id="city-map-title"
          >
            {language === "zh"
              ? "探索江苏十三城"
              : "Explore Jiangsu's 13 cities"}
          </h2>
        </div>

        <p
          className="
            hidden max-w-56
            text-right
            text-sm leading-6
            text-[#D1DED7]
            sm:block
          "
          id="map-help"
        >
          {language === "zh"
            ? "点击选择；方向键切换城市"
            : "Select a marker; use arrow keys to move"}
        </p>
      </div>

      {/* 地图主体 */}
      <div
        className="
          overflow-hidden
          border border-[#C1DDDB]/25
          bg-[linear-gradient(145deg,#496F81_0%,#426F7C_52%,#3D6671_100%)]
          shadow-[0_22px_70px_rgba(46,72,83,0.28)]
        "
      >
        <div className="relative">
          {/* 水流背景 */}
          <div
            aria-hidden="true"
            className="map-current-lines opacity-50"
          />

          {/* 淡暖色环境光 */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -right-20 top-16
              h-72 w-72
              rounded-full
              bg-[#EAC459]/6
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -left-20 bottom-16
              h-80 w-80
              rounded-full
              bg-[#81B3A9]/10
              blur-3xl
            "
          />

          {bounds ? (
            <svg
              aria-describedby="map-help"
              aria-label={
                language === "zh"
                  ? "江苏十三市互动地图"
                  : "Interactive map of Jiangsu's thirteen cities"
              }
              className="relative z-10 h-[500px] w-full sm:h-[600px]"
              preserveAspectRatio="xMidYMid meet"
              role="group"
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            >
              {/* 城市区域 */}
              <g aria-hidden="true">
                {features.map((feature, index) => {
                  const city = cityMarkers.find(
                    (item) =>
                      item.mapName === feature.properties.name,
                  );

                  const isSelected =
                    city?.slug === selectedCity.slug;

                  const isDisplayed =
                    city?.slug === displayedCity.slug;

                  return (
                    <motion.path
                      animate={{ opacity: 1 }}
                      className={cn(
                        city && "cursor-pointer",

                        `
                          stroke-[#B8D4D1]
                          stroke-[1.2]
                          transition-[fill,stroke,filter]
                          duration-200
                        `,

                        isSelected
                          ? `
                              fill-[#EAC459]
                              stroke-[#FFF0B5]
                              drop-shadow-[0_3px_10px_rgba(234,196,89,0.20)]
                            `
                          : isDisplayed
                            ? `
                                fill-[#81B3A9]
                                stroke-[#D8ECE8]
                              `
                            : `
                                fill-[#42769D]
                                hover:fill-[#6E9FA5]
                                hover:stroke-[#D6E7E4]
                              `,
                      )}
                      data-city-shape={city?.slug}
                      d={geometryToPath(
                        feature.geometry,
                        bounds,
                      )}
                      fillRule="evenodd"
                      initial={{
                        opacity: reduceMotion ? 1 : 0,
                      }}
                      key={feature.properties.adcode}
                      onClick={() =>
                        city && commitCity(city)
                      }
                      onMouseEnter={() =>
                        city && setHoveredCity(city)
                      }
                      onMouseLeave={() =>
                        setHoveredCity(null)
                      }
                      transition={{
                        delay: reduceMotion
                          ? 0
                          : index * 0.025,
                        duration: 0.35,
                      }}
                    />
                  );
                })}
              </g>

              {/* 大运河文化轴 */}
              <g
                aria-hidden="true"
                className="pointer-events-none"
              >
                <path
                  data-canal-axis="true"
                  d={canalPath}
                  fill="none"
                  opacity="0.82"
                  stroke="#C1DDDB"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />

                <path
                  d={canalPath}
                  fill="none"
                  opacity="0.86"
                  stroke="#EAF1F9"
                  strokeDasharray="3 10"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </g>

              {/* 城市节点 */}
              <g>
                {cityMarkers.map((city, index) => {
                  const [x, y] = project(
                    city.coordinates,
                    bounds,
                  );

                  const isSelected =
                    city.slug === selectedCity.slug;

                  const isDisplayed =
                    city.slug === displayedCity.slug;

                  const isFocused =
                    city.slug === focusedCitySlug;

                  return (
                    <motion.g
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      aria-label={`${city.name.zh}, ${city.name.en}: ${city.label[language]}`}
                      aria-pressed={isSelected}
                      className="cursor-pointer outline-none"
                      data-city-marker={city.slug}
                      initial={{
                        opacity: reduceMotion ? 1 : 0,
                        y: reduceMotion ? 0 : -8,
                      }}
                      key={city.slug}
                      onBlur={() => {
                        setFocusedCitySlug(null);
                        setHoveredCity(null);
                      }}
                      onClick={() =>
                        commitCity(city)
                      }
                      onFocus={() => {
                        setFocusedCitySlug(city.slug);
                        setHoveredCity(city);
                      }}
                      onKeyDown={(event) =>
                        handleMarkerKeyDown(event, city)
                      }
                      onMouseEnter={() =>
                        setHoveredCity(city)
                      }
                      onMouseLeave={() =>
                        setHoveredCity(null)
                      }
                      ref={(node) => {
                        markerRefs.current[city.slug] =
                          node;
                      }}
                      role="button"
                      tabIndex={isSelected ? 0 : -1}
                      transition={{
                        delay: reduceMotion
                          ? 0
                          : 0.15 + index * 0.035,
                        duration: 0.3,
                      }}
                    >
                      <title>
                        {`${city.name.zh} · ${city.name.en}`}
                      </title>

                      <circle
                        cx={x}
                        cy={y}
                        fill="transparent"
                        r="22"
                        stroke="transparent"
                      />

                      {/* 键盘焦点 */}
                      {isFocused && (
                        <circle
                          className="
                            fill-none
                            stroke-[#EAF1F9]
                            stroke-[2.5]
                          "
                          cx={x}
                          cy={y}
                          r="18"
                        />
                      )}

                      {/* 当前选中外圈 */}
                      {isSelected && (
                        <circle
                          className="
                            fill-none
                            stroke-[#F4D975]
                            stroke-2
                            opacity-90
                          "
                          cx={x}
                          cy={y}
                          r="14"
                        />
                      )}

                      {/* 城市节点 */}
                      <circle
                        className={cn(
                          `
                            stroke-[#EAF1F9]
                            stroke-[2.5]
                            transition-[fill,r]
                            duration-150
                          `,
                          isSelected
                            ? "fill-[#EAC459]"
                            : isDisplayed
                              ? "fill-[#81B3A9]"
                              : "fill-[#89B8B0]",
                        )}
                        cx={x}
                        cy={y}
                        r={
                          isSelected || isDisplayed
                            ? 6.5
                            : 5
                        }
                      />

                      {/* 城市标签 */}
                      {isDisplayed && (
                        <text
                          className="
                            select-none
                            fill-[#F6F7F2]
                            text-[13px]
                            font-bold
                          "
                          textAnchor="middle"
                          x={x}
                          y={y - 20}
                        >
                          {city.name[language]}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </g>
            </svg>
          ) : (
            /* 加载状态 */
            <div
              className="
                grid h-[500px]
                place-items-center
                sm:h-[600px]
              "
              role="status"
            >
              <div
                className="
                  flex max-w-72
                  items-center gap-3
                  text-sm leading-6
                  text-[#D1DED7]
                "
              >
                {!mapError && (
                  <span
                    className="
                      size-3 shrink-0
                      animate-pulse
                      rounded-full
                      bg-[#EAC459]
                    "
                  />
                )}

                {mapError
                  ? language === "zh"
                    ? "地图数据暂时无法载入，请稍后重试。"
                    : "Map data could not be loaded. Please try again."
                  : language === "zh"
                    ? "正在展开江苏水系地图…"
                    : "Opening the Jiangsu water atlas…"}
              </div>
            </div>
          )}

          {/* 城市信息浮层 */}
          <motion.aside
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              relative z-20
              border-t border-[#C1DDDB]/22
              bg-[#4C6572]/95
              p-5
              backdrop-blur-md

              sm:absolute
              sm:bottom-6
              sm:left-6
              sm:w-[350px]
              sm:border
              sm:border-[#C1DDDB]/25
              sm:p-6

              sm:shadow-[0_16px_45px_rgba(35,57,67,0.28)]
            "
            data-map-info="true"
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 10,
            }}
            key={displayedCity.slug}
            transition={{
              duration: 0.18,
            }}
          >
            <p
              className="
                mb-3
                text-xs font-semibold
                uppercase
                tracking-[0.12em]
                text-[#EAC459]
              "
            >
              {isTemporaryPreview
                ? language === "zh"
                  ? "悬停预览"
                  : "Hover preview"
                : language === "zh"
                  ? "当前选择"
                  : "Selected city"}
            </p>

            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden="true"
                className="
                  mt-1
                  size-5 shrink-0
                  text-[#EAC459]
                "
              />

              <div className="min-w-0">
                <p
                  className="
                    font-display
                    text-2xl font-semibold
                    text-[#F3F6F3]
                  "
                >
                  {displayedCity.name[language]}

                  <span
                    className="
                      ml-2
                      font-sans
                      text-sm font-semibold
                      text-[#C1DDDB]
                    "
                  >
                    {
                      displayedCity.name[
                        language === "zh"
                          ? "en"
                          : "zh"
                      ]
                    }
                  </span>
                </p>

                <p
                  className="
                    mt-2
                    text-sm leading-6
                    text-[#D6E0DB]
                  "
                >
                  {displayedCity.label[language]}
                </p>
              </div>
            </div>

            {/* 按钮 */}
            <div
              className="
                mt-5
                flex flex-col gap-2
                sm:flex-row
                sm:items-center
              "
            >
              <Button
                asChild
                className="
                  min-h-11 w-full
                  border border-[#EAC459]/45
                  bg-[#EAC459]
                  font-semibold
                  text-[#425E70]

                  hover:bg-[#F0CF72]
                  hover:text-[#425E70]

                  sm:w-auto
                "
                size="sm"
              >
                <Link
                  to={`/city/${displayedCity.slug}`}
                >
                  <ArrowUpRight aria-hidden="true" />

                  {language === "zh"
                    ? "Explore · 城市详情"
                    : "Explore city"}
                </Link>
              </Button>

              <Button
                className="
                  min-h-11 w-full
                  border border-[#C1DDDB]/22
                  bg-[#C1DDDB]/8
                  text-[#EAF1F9]

                  hover:bg-[#81B3A9]/18
                  hover:text-white

                  sm:w-auto
                "
                disabled={previewLoading}
                onClick={openCulturePreview}
                ref={previewButtonRef}
                size="sm"
                variant="ghost"
              >
                {previewLoading && (
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                  />
                )}

                {language === "zh"
                  ? "六类速览"
                  : "Six-part preview"}
              </Button>
            </div>

            {previewError && (
              <p
                className="
                  mt-3
                  text-sm leading-6
                  text-[#FFD2C5]
                "
                role="alert"
              >
                {language === "zh"
                  ? "资料载入失败，请重试。"
                  : "The city preview could not be loaded. Try again."}
              </p>
            )}
          </motion.aside>
        </div>

        {/* 地图图例 */}
        <div
          className="
            flex flex-wrap
            gap-x-5 gap-y-2
            border-t border-[#C1DDDB]/20
            bg-[#425E6B]
            px-5 py-3
            text-xs
            text-[#D1DED7]
          "
        >
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="
                size-2.5
                rounded-full
                border-2 border-[#F4F4EA]
                bg-[#EAC459]
              "
            />

            {language === "zh"
              ? "当前城市"
              : "Selected city"}
          </span>

          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="
                h-0.5 w-6
                bg-[#C1DDDB]
              "
            />

            {language === "zh"
              ? "大运河文化轴（示意）"
              : "Grand Canal cultural axis (schematic)"}
          </span>
        </div>
      </div>

      {/* 城市索引 */}
      <nav
        aria-label={
          language === "zh"
            ? "十三市索引"
            : "Thirteen-city index"
        }
        className="
          border-x border-b
          border-[#C1DDDB]/22
          bg-[#4B6571]
        "
      >
        <p
          className="
            border-b border-[#C1DDDB]/18
            px-4 py-3
            text-xs font-semibold
            uppercase
            tracking-[0.12em]
            text-[#BFD3CE]
          "
        >
          {language === "zh"
            ? "城市索引"
            : "City index"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          {cityMarkers.map((city) => {
            const isSelected =
              city.slug === selectedCity.slug;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  `
                    min-h-12
                    border-b border-r
                    border-[#C1DDDB]/14
                    px-4 py-3
                    text-left text-sm
                    outline-none
                    transition-all duration-200

                    focus-visible:relative
                    focus-visible:z-10
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-[#EAC459]
                  `,
                  isSelected
                    ? `
                        bg-[#EAC459]
                        font-semibold
                        text-[#425E70]
                      `
                    : `
                        bg-transparent
                        text-[#D5E0DC]
                        hover:bg-[#81B3A9]/16
                        hover:text-white
                      `,
                )}
                key={city.slug}
                onClick={() => commitCity(city)}
                type="button"
              >
                <span>{city.name[language]}</span>

                <span
                  className={cn(
                    "ml-2 text-xs",
                    isSelected
                      ? "text-[#5E6C82]/80"
                      : "text-[#B3C6BB]",
                  )}
                >
                  {
                    city.name[
                      language === "zh"
                        ? "en"
                        : "zh"
                    ]
                  }
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 文化速览 */}
      <AnimatePresence initial={false}>
        {culturePreview && (
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: reduceMotion ? 0 : -6,
            }}
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 8,
            }}
            key={culturePreview.slug}
            transition={{
              duration: 0.18,
            }}
          >
            <MapCulturePreview
              city={culturePreview}
              language={language}
              onClose={closeCulturePreview}
              ref={previewHeadingRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <p
        aria-live="polite"
        className="sr-only"
      >
        {announcement}
      </p>
    </section>
  );
}