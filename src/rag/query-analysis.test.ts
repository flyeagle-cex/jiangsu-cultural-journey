import { describe, expect, it } from "vitest";

import {
  detectQueryCities,
  isGlobalQueryIntent,
  resolveRetrievalScope,
} from "@/rag/city-detection";
import {
  normalizeQuery,
  tokenizeChineseText,
  translateEnglishCultureTerms,
  uniqueQueryTokens,
} from "@/rag/normalize-query";

describe("Stage 7B query analysis", () => {
  it("normalizes punctuation, case, unicode, and whitespace deterministically", () => {
    expect(normalizeQuery("  无锡菜，为什么这么甜？  ")).toBe("无锡菜 为什么这么甜");
    expect(normalizeQuery("ＮＡＮＪＩＮＧ  Food!")).toBe("nanjing food");
  });

  it("builds Chinese bigrams, trigrams, and limited domain single-character tokens", () => {
    const tokens = tokenizeChineseText("无锡美食", { query: true });
    expect(tokens).toEqual(expect.arrayContaining(["无锡", "锡美", "美食", "无锡美", "锡美食"]));
    expect(uniqueQueryTokens("鸭和醋")).toEqual(expect.arrayContaining(["鸭", "醋"]));
  });

  it("maps a small supported English vocabulary without promising broad translation", () => {
    expect(translateEnglishCultureTerms("Nanjing food and Grand Canal"))
      .toContain("nanjing 美食 and 大运河");
  });

  it("detects official Chinese and English city names only", () => {
    expect(detectQueryCities("南京和扬州的大运河文化有什么区别？")).toEqual([
      "nanjing",
      "yangzhou",
    ]);
    expect(detectQueryCities("What food should I try in Wuxi?")).toEqual(["wuxi"]);
    expect(detectQueryCities("姑苏有什么园林？")).toEqual([]);
  });

  it("resolves explicit city, current city, multi-city, and global scopes", () => {
    expect(resolveRetrievalScope("这里有什么美食？", { currentCity: "wuxi" })).toMatchObject({
      kind: "city",
      citySlugs: ["wuxi"],
      usesCurrentCity: true,
    });
    expect(resolveRetrievalScope("无锡有什么美食？", { currentCity: "nanjing" })).toMatchObject({
      citySlugs: ["wuxi"],
      usesCurrentCity: false,
    });
    expect(resolveRetrievalScope("南京和扬州有什么美食？")).toMatchObject({
      kind: "multi-city",
      citySlugs: ["nanjing", "yangzhou"],
    });
    expect(isGlobalQueryIntent("江苏哪些城市和大运河关系密切？")).toBe(true);
    expect(resolveRetrievalScope("江苏哪些城市和大运河关系密切？").kind).toBe("all");
  });
});
