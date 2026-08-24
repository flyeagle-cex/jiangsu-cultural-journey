import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import { ShuiLingMark } from "@/components/ShuiLingMark";
import { useLanguage } from "@/context/LanguageContext";

export function ShuiLingGuide() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="shuiling-guide-title"
            className="relative mb-3 w-[min(23rem,calc(100vw-2rem))] overflow-hidden border border-[#c1dddb]/[0.35] bg-[#42769d] shadow-quiet"
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            id="shuiling-guide"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="map-current-lines opacity-45" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4 border-b border-[#c1dddb]/[0.28] px-5 py-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {language === "zh" ? "水上文化向导 · 预览" : "Water culture guide · Preview"}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold text-[#eaf1f9]" id="shuiling-guide-title">
                    {language === "zh" ? "水灵 · AI 文化导览" : "ShuiLing · AI Cultural Guide"}
                  </h2>
                </div>
                <button
                  aria-label={language === "zh" ? "关闭水灵导览" : "Close ShuiLing guide"}
                  className="grid size-11 shrink-0 place-items-center border-l border-[#c1dddb]/[0.28] text-foreground/75 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              <div className="flex gap-4 px-5 py-5">
                <ShuiLingMark />
                <p className="text-sm leading-6 text-[#eaf1f9]/[0.92]">
                  {language === "zh"
                    ? "先从地图选择一座城市。我会带你从水路、园林、手艺与味道中找到下一段旅程。"
                    : "Choose a city on the map. I'll help you continue through waterways, gardens, living crafts and local food."}
                </p>
              </div>

              <div className="grid grid-cols-2 border-y border-[#c1dddb]/[0.28] bg-[#5e6c82]/[0.35]">
                <div className="border-r border-[#c1dddb]/[0.28] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#c1dddb]">
                    {language === "zh" ? "覆盖范围" : "Coverage"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#eaf1f9]">13 {language === "zh" ? "座城市" : "cities"}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#c1dddb]">
                    {language === "zh" ? "当前模式" : "Current mode"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#eaf1f9]">
                    {language === "zh" ? "本地预览" : "Local preview"}
                  </p>
                </div>
              </div>

              <Link
                className="flex min-h-14 items-center justify-between px-5 text-sm font-semibold text-primary outline-none transition-colors hover:text-[#eaf1f9] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                onClick={() => setOpen(false)}
                to="/#cities"
              >
                {language === "zh" ? "查看十三城地图" : "Open the 13-city map"}
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        aria-controls="shuiling-guide"
        aria-expanded={open}
        aria-label={language === "zh" ? "打开水灵 AI 文化导览" : "Open ShuiLing AI Cultural Guide"}
        className="group relative block rounded-full text-white shadow-quiet outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <ShuiLingMark />
        <span className="absolute -left-2 bottom-0 border border-[#5e6c82] bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary-foreground">
          AI
        </span>
      </button>
    </div>
  );
}
