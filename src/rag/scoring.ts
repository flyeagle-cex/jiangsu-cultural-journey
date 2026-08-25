import { cityManifest } from "@/data/city-manifest";
import {
  normalizeQuery,
  removeQueryStopWords,
  tokenizeChineseText,
  translateEnglishCultureTerms,
  uniqueQueryTokens,
} from "@/rag/normalize-query";
import type {
  KnowledgeChunk,
  KnowledgeSection,
  RetrievalMatchReason,
  RetrievalResult,
} from "@/rag/types";
import type { CitySlug } from "@/types/city";

export const RETRIEVAL_WEIGHTS = Object.freeze({
  title: 3.6,
  parentTitle: 1.8,
  content: 1,
  exactPhraseTitle: 3.4,
  exactPhraseContent: 1.6,
  explicitCity: 7,
  currentCity: 1.2,
  section: 1.1,
  referencePenalty: 0.28,
});

export const MIN_RESULT_SCORE = 2.4;
export const MIN_QUERY_COVERAGE = 0.2;
export const MIN_LOCAL_RETRIEVAL_SCORE = 5;

const BM25_K1 = 1.2;
const BM25_B = 0.75;

const SECTION_QUERY_HINTS: Record<Exclude<KnowledgeSection, "reference" | "other">, string[]> = {
  overview: ["城市", "概况", "位置", "地理"],
  nature: ["自然", "风景", "湖", "山", "湿地", "生态", "园林"],
  history: ["历史", "古代", "沿革", "人物", "名人", "项羽"],
  heritage: ["非遗", "传统技艺", "手艺", "民俗", "工艺"],
  food: ["美食", "小吃", "菜", "饮食", "吃", "味道", "甜", "鸭"],
  waterways: ["运河", "大运河", "漕运", "水运", "航运", "水系", "河"],
  route: ["路线", "线路", "怎么玩", "游览"],
  story: ["故事", "传说", "典故"],
};

const SOURCE_QUERY_PATTERN = /资料来源|参考资料|参考文献|信息来源|来源说明|source|citation|reference/u;
const EXACT_PHRASE_TERMS = new Set([
  "美食",
  "非遗",
  "运河",
  "大运河",
  "历史",
  "湿地",
  "园林",
  "水系",
]);

type IndexedChunk = {
  chunk: KnowledgeChunk;
  title: string;
  parentTitle: string;
  content: string;
  titleTerms: Map<string, number>;
  parentTitleTerms: Map<string, number>;
  contentTerms: Map<string, number>;
  contentLength: number;
};

type RetrievalIndex = {
  documents: IndexedChunk[];
  documentFrequency: Map<string, number>;
  averageDocumentLength: number;
};

const indexCache = new WeakMap<readonly KnowledgeChunk[], RetrievalIndex>();

function termFrequency(tokens: string[]) {
  const frequencies = new Map<string, number>();
  for (const token of tokens) frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  return frequencies;
}

function createRetrievalIndex(chunks: readonly KnowledgeChunk[]): RetrievalIndex {
  const cached = indexCache.get(chunks);
  if (cached) return cached;

  const documents = chunks.map((chunk) => {
    const contentTokens = tokenizeChineseText(chunk.content);
    return {
      chunk,
      title: normalizeQuery(chunk.title),
      parentTitle: normalizeQuery(chunk.parentTitle ?? ""),
      content: normalizeQuery(chunk.content),
      titleTerms: termFrequency(tokenizeChineseText(chunk.title)),
      parentTitleTerms: termFrequency(tokenizeChineseText(chunk.parentTitle ?? "")),
      contentTerms: termFrequency(contentTokens),
      contentLength: Math.max(contentTokens.length, 1),
    };
  });

  const documentFrequency = new Map<string, number>();
  for (const document of documents) {
    const terms = new Set([
      ...document.titleTerms.keys(),
      ...document.parentTitleTerms.keys(),
      ...document.contentTerms.keys(),
    ]);
    for (const term of terms) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const averageDocumentLength =
    documents.reduce((sum, document) => sum + document.contentLength, 0) /
    Math.max(documents.length, 1);
  const index = { documents, documentFrequency, averageDocumentLength };
  indexCache.set(chunks, index);
  return index;
}

function inverseDocumentFrequency(documentCount: number, frequency: number) {
  return Math.log(1 + (documentCount - frequency + 0.5) / (frequency + 0.5));
}

function bm25TermScore(
  frequency: number,
  documentLength: number,
  averageDocumentLength: number,
  idf: number,
) {
  if (!frequency) return 0;
  const normalization =
    frequency +
    BM25_K1 * (1 - BM25_B + BM25_B * (documentLength / averageDocumentLength));
  return idf * ((frequency * (BM25_K1 + 1)) / normalization);
}

function detectSectionHints(query: string) {
  const normalized = translateEnglishCultureTerms(query);
  return new Set(
    Object.entries(SECTION_QUERY_HINTS)
      .filter(([, hints]) => hints.some((hint) => normalized.includes(hint)))
      .map(([section]) => section as KnowledgeSection),
  );
}

function removeDetectedCityNames(query: string, citySlugs: readonly CitySlug[]) {
  let value = translateEnglishCultureTerms(query);
  for (const slug of citySlugs) {
    const city = cityManifest.find((item) => item.slug === slug);
    if (!city) continue;
    for (const name of [city.name.zh, city.name.en, city.slug]) {
      value = value.replaceAll(normalizeQuery(name), " ");
    }
  }
  return removeQueryStopWords(value).replace(/\s+/gu, " ").trim();
}

function addReason(reasons: Set<RetrievalMatchReason>, reason: RetrievalMatchReason) {
  reasons.add(reason);
}

function simpleContentOverlap(left: string, right: string) {
  const leftTerms = new Set(tokenizeChineseText(left).filter((token) => token.length >= 2));
  const rightTerms = new Set(tokenizeChineseText(right).filter((token) => token.length >= 2));
  if (!leftTerms.size || !rightTerms.size) return 0;
  let intersection = 0;
  for (const term of leftTerms) if (rightTerms.has(term)) intersection += 1;
  return intersection / Math.min(leftTerms.size, rightTerms.size);
}

function diverseTopResults(
  ranked: RetrievalResult[],
  topK: number,
  explicitCitySlugs: readonly CitySlug[],
) {
  const selected: RetrievalResult[] = [];
  const addIfDiverse = (candidate: RetrievalResult) => {
    const duplicate = selected.some(
      (existing) =>
        existing.chunk.city === candidate.chunk.city &&
        existing.chunk.title === candidate.chunk.title &&
        simpleContentOverlap(existing.chunk.content, candidate.chunk.content) >= 0.72,
    );
    if (!duplicate) selected.push(candidate);
  };

  if (explicitCitySlugs.length > 1) {
    for (const citySlug of explicitCitySlugs) {
      const cityResult = ranked.find((result) => result.chunk.city === citySlug);
      if (cityResult) addIfDiverse(cityResult);
    }
  }

  for (const result of ranked) {
    if (selected.length >= topK) break;
    if (selected.includes(result)) continue;
    addIfDiverse(result);
  }
  return selected.slice(0, topK);
}

export function scoreKnowledgeChunks(
  query: string,
  chunks: readonly KnowledgeChunk[],
  {
    explicitCitySlugs = [],
    currentCity,
    topK = 5,
  }: {
    explicitCitySlugs?: readonly CitySlug[];
    currentCity?: CitySlug;
    topK?: number;
  } = {},
) {
  const lexicalQuery = removeDetectedCityNames(query, explicitCitySlugs);
  const queryTerms = uniqueQueryTokens(lexicalQuery);
  if (!queryTerms.length) return [];

  const index = createRetrievalIndex(chunks);
  const sectionHints = detectSectionHints(query);
  const sourceIntent = SOURCE_QUERY_PATTERN.test(translateEnglishCultureTerms(query));
  const phraseTerms = queryTerms.filter(
    (term) => term.length >= 3 || EXACT_PHRASE_TERMS.has(term),
  );
  const ranked: RetrievalResult[] = [];

  for (const document of index.documents) {
    let score = 0;
    const matchedTerms = new Set<string>();
    const reasons = new Set<RetrievalMatchReason>();

    for (const term of queryTerms) {
      const titleFrequency = document.titleTerms.get(term) ?? 0;
      const parentFrequency = document.parentTitleTerms.get(term) ?? 0;
      const contentFrequency = document.contentTerms.get(term) ?? 0;
      if (!titleFrequency && !parentFrequency && !contentFrequency) continue;

      matchedTerms.add(term);
      const idf = inverseDocumentFrequency(
        index.documents.length,
        index.documentFrequency.get(term) ?? 0,
      );
      if (titleFrequency) {
        score += idf * titleFrequency * RETRIEVAL_WEIGHTS.title;
        addReason(reasons, "title");
      }
      if (parentFrequency) {
        score += idf * parentFrequency * RETRIEVAL_WEIGHTS.parentTitle;
        addReason(reasons, "title");
      }
      if (contentFrequency) {
        score +=
          bm25TermScore(
            contentFrequency,
            document.contentLength,
            index.averageDocumentLength,
            idf,
          ) * RETRIEVAL_WEIGHTS.content;
        addReason(reasons, "content");
      }
    }

    let phraseBonus = 0;
    for (const phrase of phraseTerms) {
      if (document.title.includes(phrase) || document.parentTitle.includes(phrase)) {
        phraseBonus += RETRIEVAL_WEIGHTS.exactPhraseTitle;
      } else if (document.content.includes(phrase)) {
        phraseBonus += RETRIEVAL_WEIGHTS.exactPhraseContent;
      }
    }
    if (phraseBonus) {
      score += Math.min(phraseBonus, 9);
      addReason(reasons, "phrase");
    }

    if (explicitCitySlugs.includes(document.chunk.city)) {
      score += RETRIEVAL_WEIGHTS.explicitCity;
      addReason(reasons, "city");
    } else if (!explicitCitySlugs.length && currentCity === document.chunk.city) {
      score += RETRIEVAL_WEIGHTS.currentCity;
      addReason(reasons, "city");
    }

    if (sectionHints.has(document.chunk.section)) {
      score += RETRIEVAL_WEIGHTS.section;
      addReason(reasons, "section");
    }

    if (document.chunk.section === "reference" && !sourceIntent) {
      score *= RETRIEVAL_WEIGHTS.referencePenalty;
    }

    const coverage = matchedTerms.size / queryTerms.length;
    const enoughCoverage =
      matchedTerms.size >= Math.min(2, queryTerms.length) || coverage >= MIN_QUERY_COVERAGE;
    if (enoughCoverage && score >= MIN_RESULT_SCORE) {
      ranked.push({
        chunk: document.chunk,
        score: Number(score.toFixed(3)),
        matchedTerms: [...matchedTerms].sort((left, right) => right.length - left.length),
        reasons: [...reasons],
      });
    }
  }

  ranked.sort((left, right) => right.score - left.score || left.chunk.id.localeCompare(right.chunk.id));
  return diverseTopResults(ranked, Math.min(Math.max(topK, 1), 8), explicitCitySlugs);
}
