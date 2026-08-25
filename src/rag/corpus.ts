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

export function knowledgeUrl(path: string, baseUrl = import.meta.env.BASE_URL) {
  const normalizedBase = `/${baseUrl ?? ""}/`.replace(/\/{2,}/gu, "/");
  const normalizedPath = path.replace(/^\/+|\/+$/gu, "");
  return `${normalizedBase}knowledge/${normalizedPath}`;
}

export function getKnowledgeManifest(fetcher: Fetcher = fetch) {
  if (!manifestRequest) {
    const request = fetchJson<KnowledgeManifest>(knowledgeUrl("manifest.json"), fetcher).catch(
      (error: unknown) => {
        if (manifestRequest === request) manifestRequest = null;
        throw error;
      },
    );
    manifestRequest = request;
  }
  return manifestRequest;
}

export function getAllKnowledgeChunks(fetcher: Fetcher = fetch) {
  if (!allChunksRequest) {
    const request = fetchJson<KnowledgeChunk[]>(knowledgeUrl("corpus.json"), fetcher).catch(
      (error: unknown) => {
        if (allChunksRequest === request) allChunksRequest = null;
        throw error;
      },
    );
    allChunksRequest = request;
  }
  return allChunksRequest;
}

export function getCityKnowledgeChunks(citySlug: CitySlug, fetcher: Fetcher = fetch) {
  const existing = cityRequests.get(citySlug);
  if (existing) return existing;
  const request = fetchJson<KnowledgeChunk[]>(
    knowledgeUrl(`cities/${citySlug}.json`),
    fetcher,
  ).catch((error: unknown) => {
    if (cityRequests.get(citySlug) === request) cityRequests.delete(citySlug);
    throw error;
  });
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
