import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "@/context/LanguageContext";
import { cityManifest } from "@/data/city-manifest";
import type { City } from "@/types/city";

export function CityJourneyNav({ city }: { city: City }) {
  const { language } = useLanguage();
  const secondaryLanguage = language === "zh" ? "en" : "zh";
  const currentIndex = cityManifest.findIndex((item) => item.slug === city.slug);
  const previousCity = cityManifest[(currentIndex - 1 + cityManifest.length) % cityManifest.length];
  const nextCity = cityManifest[(currentIndex + 1) % cityManifest.length];

  return (
    <nav
      aria-label={language === "zh" ? "继续浏览其他城市" : "Continue to another city"}
      className="city-journey-nav grid border-y sm:grid-cols-2"
      data-city-journey-nav="true"
    >
      <Link
        className="city-journey-link city-journey-link--prev group flex min-h-40 items-center gap-5 border-b px-1 py-8 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:border-b-0 sm:border-r sm:px-8"
        to={`/city/${previousCity.slug}`}
      >
        <ArrowLeft aria-hidden="true" className="size-5 shrink-0 text-primary" />
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {String(previousCity.order).padStart(2, "0")} / 13 · {language === "zh" ? "上一城" : "Previous city"}
          </span>
          <span className="mt-3 block font-display text-3xl font-semibold text-[#f3f8fc] transition-colors group-hover:text-primary">
            {previousCity.name[language]}
          </span>
          <span className="mt-1 block font-display text-base text-[#eef5fb]/[0.85]">
            {previousCity.name[secondaryLanguage]}
          </span>
        </span>
      </Link>
      <Link
        className="city-journey-link city-journey-link--next group flex min-h-40 items-center justify-end gap-5 px-1 py-8 text-right outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-8"
        to={`/city/${nextCity.slug}`}
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {String(nextCity.order).padStart(2, "0")} / 13 · {language === "zh" ? "下一城" : "Next city"}
          </span>
          <span className="mt-3 block font-display text-3xl font-semibold text-[#f3f8fc] transition-colors group-hover:text-primary">
            {nextCity.name[language]}
          </span>
          <span className="mt-1 block font-display text-base text-[#eef5fb]/[0.85]">
            {nextCity.name[secondaryLanguage]}
          </span>
        </span>
        <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
      </Link>
    </nav>
  );
}
