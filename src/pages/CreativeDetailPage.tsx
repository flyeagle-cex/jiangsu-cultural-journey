import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import CreativeImageViewer from "@/components/CreativeImageViewer";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_NAME } from "@/data/brand";
import {
  creativeCategoryLabels,
  creativeThemeLabels,
} from "@/data/creative-manifest";
import { CREATIVE_CENTER_PATH, getCreativeProjectBySlug } from "@/lib/creative";
import type { Language } from "@/types/city";
import type { CreativeAsset, CreativeProject } from "@/types/creative";

function CreativeDetailNotFound({ language }: { language: Language }) {
  useEffect(() => {
    document.title = `${language === "zh" ? "未找到文创作品" : "Creative Project Not Found"}｜${BRAND_NAME[language]}`;
  }, [language]);

  return (
    <main
      className="grid min-h-screen place-items-center bg-[#5E6C82] px-4 pb-20 pt-24 text-[#EAF1F9]"
      id="main-content"
    >
      <div className="w-full max-w-2xl border-y border-[#C1DDDB]/32 py-12">
        <p className="font-display text-6xl text-[#EAC459] tabular-nums">404</p>
        <h1 className="mt-5 text-3xl font-semibold">
          {language === "zh" ? "未找到这件文创作品" : "Creative project not found"}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#EAF1F9]/90">
          {language === "zh"
            ? "该作品链接不存在或尚未登记，请返回文创中心查看已收录作品。"
            : "This project link does not exist or has not been registered. Return to the Creative Center to browse available work."}
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center gap-2 border border-[#EAC459] px-4 py-2.5 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:bg-[#EAC459] hover:text-[#34465A] focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82]"
          to={CREATIVE_CENTER_PATH}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {language === "zh" ? "返回文创中心" : "Back to Creative Center"}
        </Link>
      </div>
    </main>
  );
}

function ProjectMetadata({ language, project }: { language: Language; project: CreativeProject }) {
  const scopeLabel = {
    jiangsu: language === "zh" ? "江苏主题" : "Jiangsu-wide",
    city: language === "zh" ? "城市主题" : "City-linked",
    "multi-city": language === "zh" ? "多城市主题" : "Multi-city",
  }[project.scope];
  const rows = [
    { label: language === "zh" ? "作品范围" : "Scope", value: scopeLabel },
    {
      label: language === "zh" ? "作品状态" : "Status",
      value:
        project.status === "published"
          ? language === "zh"
            ? "正式作品"
            : "Published project"
          : language === "zh"
            ? "草稿"
            : "Draft",
    },
    project.designer
      ? { label: language === "zh" ? "设计作者" : "Designer", value: project.designer }
      : null,
    project.year
      ? { label: language === "zh" ? "创作年份" : "Year", value: project.year.toString() }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <dl className="border-t border-[#C1DDDB]/26">
      {rows.map((row) => (
        <div
          className="grid gap-1 border-b border-[#C1DDDB]/26 py-3.5 sm:grid-cols-[7rem_minmax(0,1fr)]"
          key={row.label}
        >
          <dt className="text-sm text-[#C1DDDB]">{row.label}</dt>
          <dd className="text-sm text-[#EAF1F9]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ArtworkFigure({
  asset,
  language,
  eager = false,
}: {
  asset: CreativeAsset;
  language: Language;
  eager?: boolean;
}) {
  return (
    <figure className="border border-[#C1DDDB]/28 bg-[#F6F7F4] p-2 sm:p-3">
      <CreativeImageViewer asset={asset} eager={eager} language={language} />
      <figcaption className="border-t border-[#5E6C82]/20 px-2 pb-1 pt-3 text-xs leading-5 text-[#46586A]">
        {asset.alt[language]}
      </figcaption>
    </figure>
  );
}

export default function CreativeDetailPage() {
  const { language } = useLanguage();
  const { slug } = useParams();
  const project = getCreativeProjectBySlug(slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.name[language]}｜${BRAND_NAME[language]}`;
    }
  }, [language, project]);

  if (!project) return <CreativeDetailNotFound language={language} />;

  const collectionAssets = project.gallery.filter(
    (asset) => asset.kind === "scene" || asset.kind === "design_board",
  );
  const packagingAssets = project.gallery.filter((asset) => asset.kind === "packaging");
  const productAssets = project.gallery.filter((asset) => asset.kind === "product");

  return (
    <main
      className="min-h-screen bg-[#5E6C82] px-4 pb-32 pt-24 text-[#EAF1F9] sm:px-6 lg:px-10"
      id="main-content"
    >
      <article className="mx-auto max-w-[1240px]">
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
          to={CREATIVE_CENTER_PATH}
        >
          <ArrowLeft aria-hidden="true" className="size-4 text-[#EAC459]" />
          {language === "zh" ? "返回文创中心" : "Back to Creative Center"}
        </Link>

        <header className="mt-6 grid gap-10 border-y border-[#C1DDDB]/30 py-10 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {project.name[language]}
            </h1>
            {language === "en" && project.metadataProvenance.nameEn === "temporaryTranslation" && (
              <p className="mt-3 text-xs text-[#C1DDDB]">Working English translation</p>
            )}
            {project.subtitle && (
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#C1DDDB]">
                {project.subtitle[language]}
              </p>
            )}
            {project.description && (
              <p className="mt-5 max-w-xl text-base leading-7 text-[#EAF1F9]/90">
                {project.description[language]}
              </p>
            )}

            <p className="mt-7 text-sm leading-7 text-[#EAC459]">
              {project.themes.map((theme) => creativeThemeLabels[theme][language]).join(" · ")}
            </p>
            <div className="mt-8 max-w-md">
              <ProjectMetadata language={language} project={project} />
            </div>
          </div>

          {project.coverAsset && <ArtworkFigure asset={project.coverAsset} eager language={language} />}
        </header>

        {project.concept && (
          <section aria-labelledby="creative-concept-heading" className="border-b border-[#C1DDDB]/24 py-12">
            <h2 className="font-display text-2xl font-semibold" id="creative-concept-heading">
              {language === "zh" ? "设计理念" : "Design Concept"}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#EAF1F9]/90">
              {project.concept[language]}
            </p>
          </section>
        )}

        <section aria-labelledby="creative-gallery-heading" className="pt-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold" id="creative-gallery-heading">
              {language === "zh" ? "作品图集" : "Project Gallery"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#C1DDDB]">
              {language === "zh"
                ? "以下展示保持原始设计稿比例与构图；点击图片可查看完整大图。"
                : "The original proportions and composition are preserved. Select an image to open the full view."}
            </p>
          </div>

          {collectionAssets.length > 0 && (
            <section aria-labelledby="creative-collection-heading" className="mt-12">
              <h3 className="border-b border-[#C1DDDB]/28 pb-4 text-xl font-semibold" id="creative-collection-heading">
                {language === "zh" ? "系列组合" : "Collection Views"}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {collectionAssets.map((asset) => (
                  <ArtworkFigure asset={asset} key={asset.id} language={language} />
                ))}
              </div>
            </section>
          )}

          {packagingAssets.length > 0 && (
            <section aria-labelledby="creative-packaging-heading" className="mt-14">
              <h3 className="border-b border-[#C1DDDB]/28 pb-4 text-xl font-semibold" id="creative-packaging-heading">
                {language === "zh" ? "包装设计" : "Packaging"}
              </h3>
              <div className="mt-6 max-w-2xl">
                {packagingAssets.map((asset) => (
                  <ArtworkFigure asset={asset} key={asset.id} language={language} />
                ))}
              </div>
            </section>
          )}

          {productAssets.length > 0 && (
            <section aria-labelledby="creative-products-heading" className="mt-14">
              <h3 className="border-b border-[#C1DDDB]/28 pb-4 text-xl font-semibold" id="creative-products-heading">
                {language === "zh" ? "单品设计" : "Individual Products"}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {productAssets.map((asset) => (
                  <ArtworkFigure asset={asset} key={asset.id} language={language} />
                ))}
              </div>
            </section>
          )}
        </section>

        <footer className="mt-16 grid gap-10 border-t border-[#C1DDDB]/30 pt-10 md:grid-cols-2">
          <section aria-labelledby="creative-categories-detail-heading">
            <h2 className="text-lg font-semibold" id="creative-categories-detail-heading">
              {language === "zh" ? "作品类别" : "Categories"}
            </h2>
            <ul className="mt-4 divide-y divide-[#C1DDDB]/24 border-y border-[#C1DDDB]/24">
              {project.categories.map((category) => (
                <li className="py-3 text-sm text-[#EAF1F9]/90" key={category}>
                  {creativeCategoryLabels[category][language]}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="creative-cultural-links-heading">
            <h2 className="text-lg font-semibold" id="creative-cultural-links-heading">
              {language === "zh" ? "文化关联" : "Cultural Links"}
            </h2>
            <ul className="mt-4 divide-y divide-[#C1DDDB]/24 border-y border-[#C1DDDB]/24">
              {project.culturalLinks.map((link) => (
                <li className="py-3 text-sm text-[#EAF1F9]/90" key={`${link.type}-${link.title.zh}`}>
                  {link.title[language]}
                </li>
              ))}
            </ul>
          </section>
        </footer>
      </article>
    </main>
  );
}
