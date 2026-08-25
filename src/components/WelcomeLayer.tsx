import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useLanguage } from "@/context/LanguageContext";
import { SHUILING_ASSETS, SHUILING_COPY } from "@/data/shuiling-guide";
import {
  SHUILING_WELCOME_REPLAY_EVENT,
  SHUILING_WELCOME_STORAGE_KEY,
  dismissShuiLingWelcome,
  hasSeenShuiLingWelcome,
} from "@/lib/shuiling-session";

export const WELCOME_STORAGE_KEY = SHUILING_WELCOME_STORAGE_KEY;

type WelcomeLayerProps = {
  onVisibilityChange?: (visible: boolean) => void;
};

function WelcomeJasmine({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 48 48">
      <g fill="#f4f1e8" stroke="rgba(214,205,190,0.72)" strokeWidth="0.8">
        <ellipse cx="24" cy="13" rx="7" ry="12" />
        <ellipse cx="35" cy="21" rx="7" ry="12" transform="rotate(72 35 21)" />
        <ellipse cx="31" cy="35" rx="7" ry="12" transform="rotate(144 31 35)" />
        <ellipse cx="17" cy="35" rx="7" ry="12" transform="rotate(216 17 35)" />
        <ellipse cx="13" cy="21" rx="7" ry="12" transform="rotate(288 13 21)" />
      </g>
      <circle cx="24" cy="24" fill="#eac459" r="3.2" />
    </svg>
  );
}

export function WelcomeLayer({ onVisibilityChange }: WelcomeLayerProps) {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => location.pathname === "/" && !hasSeenShuiLingWelcome());
  const [videoFailed, setVideoFailed] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    dismissShuiLingWelcome();
    setVisible(false);
  }, []);

  const startExploring = useCallback(() => {
    dismiss();
    navigate("/#cities");
  }, [dismiss, navigate]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setVisible(false);
      return;
    }
    if (!hasSeenShuiLingWelcome()) setVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    if (visible) setVideoFailed(false);
  }, [visible]);

  useEffect(() => {
    const replay = () => {
      if (location.pathname === "/") setVisible(true);
    };
    window.addEventListener(SHUILING_WELCOME_REPLAY_EVENT, replay);
    return () => window.removeEventListener(SHUILING_WELCOME_REPLAY_EVENT, replay);
  }, [location.pathname]);

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [onVisibilityChange, visible]);

  useEffect(() => {
    if (!visible) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => startButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [dismiss, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ opacity: 1 }}
          className="welcome-layer fixed inset-0 z-[60] overflow-hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        >
          <button
            aria-label={language === "zh" ? "关闭水灵欢迎" : "Close Shuiling welcome"}
            className="welcome-layer__dismiss-backdrop absolute inset-0 cursor-default"
            onClick={dismiss}
            tabIndex={-1}
            type="button"
          />

          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-describedby="shuiling-welcome-message"
            aria-labelledby="shuiling-welcome-title"
            aria-modal="false"
            className="welcome-layer__stage absolute bottom-0 right-0 overflow-hidden text-[#eaf1f9]"
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
            role="dialog"
            transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.5, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="welcome-layer__water" />
            <WelcomeJasmine className="welcome-layer__jasmine welcome-layer__jasmine--one" />
            <WelcomeJasmine className="welcome-layer__jasmine welcome-layer__jasmine--two" />

            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="welcome-layer__portrait"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.985 }}
              transition={{ delay: reduceMotion ? 0 : 0.58, duration: 0.58, ease: "easeOut" }}
            >
              {SHUILING_ASSETS.welcomeVideo && !reduceMotion && !videoFailed ? (
                <video
                  aria-hidden="true"
                  autoPlay
                  className="size-full object-cover"
                  loop
                  muted
                  onError={() => setVideoFailed(true)}
                  playsInline
                  poster={SHUILING_ASSETS.poster}
                  preload="metadata"
                  src={SHUILING_ASSETS.welcomeVideo}
                />
              ) : (
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover"
                  decoding="async"
                  height="960"
                  src={SHUILING_ASSETS.poster}
                  width="540"
                />
              )}
              <div aria-hidden="true" className="welcome-layer__portrait-wash" />
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="welcome-layer__copy relative z-10"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 }}
              transition={{ delay: reduceMotion ? 0 : 1.02, duration: 0.42, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between gap-5">
                <p className="welcome-layer__name font-semibold text-[#eac459]" translate="no">
                  {SHUILING_COPY.name[language]}
                </p>
                <button
                  aria-label={language === "zh" ? "关闭欢迎" : "Close welcome"}
                  className="welcome-layer__close grid size-11 shrink-0 place-items-center text-[#eaf1f9] outline-none"
                  onClick={dismiss}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
              <h2
                className="mt-4 max-w-[12ch] font-display text-[clamp(2rem,3.2vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#f3f8fc]"
                id="shuiling-welcome-title"
              >
                {SHUILING_COPY.welcomeTitle[language]}
              </h2>
              <p className="mt-4 max-w-[34ch] text-sm leading-6 text-[#eaf1f9]/90 sm:text-base sm:leading-7" id="shuiling-welcome-message">
                {SHUILING_COPY.welcomeBody[language]}
              </p>
              <div className="welcome-layer__actions mt-7 flex flex-wrap items-center gap-4">
                <button
                  className="welcome-layer__primary inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold outline-none"
                  onClick={startExploring}
                  ref={startButtonRef}
                  type="button"
                >
                  {SHUILING_COPY.start[language]}
                  <ArrowDown aria-hidden="true" className="size-4" />
                </button>
                <button
                  className="welcome-layer__later min-h-11 px-1 text-sm font-semibold text-[#d7e2de] outline-none"
                  onClick={dismiss}
                  type="button"
                >
                  {SHUILING_COPY.later[language]}
                </button>
              </div>
            </motion.div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
