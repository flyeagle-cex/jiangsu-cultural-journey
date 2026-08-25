import { useLanguage } from "@/context/LanguageContext";
import { SHUILING_ASSETS } from "@/data/shuiling-guide";
import { cn } from "@/lib/utils";

type ShuiLingMarkProps = {
  className?: string;
  decorative?: boolean;
  large?: boolean;
};

export function ShuiLingMark({ className, decorative = false, large = false }: ShuiLingMarkProps) {
  const { language } = useLanguage();

  return (
    <div
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : language === "zh" ? "水灵数字文化向导" : "Shuiling cultural guide"}
      className={cn(
        "shuiling-mark relative isolate shrink-0 overflow-hidden rounded-full border border-[#c1dddb]/75 bg-[#81b3a9]",
        large ? "size-52 sm:size-64 lg:size-72" : "size-14 sm:size-[4.5rem]",
        className,
      )}
      data-asset-slot="shuiling-official-media"
      role={decorative ? undefined : "img"}
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
        height="320"
        src={SHUILING_ASSETS.avatar}
        width="320"
      />
      <span aria-hidden="true" className="shuiling-mark__ripple shuiling-mark__ripple--one" />
      <span aria-hidden="true" className="shuiling-mark__ripple shuiling-mark__ripple--two" />
      <span aria-hidden="true" className="shuiling-mark__image-wash absolute inset-0" />
    </div>
  );
}
