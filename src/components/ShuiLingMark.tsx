import { Waves } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function ShuiLingMark({ large = false }: { large?: boolean }) {
  const { language } = useLanguage();

  return (
    <div
      aria-label={language === "zh" ? "水灵" : "ShuiLing"}
      className={cn(
        "shuiling-mark relative isolate grid shrink-0 place-items-center overflow-hidden rounded-full border border-[#c1dddb]/75 bg-[#81b3a9] text-[#34465a]",
        large ? "size-52 sm:size-64 lg:size-72" : "size-12 sm:size-14",
      )}
      data-asset-slot="shuiling-canva-media"
      role="img"
    >
      <span aria-hidden="true" className="shuiling-mark__ripple shuiling-mark__ripple--one" />
      <span aria-hidden="true" className="shuiling-mark__ripple shuiling-mark__ripple--two" />
      <div className="relative z-10 text-center">
        <Waves aria-hidden="true" className={cn("mx-auto", large ? "size-12" : "size-5")} />
        <span
          className={cn(
            "mt-1 block font-display font-semibold",
            large ? "text-3xl" : language === "zh" ? "text-xs" : "text-[9px] tracking-[-0.02em]",
          )}
          translate="no"
        >
          {language === "zh" ? "水灵" : "ShuiLing"}
        </span>
        {large && (
          <span className="mt-1 block text-xs font-semibold tracking-[0.12em] text-[#34465a]/80" translate="no">
            {language === "zh" ? "SHUILING" : "水灵"}
          </span>
        )}
      </div>
    </div>
  );
}
