import {
  KNOWLEDGE_CITY_SLUGS,
  type KnowledgeChunk,
  type KnowledgeManifest,
} from "@/rag/types";
import type { CitySlug } from "@/types/city";

type Fetcher = typeof fetch;

let allChunksRequest: Promise<KnowledgeChunk[]> | null = null;
let manifestRequest: Promise<KnowledgeManifest> | null = null;
const cityRequests = new Map<CitySlug, Promise<KnowledgeChunk[]>>();

async function fetchJson<T>(url: string, fetcher: Fetcher): Promise<T> {
  const response = await fetcher(url);
  if (!response.ok) throw new Error(`KNOWLEDGE_FETCH_FAILED: ${response.status} ${url}`);
  return (await response.json()) as T;
}

export function getKnowledgeManifest(fetcher: Fetcher = fetch) {
  manifestRequest ??= fetchJson<KnowledgeManifest>("/knowledge/manifest.json", fetcher);
  return manifestRequest;
}

export function getAllKnowledgeChunks(fetcher: Fetcher = fetch) {
  allChunksRequest ??= fetchJson<KnowledgeChunk[]>("/knowledge/corpus.json", fetcher);
  return allChunksRequest;
}

export function getCityKnowledgeChunks(citySlug: CitySlug, fetcher: Fetcher = fetch) {
  const existing = cityRequests.get(citySlug);
  if (existing) return existing;
  const request = fetchJson<KnowledgeChunk[]>(`/knowledge/cities/${citySlug}.json`, fetcher);
  cityRequests.set(citySlug, request);
  return request;
}

export async function getKnowledgeChunkById(id: string, fetcher: Fetcher = fetch) {
  const citySlug = KNOWLEDGE_CITY_SLUGS.find((slug) => id.startsWith(`${slug}-`));
  const chunks = citySlug
    ? await getCityKnowledgeChunks(citySlug, fetcher)
    : await getAllKnowledgeChunks(fetcher);
  return chunks.find((chunk) => chunk.id === id);
}

export function clearKnowledgeCorpusCache() {
  allChunksRequest = null;
  manifestRequest = null;
  cityRequests.clear();
}
