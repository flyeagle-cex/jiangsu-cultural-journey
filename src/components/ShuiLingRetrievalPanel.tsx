import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, LoaderCircle, MapPin, Search, X } from "lucide-react";

import { ShuiLingMark } from "@/components/ShuiLingMark";
import { useLanguage } from "@/context/LanguageContext";
import { cityIdentityBySlug } from "@/data/city-manifest";
import { searchKnowledge } from "@/rag/retrieval";
import type {
  KnowledgeSection,
  RetrievalMatchReason,
  RetrievalResponse,
} from "@/rag/types";
import type { CitySlug, Language } from "@/types/city";

type ShuiLingRetrievalPanelProps = {
  citySlug?: CitySlug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SECTION_LABELS: Record<KnowledgeSection, { zh: string; en: string }> = {
  overview: { zh: "城市概况", en: "City profile" },
  nature: { zh: "自然风光", en: "Nature" },
  history: { zh: "历史文化", en: "History" },
  heritage: { zh: "非遗技艺", en: "Heritage" },
  food: { zh: "特色美食", en: "Food" },
  waterways: { zh: "运河水系", en: "Waterways" },
  route: { zh: "文化路线", en: "Route" },
  story: { zh: "文化故事", en: "Story" },
  reference: { zh: "参考资料", en: "Reference" },
  other: { zh: "其他专题", en: "Other" },
};

const REASON_LABELS: Record<RetrievalMatchReason, { zh: string; en: string }> = {
  title: { zh: "标题相关", en: "title match" },
  content: { zh: "正文相关", en: "content match" },
  city: { zh: "城市匹配", en: "city match" },
  section: { zh: "主题匹配", en: "topic match" },
  phrase: { zh: "词组命中", en: "phrase match" },
};

const COPY = {
  zh: {
    title: "水灵 · 文化资料检索",
    description: "当前为资料检索模式，水灵正在从江苏十三市文化资料库中寻找相关内容。",
    allCities: "检索范围：江苏十三市",
    currentCity: "当前城市",
    recognizedCity: "识别城市",
    queryLabel: "文化问题",
    placeholder: "例如：南京有什么代表性的鸭类美食？",
    submit: "检索资料",
    loading: "正在检索",
    hint: "当前资料库以中文检索最准确。",
    initial: "输入一个江苏文化问题，检索结果将显示原始资料片段与来源。",
    empty: "现有资料中暂未找到足够相关的内容。可以换一个更具体的文化关键词。",
    error: "文化资料暂时未能加载，请重试。",
    retry: "重试",
    results: "检索结果",
    source: "来源",
    basis: "检索依据",
    original: "查看原文",
    close: "关闭文化资料检索",
    fallback: "当前城市资料匹配较弱，已扩大到江苏十三市。",
    score: "检索分数",
  },
  en: {
    title: "Shuiling · Cultural Retrieval",
    description: "Retrieval preview based on the Jiangsu cultural corpus.",
    allCities: "Scope: Jiangsu's 13 cities",
    currentCity: "Current city",
    recognizedCity: "Detected city",
    queryLabel: "Culture question",
    placeholder: "For example: What food should I try in Wuxi?",
    submit: "Search sources",
    loading: "Searching",
    hint: "Chinese queries currently provide the best retrieval accuracy.",
    initial: "Enter a Jiangsu culture question to find original excerpts and their sources.",
    empty: "The current corpus does not contain a sufficiently relevant result. Try a more specific term.",
    error: "The cultural corpus could not be loaded. Please try again.",
    retry: "Retry",
    results: "Retrieved sources",
    source: "Source",
    basis: "Matched by",
    original: "View original excerpt",
    close: "Close cultural retrieval",
    fallback: "Local matches were weak, so the search expanded to all 13 cities.",
    score: "Retrieval score",
  },
} as const;

export function formatSourceDocument(sourceDocument: string) {
  return `《${sourceDocument.replace(/\.docx$/iu, "").trim()}》`;
}

export function createRetrievalExcerpt(content: string, maximumCharacters = 220) {
  return content.length > maximumCharacters
    ? `${content.slice(0, maximumCharacters).trimEnd()}…`
    : content;
}

function getScopeLabel(response: RetrievalResponse, language: Language) {
  const copy = COPY[language];
  if (response.scope.kind === "all") return copy.allCities;
  const cityNames = response.scope.citySlugs.map(
    (slug) => cityIdentityBySlug[slug].name[language],
  );
  return `${response.scope.explicitCitySlugs.length ? copy.recognizedCity : copy.currentCity}：${cityNames.join(
    language === "zh" ? "、" : ", ",
  )}`;
}

export function ShuiLingRetrievalPanel({
  citySlug,
  open,
  onOpenChange,
}: ShuiLingRetrievalPanelProps) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<RetrievalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const copy = COPY[language];
  const currentCity = citySlug ? cityIdentityBySlug[citySlug] : undefined;
  const contextLabel = currentCity
    ? `${copy.currentCity}：${currentCity.name[language]}`
    : copy.allCities;

  const resultCountLabel = useMemo(() => {
    if (!response) return "";
    return language === "zh"
      ? `${copy.results} · ${response.results.length} 条`
      : `${copy.results} · ${response.results.length}`;
  }, [copy.results, language, response]);

  useEffect(() => {
    setQuery("");
    setResponse(null);
    setError(false);
  }, [citySlug]);

  const runSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(false);
    try {
      setResponse(await searchKnowledge(query, { currentCity: citySlug, topK: 5 }));
    } catch {
      setError(true);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[70] bg-[#071925]/75"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                aria-describedby="shuiling-retrieval-description"
                asChild
                forceMount
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  document.querySelector<HTMLButtonElement>(".shuiling-guide__trigger")?.focus();
                }}
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  if (window.matchMedia("(min-width: 640px)").matches) {
                    window.requestAnimationFrame(() => inputRef.current?.focus());
                  }
                }}
              >
                <motion.section
                  animate={{ opacity: 1 }}
                  className="fixed inset-y-0 right-0 z-[71] flex w-full flex-col overflow-hidden border-l border-[#c1dddb]/30 bg-[#183a4e] text-[#eaf1f9] shadow-[-2px_0_8px_rgba(4,18,29,0.22)] sm:max-w-[38rem]"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
                >
                  <header className="flex items-start gap-3 border-b border-[#c1dddb]/25 px-4 py-4 sm:px-6">
                    <ShuiLingMark className="!size-12" decorative />
                    <div className="min-w-0 flex-1">
                      <Dialog.Title className="font-display text-xl font-semibold leading-7 text-[#f3f8fc]">
                        {copy.title}
                      </Dialog.Title>
                      <Dialog.Description
                        className="mt-1 max-w-[58ch] text-sm leading-5 text-[#c1dddb]"
                        id="shuiling-retrieval-description"
                      >
                        {copy.description}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      aria-label={copy.close}
                      className="grid size-11 shrink-0 place-items-center rounded-md border border-[#c1dddb]/35 text-[#eaf1f9] outline-none transition-colors duration-150 hover:bg-[#42769d]/35 focus-visible:ring-2 focus-visible:ring-[#eac459]"
                    >
                      <X aria-hidden="true" className="size-5" />
                    </Dialog.Close>
                  </header>

                  <div className="flex items-center gap-2 border-b border-[#c1dddb]/20 px-4 py-3 text-sm text-[#d7e2de] sm:px-6">
                    <MapPin aria-hidden="true" className="size-4 shrink-0 text-[#eac459]" />
                    <span>{response ? getScopeLabel(response, language) : contextLabel}</span>
                  </div>

                  <form className="border-b border-[#c1dddb]/25 px-4 py-4 sm:px-6" onSubmit={runSearch}>
                    <label className="mb-2 block text-sm font-semibold text-[#eaf1f9]" htmlFor="shuiling-retrieval-query">
                      {copy.queryLabel}
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        autoComplete="off"
                        className="min-h-12 min-w-0 flex-1 rounded-md border border-[#c1dddb]/45 bg-[#102f42] px-3 text-base text-[#f3f8fc] outline-none placeholder:text-[#b3c6bb]/65 focus-visible:border-[#eac459] focus-visible:ring-2 focus-visible:ring-[#eac459]/45"
                        id="shuiling-retrieval-query"
                        name="culture-query"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={copy.placeholder}
                        ref={inputRef}
                        type="search"
                        value={query}
                      />
                      <button
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#eac459] px-5 text-sm font-bold text-[#263a4d] outline-none transition-colors duration-150 hover:bg-[#f1cf6f] focus-visible:ring-2 focus-visible:ring-[#eaf1f9] disabled:cursor-wait disabled:opacity-70"
                        disabled={loading}
                        type="submit"
                      >
                        {loading ? (
                          <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
                        ) : (
                          <Search aria-hidden="true" className="size-4" />
                        )}
                        <span>{loading ? copy.loading : copy.submit}</span>
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#b3c6bb]">{copy.hint}</p>
                  </form>

                  <p aria-live="polite" className="sr-only" role="status">
                    {loading ? `${copy.loading}…` : response ? resultCountLabel : ""}
                  </p>

                  <div
                    aria-busy={loading}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6"
                    data-retrieval-elapsed-ms={response?.elapsedMs}
                    data-retrieval-scope={response?.scope.kind}
                  >
                    {!response && !error && !loading && (
                      <p className="mx-auto max-w-[52ch] py-10 text-center text-sm leading-6 text-[#c1dddb]">
                        {copy.initial}
                      </p>
                    )}

                    {loading && (
                      <p className="py-10 text-center text-sm text-[#c1dddb]" role="status">
                        {copy.loading}…
                      </p>
                    )}

                    {error && !loading && (
                      <div className="py-10 text-center" role="alert">
                        <p className="text-sm leading-6 text-[#eaf1f9]">{copy.error}</p>
                        <button
                          className="mt-4 min-h-11 rounded-md border border-[#eac459] px-4 text-sm font-semibold text-[#eac459] outline-none transition-colors duration-150 hover:bg-[#eac459]/10 focus-visible:ring-2 focus-visible:ring-[#eaf1f9]"
                          onClick={() => void runSearch()}
                          type="button"
                        >
                          {copy.retry}
                        </button>
                      </div>
                    )}

                    {response && !loading && !error && response.results.length === 0 && (
                      <p className="mx-auto max-w-[52ch] py-10 text-center text-sm leading-6 text-[#c1dddb]">
                        {copy.empty}
                      </p>
                    )}

                    {response && !loading && response.results.length > 0 && (
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c1dddb]/20 py-3 text-xs text-[#b3c6bb]">
                          <span>{resultCountLabel}</span>
                          {response.fellBackToGlobal && <span>{copy.fallback}</span>}
                        </div>
                        <ol>
                          {response.results.map((result) => {
                            const city = cityIdentityBySlug[result.chunk.city];
                            const reasonText = result.reasons
                              .map((reason) => REASON_LABELS[reason][language])
                              .join(language === "zh" ? "、" : ", ");
                            return (
                              <li
                                className="border-b border-[#c1dddb]/20 py-5 last:border-b-0"
                                data-city={result.chunk.city}
                                data-score={result.score}
                                data-section={result.chunk.section}
                                key={result.chunk.id}
                              >
                                <article>
                                  <p className="text-xs font-semibold text-[#eac459]">
                                    {city.name[language]} · {SECTION_LABELS[result.chunk.section][language]}
                                  </p>
                                  <h3 className="mt-1.5 font-display text-lg font-semibold leading-6 text-[#f3f8fc]">
                                    {result.chunk.title}
                                  </h3>
                                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#eaf1f9]/90">
                                    {createRetrievalExcerpt(result.chunk.content)}
                                  </p>
                                  <dl className="mt-3 grid gap-1.5 text-xs leading-5 text-[#b3c6bb]">
                                    <div className="flex gap-2">
                                      <dt className="shrink-0 font-semibold text-[#c1dddb]">{copy.source}：</dt>
                                      <dd>{formatSourceDocument(result.chunk.sourceDocument)}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                      <dt className="shrink-0 font-semibold text-[#c1dddb]">{copy.basis}：</dt>
                                      <dd>{reasonText}</dd>
                                    </div>
                                    {import.meta.env.DEV && (
                                      <div className="flex gap-2">
                                        <dt className="shrink-0 font-semibold text-[#c1dddb]">{copy.score}：</dt>
                                        <dd className="tabular-nums">{result.score.toFixed(2)}</dd>
                                      </div>
                                    )}
                                  </dl>
                                  <details className="mt-3 border-t border-[#c1dddb]/15 pt-2">
                                    <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-[#eac459] outline-none focus-visible:ring-2 focus-visible:ring-[#eac459] [&::-webkit-details-marker]:hidden">
                                      {copy.original}
                                      <ChevronDown aria-hidden="true" className="size-4" />
                                    </summary>
                                    <p className="mt-2 whitespace-pre-line border-l border-[#81b3a9] pl-3 text-sm leading-6 text-[#d7e2de]">
                                      {result.chunk.content}
                                    </p>
                                  </details>
                                </article>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    )}
                  </div>
                </motion.section>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
