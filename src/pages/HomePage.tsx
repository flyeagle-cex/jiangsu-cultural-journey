import { useEffect } from "react";

import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ThemeExplorer } from "@/components/ThemeExplorer";
import { useLanguage } from "@/context/LanguageContext";
import { setDocumentMeta } from "@/lib/document-meta";

export function HomePage() {
  const { language } = useLanguage();

  useEffect(() => {
    setDocumentMeta({
      title: language === "zh" ? "水韵江苏 · 江苏文化之旅" : "Jiangsu Cultural Journey",
      description:
        language === "zh"
          ? "水韵江苏双语数字文化导览，以水系为线索探索江苏十三座城市。"
          : "A bilingual cultural guide for exploring Jiangsu's thirteen cities through waterways, landscapes, living heritage and food.",
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
