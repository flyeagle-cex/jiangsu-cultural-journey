import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import {
  creativeCategoryLabels,
  creativeThemeLabels,
} from "@/data/creative-manifest";
import { useLanguage } from "@/context/LanguageContext";
import {
  CREATIVE_CENTER_PATH,
  getCreativeProjectPath,
  getFeaturedCreativeProjects,
  getPublishedCreativeProjects,
} from "@/lib/creative";
import type { CreativeCategory } from "@/types/creative";

function isCreativeCategory(value: string | null): value is CreativeCategory {
  return value !== null && value in creativeCategoryLabels;
}

export default function CreativeCenterPage() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const activeCategory = isCreativeCategory(requestedCategory) ? requestedCategory : null;
  const publishedProjects = getPublishedCreativeProjects();
  const featuredProjects = getFeaturedCreativeProjects();
  const visibleProjects = activeCategory
    ? publishedProjects.filter((project) => project.categories.includes(activeCategory))
    : publishedProjects;

  useEffect(() => {
    document.title = language === "zh" ? "文创中心｜水韵江苏" : "Creative Center | Jiangsu Cultural Journey";
  }, [language]);

  return (
    <main
      className="min-h-screen bg-[#5E6C82] px-4 pb-24 pt-24 text-[#EAF1F9] sm:px-6 lg:px-10"
      id="main-content"
    >
      <div className="mx-auto max-w-[1240px]">
        <header className="grid gap-8 border-b border-[#C1DDDB]/30 pb-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {language === "zh" ? "文创中心" : "Creative Center"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#EAF1F9]">
              {language === "zh"
                ? "汇集江苏文化 IP 与真实文创作品，建立作品、文化主题与城市之间的清晰关联。"
                : "An indexed collection of authentic Jiangsu cultural IP and creative works, connected to their cultural themes and cities."}
            </p>
          </div>
          <p className="border-l border-[#EAC459]/70 pl-5 text-sm leading-6 text-[#EAF1F9]">
            <span className="block text-3xl font-semibold tabular-nums text-[#EAC459]">
              {publishedProjects.length}
            </span>
            {language === "zh" ? "件正式作品已登记" : "official project registered"}
          </p>
        </header>

        <section aria-labelledby="creative-featured-heading" className="border-b border-[#C1DDDB]/24 py-10">
          <h2 className="text-xl font-semibold" id="creative-featured-heading">
            {language === "zh" ? "重点作品" : "Featured Project"}
          </h2>
          <div className="mt-6 divide-y divide-[#C1DDDB]/20 border-y border-[#C1DDDB]/20">
            {featuredProjects.map((project) => (
              <Link
                className="group grid min-h-32 gap-5 px-1 py-6 outline-none transition-colors duration-150 hover:bg-[#42769D]/20 focus-visible:ring-2 focus-visible:ring-[#EAC459] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                key={project.slug}
                to={getCreativeProjectPath(project.slug)}
              >
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#EAF1F9]">
                    {project.name[language]}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#EAF1F9]">
                    {project.themes.map((theme) => creativeThemeLabels[theme][language]).join(" · ")}
                  </p>
                </div>
                <span className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#EAF1F9]">
                  {language === "zh" ? "查看作品" : "View project"}
                  <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="creative-categories-heading" className="border-b border-[#C1DDDB]/24 py-10">
          <h2 className="text-xl font-semibold" id="creative-categories-heading">
            {language === "zh" ? "按类别浏览" : "Browse by Category"}
          </h2>
          <nav
            aria-label={language === "zh" ? "文创类别" : "Creative categories"}
            className="mt-6 flex flex-wrap gap-x-3 gap-y-3 pr-16 sm:pr-0"
          >
            <Link
              aria-current={activeCategory === null ? "page" : undefined}
              className="min-h-11 border border-[#C1DDDB]/35 px-4 py-2.5 text-sm text-[#EAF1F9] outline-none transition-colors duration-150 hover:border-[#EAC459]/70 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459] aria-[current=page]:border-[#EAC459] aria-[current=page]:bg-[#EAC459] aria-[current=page]:text-[#34465A]"
              to={CREATIVE_CENTER_PATH}
            >
              {language === "zh" ? "全部" : "All"}
            </Link>
            {(Object.entries(creativeCategoryLabels) as [CreativeCategory, (typeof creativeCategoryLabels)[CreativeCategory]][]).map(
              ([category, label]) => (
                <Link
                  aria-current={activeCategory === category ? "page" : undefined}
                  className="min-h-11 border border-[#C1DDDB]/35 px-4 py-2.5 text-sm text-[#EAF1F9] outline-none transition-colors duration-150 hover:border-[#EAC459]/70 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459] aria-[current=page]:border-[#EAC459] aria-[current=page]:bg-[#EAC459] aria-[current=page]:text-[#34465A]"
                  key={category}
                  to={`${CREATIVE_CENTER_PATH}?category=${category}#creative-projects`}
                >
                  {label[language]}
                </Link>
              ),
            )}
          </nav>
        </section>

        <section aria-labelledby="creative-projects-heading" className="pt-10" id="creative-projects">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-semibold" id="creative-projects-heading">
              {language === "zh" ? "作品档案" : "Project Archive"}
            </h2>
            <p className="text-sm tabular-nums text-[#EAF1F9]">
              {language === "zh" ? `${visibleProjects.length} 件` : `${visibleProjects.length} project`}
            </p>
          </div>
          <div className="mt-6 border-t border-[#C1DDDB]/28">
            {visibleProjects.map((project, index) => (
              <article
                className="grid gap-6 border-b border-[#C1DDDB]/28 py-7 md:grid-cols-[5rem_minmax(0,1fr)_minmax(14rem,0.55fr)_auto] md:items-center"
                key={project.slug}
              >
                <p className="font-display text-3xl text-[#EAC459] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{project.name[language]}</h3>
                  <p className="mt-2 text-sm text-[#EAF1F9]">
                    {project.scope === "jiangsu"
                      ? language === "zh"
                        ? "江苏主题"
                        : "Jiangsu-wide"
                      : language === "zh"
                        ? "城市主题"
                        : "City-linked"}
                  </p>
                </div>
                <p className="text-sm leading-6 text-[#EAF1F9]">
                  {project.categories.map((category) => creativeCategoryLabels[category][language]).join(" / ")}
                </p>
                <Link
                  className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#EAF1F9] outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                  to={getCreativeProjectPath(project.slug)}
                >
                  {language === "zh" ? "了解设计" : "Explore design"}
                  <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
