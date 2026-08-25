import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { creativeThemeLabels } from "@/data/creative-manifest";
import {
  getCreativeRecommendationReasonLabel,
  type CreativeRecommendation,
} from "@/lib/creative-recommendation";
import { getCreativeProjectPath } from "@/lib/creative";
import type { Language } from "@/types/city";

type CreativeRecommendationBlockProps = {
  language: Language;
  onNavigate: () => void;
  recommendations: readonly CreativeRecommendation[];
};

export function CreativeRecommendationBlock({
  language,
  onNavigate,
  recommendations,
}: CreativeRecommendationBlockProps) {
  if (recommendations.length === 0) return null;

  const heading = language === "zh" ? "相关文创" : "Related Creative Work";
  const viewLabel = language === "zh" ? "查看作品" : "View Project";

  return (
    <section
      aria-labelledby="creative-recommendation-heading"
      className="border-b border-[#c1dddb]/25 py-5"
      data-creative-recommendation-count={recommendations.length}
    >
      <h2 className="text-sm font-semibold text-[#eac459]" id="creative-recommendation-heading">
        {heading}
      </h2>
      <ul className="mt-3 grid gap-3">
        {recommendations.map((recommendation) => {
          const { project } = recommendation;
          const cover = project.coverAsset;
          return (
            <li key={project.slug}>
              <article
                className={`grid gap-3 border border-[#c1dddb]/25 bg-[#102f42] p-3 ${
                  cover ? "grid-cols-[5rem_minmax(0,1fr)]" : "grid-cols-1"
                }`}
              >
                {cover && (
                  <div className="flex min-h-28 items-center justify-center bg-[#eaf1f9]">
                    <img
                      alt={cover.alt[language]}
                      className="h-auto max-h-28 w-full object-contain"
                      decoding="async"
                      height={cover.height}
                      loading="lazy"
                      src={cover.src}
                      width={cover.width}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold leading-6 text-[#f3f8fc]">
                    {project.name[language]}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#c1dddb]">
                    {project.themes
                      .map((theme) => creativeThemeLabels[theme][language])
                      .join(" · ")}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-[#eaf1f9]/90">
                    {getCreativeRecommendationReasonLabel(recommendation, language)}
                  </p>
                  <Link
                    className="mt-3 inline-flex min-h-11 items-center gap-2 border-b border-[#eac459]/70 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:border-[#eaf1f9] hover:text-[#eaf1f9] focus-visible:ring-2 focus-visible:ring-[#eac459]"
                    onClick={onNavigate}
                    to={getCreativeProjectPath(project.slug)}
                  >
                    {viewLabel}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
