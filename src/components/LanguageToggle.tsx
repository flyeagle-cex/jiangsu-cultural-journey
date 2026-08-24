import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      aria-label={language === "zh" ? "语言选择" : "Language selection"}
      className={cn(
        "inline-flex items-center border border-[#c1dddb]/[0.32] bg-[#42769d]/90 p-1",
        compact ? "rounded-md" : "rounded-lg",
      )}
      role="group"
    >
      <button
        aria-pressed={language === "zh"}
        className={cn(
          compact ? "min-h-9" : "min-h-11",
          "rounded px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          language === "zh" ? "bg-primary text-primary-foreground" : "text-foreground/65 hover:text-foreground",
        )}
        onClick={() => setLanguage("zh")}
        type="button"
      >
        <span lang="zh-CN">中文</span>
      </button>
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-[#c1dddb]/[0.28]" />
      <button
        aria-pressed={language === "en"}
        className={cn(
          compact ? "min-h-9" : "min-h-11",
          "rounded px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          language === "en" ? "bg-primary text-primary-foreground" : "text-foreground/65 hover:text-foreground",
        )}
        onClick={() => setLanguage("en")}
        type="button"
      >
        <span lang="en">English</span>
      </button>
    </div>
  );
}
