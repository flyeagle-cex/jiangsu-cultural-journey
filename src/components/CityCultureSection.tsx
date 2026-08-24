import { motion, useReducedMotion } from "framer-motion";
import { Waves } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getCitySectionVisual } from "@/data/city-media";
import type { City, CitySection } from "@/types/city";
import { CITY_SECTION_LABELS, resolveText } from "@/types/city";

type CityCultureSectionProps = {
  city: City;
  index: number;
  section: CitySection;
};

export function CityCultureSection({ city, index, section }: CityCultureSectionProps) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const visual = getCitySectionVisual(city.slug, section.id);
  const secondaryLanguage = language === "zh" ? "en" : "zh";
  const imageFirst = index % 2 === 1;

  return (
    <motion.section
      className="city-culture-section scroll-mt-16 border-b border-[#c1dddb]/[0.28] py-16 sm:py-20 lg:py-28"
      data-city-section={section.id}
      id={`city-${section.id}`}
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.12 }}
      whileInView={{ opacity: 1 }}
    >
      <div className="grid gap-9 lg:grid-cols-12 lg:gap-10">
        <header className="self-start lg:sticky lg:top-36 lg:col-span-3">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="font-display text-3xl font-light tabular-nums text-primary/65">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-primary/45" />
            {language === "zh" ? "城市档案" : "City archive"}
          </p>
          <h2 className="mt-6 max-w-[9ch] font-display text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#eaf1f9] sm:text-4xl lg:text-[2.7rem]">
            {CITY_SECTION_LABELS[section.id][language]}
          </h2>
          <p className="mt-3 max-w-[18ch] font-display text-lg leading-6 text-primary/78">
            {CITY_SECTION_LABELS[section.id][secondaryLanguage]}
          </p>
        </header>

        <div className="lg:col-span-9">
          <p className="max-w-[68ch] font-display text-xl leading-9 text-[#eaf1f9] sm:text-2xl sm:leading-10">
            {resolveText(section.intro, language)}
          </p>

          {section.id === "overview" && (
            <div className="mt-9 grid gap-4 border-y border-[#c1dddb]/[0.28] py-5 sm:grid-cols-[11rem_1fr] sm:items-start">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {language === "zh" ? "文化关键词" : "Cultural keywords"}
              </p>
              <p className="text-sm leading-7 text-[#eaf1f9]/90">
                <span className="sr-only">
                  {language === "zh" ? "文化关键词" : "Cultural keywords"}
                </span>
                {city.searchTerms[language].join(" · ")}
              </p>
            </div>
          )}

          {section.id === "overview" ? (
            <div className="mt-10 grid border-y border-[#c1dddb]/[0.28] md:grid-cols-2">
              {section.highlights.map((highlight, highlightIndex) => (
                <article
                  className={
                    "py-8 md:pr-9 " +
                    (highlightIndex > 0
                      ? "border-t border-[#c1dddb]/[0.24] md:border-l md:border-t-0 md:pl-9 md:pr-0"
                      : "")
                  }
                  key={highlight.id}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75">
                    {String(highlightIndex + 1).padStart(2, "0")} · {city.name[language]}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-[#eaf1f9]">
                    {resolveText(highlight.title, language)}
                  </h3>
                  <p className="mt-4 max-w-[62ch] text-base leading-7 text-[#eaf1f9]/[0.92]">
                    {resolveText(highlight.summary, language)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="mt-10 grid border-y border-[#c1dddb]/[0.28] bg-[#42769d] lg:grid-cols-9"
              data-section-layout={imageFirst ? "media-first" : "media-last"}
            >
              {visual ? (
                <figure
                  className={
                    "relative min-h-[320px] overflow-hidden bg-[#899fb0] sm:min-h-[420px] lg:col-span-5 lg:min-h-[520px] " +
                    (imageFirst
                      ? "lg:order-first lg:border-r lg:border-[#c1dddb]/[0.28]"
                      : "lg:order-last lg:border-l lg:border-[#c1dddb]/[0.28]")
                  }
                >
                  <img
                    alt={visual.alt[language]}
                    className="atlas-media-image absolute inset-0 size-full object-cover opacity-85 transition-opacity duration-200 hover:opacity-75"
                    height="1100"
                    loading="lazy"
                    src={visual.src}
                    style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
                    width="1200"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-primary/55" />
                </figure>
              ) : (
                <figure
                  aria-label={`${city.name[language]} · ${CITY_SECTION_LABELS[section.id][language]}`}
                  className={
                    "relative grid min-h-[320px] place-items-center overflow-hidden bg-[#899fb0] sm:min-h-[420px] lg:col-span-5 lg:min-h-[520px] " +
                    (imageFirst
                      ? "lg:order-first lg:border-r lg:border-[#c1dddb]/[0.28]"
                      : "lg:order-last lg:border-l lg:border-[#c1dddb]/[0.28]")
                  }
                  data-section-placeholder="true"
                  role="img"
                >
                  <div aria-hidden="true" className="map-current-lines" />
                  <div className="relative flex items-center gap-3 text-primary">
                    <Waves aria-hidden="true" className="size-6" />
                    <p className="font-display text-lg font-semibold">
                      {city.name[language]} · {CITY_SECTION_LABELS[section.id][language]}
                    </p>
                  </div>
                </figure>
              )}

              <div
                className={
                  "border-t border-[#c1dddb]/[0.28] lg:col-span-4 lg:border-t-0 " +
                  (imageFirst ? "lg:order-last" : "lg:order-first")
                }
              >
                {section.highlights.map((highlight, highlightIndex) => (
                  <article
                    className={
                      "px-0 py-8 sm:px-8 lg:px-9 lg:py-10 " +
                      (highlightIndex > 0 ? "border-t border-[#c1dddb]/[0.24]" : "")
                    }
                    key={highlight.id}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75">
                      {String(highlightIndex + 1).padStart(2, "0")} · {CITY_SECTION_LABELS[section.id][language]}
                    </p>
                    <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-[#eaf1f9]">
                      {resolveText(highlight.title, language)}
                    </h3>
                    <p className="mt-4 max-w-[62ch] text-base leading-7 text-[#eaf1f9]/[0.92]">
                      {resolveText(highlight.summary, language)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
