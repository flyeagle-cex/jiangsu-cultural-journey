import { useEffect } from "react";

import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ThemeExplorer } from "@/components/ThemeExplorer";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_NAME } from "@/data/brand";
import { setDocumentMeta } from "@/lib/document-meta";

export function HomePage() {
  const { language } = useLanguage();

  useEffect(() => {
    setDocumentMeta({
      title:
        language === "zh"
          ? `${BRAND_NAME.zh} · 江苏文化之旅`
          : BRAND_NAME.en,
      description:
        language === "zh"
          ? `${BRAND_NAME.zh}双语数字文化导览，以水系为线索探索江苏十三座城市。`
          : `${BRAND_NAME.en} is a bilingual cultural guide to Jiangsu's thirteen cities through waterways, landscapes, living heritage and food.`,
    });
  }, [language]);

  return (
    <main
  id="main-content"
  className="min-h-screen bg-[#F6F1E8] text-[#20343C]"
>
      <Hero />
      <ThemeExplorer />
      <Footer />
    </main>
  );
}
