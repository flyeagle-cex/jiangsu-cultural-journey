import { forwardRef } from "react";
import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { City, Language } from "@/types/city";
import { CITY_SECTION_LABELS, resolveText } from "@/types/city";

type MapCulturePreviewProps = {
  city: City;
  language: Language;
  onClose: () => void;
};

export const MapCulturePreview = forwardRef<HTMLHeadingElement, MapCulturePreviewProps>(
  function MapCulturePreview({ city, language, onClose }, headingRef) {
    return (
      <section
        aria-labelledby="map-culture-preview-title"
        className="border-x border-b border-white/[0.14] bg-[#031d2b]"
        data-map-culture-preview="true"
      >
        <header className="flex items-start justify-between gap-5 border-b border-white/[0.14] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold text-primary">
              {language === "zh" ? "六类文化速览" : "Six-part cultural preview"}
            </p>
            <h3
              className="mt-1 font-display text-xl font-semibold text-[#effdfd] outline-none"
              id="map-culture-preview-title"
              ref={headingRef}
              tabIndex={-1}
            >
              {city.name[language]}
              <span className="ml-2 font-sans text-sm font-medium text-foreground/60">
                {city.name[language === "zh" ? "en" : "zh"]}
              </span>
            </h3>
          </div>
          <Button className="min-h-11 shrink-0" onClick={onClose} size="sm" variant="ghost">
            <ChevronUp aria-hidden="true" />
            {language === "zh" ? "收起" : "Collapse"}
          </Button>
        </header>

        <div className="grid md:grid-cols-2">
          {city.sections.map((section, index) => {
            const highlight = section.highlights[0];
            return (
              <article
                className={
                  "border-white/[0.12] px-5 py-5 md:px-6 " +
                  (index < 4 ? "border-b " : "") +
                  (index % 2 === 0 ? "md:border-r " : "")
                }
                key={section.id}
              >
                <p className="text-xs font-semibold text-primary">
                  {CITY_SECTION_LABELS[section.id][language]}
                </p>
                <h4 className="mt-2 text-base font-semibold text-[#effdfd]">
                  {resolveText(highlight.title, language)}
                </h4>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {resolveText(highlight.summary, language)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    );
  },
);
