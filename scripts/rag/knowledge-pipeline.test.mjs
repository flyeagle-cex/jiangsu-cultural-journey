import { describe, expect, it } from "vitest";

import { chunkEntries } from "./chunk-document.mjs";
import { CITY_DEFINITIONS, KNOWLEDGE_SECTIONS } from "./config.mjs";
import {
  extractParagraphsFromHtml,
  paragraphsToEntries,
  splitInlineReference,
} from "./parse-docx.mjs";
import { inferHeading, isStandaloneSpecialHeading } from "./section-detection.mjs";
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
    expect(isStandaloneSpecialHeading("文化故事")).toBe(true);
    expect(isStandaloneSpecialHeading("5.3 美食故事")).toBe(false);
  });

  it("keeps bold table labels as content instead of global section headings", () => {
    const extracted = extractParagraphsFromHtml(`
      <h2>六、特色美食</h2>
      <table><tr><th><p><strong>文化故事/场景</strong></p></th></tr>
      <tr><td><p>软兜长鱼</p></td></tr></table>
      <h3>3. 美食文化的当代传播</h3>
      <p>美食文化进入现代城市品牌体系。</p>
    `);
    const entries = paragraphsToEntries(extracted.paragraphs, {
      slug: "huaian",
      nameZh: "淮安",
      fileName: "淮安篇.docx",
    });

    expect(extracted.tableDerivedParagraphs).toBe(2);
    expect(extracted.tableHeadingCandidatesIgnored).toBe(1);
    expect(entries.map((entry) => entry.section)).toEqual(["food", "food", "food"]);
    expect(entries.at(-1)?.title).toBe("3. 美食文化的当代传播");
  });

  it("keeps real Word heading elements inside tables as headings", () => {
    const extracted = extractParagraphsFromHtml(
      "<table><tr><td><h2>六、特色美食</h2><p>淮扬菜内容。</p></td></tr></table>",
    );
    expect(extracted.paragraphs[0]).toMatchObject({ kind: "heading", isMain: true });
  });

  it("splits inline references without changing the preceding source text", () => {
    expect(splitInlineReference("板鸭进宫：文化正文。资料来源：南京市人民政府官网。"))
      .toEqual([
        { kind: "content", text: "板鸭进宫：文化正文。" },
        { kind: "reference", text: "资料来源：南京市人民政府官网。", title: "资料来源" },
      ]);
    expect(splitInlineReference("参考文献 南京地方志。"))
      .toEqual([{ kind: "reference", text: "参考文献 南京地方志。", title: "参考文献" }]);
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

  it("uses targetCharacters as a soft split target while respecting the hard maximum", () => {
    const sentence = "运河文化与城市生活在历史进程中持续交织并形成独特的地方记忆。";
    const entries = [
      {
        city: "nanjing",
        cityNameZh: "南京",
        section: "waterways",
        title: "运河文化",
        parentTitle: "大运河",
        content: sentence.repeat(30),
        sourceDocument: "南京篇.docx",
        sourceOrder: 1,
      },
    ];
    const chunks = chunkEntries(entries, {
      targetCharacters: 300,
      maxCharacters: 500,
      overlapCharacters: 30,
    });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.content.length <= 500)).toBe(true);
    expect(chunks.some((chunk) => chunk.content.length < 450)).toBe(true);
  });

  it("does not merge complete cultural items with different titles", () => {
    const base = {
      city: "nanjing",
      cityNameZh: "南京",
      section: "food",
      parentTitle: "五、特色美食",
      sourceDocument: "南京篇.docx",
    };
    const chunks = chunkEntries([
      { ...base, title: "盐水鸭", content: "盐水鸭文化条目。".repeat(20), sourceOrder: 1 },
      { ...base, title: "鸭血粉丝汤", content: "鸭血粉丝汤文化条目。".repeat(18), sourceOrder: 2 },
    ]);

    expect(chunks).toHaveLength(2);
    expect(chunks.map((chunk) => chunk.title)).toEqual(["盐水鸭", "鸭血粉丝汤"]);
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
