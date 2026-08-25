import type { ShuiLingCitation } from "../../src/assistant/types";
import type { KnowledgeChunk, RetrievalResult } from "../../src/rag/types";

export const MAX_RAG_CONTEXT_CHARS = 6_000;
export const MAX_RAG_EVIDENCE = 5;

export type RagEvidence = {
  evidenceId: string;
  chunk: KnowledgeChunk;
  contextContent: string;
};

export type BuiltRagContext = {
  text: string;
  evidence: RagEvidence[];
};

function evidenceHeader(evidenceId: string, chunk: KnowledgeChunk) {
  return [
    `[${evidenceId}]`,
    `Chunk ID: ${chunk.id}`,
    `City: ${chunk.cityNameZh}`,
    `Section: ${chunk.section}`,
    `Title: ${chunk.title}`,
    `Source: ${chunk.sourceDocument}`,
    "Content:",
  ].join("\n");
}

export function buildRagContext(
  results: readonly RetrievalResult[],
  maximumCharacters = MAX_RAG_CONTEXT_CHARS,
): BuiltRagContext {
  const evidence: RagEvidence[] = [];
  let text = "";

  for (const result of results.slice(0, MAX_RAG_EVIDENCE)) {
    const evidenceId = `E${evidence.length + 1}`;
    const separator = text ? "\n\n" : "";
    const header = evidenceHeader(evidenceId, result.chunk);
    const remaining = maximumCharacters - text.length - separator.length - header.length - 1;
    if (remaining < 40) break;

    const contextContent = result.chunk.content.slice(0, remaining).trimEnd();
    const block = `${header}\n${contextContent}`;
    text += `${separator}${block}`;
    evidence.push({ evidenceId, chunk: result.chunk, contextContent });
  }

  return { text, evidence };
}

export function evidenceToCitation(evidence: RagEvidence): ShuiLingCitation {
  return {
    evidenceId: evidence.evidenceId,
    chunkId: evidence.chunk.id,
    city: evidence.chunk.city,
    section: evidence.chunk.section,
    title: evidence.chunk.title,
    sourceDocument: evidence.chunk.sourceDocument,
  };
}

export function validateCitationIds(citationIds: readonly string[], evidence: readonly RagEvidence[]) {
  const allowed = new Set(evidence.map((item) => item.evidenceId));
  return [...new Set(citationIds)].filter((citationId) => allowed.has(citationId));
}
