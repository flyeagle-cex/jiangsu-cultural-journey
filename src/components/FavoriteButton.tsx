import { Bookmark, BookmarkCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export type FavoriteButtonProps = {
  active: boolean;
  label: string;
  activeLabel: string;
  ariaLabel: string;
  activeAriaLabel: string;
  onToggle: () => void;
  compact?: boolean;
};

export function FavoriteButton({
  active,
  label,
  activeLabel,
  ariaLabel,
  activeAriaLabel,
  onToggle,
  compact = false,
}: FavoriteButtonProps) {
  const Icon = active ? BookmarkCheck : Bookmark;

  return (
    <button
      aria-label={active ? activeAriaLabel : ariaLabel}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-md border bg-transparent py-2 text-sm font-semibold outline-none",
        "transition-[color,border-color,background-color] duration-150 ease-out",
        "focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#355768]",
        compact ? "px-3" : "px-4",
        active
          ? "border-[#EAC459]/80 bg-[#EAC459]/[0.08] text-[#EAC459] hover:border-[#F2D77C] hover:text-[#F2D77C]"
          : "border-[#C1DDDB]/45 text-[#DDE9E7] hover:border-[#C1DDDB]/80 hover:text-[#EAF1F9]",
      )}
      data-favorite-state={active ? "saved" : "unsaved"}
      onClick={onToggle}
      type="button"
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{active ? activeLabel : label}</span>
    </button>
  );
}
