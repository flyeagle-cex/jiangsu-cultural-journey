import { resolveRetrievalScope } from "../../src/rag/city-detection";
import { retrieveKnowledgeFromChunks } from "../../src/rag/retrieval";
import { MIN_LOCAL_RETRIEVAL_SCORE } from "../../src/rag/scoring";
import type {
  KnowledgeChunk,
  ResolvedRetrievalScope,
  RetrievalResult,
} from "../../src/rag/types";
import type { CitySlug } from "../../src/types/city";

export const SERVER_RETRIEVAL_TOP_K = 5;
export const MIN_SERVER_GROUNDING_SCORE = 5;

export type ServerRetrievalResult = {
  results: RetrievalResult[];
  scope: ResolvedRetrievalScope;
  fellBackToGlobal: boolean;
};

function chunksForScope(chunks: readonly KnowledgeChunk[], scope: ResolvedRetrievalScope) {
  if (scope.kind === "all") return chunks;
  const citySlugs = new Set(scope.citySlugs);
  return chunks.filter((chunk) => citySlugs.has(chunk.city));
}

function groundedResults(results: RetrievalResult[]) {
  return results.filter((result) => result.score >= MIN_SERVER_GROUNDING_SCORE);
}

export function retrieveServerKnowledge(
  question: string,
  chunks: readonly KnowledgeChunk[],
  currentCity?: CitySlug,
): ServerRetrievalResult {
  const initialScope = resolveRetrievalScope(question, { currentCity });
  const scopedChunks = chunksForScope(chunks, initialScope);
  let results = groundedResults(
    retrieveKnowledgeFromChunks(question, scopedChunks, {
      currentCity: initialScope.usesCurrentCity ? currentCity : undefined,
      topK: SERVER_RETRIEVAL_TOP_K,
    }),
  );

  if (
    initialScope.usesCurrentCity &&
    (!results.length || results[0].score < MIN_LOCAL_RETRIEVAL_SCORE)
  ) {
    results = groundedResults(
      retrieveKnowledgeFromChunks(question, chunks, { topK: SERVER_RETRIEVAL_TOP_K }),
    );
    return {
      results,
      scope: {
        kind: "all",
        citySlugs: [],
        explicitCitySlugs: [],
        isGlobalIntent: false,
        usesCurrentCity: false,
      },
      fellBackToGlobal: true,
    };
  }

  return { results, scope: initialScope, fellBackToGlobal: false };
}
