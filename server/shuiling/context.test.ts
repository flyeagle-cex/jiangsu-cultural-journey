import { describe, expect, it } from "vitest";

import type { RetrievalResult } from "../../src/rag/types";
import { buildRagContext, validateCitationIds } from "./context";

function result(id: string, content: string): RetrievalResult {
  return {
    chunk: {
      id,
      city: "wuxi",
      cityNameZh: "无锡",
      section: "food",
      title: "无锡饮食",
      content,
      sourceDocument: "江苏十三市文化资料库 · 无锡篇.docx",
      sourceOrder: 1,
      chunkIndex: 0,
    },
    score: 12,
    matchedTerms: ["饮食"],
    reasons: ["content"],
  };
}

describe("Stage 7C evidence context", () => {
  it("builds bounded E# context with server-owned metadata", () => {
    const context = buildRagContext(
      [result("wuxi-food-001", "无锡饮食口味具有鲜明的地方特色。".repeat(100))],
      420,
    );

    expect(context.text.length).toBeLessThanOrEqual(420);
    expect(context.text).toContain("[E1]");
    expect(context.text).toContain("Chunk ID: wuxi-food-001");
    expect(context.text).toContain("City: 无锡");
    expect(context.text).toContain("Section: food");
    expect(context.text).toContain("Source: 江苏十三市文化资料库 · 无锡篇.docx");
    expect(context.text).not.toMatch(/(?:[A-Za-z]:\\|file:\/\/)/u);
  });

  it("filters invented citations and removes duplicates", () => {
    const context = buildRagContext([
      result("wuxi-food-001", "资料一"),
      result("wuxi-food-002", "资料二"),
    ]);
    expect(validateCitationIds(["E1", "E99", "E1", "E2"], context.evidence)).toEqual([
      "E1",
      "E2",
    ]);
  });
});
