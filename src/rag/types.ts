import { cityManifest } from "@/data/city-manifest";
import type { CitySlug } from "@/types/city";

export const KNOWLEDGE_SECTIONS = [
  "overview",
  "nature",
  "history",
  "heritage",
  "food",
  "waterways",
  "route",
  "story",
  "reference",
  "other",
] as const;

export type KnowledgeSection = (typeof KNOWLEDGE_SECTIONS)[number];

export const KNOWLEDGE_CITY_SLUGS: readonly CitySlug[] = Object.freeze(
  cityManifest.map((city) => city.slug),
);

export type KnowledgeChunk = {
  id: string;
  city: CitySlug;
  cityNameZh: string;
  section: KnowledgeSection;
  title: string;
  parentTitle?: string;
  content: string;
  sourceDocument: string;
  sourceOrder: number;
  chunkIndex: number;
};

export type KnowledgeManifest = {
  version: string;
  generatedAt: string;
  totalChunks: number;
  cities: Record<CitySlug, { nameZh: string; chunks: number }>;
  sectionCounts: Record<KnowledgeSection, number>;
};

export type RetrievalScope = "auto" | "city" | "all";

export type RetrievalMatchReason = "title" | "content" | "city" | "section" | "phrase";

export type RetrievalOptions = {
  currentCity?: CitySlug;
  scope?: RetrievalScope;
  topK?: number;
  fetcher?: typeof fetch;
};

export type RetrievalResult = {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
  reasons: RetrievalMatchReason[];
};

export type ResolvedRetrievalScope = {
  kind: "city" | "multi-city" | "all";
  citySlugs: CitySlug[];
  explicitCitySlugs: CitySlug[];
  isGlobalIntent: boolean;
  usesCurrentCity: boolean;
};

export type RetrievalResponse = {
  normalizedQuery: string;
  results: RetrievalResult[];
  scope: ResolvedRetrievalScope;
  fellBackToGlobal: boolean;
  elapsedMs: number;
};
