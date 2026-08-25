import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

import { clearKnowledgeCorpusCache } from "@/rag/corpus";
import { RETRIEVAL_REGRESSION_QUESTIONS } from "@/rag/fixtures/questions";
import { searchKnowledge } from "@/rag/retrieval";
import type { KnowledgeChunk } from "@/rag/types";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const knowledgeDirectory = path.join(projectRoot, "public", "knowledge");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function jsonResponse(value: unknown) {
  return { ok: true, status: 200, json: async () => value } as Response;
}

function createCorpusFetcher() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const relativePath = url.replace(/^.*\/knowledge\//u, "");
    return jsonResponse(readJson(path.join(knowledgeDirectory, relativePath)));
  }) as unknown as typeof fetch;
}

function topThree(response: Awaited<ReturnType<typeof searchKnowledge>>) {
  return response.results.slice(0, 3);
}

afterEach(() => {
  clearKnowledgeCorpusCache();
});

describe("Stage 7B hybrid local retrieval", () => {
  it.each(RETRIEVAL_REGRESSION_QUESTIONS)(
    "retrieves relevant $city culture for: $question",
    async ({ city, question }) => {
      const response = await searchKnowledge(question, { fetcher: createCorpusFetcher(), topK: 5 });
      const candidates = topThree(response);
      expect(candidates.some((result) => result.chunk.city === city)).toBe(true);

      if (city === "nanjing") {
        expect(
          candidates.some(
            (result) =>
              result.chunk.section === "food" && /盐水鸭|鸭血粉丝汤/u.test(result.chunk.content),
          ),
        ).toBe(true);
      }
      if (city === "wuxi") {
        expect(candidates.some((result) => result.chunk.section === "food")).toBe(true);
      }
      if (city === "huaian") {
        expect(
          candidates.some(
            (result) =>
              result.chunk.section === "waterways" || /大运河|运河之都/u.test(result.chunk.content),
          ),
        ).toBe(true);
      }
      if (city === "xuzhou") {
        expect(candidates.some((result) => result.chunk.section === "waterways")).toBe(true);
      }
      if (city === "suqian") {
        expect(candidates.some((result) => /项羽|项王/u.test(result.chunk.content))).toBe(true);
      }
      if (city === "yangzhou") {
        expect(candidates.some((result) => result.chunk.section === "heritage")).toBe(true);
      }
      if (city === "yancheng") {
        expect(candidates.some((result) => /湿地|滩涂|丹顶鹤/u.test(result.chunk.content))).toBe(true);
      }
      if (city === "suzhou") {
        expect(candidates.some((result) => /园林/u.test(result.chunk.title + result.chunk.content))).toBe(
          true,
        );
      }
    },
  );

  it("uses only the current city corpus for a strong local question", async () => {
    const fetcher = createCorpusFetcher();
    const response = await searchKnowledge("有什么代表性鸭类美食？", {
      currentCity: "nanjing",
      fetcher,
    });

    expect(response.fellBackToGlobal).toBe(false);
    expect(response.results.every((result) => result.chunk.city === "nanjing")).toBe(true);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
    expect(fetcher).not.toHaveBeenCalledWith("/knowledge/corpus.json");
  });

  it("lets an explicit city override the current route city", async () => {
    const fetcher = createCorpusFetcher();
    const response = await searchKnowledge("无锡有什么代表性美食？", {
      currentCity: "nanjing",
      fetcher,
    });

    expect(response.scope.citySlugs).toEqual(["wuxi"]);
    expect(response.results.every((result) => result.chunk.city === "wuxi")).toBe(true);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/wuxi.json");
    expect(fetcher).not.toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
  });

  it("loads and represents both cities for a multi-city query", async () => {
    const fetcher = createCorpusFetcher();
    const response = await searchKnowledge("南京和扬州有什么代表性美食？", {
      fetcher,
      topK: 5,
    });
    const resultCities = new Set(response.results.map((result) => result.chunk.city));

    expect(response.scope.kind).toBe("multi-city");
    expect(resultCities).toEqual(new Set(["nanjing", "yangzhou"]));
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/yangzhou.json");
    expect(fetcher).not.toHaveBeenCalledWith("/knowledge/corpus.json");
  });

  it("uses the global corpus for Jiangsu-wide intent", async () => {
    const fetcher = createCorpusFetcher();
    const response = await searchKnowledge("江苏哪些城市和大运河关系密切？", {
      fetcher,
      topK: 5,
    });

    expect(response.scope.kind).toBe("all");
    expect(new Set(response.results.map((result) => result.chunk.city)).size).toBeGreaterThan(1);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/corpus.json");
  });

  it("falls back from a weak current-city search to the global corpus", async () => {
    const fetcher = createCorpusFetcher();
    const response = await searchKnowledge("项羽和项王故里有什么关系？", {
      currentCity: "nanjing",
      fetcher,
    });

    expect(response.fellBackToGlobal).toBe(true);
    expect(response.results.some((result) => result.chunk.city === "suqian")).toBe(true);
    expect(fetcher).toHaveBeenCalledWith("/knowledge/cities/nanjing.json");
    expect(fetcher).toHaveBeenCalledWith("/knowledge/corpus.json");
  });

  it("penalizes reference chunks for ordinary cultural questions", async () => {
    const response = await searchKnowledge("南京盐水鸭", { fetcher: createCorpusFetcher() });
    expect(response.results[0]?.chunk.section).not.toBe("reference");
    expect(response.results[0]?.reasons.length).toBeGreaterThan(0);
    expect(response.results[0]?.matchedTerms.length).toBeGreaterThan(0);
  });

  it("rejects an unrelated query instead of returning arbitrary culture", async () => {
    const response = await searchKnowledge("火星殖民基地", { fetcher: createCorpusFetcher() });
    expect(response.results).toEqual([]);
  });

  it("supports the documented small English vocabulary", async () => {
    const response = await searchKnowledge("What food should I try in Wuxi?", {
      fetcher: createCorpusFetcher(),
    });
    expect(response.scope.citySlugs).toEqual(["wuxi"]);
    expect(topThree(response).some((result) => result.chunk.section === "food")).toBe(true);
  });

  it("keeps food-domain single characters in a Wuxi query", async () => {
    const response = await searchKnowledge("无锡菜为什么甜？", {
      fetcher: createCorpusFetcher(),
      topK: 5,
    });

    expect(response.scope.citySlugs).toEqual(["wuxi"]);
    expect(response.results.length).toBeGreaterThan(0);
    expect(topThree(response).some((result) => result.chunk.section === "food")).toBe(true);
  });

  it("retrieves Nanjing food for a concise eating query", async () => {
    const response = await searchKnowledge("南京吃什么？", {
      fetcher: createCorpusFetcher(),
      topK: 5,
    });

    expect(response.scope.citySlugs).toEqual(["nanjing"]);
    expect(topThree(response).some((result) => result.chunk.section === "food")).toBe(true);
  });

  it.each(["南京", "介绍一下南京", "给我介绍一下南京", "南京怎么样"])(
    "maps a generic Nanjing query to city overview: %s",
    async (query) => {
      const response = await searchKnowledge(query, {
        fetcher: createCorpusFetcher(),
        topK: 5,
      });

      expect(response.scope.citySlugs).toEqual(["nanjing"]);
      expect(response.results.length).toBeGreaterThan(0);
      expect(topThree(response).every((result) => result.chunk.city === "nanjing")).toBe(true);
      expect(topThree(response).some((result) => result.chunk.section === "overview")).toBe(true);
    },
  );

  it.each(["介绍一下这里", "这里怎么样？"])(
    "uses the current route city for a generic here query: %s",
    async (query) => {
      const response = await searchKnowledge(query, {
        currentCity: "nanjing",
        fetcher: createCorpusFetcher(),
        topK: 5,
      });

      expect(response.scope.citySlugs).toEqual(["nanjing"]);
      expect(response.fellBackToGlobal).toBe(false);
      expect(response.results.length).toBeGreaterThan(0);
      expect(topThree(response).every((result) => result.chunk.city === "nanjing")).toBe(true);
      expect(topThree(response).some((result) => result.chunk.section === "overview")).toBe(true);
    },
  );

  it("does not guess a city for a generic here query without route context", async () => {
    const response = await searchKnowledge("这里怎么样？", {
      fetcher: createCorpusFetcher(),
      topK: 5,
    });

    expect(response.scope.kind).toBe("all");
    expect(response.results).toEqual([]);
  });

  it("represents both cities for a generic multi-city introduction", async () => {
    const response = await searchKnowledge("介绍一下南京和扬州", {
      fetcher: createCorpusFetcher(),
      topK: 5,
    });
    const resultCities = new Set(response.results.map((result) => result.chunk.city));

    expect(response.scope.kind).toBe("multi-city");
    expect(resultCities).toEqual(new Set(["nanjing", "yangzhou"]));
    expect(topThree(response).some((result) => result.chunk.section === "overview")).toBe(true);
  });
});
