import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Language } from "@/types/city";

export type { Language } from "@/types/city";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const LANGUAGE_STORAGE_KEY = "jiangsu-cultural-journey:language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function resolveInitialLanguage(savedLanguage: string | null): Language {
  return savedLanguage === "zh" || savedLanguage === "en" ? savedLanguage : "zh";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "zh";

  try {
    return resolveInitialLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return "zh";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The interface still works when storage is disabled or unavailable.
    }
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
