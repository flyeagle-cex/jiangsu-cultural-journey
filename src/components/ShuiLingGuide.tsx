import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  Compass,
  Landmark,
  Map,
  MessageCircle,
  Palette,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { ShuiLingMark } from "@/components/ShuiLingMark";
import { useLanguage } from "@/context/LanguageContext";
import {
  FUTURE_GUIDE_ACTIONS,
  HOME_GUIDE_ACTIONS,
  NOT_FOUND_GUIDE_ACTIONS,
  SHUILING_COPY,
  getCityGuideActions,
  type ShuiLingGuideAction,
  type ShuiLingMode,
  type ShuiLingPageKind,
} from "@/data/shuiling-guide";
import { cityIdentityBySlug } from "@/data/city-manifest";
import {
  hasSeenCityHint,
  hasSeenHomeHint,
  markCityHintSeen,
  markHomeHintSeen,
} from "@/lib/shuiling-session";
import type { CitySlug, Language } from "@/types/city";

export type ShuiLingGuideProps = {
  citySlug?: CitySlug;
  hidden?: boolean;
  mode?: ShuiLingMode;
  onAskAI?: (context: { citySlug?: CitySlug }) => void;
};

const ACTION_ICONS: Record<string, LucideIcon> = {
  ask: MessageCircle,
  cities: Map,
  creative: Palette,
  favorites: Bookmark,
  home: Compass,
  themes: Landmark,
};

function getRouteCity(pathname: string) {
  const [, routeName, slug] = pathname.split("/");
  return routeName === "city" && slug ? cityIdentityBySlug[slug as CitySlug] : undefined;
}

function getPageKind(pathname: string, hasCity: boolean): ShuiLingPageKind {
  if (hasCity) return "city";
  return pathname === "/" ? "home" : "not-found";
}

function getPanelTitle(pageKind: ShuiLingPageKind, language: Language, cityName?: string) {
  if (pageKind === "city" && cityName) {
    return language === "zh" ? `继续探索「${cityName}」` : `Continue Exploring ${cityName}`;
  }
  if (pageKind === "not-found") {
    return language === "zh" ? "好像走错水路啦" : "This waterway looks unfamiliar";
  }
  return SHUILING_COPY.name[language];
}

export function ShuiLingGuide({ citySlug, hidden = false, mode = "guide", onAskAI }: ShuiLingGuideProps) {
  const { language } = useLanguage();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [footerOffset, setFooterOffset] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const city = citySlug ? cityIdentityBySlug[citySlug] : getRouteCity(location.pathname);
  const pageKind = getPageKind(location.pathname, Boolean(city));
  const cityName = city?.name[language];
  const panelTitle = getPanelTitle(pageKind, language, cityName);
  const cityActions = useMemo(() => getCityGuideActions(), []);
  const askAction = HOME_GUIDE_ACTIONS.find((action) => action.id === "ask");

  const closePanel = useCallback((restoreFocus = true) => {
    setOpen(false);
    setStatus(null);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    }
  }, []);

  useEffect(() => {
    setOpen(false);
    setStatus(null);
    setHintVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    if (hidden || open || pageKind === "not-found") return;

    const alreadySeen = pageKind === "city" && city ? hasSeenCityHint(city.slug) : hasSeenHomeHint();
    if (alreadySeen) return;

    const showTimer = window.setTimeout(() => {
      setHintVisible(true);
      if (pageKind === "city" && city) markCityHintSeen(city.slug);
      else markHomeHintSeen();
    }, reduceMotion ? 0 : 900);
    const hideTimer = window.setTimeout(() => setHintVisible(false), reduceMotion ? 4200 : 6000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [city, hidden, open, pageKind, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    setHintVisible(false);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel, open]);

  useEffect(() => {
    const updateFooterOffset = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setFooterOffset(0);
        return;
      }
      const rect = footer.getBoundingClientRect();
      const visibleStart = Math.max(rect.top, 0);
      const visibleEnd = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(visibleEnd - visibleStart, 0);
      const maxOffset = Math.max(window.innerHeight - 96, 0);
      setFooterOffset(Math.min(Math.ceil(visibleHeight), maxOffset));
    };

    const observer = new MutationObserver(updateFooterOffset);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updateFooterOffset);
    window.addEventListener("scroll", updateFooterOffset, { passive: true });
    updateFooterOffset();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFooterOffset);
      window.removeEventListener("scroll", updateFooterOffset);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (hidden) closePanel(false);
  }, [closePanel, hidden]);

  const announceComingSoon = (action: ShuiLingGuideAction) => {
    setStatus(action.status?.[language] ?? "");
  };

  const openAssistant = () => {
    if (mode !== "assistant" || !onAskAI) return;
    closePanel(false);
    onAskAI({ citySlug: city?.slug });
  };

  const followAnchor = (action: ShuiLingGuideAction) => {
    if (!action.target) return;
    const target = document.querySelector<HTMLElement>(action.target);
    if (!target) return;
    window.history.replaceState(window.history.state, "", `${location.pathname}${action.target}`);
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    closePanel(false);
  };

  const renderAction = (action: ShuiLingGuideAction) => {
    const ActionIcon = ACTION_ICONS[action.id] ?? ChevronRight;
    const content = (
      <>
        <ActionIcon aria-hidden="true" className="size-[1.05rem] shrink-0" />
        <span>{action.label[language]}</span>
        <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0 opacity-55" />
      </>
    );

    if (action.kind === "navigate" && action.target) {
      return (
        <Link className="shuiling-guide__action" key={action.id} onClick={() => closePanel(false)} to={action.target}>
          {content}
        </Link>
      );
    }

    return (
      <button
        className="shuiling-guide__action w-full text-left"
        key={action.id}
        onClick={() => {
          if (action.kind === "anchor") followAnchor(action);
          else if (action.kind === "ask-ai") openAssistant();
          else announceComingSoon(action);
        }}
        type="button"
      >
        {content}
      </button>
    );
  };

  if (hidden) return null;

  const prompt =
    pageKind === "city" && city
      ? language === "zh"
        ? `想更了解${city.name.zh}吗？跟着我继续看看吧。`
        : `Want to discover more of ${city.name.en}? I'll guide you through the city.`
      : SHUILING_COPY[pageKind === "not-found" ? "notFoundPrompt" : "homePrompt"][language];

  return (
    <div
      className="shuiling-guide fixed z-[45]"
      data-open={open ? "true" : "false"}
      data-page-kind={pageKind}
      style={{ "--shuiling-footer-offset": `${footerOffset}px` } as CSSProperties}
    >
      <AnimatePresence>
        {open && (
          <>
            <button
              aria-label={language === "zh" ? "关闭水灵导览" : "Close Shuiling guide"}
              className="shuiling-guide__backdrop fixed inset-0"
              onClick={() => closePanel()}
              tabIndex={-1}
              type="button"
            />
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="shuiling-guide-title"
              aria-modal="false"
              className="shuiling-guide__panel overflow-hidden text-[#eaf1f9]"
              exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              id="shuiling-guide"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              role="dialog"
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
            >
              <div aria-hidden="true" className="map-current-lines opacity-40" />
              <div className="relative">
                <header className="flex items-start gap-4 border-b border-[#c1dddb]/25 px-5 py-5">
                  <ShuiLingMark className="size-14 sm:size-16" decorative />
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[11px] font-semibold text-[#eac459]" translate="no">
                      Shuiling · Jiangsu Cultural Guide
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-semibold leading-6 text-[#f3f8fc]" id="shuiling-guide-title">
                      {panelTitle}
                    </h2>
                  </div>
                  <button
                    aria-label={language === "zh" ? "关闭水灵导览" : "Close Shuiling guide"}
                    className="shuiling-guide__close grid size-11 shrink-0 place-items-center outline-none"
                    onClick={() => closePanel()}
                    ref={closeButtonRef}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </header>

                <p className="border-b border-[#c1dddb]/20 px-5 py-4 text-sm leading-6 text-[#eaf1f9]/90">{prompt}</p>

                {pageKind === "city" ? (
                  <>
                    <p className="shuiling-guide__group-label px-5 pb-2 pt-4">{SHUILING_COPY.cityContents[language]}</p>
                    <div className="shuiling-guide__actions shuiling-guide__actions--city">{cityActions.map(renderAction)}</div>
                    <p className="shuiling-guide__group-label px-5 pb-2 pt-4">{SHUILING_COPY.futureServices[language]}</p>
                    <div className="shuiling-guide__actions">
                      {[...(askAction ? [askAction] : []), ...FUTURE_GUIDE_ACTIONS].map(renderAction)}
                    </div>
                  </>
                ) : (
                  <div className="shuiling-guide__actions py-2">
                    {(pageKind === "home" ? HOME_GUIDE_ACTIONS : NOT_FOUND_GUIDE_ACTIONS).map(renderAction)}
                    {pageKind === "home" && FUTURE_GUIDE_ACTIONS.map(renderAction)}
                  </div>
                )}

                <div className="min-h-12 border-t border-[#c1dddb]/20 px-5 py-3" aria-live="polite" role="status">
                  <p className="text-xs leading-5 text-[#d7e2de]">
                    {status ??
                      (language === "zh" ? "当前为本地文化导览模式。" : "Local cultural guide mode is active.")}
                  </p>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hintVisible && !open && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="shuiling-guide__hint"
            exit={{ opacity: 0, y: reduceMotion ? 0 : 5 }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          >
            {prompt}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        aria-controls="shuiling-guide"
        aria-expanded={open}
        aria-label={language === "zh" ? "打开水灵导览" : "Open Shuiling guide"}
        className="shuiling-guide__trigger group relative block rounded-full outline-none"
        onClick={() => {
          if (open) closePanel();
          else setOpen(true);
        }}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="shuiling-guide__ring absolute inset-[-6px] rounded-full" />
        <ShuiLingMark decorative />
        <span className="shuiling-guide__label absolute bottom-0 right-[82%] whitespace-nowrap px-2 py-1 text-[10px] font-semibold text-[#34465a]">
          {language === "zh" ? "水灵导览" : "Shuiling"}
        </span>
      </button>
    </div>
  );
}
