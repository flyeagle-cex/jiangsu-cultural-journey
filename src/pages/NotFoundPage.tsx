import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Map } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { setDocumentMeta } from "@/lib/document-meta";

export function NotFoundPage() {
  const { language } = useLanguage();

  useEffect(() => {
    setDocumentMeta({
      title: language === "zh" ? "页面未找到 · 水韵江苏" : "Page not found · Jiangsu Cultural Journey",
      description:
        language === "zh"
          ? "返回江苏十三城地图，继续探索水韵江苏。"
          : "Return to the map and continue exploring Jiangsu's thirteen cities.",
    });
  }, [language]);

  return (
    <>
      <main
        className="city-not-found relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-background pt-16 text-foreground"
        id="main-content"
      >
        <img
          alt=""
          aria-hidden="true"
          className="hero-water-image city-hero-image absolute inset-0 -z-30 size-full object-cover opacity-45"
          height="1080"
          src="/assets/hero-grand-canal.jpg"
          width="1920"
        />
        <div aria-hidden="true" className="city-not-found__wash absolute inset-0 -z-20" />
        <div aria-hidden="true" className="deep-water-currents opacity-65" />

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] content-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden="true" className="h-px w-12 bg-primary/60" />
              {language === "zh" ? "水路偏航" : "Waterway off course"}
            </p>
            <p aria-hidden="true" className="city-not-found__code mt-8 font-display text-[clamp(6rem,17vw,13rem)] font-light leading-[0.72] tracking-[-0.07em]">
              404
            </p>
            <h1 className="mt-10 max-w-[14ch] font-display text-[clamp(2.7rem,5.5vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f4f9fd]">
              {language === "zh" ? "这条水路暂未开放" : "This waterway is not open yet"}
            </h1>
            <p className="mt-6 max-w-[56ch] text-base leading-7 text-[#eef5fb]/[0.94] sm:text-lg sm:leading-8">
              {language === "zh"
                ? "当前地址没有对应的城市档案。回到江苏十三城地图，沿着长江、运河与湖海重新出发。"
                : "There is no city archive at this address. Return to the thirteen-city map and begin again along the Yangtze, Grand Canal, lakes and coast."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button asChild>
                <Link to="/#cities">
                  <Map aria-hidden="true" />
                  {language === "zh" ? "打开十三城地图" : "Open the 13-city map"}
                </Link>
              </Button>
              <Link
                className="inline-flex min-h-11 items-center gap-2 border-b border-[#9fcfc5]/55 px-1 text-sm font-semibold text-[#d5eee8] outline-none transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                to="/"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                {language === "zh" ? "返回首页" : "Return home"}
              </Link>
            </div>
          </div>

          <aside className="atlas-index-rule city-not-found__aside self-end pl-6 lg:col-span-3 lg:col-start-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bfe2d9]">
              {language === "zh" ? "导航提示" : "Navigation note"}
            </p>
            <p className="mt-4 max-w-[24ch] font-display text-xl leading-8 text-[#f2f7fb]">
              {language === "zh" ? "水脉会转弯，旅程仍可继续。" : "A waterway may turn; the journey continues."}
            </p>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#d6cdbe]/70">
              Jiangsu · 13 cities · 05 currents
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
