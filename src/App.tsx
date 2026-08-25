import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { CityAmbientLayer } from "@/components/CityAmbientLayer";
import { Navbar } from "@/components/Navbar";
import { ScrollManager } from "@/components/ScrollManager";
import { WelcomeLayer } from "@/components/WelcomeLayer";
import { useLanguage } from "@/context/LanguageContext";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { CitySlug } from "@/types/city";

const CityPage = lazy(() => import("@/pages/CityPage"));
const CreativeCenterPage = lazy(() => import("@/pages/CreativeCenterPage"));
const CreativeDetailPage = lazy(() => import("@/pages/CreativeDetailPage"));
const ShuiLingGuide = lazy(() =>
  import("@/components/ShuiLingGuide").then((module) => ({ default: module.ShuiLingGuide })),
);
const ShuiLingRetrievalPanel = lazy(() =>
  import("@/components/ShuiLingRetrievalPanel").then((module) => ({
    default: module.ShuiLingRetrievalPanel,
  })),
);

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

function CreativeRouteLoading() {
  const { language } = useLanguage();

  return (
    <main
      className="grid min-h-screen place-items-center bg-[#5E6C82] px-6 pt-16 text-[#EAF1F9]"
      id="main-content"
    >
      <p className="border-y border-[#C1DDDB]/30 px-10 py-8 text-sm text-[#C1DDDB]" role="status">
        {language === "zh" ? "正在载入文创档案…" : "Loading the creative archive…"}
      </p>
    </main>
  );
}

export default function App() {
  const { language } = useLanguage();
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [assistantMounted, setAssistantMounted] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantCitySlug, setAssistantCitySlug] = useState<CitySlug>();

  const openRetrieval = ({ citySlug }: { citySlug?: CitySlug }) => {
    setAssistantCitySlug(citySlug);
    setAssistantMounted(true);
    setAssistantOpen(true);
  };

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
        <Route
          path="/creative"
          element={
            <Suspense fallback={<CreativeRouteLoading />}>
              <CreativeCenterPage />
            </Suspense>
          }
        />
        <Route
          path="/creative/:slug"
          element={
            <Suspense fallback={<CreativeRouteLoading />}>
              <CreativeDetailPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <WelcomeLayer onVisibilityChange={setWelcomeVisible} />
      <Suspense fallback={null}>
        <ShuiLingGuide hidden={welcomeVisible} mode="assistant" onAskAI={openRetrieval} />
      </Suspense>
      {assistantMounted && (
        <Suspense fallback={null}>
          <ShuiLingRetrievalPanel
            citySlug={assistantCitySlug}
            onOpenChange={setAssistantOpen}
            open={assistantOpen}
          />
        </Suspense>
      )}
    </>
  );
}
