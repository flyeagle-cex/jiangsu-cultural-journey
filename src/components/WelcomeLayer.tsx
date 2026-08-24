import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { ShuiLingMark } from "@/components/ShuiLingMark";
import { useLanguage } from "@/context/LanguageContext";

export const WELCOME_STORAGE_KEY = "jiangsu-cultural-journey:welcome-seen";

function shouldShowWelcome() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(WELCOME_STORAGE_KEY) !== "true";
}

export function WelcomeLayer() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(shouldShowWelcome);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(WELCOME_STORAGE_KEY, "true");
      setVisible(false);
    }, reduceMotion ? 800 : 4200);

    return () => window.clearTimeout(timer);
  }, [reduceMotion, visible]);

  useEffect(() => {
    if (!visible) return;
    const focusFrame = window.requestAnimationFrame(() => skipButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  function dismiss() {
    window.localStorage.setItem(WELCOME_STORAGE_KEY, "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-describedby="welcome-message"
          aria-labelledby="welcome-title"
          aria-modal="true"
          className="fixed inset-0 z-[80] grid overflow-hidden bg-[#5e6c82] text-[#eaf1f9]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="dialog"
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        >
          <img
            alt=""
            aria-hidden="true"
            className="hero-water-image absolute inset-0 size-full object-cover opacity-25"
            height="1080"
            src="/assets/hero-grand-canal.jpg"
            width="1920"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#5e6c82]/[0.74]" />
          <div aria-hidden="true" className="welcome-water-ripples" />
          <div aria-hidden="true" className="deep-water-currents opacity-55" />
          <div aria-hidden="true" className="welcome-foam" />
          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="flex items-center justify-between gap-6 border-b border-[#c1dddb]/[0.35] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {language === "zh" ? "水韵江苏 · 初次相遇" : "Jiangsu Cultural Journey · First encounter"}
              </p>
              <button
                className="min-h-11 border-b border-[#c1dddb]/[0.55] px-1 text-sm font-semibold text-[#eaf1f9] outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                onClick={dismiss}
                ref={skipButtonRef}
                type="button"
              >
                {language === "zh" ? "跳过欢迎" : "Skip welcome"}
              </button>
            </div>

            <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-8">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-7 lg:col-span-8"
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
                transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.5 }}
              >
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <span aria-hidden="true" className="h-px w-12 bg-primary/60" />
                  {language === "zh" ? "AI 文化向导 · 水灵" : "AI cultural guide · ShuiLing"}
                </p>
                <h2
                  className={
                    "mt-7 font-display font-semibold leading-[0.98] tracking-[-0.045em] text-[#eaf1f9] " +
                    (language === "zh"
                      ? "text-[clamp(2.65rem,7vw,7.2rem)]"
                      : "text-[clamp(2.35rem,6.2vw,6.4rem)]")
                  }
                  id="welcome-title"
                >
                  {language === "zh" ? (
                    <>
                      <span className="block sm:hidden">
                        你好！我是
                        <br />
                        水灵，欢迎
                        <br />
                        来到江苏。
                      </span>
                      <span className="hidden sm:block">
                        你好！我是水灵，
                        <br />
                        欢迎来到江苏。
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block sm:hidden">
                        Hi! I'm ShuiLing.
                        <br />
                        Welcome to
                        <br />
                        Jiangsu.
                      </span>
                      <span className="hidden sm:block">
                        Hi! I'm ShuiLing.
                        <br />
                        Welcome to Jiangsu.
                      </span>
                    </>
                  )}
                </h2>
                <p
                  className="mt-6 max-w-[58ch] font-display text-xl leading-8 text-primary sm:text-2xl sm:leading-9"
                  id="welcome-message"
                >
                  {language === "zh"
                    ? "Hi! I'm ShuiLing. Let me show you around Jiangsu!"
                    : "你好！我是水灵，让我带你游江苏。"}
                </p>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="atlas-index-rule justify-self-center pl-6 md:col-span-5 md:justify-self-end lg:col-span-3 lg:col-start-10"
                initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.94 }}
                transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <ShuiLingMark large />
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#c1dddb]/[0.32] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {language === "zh" ? "水上文化向导" : "Water culture guide"}
                  </p>
                  <p className="text-xs tabular-nums text-[#b3c6bb]">01 / 13</p>
                </div>
              </motion.div>
            </div>

            <div className="hidden items-center justify-between gap-6 border-t border-[#c1dddb]/[0.35] pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b3c6bb] sm:flex">
              <p>{language === "zh" ? "江河 · 运河 · 湖海" : "Rivers · Canal · Lakes · Coast"}</p>
              <p>{language === "zh" ? "四秒后进入文化地图" : "Entering the cultural map in four seconds"}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
