import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { cityManifest } from "@/data/city-manifest";
import {
  KNOWLEDGE_CITY_SLUGS,
  KNOWLEDGE_SECTIONS,
  type KnowledgeChunk,
  type KnowledgeManifest,
} from "@/rag/types";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const knowledgeDirectory = path.join(projectRoot, "public", "knowledge");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

describe("generated Jiangsu knowledge corpus", () => {
  const corpus = readJson<KnowledgeChunk[]>(path.join(knowledgeDirectory, "corpus.json"));
  const manifest = readJson<KnowledgeManifest>(path.join(knowledgeDirectory, "manifest.json"));

  it("contains unique valid chunks for all 13 cities", () => {
    expect(corpus.length).toBeGreaterThan(0);
    expect(new Set(corpus.map((chunk) => chunk.id)).size).toBe(corpus.length);
    expect(new Set(corpus.map((chunk) => chunk.city))).toEqual(new Set(KNOWLEDGE_CITY_SLUGS));

    for (const chunk of corpus) {
      expect(KNOWLEDGE_CITY_SLUGS).toContain(chunk.city);
      expect(KNOWLEDGE_SECTIONS).toContain(chunk.section);
      expect(chunk.title.trim()).not.toBe("");
      expect(chunk.content.trim()).not.toBe("");
      expect(chunk.sourceDocument.trim()).not.toBe("");
      expect(path.isAbsolute(chunk.sourceDocument)).toBe(false);
      expect(chunk.sourceDocument).not.toMatch(/[\\/]/u);
    }
  });

  it("keeps manifest and per-city files aligned with the total corpus", () => {
    expect(manifest.totalChunks).toBe(corpus.length);

    const perCityTotal = cityManifest.reduce((total, city) => {
      const cityChunks = readJson<KnowledgeChunk[]>(
        path.join(knowledgeDirectory, "cities", `${city.slug}.json`),
      );
      expect(cityChunks.length).toBeGreaterThan(0);
      expect(cityChunks.every((chunk) => chunk.city === city.slug)).toBe(true);
      expect(manifest.cities[city.slug].chunks).toBe(cityChunks.length);
      return total + cityChunks.length;
    }, 0);

    expect(perCityTotal).toBe(corpus.length);
  });

  it("separates Nanjing and Zhenjiang source notes into reference chunks", () => {
    const nanjing = corpus.filter((chunk) => chunk.city === "nanjing");
    const zhenjiang = corpus.filter((chunk) => chunk.city === "zhenjiang");

    expect(
      nanjing.some(
        (chunk) => chunk.section === "reference" && chunk.content.includes("南京市人民政府"),
      ),
    ).toBe(true);
    expect(
      zhenjiang.some(
        (chunk) => chunk.section === "reference" && chunk.content.includes("镇江文旅"),
      ),
    ).toBe(true);
    expect(
      [...nanjing, ...zhenjiang].some(
        (chunk) => chunk.section !== "reference" && /资料来源|参考资料|参考文献/u.test(chunk.content),
      ),
    ).toBe(false);
  });

  it("keeps Huaian table labels and subsequent food content in the food section", () => {
    const huaian = corpus.filter((chunk) => chunk.city === "huaian");
    const tableChunk = huaian.find((chunk) => chunk.content.includes("文化故事/场景"));
    const contemporaryFoodChunk = huaian.find((chunk) => chunk.content.includes("2002年淮安获"));

    expect(tableChunk?.section).toBe("food");
    expect(contemporaryFoodChunk?.section).toBe("food");
  });

  it("retains Xuzhou's Grand Canal node content as waterways", () => {
    expect(
      corpus.some(
        (chunk) =>
          chunk.city === "xuzhou" &&
          chunk.section === "waterways" &&
          chunk.title.includes("大运河节点作用"),
      ),
    ).toBe(true);
  });
});
