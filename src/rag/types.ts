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
