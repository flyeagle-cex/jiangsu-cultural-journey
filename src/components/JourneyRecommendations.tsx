import { useMemo } from "react";
import { ArrowRight, BookmarkCheck, Compass } from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "@/context/LanguageContext";
import { useSavedItems } from "@/context/UserSavedStateContext";
import { cityBySlug } from "@/data/cities";
import { getCityHeroVisual } from "@/data/city-media";
import { recommendJourneyCities } from "@/lib/journey-recommendation";

const COPY = {
  zh: {
    heading: "兴趣探索建议",
    description: "依据你主动选择的兴趣主题，从现有江苏城市文化资料中生成。",
    empty:
      "选择至少一个兴趣主题后，这里会出现基于你主动设置偏好的城市探索建议。",
    matched: "匹配兴趣",
    why: "推荐依据",
    saved: "已收藏",
    explore: "进入城市",
  },
  en: {
    heading: "Interest-based Suggestions",
    description:
      "Generated locally from the interests you selected and the existing Jiangsu city guide data.",
    empty:
      "Choose at least one interest to see city suggestions based on preferences you set yourself.",
    matched: "Matched interests",
    why: "Why this fits",
    saved: "Saved",
    explore: "Explore city",
  },
} as const;

export function JourneyRecommendations() {
  const { language } = useLanguage();
  const { interests, favoriteCities } = useSavedItems();
  const copy = COPY[language];
  const recommendations = useMemo(
    () =>
      recommendJourneyCities({
        interests,
        favoriteCities,
      }),
    [favoriteCities, interests],
  );

  return (
    <section
      aria-labelledby="journey-recommendations-heading"
      className="border-b border-[#C1DDDB]/28 py-10 sm:py-12"
      data-journey-recommendations={interests.length > 0 ? "ready" : "empty"}
    >
      <div className="max-w-2xl">
        <h2
          className="font-display text-2xl font-semibold sm:text-3xl"
          id="journey-recommendations-heading"
        >
          {copy.heading}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#C1DDDB]">{copy.description}</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="mt-7 border-y border-[#C1DDDB]/28 py-7" role="status">
          <Compass aria-hidden="true" className="size-5 text-[#EAC459]" />
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#EAF1F9]/90">
            {copy.empty}
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((recommendation) => {
            const city = cityBySlug.get(recommendation.citySlug);
            if (!city) return null;
            const visual = getCityHeroVisual(city.slug);

            return (
              <article
                className="flex min-w-0 flex-col overflow-hidden border border-[#C1DDDB]/28 bg-[#4F6F80]"
                data-recommended-city={city.slug}
                data-recommendation-saved={recommendation.saved ? "true" : "false"}
                key={city.slug}
              >
                <img
                  alt={visual.alt[language]}
                  className="aspect-[16/9] w-full object-cover"
                  height="240"
                  loading="lazy"
                  src={visual.src}
                  style={{ objectPosition: visual.objectPosition }}
                  width="420"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold leading-tight">
                        {city.name.zh}
                      </h3>
                      <p className="mt-1 text-sm text-[#C1DDDB]" lang="en">
                        {city.name.en}
                      </p>
                    </div>
                    {recommendation.saved && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#EAC459]">
                        <BookmarkCheck aria-hidden="true" className="size-4" />
                        {copy.saved}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#EAF1F9]/90">
                    {city.tagline[language]}
                  </p>

                  <div className="mt-5 border-t border-[#C1DDDB]/24 pt-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-[#EAC459] uppercase">
                      {copy.matched}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#EAF1F9]">
                      {recommendation.reasons
                        .map((reason) => reason.label[language])
                        .join(" · ")}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-[#C1DDDB] uppercase">
                      {copy.why}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-[#EAF1F9]/90">
                      {recommendation.reasons.map((reason) => (
                        <li className="border-l border-[#EAC459]/65 pl-3" key={reason.interest}>
                          {reason.evidence[language]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                    to={`/city/${city.slug}`}
                  >
                    {copy.explore}
                    <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
