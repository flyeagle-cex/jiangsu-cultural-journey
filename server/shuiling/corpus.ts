import { readFile } from "node:fs/promises";
import path from "node:path";

import type { KnowledgeChunk } from "../../src/rag/types";

let corpusRequest: Promise<KnowledgeChunk[]> | null = null;

function isKnowledgeChunk(value: unknown): value is KnowledgeChunk {
  if (!value || typeof value !== "object") return false;
  const chunk = value as Partial<KnowledgeChunk>;
  return (
    typeof chunk.id === "string" &&
    typeof chunk.city === "string" &&
    typeof chunk.section === "string" &&
    typeof chunk.title === "string" &&
    typeof chunk.content === "string" &&
    typeof chunk.sourceDocument === "string"
  );
}

async function readCorpus(projectRoot: string) {
  const corpusPath = path.resolve(projectRoot, "public", "knowledge", "corpus.json");
  const parsed = JSON.parse(await readFile(corpusPath, "utf8")) as unknown;
  if (!Array.isArray(parsed) || !parsed.every(isKnowledgeChunk)) {
    throw new Error("KNOWLEDGE_CORPUS_INVALID");
  }
  return parsed;
}

export function loadServerKnowledgeCorpus(projectRoot = process.cwd()) {
  if (!corpusRequest) {
    const request = readCorpus(projectRoot).catch((error: unknown) => {
      if (corpusRequest === request) corpusRequest = null;
      throw error;
    });
    corpusRequest = request;
  }
  return corpusRequest;
}

export function clearServerKnowledgeCorpusCache() {
  corpusRequest = null;
}
