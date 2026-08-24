import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "@/context/LanguageContext";
import { getCityHeroVisual } from "@/data/city-media";
import type { City } from "@/types/city";
import { resolveText } from "@/types/city";

export function CityHero({ city }: { city: City }) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const visual = getCityHeroVisual(city.slug);
  const secondaryLanguage = language === "zh" ? "en" : "zh";
  const [longitude, latitude] = city.coordinates;

  return (
    <section
      className="relative isolate min-h-[720px] overflow-hidden bg-background pt-16 sm:min-h-[780px]"
      data-city-hero={city.slug}
    >
      <img
        alt={visual.alt[language]}
        className="hero-water-image city-hero-image absolute inset-0 -z-30 size-full object-cover"
        fetchPriority="high"
        height="1080"
        src={visual.src}
        style={{ objectPosition: visual.objectPosition }}
        width="1920"
      />
      <div aria-hidden="true" className="city-hero-colorwash absolute inset-0 -z-20" />
      <div aria-hidden="true" className="deep-water-currents opacity-55" />

      <div className="mx-auto flex min-h-[656px] max-w-[1440px] flex-col px-4 pb-14 pt-9 sm:min-h-[716px] sm:px-6 sm:pb-16 lg:px-10 lg:pt-11">
        <div className="flex items-center justify-between gap-6 border-b border-[#c1dddb]/[0.35] pb-5">
          <Link
            className="inline-flex min-h-11 w-fit items-center gap-2 border-b border-transparent px-1 text-sm font-semibold text-[#eaf1f9] outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            to="/#cities"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {language === "zh" ? "返回十三市地图" : "Back to the city map"}
          </Link>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-foreground/64 sm:block">
            {language === "zh" ? "江苏城市文化资料库" : "Jiangsu city cultural archive"}
          </p>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto grid items-end gap-10 pt-20 lg:grid-cols-12 lg:gap-10"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden="true" className="h-px w-12 bg-primary/60" />
              {language === "zh" ? "江苏城市水志" : "Jiangsu city water atlas"} ·{" "}
              {String(city.order).padStart(2, "0")} / 13
            </p>
            <h1 className="mt-7 font-display text-[clamp(4.1rem,9vw,8.4rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-[#f3f8fc]">
              {city.name[language]}
            </h1>
            <p className="mt-5 font-display text-[clamp(1.55rem,3vw,2.8rem)] font-light leading-none tracking-[-0.025em] text-primary">
              {city.name[secondaryLanguage]}
            </p>
            <p className="mt-8 text-lg font-semibold leading-8 text-[#f3f8fc] sm:text-xl">
              {city.tagline[language]}
            </p>
            <p className="mt-4 max-w-[66ch] text-base leading-7 text-[#eef5fb]/[0.94] sm:text-lg sm:leading-8">
              {resolveText(city.summary, language)}
            </p>
          </div>

          <aside className="atlas-index-rule city-hero-index grid gap-5 pl-5 sm:grid-cols-3 lg:col-span-3 lg:col-start-10 lg:block lg:pl-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {language === "zh" ? "城市序号" : "City index"}
              </p>
              <p className="mt-2 font-display text-3xl font-light tabular-nums text-[#f3f8fc]">
                {String(city.order).padStart(2, "0")} <span className="text-base text-[#dce7ef]/60">/ 13</span>
              </p>
            </div>
            <div className="lg:mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {language === "zh" ? "地理坐标" : "Coordinates"}
              </p>
              <p className="mt-2 text-sm tabular-nums text-[#eef5fb]/90">
                {latitude.toFixed(2)}°N · {longitude.toFixed(2)}°E
              </p>
            </div>
            <a
              className="inline-flex min-h-11 w-fit items-center gap-2 self-end border-b border-primary/60 px-1 text-sm font-semibold text-primary outline-none transition-colors hover:border-[#eaf1f9] hover:text-[#eaf1f9] focus-visible:ring-2 focus-visible:ring-ring lg:mt-8"
              href="#city-overview"
            >
              {language === "zh" ? "阅读城市档案" : "Read the city archive"}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
