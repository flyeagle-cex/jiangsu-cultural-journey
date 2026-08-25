import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { creativeThemeLabels } from "@/data/creative-manifest";
import { useLanguage } from "@/context/LanguageContext";
import {
  getCreativeProjectPath,
  getPublishedCreativeProjectsByCity,
} from "@/lib/creative";
import type { CitySlug } from "@/types/city";
import type { CreativeProject } from "@/types/creative";

type CityCreativeLinksProps = {
  citySlug: CitySlug;
  projects?: readonly CreativeProject[];
};

export function CityCreativeLinks({ citySlug, projects }: CityCreativeLinksProps) {
  const { language } = useLanguage();
  const cityProjects = getPublishedCreativeProjectsByCity(citySlug, projects);

  if (cityProjects.length === 0) return null;

  return (
    <section
      aria-labelledby="city-creative-links-heading"
      className="border-y border-[#c1dddb]/25 py-10 sm:py-12"
      data-city-creative-count={cityProjects.length}
    >
      <h2 className="font-display text-2xl font-semibold text-[#eef5fb]" id="city-creative-links-heading">
        {language === "zh" ? "城市文创" : "City Creative Works"}
      </h2>
      <div className="mt-6 divide-y divide-[#c1dddb]/20 border-y border-[#c1dddb]/20">
        {cityProjects.map((project) => (
          <article
            className="grid gap-5 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center"
            key={project.slug}
          >
            {project.coverAsset && (
              <div className="flex h-28 items-center justify-center bg-[#eaf1f9]">
                <img
                  alt={project.coverAsset.alt[language]}
                  className="h-full w-full object-contain"
                  decoding="async"
                  height={project.coverAsset.height}
                  loading="lazy"
                  src={project.coverAsset.src}
                  width={project.coverAsset.width}
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-[#eef5fb]">
                {project.name[language]}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#c1dddb]">
                {project.themes
                  .map((theme) => creativeThemeLabels[theme][language])
                  .join(" · ")}
              </p>
            </div>
            <Link
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:text-[#eef5fb] focus-visible:ring-2 focus-visible:ring-[#eac459]"
              to={getCreativeProjectPath(project.slug)}
            >
              {language === "zh" ? "查看作品" : "View Project"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
