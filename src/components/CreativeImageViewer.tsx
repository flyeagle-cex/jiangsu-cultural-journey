import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";

import type { Language } from "@/types/city";
import type { CreativeAsset } from "@/types/creative";

interface CreativeImageViewerProps {
  asset: CreativeAsset;
  language: Language;
  eager?: boolean;
  imageClassName?: string;
}

export default function CreativeImageViewer({
  asset,
  language,
  eager = false,
  imageClassName = "",
}: CreativeImageViewerProps) {
  const alt = asset.alt[language];
  const openLabel = language === "zh" ? `放大查看：${alt}` : `Open full view: ${alt}`;
  const closeLabel = language === "zh" ? "关闭大图" : "Close full view";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          aria-label={openLabel}
          className="group relative block w-full cursor-zoom-in bg-[#F6F7F4] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82]"
          type="button"
        >
          <img
            alt={alt}
            className={`h-auto w-full object-contain ${imageClassName}`}
            decoding="async"
            fetchPriority={eager ? "high" : undefined}
            height={asset.height}
            loading={eager ? "eager" : "lazy"}
            src={asset.src}
            width={asset.width}
          />
          <span className="absolute bottom-3 right-3 grid size-11 place-items-center border border-[#C1DDDB]/65 bg-[#34465A]/90 text-[#EAF1F9] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ZoomIn aria-hidden="true" className="size-4" />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#162B3A]/94" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[81] flex max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 flex-col bg-[#F6F7F4] p-3 outline-none sm:p-5"
        >
          <div className="mb-3 flex min-h-11 items-start justify-between gap-5 text-[#34465A]">
            <Dialog.Title className="max-w-3xl pt-2 text-sm font-medium leading-5">
              {alt}
            </Dialog.Title>
            <Dialog.Close
              aria-label={closeLabel}
              className="grid size-11 shrink-0 place-items-center border border-[#5E6C82]/35 outline-none transition-colors duration-150 hover:border-[#42769D] hover:bg-[#EAF1F9] focus-visible:ring-2 focus-visible:ring-[#42769D]"
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-auto text-center">
            <img
              alt=""
              className="mx-auto h-auto max-h-[calc(100svh-8rem)] w-auto max-w-full object-contain"
              decoding="async"
              height={asset.height}
              src={asset.src}
              width={asset.width}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
