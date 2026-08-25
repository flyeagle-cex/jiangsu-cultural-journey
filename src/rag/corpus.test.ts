import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearKnowledgeCorpusCache,
  getAllKnowledgeChunks,
  getCityKnowledgeChunks,
  getKnowledgeChunkById,
  getKnowledgeManifest,
  knowledgeUrl,
} from "@/rag/corpus";
import type { KnowledgeChunk } from "@/rag/types";

const nanjingChunk: KnowledgeChunk = {
  id: "nanjing-food-001",
  city: "nanjing",
  cityNameZh: "南京",
  section: "food",
  title: "南京美食",
  content: "南京文化资料测试内容。",
  sourceDocument: "南京篇.docx",
  sourceOrder: 1,
  chunkIndex: 1,
};

function jsonResponse(value: unknown) {
  return { ok: true, status: 200, json: async () => value } as Response;
}

function errorResponse(status = 500) {
  return { ok: false, status, json: async () => ({}) } as Response;
}

afterEach(() => {
  clearKnowledgeCorpusCache();
});

describe("lazy knowledge corpus loader", () => {
  it("loads a city file without requesting the full corpus", async () => {
    const fetcher = vi.fn(async () => jsonResponse([nanjingChunk])) as unknown as typeof fetch;
    await expect(getCityKnowledgeChunks("nanjing", fetcher)).resolves.toEqual([nanjingChunk]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
  });

  it("derives the city from a stable chunk id", async () => {
    const fetcher = vi.fn(async () => jsonResponse([nanjingChunk])) as unknown as typeof fetch;
    await expect(getKnowledgeChunkById("nanjing-food-001", fetcher)).resolves.toEqual(nanjingChunk);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
  });

  it("loads the full corpus only when explicitly requested", async () => {
    const fetcher = vi.fn(async () => jsonResponse([nanjingChunk])) as unknown as typeof fetch;
    await expect(getAllKnowledgeChunks(fetcher)).resolves.toEqual([nanjingChunk]);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/corpus.json");
  });

  it("builds knowledge URLs for root and subpath deployments", () => {
    expect(knowledgeUrl("corpus.json", "/")).toBe("/knowledge/corpus.json");
    expect(knowledgeUrl("/cities/nanjing.json", "/jiangsu-cultural-journey/"))
      .toBe("/jiangsu-cultural-journey/knowledge/cities/nanjing.json");
    expect(knowledgeUrl("manifest.json", "jiangsu-cultural-journey"))
      .toBe("/jiangsu-cultural-journey/knowledge/manifest.json");
  });

  it("retries a city request after a failed response instead of caching the rejection", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(errorResponse())
      .mockResolvedValueOnce(jsonResponse([nanjingChunk])) as unknown as typeof fetch;

    await expect(getCityKnowledgeChunks("nanjing", fetcher)).rejects.toThrow(
      /KNOWLEDGE_FETCH_FAILED/u,
    );
    await expect(getCityKnowledgeChunks("nanjing", fetcher)).resolves.toEqual([nanjingChunk]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("retries full corpus and manifest requests after failed responses", async () => {
    const corpusFetcher = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(503))
      .mockResolvedValueOnce(jsonResponse([nanjingChunk])) as unknown as typeof fetch;
    await expect(getAllKnowledgeChunks(corpusFetcher)).rejects.toThrow(/503/u);
    await expect(getAllKnowledgeChunks(corpusFetcher)).resolves.toEqual([nanjingChunk]);
    expect(corpusFetcher).toHaveBeenCalledTimes(2);

    const manifest = { version: "1", totalChunks: 1 };
    const manifestFetcher = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(500))
      .mockResolvedValueOnce(jsonResponse(manifest)) as unknown as typeof fetch;
    await expect(getKnowledgeManifest(manifestFetcher)).rejects.toThrow(/500/u);
    await expect(getKnowledgeManifest(manifestFetcher)).resolves.toEqual(manifest);
    expect(manifestFetcher).toHaveBeenCalledTimes(2);
  });
});
