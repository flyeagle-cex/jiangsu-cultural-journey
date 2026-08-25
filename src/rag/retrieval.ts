import { getAllKnowledgeChunks, getCityKnowledgeChunks } from "@/rag/corpus";
import { resolveRetrievalScope } from "@/rag/city-detection";
import { normalizeQuery } from "@/rag/normalize-query";
import { MIN_LOCAL_RETRIEVAL_SCORE, scoreKnowledgeChunks } from "@/rag/scoring";
import type {
  KnowledgeChunk,
  ResolvedRetrievalScope,
  RetrievalOptions,
  RetrievalResponse,
  RetrievalResult,
} from "@/rag/types";

async function loadScopedCorpus(scope: ResolvedRetrievalScope, fetcher: typeof fetch) {
  if (scope.kind === "all") return getAllKnowledgeChunks(fetcher);
  const cityChunks = await Promise.all(
    scope.citySlugs.map((citySlug) => getCityKnowledgeChunks(citySlug, fetcher)),
  );
  return cityChunks.flat();
}

export function retrieveKnowledgeFromChunks(
  query: string,
  chunks: readonly KnowledgeChunk[],
  options: Omit<RetrievalOptions, "fetcher" | "scope"> = {},
) {
  const explicitCitySlugs = resolveRetrievalScope(query, options).explicitCitySlugs;
  return scoreKnowledgeChunks(query, chunks, {
    explicitCitySlugs,
    currentCity: explicitCitySlugs.length ? undefined : options.currentCity,
    topK: options.topK,
  });
}

export async function searchKnowledge(
  query: string,
  options: RetrievalOptions = {},
): Promise<RetrievalResponse> {
  const startedAt = performance.now();
  const normalizedQuery = normalizeQuery(query);
  const scope = resolveRetrievalScope(query, options);
  if (!normalizedQuery) {
    return { normalizedQuery, results: [], scope, fellBackToGlobal: false, elapsedMs: 0 };
  }

  const fetcher = options.fetcher ?? fetch;
  const chunks = await loadScopedCorpus(scope, fetcher);
  let results = scoreKnowledgeChunks(query, chunks, {
    explicitCitySlugs: scope.explicitCitySlugs,
    currentCity: scope.usesCurrentCity ? options.currentCity : undefined,
    topK: options.topK,
  });
  let fellBackToGlobal = false;
  let resolvedScope = scope;

  if (
    options.scope !== "city" &&
    scope.usesCurrentCity &&
    (!results.length || results[0].score < MIN_LOCAL_RETRIEVAL_SCORE)
  ) {
    const globalChunks = await getAllKnowledgeChunks(fetcher);
    results = scoreKnowledgeChunks(query, globalChunks, { topK: options.topK });
    fellBackToGlobal = true;
    resolvedScope = {
      kind: "all",
      citySlugs: [],
      explicitCitySlugs: [],
      isGlobalIntent: false,
      usesCurrentCity: false,
    };
  }

  return {
    normalizedQuery,
    results,
    scope: resolvedScope,
    fellBackToGlobal,
    elapsedMs: Number((performance.now() - startedAt).toFixed(2)),
  };
}

export async function retrieveKnowledge(
  query: string,
  options: RetrievalOptions = {},
): Promise<RetrievalResult[]> {
  return (await searchKnowledge(query, options)).results;
}
