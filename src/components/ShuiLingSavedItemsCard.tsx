import { ArrowRight, Bookmark, MapPin, Palette } from "lucide-react";
import { Link } from "react-router-dom";

import { getCreativeProjectPath } from "@/lib/creative";
import type { SavedStateResult } from "@/lib/shuiling-saved-state";
import type { Language } from "@/types/city";

type ShuiLingSavedItemsCardProps = {
  language: Language;
  onNavigate: () => void;
  result: SavedStateResult;
};

const COPY = {
  zh: {
    heading: "我的收藏",
    cities: "收藏城市",
    creative: "收藏文创",
    noCities: "你还没有收藏城市。",
    noCreative: "你还没有收藏文创作品。",
    empty:
      "你还没有收藏城市或文创。逛到喜欢的内容时，可以点击“收藏”，之后我就能在这里帮你找到它们。",
    exploreCities: "探索十三市",
    creativeCenter: "文创中心",
    viewJourney: "查看全部收藏",
  },
  en: {
    heading: "My Saved Journey",
    cities: "Saved Cities",
    creative: "Saved Creative Works",
    noCities: "You haven't saved any cities yet.",
    noCreative: "You haven't saved any creative works yet.",
    empty:
      "You haven't saved any cities or creative works yet. Save something you like, and I can help you find it here later.",
    exploreCities: "Explore the 13 Cities",
    creativeCenter: "Creative Center",
    viewJourney: "View My Journey",
  },
} as const;

const MAX_VISIBLE_CITIES = 5;
const MAX_VISIBLE_CREATIVE = 3;

export function ShuiLingSavedItemsCard({
  language,
  onNavigate,
  result,
}: ShuiLingSavedItemsCardProps) {
  const copy = COPY[language];
  const showCities = result.intent === "all" || result.intent === "cities";
  const showCreative = result.intent === "all" || result.intent === "creative";
  const completelyEmpty = result.cities.length === 0 && result.creativeProjects.length === 0;

  return (
    <section
      aria-labelledby="shuiling-saved-items-heading"
      className="border-b border-[#c1dddb]/25 py-5"
      data-saved-state-intent={result.intent}
    >
      <div className="flex items-center gap-2">
        <Bookmark aria-hidden="true" className="size-4 shrink-0 text-[#eac459]" />
        <h2
          className="text-sm font-semibold text-[#eac459]"
          id="shuiling-saved-items-heading"
        >
          {copy.heading}
        </h2>
      </div>

      {result.intent === "all" && completelyEmpty ? (
        <div className="mt-3" role="status">
          <p className="text-sm leading-6 text-[#eaf1f9]">{copy.empty}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <SavedActionLink label={copy.exploreCities} onNavigate={onNavigate} to="/#cities" />
            <SavedActionLink label={copy.creativeCenter} onNavigate={onNavigate} to="/creative" />
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-5">
          {showCities && (
            <section aria-labelledby="shuiling-saved-cities-heading">
              <h3
                className="flex items-center gap-2 text-sm font-semibold text-[#eaf1f9]"
                id="shuiling-saved-cities-heading"
              >
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-[#81b3a9]" />
                {copy.cities}
              </h3>
              {result.cities.length > 0 ? (
                <ul className="mt-2 border-t border-[#c1dddb]/15">
                  {result.cities.slice(0, MAX_VISIBLE_CITIES).map((city) => (
                    <li className="border-b border-[#c1dddb]/15 last:border-b-0" key={city.slug}>
                      <Link
                        className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm text-[#eaf1f9] outline-none transition-colors duration-150 hover:text-[#eac459] focus-visible:ring-2 focus-visible:ring-[#eac459]"
                        data-saved-city={city.slug}
                        onClick={onNavigate}
                        to={`/city/${city.slug}`}
                      >
                        <span>{city.name[language]}</span>
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[#eac459]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2" role="status">
                  <p className="text-sm leading-6 text-[#c1dddb]">{copy.noCities}</p>
                  <SavedActionLink label={copy.exploreCities} onNavigate={onNavigate} to="/#cities" />
                </div>
              )}
            </section>
          )}

          {showCreative && (
            <section aria-labelledby="shuiling-saved-creative-heading">
              <h3
                className="flex items-center gap-2 text-sm font-semibold text-[#eaf1f9]"
                id="shuiling-saved-creative-heading"
              >
                <Palette aria-hidden="true" className="size-4 shrink-0 text-[#f09c77]" />
                {copy.creative}
              </h3>
              {result.creativeProjects.length > 0 ? (
                <ul className="mt-2 border-t border-[#c1dddb]/15">
                  {result.creativeProjects.slice(0, MAX_VISIBLE_CREATIVE).map((project) => (
                    <li className="border-b border-[#c1dddb]/15 last:border-b-0" key={project.slug}>
                      <Link
                        className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm leading-5 text-[#eaf1f9] outline-none transition-colors duration-150 hover:text-[#eac459] focus-visible:ring-2 focus-visible:ring-[#eac459]"
                        data-saved-creative={project.slug}
                        onClick={onNavigate}
                        to={getCreativeProjectPath(project.slug)}
                      >
                        <span>{project.name[language]}</span>
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[#eac459]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2" role="status">
                  <p className="text-sm leading-6 text-[#c1dddb]">{copy.noCreative}</p>
                  <SavedActionLink label={copy.creativeCenter} onNavigate={onNavigate} to="/creative" />
                </div>
              )}
            </section>
          )}
        </div>
      )}

      <Link
        className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#eac459]/70 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:border-[#eaf1f9] hover:text-[#eaf1f9] focus-visible:ring-2 focus-visible:ring-[#eac459]"
        onClick={onNavigate}
        to="/user"
      >
        {copy.viewJourney}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}

function SavedActionLink({
  label,
  onNavigate,
  to,
}: {
  label: string;
  onNavigate: () => void;
  to: string;
}) {
  return (
    <Link
      className="mt-2 inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:text-[#eaf1f9] focus-visible:ring-2 focus-visible:ring-[#eac459]"
      onClick={onNavigate}
      to={to}
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}
