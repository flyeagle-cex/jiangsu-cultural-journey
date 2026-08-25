import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearKnowledgeCorpusCache,
  getAllKnowledgeChunks,
  getCityKnowledgeChunks,
  getKnowledgeChunkById,
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
});
