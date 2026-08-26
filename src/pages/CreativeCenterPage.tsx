import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import CreativeImageViewer from "@/components/CreativeImageViewer";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_NAME } from "@/data/brand";
import {
  creativeCategoryLabels,
  creativeThemeLabels,
} from "@/data/creative-manifest";
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
  const featuredProject = getFeaturedCreativeProjects()[0];
  const visibleProjects = activeCategory
    ? publishedProjects.filter((project) => project.categories.includes(activeCategory))
    : publishedProjects;

  useEffect(() => {
    document.title = `${language === "zh" ? "文创中心" : "Creative Center"}｜${BRAND_NAME[language]}`;
  }, [language]);

  return (
    <main
      className="min-h-screen bg-[#5E6C82] px-4 pb-32 pt-24 text-[#EAF1F9] sm:px-6 lg:px-10"
      id="main-content"
    >
      <div className="mx-auto max-w-[1240px]">
        <header className="grid gap-7 border-b border-[#C1DDDB]/30 pb-9 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {language === "zh" ? "文创中心" : "Creative Center"}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#EAF1F9]/90">
              {language === "zh"
                ? "收录已完成的江苏文化文创作品，以及作品与城市、文化主题之间的关联。"
                : "An archive of completed Jiangsu cultural creative projects and their documented links to cities and cultural themes."}
            </p>
          </div>
          <p className="text-sm leading-6 text-[#C1DDDB] lg:text-right">
            <span className="mr-2 font-display text-3xl text-[#EAC459] tabular-nums">
              {publishedProjects.length}
            </span>
            {language === "zh" ? "件正式作品" : "published project"}
          </p>
        </header>

        {featuredProject && (
          <section
            aria-labelledby="creative-featured-heading"
            className="grid gap-10 border-b border-[#C1DDDB]/24 py-12 lg:grid-cols-[minmax(18rem,0.62fr)_minmax(0,1fr)] lg:items-start lg:gap-16"
          >
            <div className="lg:py-8">
              <p className="text-sm text-[#EAC459]">
                {language === "zh" ? "馆藏作品" : "Featured archive"}
              </p>
              <h2
                className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl"
                id="creative-featured-heading"
              >
                {featuredProject.name[language]}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#C1DDDB]">
                {featuredProject.themes
                  .map((theme) => creativeThemeLabels[theme][language])
                  .join(" · ")}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#EAF1F9]/85">
                {featuredProject.categories
                  .map((category) => creativeCategoryLabels[category][language])
                  .join(" / ")}
              </p>
              <Link
                className="mt-8 inline-flex min-h-11 items-center gap-3 border border-[#EAC459] bg-[#EAC459] px-5 py-2.5 text-sm font-semibold text-[#34465A] outline-none transition-colors duration-150 hover:bg-transparent hover:text-[#EAF1F9] focus-visible:ring-2 focus-visible:ring-[#EAC459] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5E6C82]"
                to={getCreativeProjectPath(featuredProject.slug)}
              >
                {language === "zh" ? "进入作品档案" : "Open project archive"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            {featuredProject.coverAsset && (
              <figure className="border border-[#C1DDDB]/28 bg-[#F6F7F4] p-2 sm:p-3">
                <CreativeImageViewer asset={featuredProject.coverAsset} eager language={language} />
                <figcaption className="border-t border-[#5E6C82]/20 px-2 pb-1 pt-3 text-xs leading-5 text-[#46586A]">
                  {featuredProject.coverAsset.alt[language]}
                </figcaption>
              </figure>
            )}
          </section>
        )}

        <section aria-labelledby="creative-categories-heading" className="border-b border-[#C1DDDB]/24 py-9">
          <h2 className="text-xl font-semibold" id="creative-categories-heading">
            {language === "zh" ? "按类别浏览" : "Browse by Category"}
          </h2>
          <nav
            aria-label={language === "zh" ? "文创类别" : "Creative categories"}
            className="mt-5 flex flex-wrap gap-3 pr-16 sm:pr-0"
          >
            <Link
              aria-current={activeCategory === null ? "page" : undefined}
              className="min-h-11 border border-[#C1DDDB]/40 px-4 py-2.5 text-sm text-[#EAF1F9] outline-none transition-colors duration-150 hover:border-[#EAC459] hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459] aria-[current=page]:border-[#EAC459] aria-[current=page]:bg-[#EAC459] aria-[current=page]:text-[#34465A]"
              to={CREATIVE_CENTER_PATH}
            >
              {language === "zh" ? "全部" : "All"}
            </Link>
            {(Object.entries(creativeCategoryLabels) as [
              CreativeCategory,
              (typeof creativeCategoryLabels)[CreativeCategory],
            ][]).map(([category, label]) => (
              <Link
                aria-current={activeCategory === category ? "page" : undefined}
                className="min-h-11 border border-[#C1DDDB]/40 px-4 py-2.5 text-sm text-[#EAF1F9] outline-none transition-colors duration-150 hover:border-[#EAC459] hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459] aria-[current=page]:border-[#EAC459] aria-[current=page]:bg-[#EAC459] aria-[current=page]:text-[#34465A]"
                key={category}
                to={`${CREATIVE_CENTER_PATH}?category=${category}#creative-projects`}
              >
                {label[language]}
              </Link>
            ))}
          </nav>
        </section>

        <section aria-labelledby="creative-projects-heading" className="pt-10" id="creative-projects">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-semibold" id="creative-projects-heading">
              {language === "zh" ? "作品档案" : "Project Archive"}
            </h2>
            <p className="text-sm tabular-nums text-[#C1DDDB]">
              {language === "zh"
                ? `${visibleProjects.length} 件`
                : `${visibleProjects.length} ${visibleProjects.length === 1 ? "project" : "projects"}`}
            </p>
          </div>

          <div className="mt-6 border-t border-[#C1DDDB]/28">
            {visibleProjects.map((project, index) => (
              <article
                className="grid gap-5 border-b border-[#C1DDDB]/28 py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(12rem,0.55fr)_auto] md:items-center"
                key={project.slug}
              >
                <p className="font-display text-2xl text-[#EAC459] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{project.name[language]}</h3>
                  <p className="mt-2 text-sm text-[#C1DDDB]">
                    {project.scope === "jiangsu"
                      ? language === "zh"
                        ? "江苏主题"
                        : "Jiangsu-wide"
                      : language === "zh"
                        ? "城市主题"
                        : "City-linked"}
                  </p>
                </div>
                <p className="text-sm leading-6 text-[#EAF1F9]/85">
                  {project.categories
                    .map((category) => creativeCategoryLabels[category][language])
                    .join(" / ")}
                </p>
                <Link
                  className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#EAF1F9] outline-none transition-colors duration-150 hover:text-[#EAC459] focus-visible:ring-2 focus-visible:ring-[#EAC459]"
                  to={getCreativeProjectPath(project.slug)}
                >
                  {language === "zh" ? "查看作品" : "View project"}
                  <ArrowRight aria-hidden="true" className="size-4 text-[#EAC459]" />
                </Link>
              </article>
            ))}

            {visibleProjects.length === 0 && (
              <p className="border-b border-[#C1DDDB]/28 py-10 text-sm text-[#C1DDDB]" role="status">
                {language === "zh" ? "该类别暂无已发布作品。" : "No published projects in this category."}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
