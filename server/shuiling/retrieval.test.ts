import { describe, expect, it } from "vitest";

import { loadServerKnowledgeCorpus } from "./corpus";
import { retrieveServerKnowledge } from "./retrieval";

describe("Stage 7C server retrieval reuse", () => {
  it("lets explicit Wuxi override the Nanjing route context", async () => {
    const retrieval = retrieveServerKnowledge(
      "无锡为什么饮食偏甜？",
      await loadServerKnowledgeCorpus(),
      "nanjing",
    );

    expect(retrieval.scope.citySlugs).toEqual(["wuxi"]);
    expect(retrieval.results.length).toBeGreaterThan(0);
    expect(retrieval.results.every((result) => result.chunk.city === "wuxi")).toBe(true);
  });

  it("keeps both cities in a canal comparison", async () => {
    const retrieval = retrieveServerKnowledge(
      "南京和扬州的大运河文化有什么不同？",
      await loadServerKnowledgeCorpus(),
    );

    expect(retrieval.scope.kind).toBe("multi-city");
    expect(new Set(retrieval.results.map((result) => result.chunk.city))).toEqual(
      new Set(["nanjing", "yangzhou"]),
    );
  });

  it("rejects unsupported Mars-colony evidence", async () => {
    const retrieval = retrieveServerKnowledge(
      "江苏有哪些火星殖民基地？",
      await loadServerKnowledgeCorpus(),
    );

    expect(
      retrieval.results.map((result) => ({
        id: result.chunk.id,
        score: result.score,
        matchedTerms: result.matchedTerms,
      })),
    ).toEqual([]);
  });
});
