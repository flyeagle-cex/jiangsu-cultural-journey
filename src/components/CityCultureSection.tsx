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
      className="city-culture-section scroll-mt-16 border-b py-16 sm:py-20 lg:py-28"
      data-city-section={section.id}
      id={`city-${section.id}`}
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.12 }}
      whileInView={{ opacity: 1 }}
    >
      <div className="grid gap-9 lg:grid-cols-12 lg:gap-10">
        <header className="self-start lg:sticky lg:top-36 lg:col-span-3">
          <p className="section-accent-text flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="font-display text-3xl font-light tabular-nums opacity-75">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="section-accent-line h-px w-10 opacity-60" />
            {language === "zh" ? "城市档案" : "City archive"}
          </p>
          <h2 className="city-section-heading mt-6 max-w-[9ch] font-display text-3xl font-semibold leading-tight tracking-[-0.025em] sm:text-4xl lg:text-[2.7rem]">
            {CITY_SECTION_LABELS[section.id][language]}
          </h2>
          <p className="section-accent-text mt-3 max-w-[18ch] font-display text-lg leading-6 opacity-90">
            {CITY_SECTION_LABELS[section.id][secondaryLanguage]}
          </p>
        </header>

        <div className="lg:col-span-9">
          <p className="city-section-intro max-w-[68ch] font-display text-xl leading-9 sm:text-2xl sm:leading-10">
            {resolveText(section.intro, language)}
          </p>

          {section.id === "overview" && (
            <div className="city-section-keywords mt-9 grid gap-4 border-y py-5 sm:grid-cols-[11rem_1fr] sm:items-start">
              <p className="section-accent-text text-xs font-semibold uppercase tracking-[0.18em]">
                {language === "zh" ? "文化关键词" : "Cultural keywords"}
              </p>
              <p className="city-section-keyword-text text-sm leading-7">
                <span className="sr-only">
                  {language === "zh" ? "文化关键词" : "Cultural keywords"}
                </span>
                {city.searchTerms[language].join(" · ")}
              </p>
            </div>
          )}

          {section.id === "overview" ? (
            <div className="city-section-overview-grid mt-10 grid border-y md:grid-cols-2">
              {section.highlights.map((highlight, highlightIndex) => (
                <article
                  className={
                    "city-section-overview-card py-8 md:pr-9 " +
                    (highlightIndex > 0 ? "border-t md:border-l md:border-t-0 md:pl-9 md:pr-0" : "")
                  }
                  key={highlight.id}
                >
                  <p className="section-accent-text text-[11px] font-semibold uppercase tracking-[0.18em] opacity-85">
                    {String(highlightIndex + 1).padStart(2, "0")} · {city.name[language]}
                  </p>
                  <h3 className="city-section-card-title mt-4 font-display text-2xl font-semibold">
                    {resolveText(highlight.title, language)}
                  </h3>
                  <p className="city-section-card-text mt-4 max-w-[62ch] text-base leading-7">
                    {resolveText(highlight.summary, language)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="city-section-media-grid mt-10 grid border-y lg:grid-cols-9"
              data-section-layout={imageFirst ? "media-first" : "media-last"}
            >
              {visual ? (
                <figure
                  className={
                    "city-section-media-frame relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:col-span-5 lg:min-h-[520px] " +
                    (imageFirst ? "lg:order-first lg:border-r" : "lg:order-last lg:border-l")
                  }
                >
                  <img
                    alt={visual.alt[language]}
                    className="atlas-media-image city-section-image absolute inset-0 size-full object-cover opacity-95 transition duration-200 hover:scale-[1.008] hover:opacity-100"
                    height="1100"
                    loading="lazy"
                    src={visual.src}
                    style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
                    width="1200"
                  />
                  <div aria-hidden="true" className="city-section-image-wash absolute inset-0" />
                  <div aria-hidden="true" className="section-accent-line absolute inset-x-0 bottom-0 h-px opacity-85" />
                </figure>
              ) : (
                <figure
                  aria-label={`${city.name[language]} · ${CITY_SECTION_LABELS[section.id][language]}`}
                  className={
                    "city-section-media-frame relative grid min-h-[320px] place-items-center overflow-hidden sm:min-h-[420px] lg:col-span-5 lg:min-h-[520px] " +
                    (imageFirst ? "lg:order-first lg:border-r" : "lg:order-last lg:border-l")
                  }
                  data-section-placeholder="true"
                  role="img"
                >
                  <div aria-hidden="true" className="map-current-lines" />
                  <div className="section-accent-text relative flex items-center gap-3">
                    <Waves aria-hidden="true" className="size-6" />
                    <p className="font-display text-lg font-semibold">
                      {city.name[language]} · {CITY_SECTION_LABELS[section.id][language]}
                    </p>
                  </div>
                </figure>
              )}

              <div
                className={
                  "city-section-copy border-t lg:col-span-4 lg:border-t-0 " +
                  (imageFirst ? "lg:order-last" : "lg:order-first")
                }
              >
                {section.highlights.map((highlight, highlightIndex) => (
                  <article
                    className={
                      "city-section-highlight px-0 py-8 sm:px-8 lg:px-9 lg:py-10 " +
                      (highlightIndex > 0 ? "border-t" : "")
                    }
                    key={highlight.id}
                  >
                    <p className="city-section-panel-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {String(highlightIndex + 1).padStart(2, "0")} · {CITY_SECTION_LABELS[section.id][language]}
                    </p>
                    <h3 className="city-section-panel-title mt-4 font-display text-2xl font-semibold leading-tight">
                      {resolveText(highlight.title, language)}
                    </h3>
                    <p className="city-section-panel-text mt-4 max-w-[62ch] text-base leading-7">
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
