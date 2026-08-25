import { describe, expect, it } from "vitest";

import { chunkEntries } from "./chunk-document.mjs";
import { CITY_DEFINITIONS, KNOWLEDGE_SECTIONS } from "./config.mjs";
import { inferHeading } from "./section-detection.mjs";
import { discoverSourceDocuments, recognizeCityFromFilename } from "./source-documents.mjs";
import { validateKnowledgeChunks } from "./validate-corpus.mjs";

describe("Stage 7A ingestion pipeline", () => {
  it("recognizes every city from supplied-style DOCX filenames", () => {
    expect(CITY_DEFINITIONS).toHaveLength(13);
    for (const city of CITY_DEFINITIONS) {
      expect(recognizeCityFromFilename(`江苏十三市文化资料库 · ${city.nameZh}篇.docx`)?.slug).toBe(city.slug);
    }
  });

  it("requires an explicit source directory instead of scanning the computer", () => {
    expect(() => discoverSourceDocuments()).toThrow(/SOURCE_DIRECTORY_REQUIRED/u);
  });

  it("keeps the allowed knowledge section vocabulary stable", () => {
    expect(KNOWLEDGE_SECTIONS).toHaveLength(10);
    expect(new Set(KNOWLEDGE_SECTIONS).size).toBe(KNOWLEDGE_SECTIONS.length);
  });

  it("distinguishes Heading 2 section titles from numbered subheadings", () => {
    expect(inferHeading("二、自然风光", { htmlLevel: 2 })?.isMain).toBe(true);
    expect(inferHeading("1. 地理位置", { htmlLevel: 2 })?.isMain).toBe(false);
    expect(inferHeading("1.东坡井：馆内唯一宋代原物古井，至今井水清澈可汲。", {})).toBeNull();
    expect(inferHeading("1.吴门望亭大运河入苏第一站，千年稻作文化与古驿文化交汇", {})).toBeNull();
  });

  it("creates stable unique IDs and a valid schema", () => {
    const entries = [
      {
        city: "nanjing",
        cityNameZh: "南京",
        section: "food",
        title: "南京美食",
        parentTitle: "特色美食",
        content: "南京文化资料测试内容。",
        sourceDocument: "南京篇.docx",
        sourceOrder: 1,
      },
      {
        city: "nanjing",
        cityNameZh: "南京",
        section: "food",
        title: "南京美食",
        parentTitle: "特色美食",
        content: "第二段仍然保留原始语义。",
        sourceDocument: "南京篇.docx",
        sourceOrder: 2,
      },
    ];
    const first = chunkEntries(entries);
    const second = chunkEntries(entries);
    expect(first).toEqual(second);
    expect(first[0].id).toBe("nanjing-food-001");
    expect(() => validateKnowledgeChunks(first, { requireAllCities: false })).not.toThrow();
  });

  it("rejects absolute source paths from public metadata", () => {
    const chunk = {
      id: "nanjing-overview-001",
      city: "nanjing",
      cityNameZh: "南京",
      section: "overview",
      title: "概况",
      content: "有效内容。",
      sourceDocument: "C:\\private\\南京篇.docx",
      sourceOrder: 1,
      chunkIndex: 1,
    };
    expect(() => validateKnowledgeChunks([chunk], { requireAllCities: false })).toThrow(
      /sourceDocument contains a path/u,
    );
  });
});
