import path from "node:path";

import { CITY_DEFINITIONS, KNOWLEDGE_SECTIONS } from "./config.mjs";

const VALID_CITIES = new Set(CITY_DEFINITIONS.map((city) => city.slug));
const VALID_SECTIONS = new Set(KNOWLEDGE_SECTIONS);

function validationError(messages) {
  const error = new Error(["CORPUS_VALIDATION_FAILED", ...messages].join("\n"));
  error.code = "CORPUS_VALIDATION_FAILED";
  return error;
}

export function hasPrivateSourcePath(sourceDocument) {
  return (
    path.isAbsolute(sourceDocument) ||
    /^[a-zA-Z]:[\\/]/u.test(sourceDocument) ||
    sourceDocument.includes("/") ||
    sourceDocument.includes("\\")
  );
}

export function validateKnowledgeChunks(chunks, { requireAllCities = true } = {}) {
  const errors = [];
  const ids = new Set();
  const cityCounts = Object.fromEntries(CITY_DEFINITIONS.map((city) => [city.slug, 0]));

  if (!Array.isArray(chunks) || chunks.length === 0) errors.push("Corpus is empty.");

  for (const [index, chunk] of chunks.entries()) {
    const label = `Chunk ${index + 1}`;
    if (!chunk?.id || typeof chunk.id !== "string") errors.push(`${label}: id is empty.`);
    else if (ids.has(chunk.id)) errors.push(`${label}: duplicate id ${chunk.id}.`);
    else ids.add(chunk.id);

    if (!VALID_CITIES.has(chunk?.city)) errors.push(`${label}: invalid city ${chunk?.city}.`);
    else cityCounts[chunk.city] += 1;
    if (!VALID_SECTIONS.has(chunk?.section)) errors.push(`${label}: invalid section ${chunk?.section}.`);
    if (!chunk?.title?.trim()) errors.push(`${label}: title is empty.`);
    if (!chunk?.content?.trim()) errors.push(`${label}: content is empty.`);
    if (!chunk?.sourceDocument?.trim()) errors.push(`${label}: sourceDocument is empty.`);
    else if (hasPrivateSourcePath(chunk.sourceDocument)) {
      errors.push(`${label}: sourceDocument contains a path.`);
    }
    if (!Number.isInteger(chunk?.sourceOrder) || chunk.sourceOrder < 0) {
      errors.push(`${label}: sourceOrder is invalid.`);
    }
    if (!Number.isInteger(chunk?.chunkIndex) || chunk.chunkIndex < 1) {
      errors.push(`${label}: chunkIndex is invalid.`);
    }
  }

  if (requireAllCities) {
    for (const city of CITY_DEFINITIONS) {
      if (cityCounts[city.slug] === 0) errors.push(`${city.slug}: no chunks generated.`);
    }
  }

  if (errors.length) throw validationError(errors.slice(0, 100));
  return { cityCounts, totalChunks: chunks.length };
}
