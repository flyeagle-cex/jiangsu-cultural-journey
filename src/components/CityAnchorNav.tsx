import { useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import type { City, CitySectionId } from "@/types/city";
import { CITY_SECTION_LABELS, CITY_SECTION_ORDER } from "@/types/city";
import { cn } from "@/lib/utils";

export function CityAnchorNav({ city }: { city: City }) {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<CitySectionId>("overview");

  useEffect(() => {
    const sections = CITY_SECTION_ORDER.map((id) => document.getElementById(`city-${id}`)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const sectionId = visible?.target.id.replace("city-", "") as CitySectionId | undefined;
        if (sectionId) setActiveSection(sectionId);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [city.slug]);

  return (
    <div
      className="sticky top-16 z-30 border-y border-[#c1dddb]/30 bg-[#42769d]/95 backdrop-blur-md"
      data-city-anchor-nav="true"
    >
      <div className="mx-auto flex max-w-[1440px] items-stretch px-4 sm:px-6 lg:px-10">
        <div className="hidden shrink-0 items-center gap-3 border-r border-[#c1dddb]/25 pr-6 lg:flex">
          <span className="text-xs font-semibold tabular-nums text-primary">
            {String(city.order).padStart(2, "0")}
          </span>
          <p className="text-sm font-semibold text-[#eaf1f9]">{city.name[language]}</p>
        </div>
        <nav
          aria-label={language === "zh" ? `${city.name.zh}文化目录` : `${city.name.en} cultural contents`}
          className="flex min-w-0 flex-1 overflow-x-auto lg:pl-4"
        >
          {CITY_SECTION_ORDER.map((id, index) => {
            const isActive = activeSection === id;
            return (
              <a
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex min-h-12 shrink-0 items-center border-b-2 px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/[0.78] hover:text-[#eaf1f9]",
                )}
                href={`#city-${id}`}
                key={id}
                onClick={() => setActiveSection(id)}
              >
                <span className="mr-2 text-[10px] tabular-nums text-primary/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {CITY_SECTION_LABELS[id][language]}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
