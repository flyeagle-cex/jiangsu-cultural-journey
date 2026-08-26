import { useEffect } from "react";
import { ArrowRight, BookmarkX, MapPin, Palette } from "lucide-react";
import { Link } from "react-router-dom";

import { CityAmbientLayer } from "@/components/CityAmbientLayer";
import { Footer } from "@/components/Footer";
import { UserInterestSelector } from "@/components/UserInterestSelector";
import { useLanguage } from "@/context/LanguageContext";
import { useSavedItems } from "@/context/UserSavedStateContext";
import { BRAND_NAME } from "@/data/brand";
import { cityManifest } from "@/data/city-manifest";
import { getCityHeroVisual } from "@/data/city-media";
import { creativeThemeLabels } from "@/data/creative-manifest";
import {
  getCreativeProjectPath,
  getPublishedCreativeProjects,
} from "@/lib/creative";
import { setDocumentMeta } from "@/lib/document-meta";

export const USER_CENTER_PATH = "/user";

export default function UserCenterPage() {
  const { language } = useLanguage();
  const {
    favoriteCities,
    favoriteCreativeProjects,
    toggleCity,
    toggleCreative,
  } = useSavedItems();

  const savedCities = cityManifest.filter((city) => favoriteCities.includes(city.slug));
  const savedCreativeProjects = getPublishedCreativeProjects()
    .filter((project) => favoriteCreativeProjects.includes(project.slug))
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.slug.localeCompare(right.slug),
    );

  useEffect(() => {
    setDocumentMeta({
      title:
        language === "zh"
          ? `我的灵舟之旅 · ${BRAND_NAME.zh}`
          : `My Shuiling Journey · ${BRAND_NAME.en}`,
      description:
        language === "zh"
          ? "收藏你想再次探索的江苏城市与文化创意。"
          : "Save the cities and creative works you want to explore again.",
    });
  }, [language]);

  return (
    <>
      <main className="user-center-field relative isolate min-h-screen overflow-hidden bg-[#5E6C82] pt-16 text-[#EAF1F9]" id="main-content">
        <CityAmbientLayer variant="user" />
        <header className="relative z-10 border-b border-[#C1DDDB]/30 bg-[#42769D]/95 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-[1240px]">
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {language === "zh" ? "我的灵舟之旅" : "My Shuiling Journey"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#EAF1F9] sm:text-lg">
              {language === "zh"
                ? "收藏你想再次探索的江苏城市与文化创意。"
                : "Save the cities and creative works you want to explore again."}
            </p>
            <p className="mt-5 max-w-2xl border-t border-[#C1DDDB]/30 pt-4 text-sm leading-6 text-[#C1DDDB]">
              {language === "zh"
                ? "这里没有账户或云端同步，收藏与兴趣偏好仅保存在当前浏览器中。"
                : "There is no account or cloud sync. Saved items and interests are stored only in this browser."}
            </p>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-20 sm:px-6 lg:px-10">
          <UserInterestSelector />

          <section aria-labelledby="saved-cities-heading" className="border-b border-[#C1DDDB]/28 py-10 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl" id="saved-cities-heading">
                  {language === "zh" ? "收藏城市" : "Saved Cities"}
                </h2>
                <p className="mt-2 text-sm text-[#C1DDDB]">
                  {language === "zh"
                    ? "按江苏十三市的固定顺序排列。"
                    : "Listed in the canonical order of Jiangsu's thirteen cities."}
                </p>
              </div>
              {savedCities.length > 0 && (
                <p className="text-sm tabular-nums text-[#C1DDDB]">
                  {language === "zh"
                    ? `${savedCities.length} 座城市`
                    : `${savedCities.length} ${savedCities.length === 1 ? "city" : "cities"}`}
                </p>
              )}
            </div>

            {savedCities.length === 0 ? (
              <div className="mt-7 border-y border-[#C1DDDB]/28 py-8" role="status">
                <MapPin aria-hidden="true" className="size-5 text-[#EAC459]" />
                <p className="mt-4 text-lg font-semibold">
                  {language === "zh" ? "还没有收藏城市。" : "No cities saved yet."}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#C1DDDB]">
                  {language === "zh"
                    ? "浏览十三市时，可以将感兴趣的城市保存到这里。"
                    : "When you explore the thirteen cities, you can save the ones that interest you here."}
                </p>
                <Link
                  className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#EAC459] px-4 py-2.5 text-sm font-semibold text-[#EAC459] outline-none transition-colors duration-150 hover:bg-[#EAC459] hover:text-[#34465A] focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82]"
                  to="/#cities"
                >
                  {language === "zh" ? "浏览十三市" : "Explore the 13 Cities"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {savedCities.map((city) => {
                  const visual = getCityHeroVisual(city.slug);
                  return (
                    <article
                      className="grid overflow-hidden border border-[#C1DDDB]/28 bg-[#4F6F80] sm:grid-cols-[11rem_minmax(0,1fr)]"
                      data-saved-city={city.slug}
                      key={city.slug}
                    >
                      <img
                        alt={visual.alt[language]}
                        className="aspect-[16/9] h-full min-h-40 w-full object-cover sm:aspect-auto"
                        height="210"
                        loading="lazy"
                        src={visual.src}
                        style={{ objectPosition: visual.objectPosition }}
                        width="320"
                      />
                      <div className="flex min-w-0 flex-col p-5">
                        <div>
                          <h3 className="font-display text-2xl font-semibold leading-tight">
                            {city.name.zh}
                          </h3>
                          <p className="mt-1 text-sm text-[#C1DDDB]" lang="en">
                            {city.name.en}
                          </p>
                          <p className="mt-4 text-sm leading-6 text-[#EAF1F9]/90">
                            {city.tagline[language]}
                          </p>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#C1DDDB]/24 pr-14 pt-4 sm:pr-0">
                          <Link
                            className="inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                            to={`/city/${city.slug}`}
                          >
                            {language === "zh" ? "进入城市" : "Explore city"}
                            <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                          </Link>
                          <button
                            aria-label={
                              language === "zh"
                                ? `取消收藏${city.name.zh}`
                                : `Remove ${city.name.en} from saved cities`
                            }
                            className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-sm text-[#C1DDDB] outline-none transition-colors duration-150 hover:text-[#EAF1F9] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                            onClick={() => toggleCity(city.slug)}
                            type="button"
                          >
                            <BookmarkX aria-hidden="true" className="size-4" />
                            {language === "zh" ? "取消收藏" : "Remove"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section aria-labelledby="saved-creative-heading" className="border-b border-[#C1DDDB]/28 py-10 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl" id="saved-creative-heading">
                  {language === "zh" ? "收藏文创" : "Saved Creative Works"}
                </h2>
                <p className="mt-2 text-sm text-[#C1DDDB]">
                  {language === "zh"
                    ? "仅展示文创中心内已发布的正式作品。"
                    : "Only published projects from the Creative Center appear here."}
                </p>
              </div>
              {savedCreativeProjects.length > 0 && (
                <p className="text-sm tabular-nums text-[#C1DDDB]">
                  {language === "zh"
                    ? `${savedCreativeProjects.length} 件作品`
                    : `${savedCreativeProjects.length} ${savedCreativeProjects.length === 1 ? "work" : "works"}`}
                </p>
              )}
            </div>

            {savedCreativeProjects.length === 0 ? (
              <div className="mt-7 border-y border-[#C1DDDB]/28 py-8" role="status">
                <Palette aria-hidden="true" className="size-5 text-[#F09C77]" />
                <p className="mt-4 text-lg font-semibold">
                  {language === "zh" ? "还没有收藏文创作品。" : "No creative works saved yet."}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#C1DDDB]">
                  {language === "zh"
                    ? "前往文创中心浏览已发布的江苏文化创意。"
                    : "Visit the Creative Center to browse published Jiangsu cultural works."}
                </p>
                <Link
                  className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#EAC459] px-4 py-2.5 text-sm font-semibold text-[#EAC459] outline-none transition-colors duration-150 hover:bg-[#EAC459] hover:text-[#34465A] focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82]"
                  to="/creative"
                >
                  {language === "zh" ? "浏览文创中心" : "Browse Creative Center"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-7 border-t border-[#C1DDDB]/28">
                {savedCreativeProjects.map((project) => (
                  <article
                    className="grid gap-5 border-b border-[#C1DDDB]/28 py-6 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-center"
                    data-saved-creative={project.slug}
                    key={project.slug}
                  >
                    {project.coverAsset && (
                      <img
                        alt={project.coverAsset.alt[language]}
                        className="aspect-[4/3] w-full border border-[#C1DDDB]/20 bg-[#EAF1F9] object-cover object-top md:h-28"
                        height="180"
                        loading="lazy"
                        src={project.coverAsset.src}
                        width="240"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold leading-tight">
                        {project.name[language]}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#C1DDDB]">
                        {project.themes
                          .map((theme) => creativeThemeLabels[theme][language])
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 md:justify-end">
                      <Link
                        className="inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                        to={getCreativeProjectPath(project.slug)}
                      >
                        {language === "zh" ? "查看作品" : "View project"}
                        <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                      </Link>
                      <button
                        aria-label={
                          language === "zh"
                            ? `取消收藏《${project.name.zh}》`
                            : `Remove ${project.name.en} from saved creative works`
                        }
                        className="inline-flex min-h-11 items-center gap-2 px-2 py-2 text-sm text-[#C1DDDB] outline-none transition-colors duration-150 hover:text-[#EAF1F9] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                        onClick={() => toggleCreative(project.slug)}
                        type="button"
                      >
                        <BookmarkX aria-hidden="true" className="size-4" />
                        {language === "zh" ? "取消收藏" : "Remove"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="py-9 text-sm leading-6 text-[#C1DDDB]" aria-label={language === "zh" ? "收藏说明" : "Saved items notice"}>
            <p>
              {language === "zh"
                ? "收藏与兴趣偏好仅保存在当前浏览器中，不会上传个人信息。"
                : "Saved items and interests stay in this browser. No personal information is uploaded."}
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
