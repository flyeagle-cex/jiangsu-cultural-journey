import { ArrowRight, BookmarkCheck, Compass } from "lucide-react";
import { Link } from "react-router-dom";

import { cityIdentityBySlug } from "@/data/city-manifest";
import type { JourneyCityRecommendation } from "@/lib/journey-recommendation";
import { CITY_SECTION_LABELS, type Language } from "@/types/city";
import type { JourneyInterest } from "@/types/user-preferences";

type ShuiLingJourneyRecommendationsCardProps = {
  interests: readonly JourneyInterest[];
  language: Language;
  onNavigate: () => void;
  recommendations: readonly JourneyCityRecommendation[];
};

const COPY = {
  zh: {
    heading: "水灵的兴趣推荐",
    transparency: "以下建议由你主动选择的兴趣与现有江苏城市文化资料在本地计算生成。",
    basedOn: "依据你选择的兴趣",
    matched: "匹配兴趣",
    why: "推荐依据",
    saved: "已收藏",
    explore: "进入",
    empty:
      "你还没有设置兴趣主题。先在“我的灵舟之旅”里选择自然风光、历史文化、非遗、美食或大运河与水系等兴趣，我再根据这些由你主动设置的偏好推荐城市。",
    manage: "设置兴趣",
    viewFull: "查看完整兴趣建议",
  },
  en: {
    heading: "Shuiling's Interest-based Suggestions",
    transparency:
      "These suggestions are generated locally from the interests you selected and the existing Jiangsu city guide data.",
    basedOn: "Based on your interests",
    matched: "Matched interests",
    why: "Why this fits",
    saved: "Saved",
    explore: "Explore",
    empty:
      "You haven't selected any interests yet. Choose the cultural themes you care about in My Shuiling Journey, and I can recommend cities from the preferences you set yourself.",
    manage: "Manage Interests",
    viewFull: "View Full Suggestions",
  },
} as const;

function RecommendationLink({
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
      className="inline-flex min-h-11 items-center gap-2 py-2 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:text-[#f3f8fc] focus-visible:ring-2 focus-visible:ring-[#eac459]"
      onClick={onNavigate}
      to={to}
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  );
}

export function ShuiLingJourneyRecommendationsCard({
  interests,
  language,
  onNavigate,
  recommendations,
}: ShuiLingJourneyRecommendationsCardProps) {
  const copy = COPY[language];
  const selectedInterestLabels = interests
    .map((interest) => CITY_SECTION_LABELS[interest][language])
    .join(" · ");

  return (
    <section
      aria-labelledby="shuiling-journey-recommendations-heading"
      className="border-b border-[#c1dddb]/25 py-5"
      data-journey-personalization={recommendations.length > 0 ? "results" : "empty"}
    >
      <div className="flex items-center gap-2">
        <Compass aria-hidden="true" className="size-4 shrink-0 text-[#eac459]" />
        <h2
          className="text-sm font-semibold text-[#eac459]"
          id="shuiling-journey-recommendations-heading"
        >
          {copy.heading}
        </h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#c1dddb]">{copy.transparency}</p>

      {recommendations.length === 0 ? (
        <div className="mt-4" role="status">
          <p className="text-sm leading-6 text-[#eaf1f9]">{copy.empty}</p>
          <RecommendationLink label={copy.manage} onNavigate={onNavigate} to="/user" />
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-[#eaf1f9]">
            <span className="font-semibold text-[#c1dddb]">{copy.basedOn}：</span>
            {selectedInterestLabels}
          </p>

          <ol className="mt-4 border-t border-[#c1dddb]/20">
            {recommendations.map((recommendation, index) => {
              const city = cityIdentityBySlug[recommendation.citySlug];
              const matchedInterestLabels = recommendation.matchedInterests
                .map((interest) => CITY_SECTION_LABELS[interest][language])
                .join(" · ");

              return (
                <li
                  className="border-b border-[#c1dddb]/20 py-4 last:border-b-0"
                  data-personalized-city={city.slug}
                  data-personalized-city-saved={recommendation.saved ? "true" : "false"}
                  key={city.slug}
                >
                  <article>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold leading-6 text-[#f3f8fc]">
                        <span className="mr-2 text-[#81b3a9]">{index + 1}.</span>
                        {city.name[language]}
                      </h3>
                      {recommendation.saved && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#eac459]">
                          <BookmarkCheck aria-hidden="true" className="size-4" />
                          {copy.saved}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#d7e2de]">
                      <span className="font-semibold text-[#c1dddb]">{copy.matched}：</span>
                      {matchedInterestLabels}
                    </p>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-[#c1dddb]">{copy.why}</p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#eaf1f9]/90 marker:text-[#81b3a9]">
                        {recommendation.reasons.slice(0, 2).map((reason) => (
                          <li data-personalization-reason={reason.interest} key={reason.interest}>
                            {reason.evidence[language]}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <RecommendationLink
                      label={`${copy.explore}${language === "zh" ? city.name.zh : ` ${city.name.en}`}`}
                      onNavigate={onNavigate}
                      to={`/city/${city.slug}`}
                    />
                  </article>
                </li>
              );
            })}
          </ol>

          <RecommendationLink label={copy.viewFull} onNavigate={onNavigate} to="/user" />
        </>
      )}
    </section>
  );
}
