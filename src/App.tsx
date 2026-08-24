import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { CityAmbientLayer } from "@/components/CityAmbientLayer";
import { Navbar } from "@/components/Navbar";
import { ScrollManager } from "@/components/ScrollManager";
import { ShuiLingGuide } from "@/components/ShuiLingGuide";
import { WelcomeLayer } from "@/components/WelcomeLayer";
import { useLanguage } from "@/context/LanguageContext";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const CityPage = lazy(() => import("@/pages/CityPage"));

function CityRouteLoading() {
  const { language } = useLanguage();

  return (
    <main className="city-route-loading relative grid min-h-screen place-items-center overflow-hidden px-6 pt-16 text-foreground" id="main-content">
      <CityAmbientLayer />
      <div className="city-route-loading__card relative z-10 border-y px-10 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {language === "zh" ? "江苏城市水志" : "Jiangsu city water atlas"}
        </p>
        <p className="mt-3 text-sm text-[#eaf1f9]/80" role="status">
          {language === "zh" ? "正在载入城市文化资料…" : "Loading the city archive…"}
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const { language } = useLanguage();

  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main-content">
        {language === "zh" ? "跳至主要内容" : "Skip to main content"}
      </a>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/city/:slug"
          element={
            <Suspense fallback={<CityRouteLoading />}>
              <CityPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <WelcomeLayer />
      <ShuiLingGuide />
    </>
  );
}
