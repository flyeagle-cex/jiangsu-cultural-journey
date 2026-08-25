import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { CityAmbientLayer } from "@/components/CityAmbientLayer";
import { CityAnchorNav } from "@/components/CityAnchorNav";
import { CityCreativeLinks } from "@/components/CityCreativeLinks";
import { CityCultureSection } from "@/components/CityCultureSection";
import { CityHero } from "@/components/CityHero";
import { CityJourneyNav } from "@/components/CityJourneyNav";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { getCityBySlug } from "@/data/cities";
import { setDocumentMeta } from "@/lib/document-meta";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { resolveText } from "@/types/city";

export default function CityPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const city = getCityBySlug(slug ?? "");

  useEffect(() => {
    if (!city) return;
    setDocumentMeta({
      title: `${city.name[language]} · ${language === "zh" ? "水韵江苏" : "Jiangsu Cultural Journey"}`,
      description: resolveText(city.summary, language),
    });
  }, [city, language]);

  if (!city) return <NotFoundPage />;

  return (
    <>
      <main className="city-archive-field text-foreground" data-city-page={city.slug} id="main-content">
        <CityAmbientLayer citySlug={city.slug} />
        <CityHero city={city} />
        <CityAnchorNav city={city} />
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          {city.sections.map((section, index) => (
            <CityCultureSection city={city} index={index} key={section.id} section={section} />
          ))}

          <CityCreativeLinks citySlug={city.slug} />

          <div className="city-archive-note grid gap-3 border-b py-10 sm:grid-cols-[12rem_1fr] sm:items-start sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {language === "zh" ? "资料说明" : "Archive note"}
            </p>
            <p className="max-w-[68ch] text-sm leading-6 text-[#eef5fb]/[0.88]">
              {language === "zh"
                ? `资料来源：江苏十三市文化资料库 · ${city.name.zh}篇。`
                : `Source: Jiangsu Thirteen-City Cultural Archive · ${city.name.en}.`}
            </p>
          </div>

          <div className="pb-20 pt-12 sm:pb-24 sm:pt-16">
            <CityJourneyNav city={city} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
