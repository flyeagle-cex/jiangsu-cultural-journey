import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { creativeCategoryLabels } from "@/data/creative-manifest";
import { useLanguage } from "@/context/LanguageContext";
import { CREATIVE_CENTER_PATH, getCreativeProjectBySlug } from "@/lib/creative";
import type { Language } from "@/types/city";
import type { CreativeProject } from "@/types/creative";

function CreativeDetailNotFound({ language }: { language: Language }) {
  useEffect(() => {
    document.title = language === "zh" ? "未找到文创作品｜水韵江苏" : "Creative Project Not Found | Jiangsu Cultural Journey";
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
        <p className="mt-4 max-w-xl text-base leading-7 text-[#EAF1F9]">
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
  const rows = [
    {
      label: language === "zh" ? "作品范围" : "Scope",
      value: project.scope === "jiangsu" ? (language === "zh" ? "全江苏主题" : "Jiangsu-wide") : project.scope,
    },
    {
      label: language === "zh" ? "作品状态" : "Status",
      value: project.status === "published" ? (language === "zh" ? "正式作品" : "Official project") : language === "zh" ? "草稿" : "Draft",
    },
    {
      label: language === "zh" ? "设计作者" : "Designer",
      value: project.designer ?? (language === "zh" ? "待用户补充" : "Awaiting user content"),
    },
    {
      label: language === "zh" ? "创作年份" : "Year",
      value: project.year?.toString() ?? (language === "zh" ? "待用户补充" : "Awaiting user content"),
    },
  ];

  return (
    <dl className="border-t border-[#C1DDDB]/25">
      {rows.map((row) => (
        <div className="grid gap-2 border-b border-[#C1DDDB]/25 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]" key={row.label}>
          <dt className="text-sm text-[#EAF1F9]">{row.label}</dt>
          <dd className="text-sm text-[#EAF1F9]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CreativeDetailPage() {
  const { language } = useLanguage();
  const { slug } = useParams();
  const project = getCreativeProjectBySlug(slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.name[language]}｜${language === "zh" ? "水韵江苏" : "Jiangsu Cultural Journey"}`;
    }
  }, [language, project]);

  if (!project) return <CreativeDetailNotFound language={language} />;

  return (
    <main
      className="min-h-screen bg-[#5E6C82] px-4 pb-24 pt-24 text-[#EAF1F9] sm:px-6 lg:px-10"
      id="main-content"
    >
      <article className="mx-auto max-w-[1240px]">
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-white focus-visible:ring-2 focus-visible:ring-[#EAC459]"
          to={CREATIVE_CENTER_PATH}
        >
          <ArrowLeft aria-hidden="true" className="size-4 text-[#EAC459]" />
          {language === "zh" ? "返回文创中心" : "Back to Creative Center"}
        </Link>

        <header className="mt-7 grid gap-10 border-y border-[#C1DDDB]/30 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {project.name[language]}
            </h1>
            {language === "en" && project.metadataProvenance.nameEn === "temporaryTranslation" && (
              <p className="mt-3 text-sm text-[#EAF1F9]">Temporary English title · Official translation pending</p>
            )}
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#EAF1F9]">
              {language === "zh"
                ? "本页已建立作品资料与文化关联结构；真实设计图将在 Stage 8B 完成 Web 素材整理后接入。"
                : "This page establishes the project record and its cultural links. Original artwork will be added after web asset preparation in Stage 8B."}
            </p>
          </div>
          <div className="border-l border-[#EAC459]/65 pl-5">
            <p className="text-sm text-[#EAF1F9]">{language === "zh" ? "来源素材" : "Source artwork"}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-[#EAC459]">
              {project.sourceAssets.length}
            </p>
            <p className="mt-1 text-sm text-[#EAF1F9]">{language === "zh" ? "张原始设计图已清点" : "original design files inventoried"}</p>
          </div>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.65fr)]">
          <div className="space-y-12">
            <section aria-labelledby="creative-cover-heading">
              <h2 className="text-2xl font-semibold" id="creative-cover-heading">
                {language === "zh" ? "作品封面" : "Project Cover"}
              </h2>
              {project.coverAsset ? (
                <img
                  alt={project.coverAsset.alt[language]}
                  className="mt-6 h-auto w-full border border-[#C1DDDB]/25"
                  height={project.coverAsset.height}
                  src={project.coverAsset.src}
                  width={project.coverAsset.width}
                />
              ) : (
                <div className="mt-6 border-y border-[#C1DDDB]/28 py-14 text-center text-sm leading-6 text-[#EAF1F9]">
                  {language === "zh" ? "封面素材待 Web 化整理后接入" : "Cover artwork awaits web asset preparation"}
                </div>
              )}
            </section>

            <section aria-labelledby="creative-concept-heading">
              <h2 className="text-2xl font-semibold" id="creative-concept-heading">
                {language === "zh" ? "设计理念" : "Design Concept"}
              </h2>
              <p className="mt-5 max-w-3xl border-l border-[#D6CDBE]/60 pl-5 text-base leading-7 text-[#EAF1F9]">
                {project.concept?.[language] ??
                  (language === "zh" ? "设计理念待用户提供正式文案。" : "Official design concept text has not yet been supplied.")}
              </p>
            </section>

            <section aria-labelledby="creative-gallery-heading">
              <h2 className="text-2xl font-semibold" id="creative-gallery-heading">
                {language === "zh" ? "作品图集" : "Project Gallery"}
              </h2>
              {project.gallery.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((asset) => (
                    <img
                      alt={asset.alt[language]}
                      className="h-auto w-full border border-[#C1DDDB]/25"
                      height={asset.height}
                      key={asset.id}
                      loading="lazy"
                      src={asset.src}
                      width={asset.width}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-6 border-y border-[#C1DDDB]/28 py-8 text-sm leading-6 text-[#EAF1F9]" role="status">
                  {language === "zh"
                    ? "暂无可公开加载的 Gallery 素材；12 张原始设计图已完成只读登记。"
                    : "No web-ready gallery assets are available yet; 12 original design files have been inventoried read-only."}
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-10">
            <section aria-labelledby="creative-metadata-heading">
              <h2 className="text-xl font-semibold" id="creative-metadata-heading">
                {language === "zh" ? "基本资料" : "Project Metadata"}
              </h2>
              <div className="mt-5">
                <ProjectMetadata language={language} project={project} />
              </div>
            </section>

            <section aria-labelledby="creative-categories-detail-heading">
              <h2 className="text-xl font-semibold" id="creative-categories-detail-heading">
                {language === "zh" ? "作品类别" : "Categories"}
              </h2>
              <ul className="mt-5 divide-y divide-[#C1DDDB]/22 border-y border-[#C1DDDB]/22">
                {project.categories.map((category) => (
                  <li className="py-3 text-sm text-[#EAF1F9]" key={category}>
                    {creativeCategoryLabels[category][language]}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="creative-cultural-links-heading">
              <h2 className="text-xl font-semibold" id="creative-cultural-links-heading">
                {language === "zh" ? "文化关联" : "Cultural Links"}
              </h2>
              <ul className="mt-5 divide-y divide-[#C1DDDB]/22 border-y border-[#C1DDDB]/22">
                {project.culturalLinks.map((link) => (
                  <li className="py-3 text-sm text-[#EAF1F9]" key={`${link.type}-${link.title.zh}`}>
                    {link.title[language]}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
