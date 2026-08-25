import { describe, expect, it } from "vitest";

import { creativeManifest } from "@/data/creative-manifest";
import {
  MAX_CREATIVE_RECOMMENDATIONS,
  getCreativeRecommendationReasonLabel,
  getCreativeQueryThemes,
  hasExplicitCreativeIntent,
  isCreativeManifestLookup,
  recommendCreativeProjects,
} from "@/lib/creative-recommendation";
import type { KnowledgeSection, RetrievalResult } from "@/rag/types";
import type { CitySlug } from "@/types/city";
import type { CreativeProject } from "@/types/creative";

function createRetrievalResult({
  city = "nanjing",
  content,
  score = 7,
  section,
  title,
}: {
  city?: CitySlug;
  content: string;
  score?: number;
  section: KnowledgeSection;
  title: string;
}): RetrievalResult {
  return {
    chunk: {
      id: `${city}-${section}-${title}`,
      city,
      cityNameZh: city,
      section,
      title,
      content,
      sourceDocument: `${city}.docx`,
      sourceOrder: 1,
      chunkIndex: 0,
    },
    score,
    matchedTerms: [],
    reasons: ["content", "section"],
  };
}

const waterwaysResult = createRetrievalResult({
  section: "waterways",
  title: "江苏大运河与水系",
  content: "大运河连接江苏多座城市，并形成持续发展的水文化。",
});

const currentProject = creativeManifest[0];

const genericCreativeQueries = [
  "有什么文创？",
  "你们有什么文创！",
  "有哪些文创？",
  "你们有哪些文创？",
  "想找一件伴手礼",
  "想看看伴手礼",
  "有什么伴手礼？",
  "有哪些伴手礼？",
  "有什么纪念品？",
  "有哪些纪念品？",
  "想看看纪念品",
  "有什么周边？",
  "有哪些周边？",
  "想看看周边",
  "有什么礼物？",
  "有哪些礼物？",
  "想找一件礼物",
  "有什么礼品？",
  "有哪些礼品？",
  "What creative products are available?",
  "Do you have any creative products?",
  "Do you have any souvenirs?",
  "What souvenirs are available?",
  "I'd like a souvenir",
  "I want a souvenir",
  "Do you have any gifts?",
  "What gifts are available?",
  "I'd like a gift",
  "Do you have any merchandise?",
  "What merchandise is available?",
] as const;

describe("deterministic creative recommendations", () => {
  it.each([
    "你们有什么文创",
    "想找一件伴手礼",
    "What creative products are available?",
    "Do you have any souvenirs?",
  ])("recognizes explicit creative intent: %s", (question) => {
    expect(hasExplicitCreativeIntent(question)).toBe(true);
  });

  it.each(genericCreativeQueries)("recognizes a generic manifest lookup: %s", (question) => {
    expect(isCreativeManifestLookup(question)).toBe(true);
  });

  it.each(genericCreativeQueries)(
    "recommends published work for a generic manifest lookup: %s",
    (question) => {
      expect(
        recommendCreativeProjects({ question, retrievalResults: [] }).map(
          (recommendation) => recommendation.project.slug,
        ),
      ).toEqual(["water-spirit-global-voyage"]);
    },
  );

  it.each([
    "江苏非遗有什么文创？",
    "江苏美食有什么文创？",
    "江苏历史有什么文创？",
    "江苏大运河有什么文创？",
    "苏州有什么文创？",
    "火星有什么文创？",
    "Python 有什么文创？",
    "苏州有什么伴手礼？",
    "火星有什么伴手礼？",
    "火星有什么纪念品？",
    "Python 有什么周边？",
    "机器学习有什么礼物？",
    "江苏非遗有什么纪念品？",
    "江苏美食有什么伴手礼？",
    "江苏历史有什么周边？",
  ])("does not treat a constrained creative query as a manifest lookup: %s", (question) => {
    expect(isCreativeManifestLookup(question)).toBe(false);
  });

  it("detects the cultural theme in a constrained creative query", () => {
    expect(getCreativeQueryThemes("江苏大运河有什么文创？")).toEqual(["water_culture"]);
  });

  it("recommends the current project for a Jiangsu water-culture question with evidence", () => {
    const [recommendation] = recommendCreativeProjects({
      question: "江苏水文化有什么特点？",
      retrievalResults: [waterwaysResult],
    });

    expect(recommendation.project.slug).toBe("water-spirit-global-voyage");
    expect(recommendation.matchedThemes).toContain("water_culture");
    expect(recommendation.reasons).toEqual(expect.arrayContaining(["theme", "section"]));
  });

  it("recommends the current project for a Grand Canal question with evidence", () => {
    expect(
      recommendCreativeProjects({
        question: "介绍一下江苏大运河",
        retrievalResults: [waterwaysResult],
      }).map((recommendation) => recommendation.project.slug),
    ).toEqual(["water-spirit-global-voyage"]);
  });

  it("lists published work for an explicit creative request without RAG evidence", () => {
    const [recommendation] = recommendCreativeProjects({
      question: "你们有什么文创？",
      retrievalResults: [],
    });

    expect(recommendation.project.slug).toBe("water-spirit-global-voyage");
    expect(recommendation.reasons).toEqual(["explicit-creative-intent"]);
    expect(getCreativeRecommendationReasonLabel(recommendation, "zh")).toBe("已收录文创作品");
  });

  it("recommends the current project for a constrained water-culture creative query", () => {
    expect(
      recommendCreativeProjects({
        question: "江苏水文化有什么文创？",
        retrievalResults: [waterwaysResult],
      }).map((recommendation) => recommendation.project.slug),
    ).toEqual(["water-spirit-global-voyage"]);
  });

  it.each([
    {
      question: "江苏非遗有什么文创？",
      result: createRetrievalResult({
        section: "heritage",
        title: "江苏非遗技艺",
        content: "江苏非遗包含传统技艺、民俗与表演艺术。",
      }),
    },
    {
      question: "江苏美食有什么文创？",
      result: createRetrievalResult({
        section: "food",
        title: "江苏特色美食",
        content: "江苏各地形成了丰富多样的饮食文化。",
      }),
    },
    {
      question: "江苏历史有什么文创？",
      result: createRetrievalResult({
        section: "history",
        title: "江苏历史文化",
        content: "江苏历史文化源远流长，留下众多历史遗存。",
      }),
    },
  ])("does not recommend a project without a matching project signal: $question", ({ question, result }) => {
    expect(recommendCreativeProjects({ question, retrievalResults: [result] })).toEqual([]);
  });

  it("does not let incidental water wording override a heritage constraint", () => {
    const heritageResult = createRetrievalResult({
      section: "heritage",
      title: "江苏非遗与水乡生活",
      content: "这项非遗产生于水乡生活，也反映了当地水文化。",
    });

    expect(
      recommendCreativeProjects({
        question: "江苏非遗有什么文创？",
        retrievalResults: [heritageResult],
      }),
    ).toEqual([]);
  });

  it.each(["火星有什么文创？", "Python 有什么文创？"])(
    "does not recommend anything for an out-of-domain creative query: %s",
    (question) => {
      expect(recommendCreativeProjects({ question, retrievalResults: [] })).toEqual([]);
    },
  );

  it.each([
    "苏州有什么伴手礼？",
    "火星有什么伴手礼？",
    "火星有什么纪念品？",
    "Python 有什么周边？",
    "机器学习有什么礼物？",
  ])("does not recommend the current project for a constrained generic-product query: %s", (question) => {
    expect(recommendCreativeProjects({ question, retrievalResults: [] })).toEqual([]);
  });

  it.each([
    {
      question: "江苏非遗有什么纪念品？",
      result: createRetrievalResult({
        section: "heritage",
        title: "江苏非遗技艺",
        content: "江苏非遗包含传统技艺、民俗与表演艺术。",
      }),
    },
    {
      question: "江苏美食有什么伴手礼？",
      result: createRetrievalResult({
        section: "food",
        title: "江苏特色美食",
        content: "江苏各地形成了丰富多样的饮食文化。",
      }),
    },
    {
      question: "江苏历史有什么周边？",
      result: createRetrievalResult({
        section: "history",
        title: "江苏历史文化",
        content: "江苏历史文化源远流长，留下众多历史遗存。",
      }),
    },
  ])("does not recommend the water project for a constrained product query: $question", ({ question, result }) => {
    expect(recommendCreativeProjects({ question, retrievalResults: [result] })).toEqual([]);
  });

  it.each([
    {
      question: "南京有什么历史？",
      result: createRetrievalResult({
        city: "nanjing",
        section: "history",
        title: "南京历史",
        content: "南京是六朝古都，拥有深厚的历史文化。",
      }),
    },
    {
      question: "苏州美食有哪些？",
      result: createRetrievalResult({
        city: "suzhou",
        section: "food",
        title: "苏州美食",
        content: "苏州饮食讲究时令与精细。",
      }),
    },
  ])("does not recommend the Jiangsu-wide project for unrelated city content: $question", ({ question, result }) => {
    expect(recommendCreativeProjects({ question, retrievalResults: [result] })).toEqual([]);
  });

  it.each(["火星有什么文化？", "Python 怎么写循环？", "今天天气怎么样？"])(
    "does not recommend anything for an unsupported query without evidence: %s",
    (question) => {
      expect(recommendCreativeProjects({ question, retrievalResults: [] })).toEqual([]);
    },
  );

  it("does not treat 水平 as a water-culture signal", () => {
    const historyResult = createRetrievalResult({
      section: "history",
      title: "江苏历史研究",
      content: "相关研究梳理了江苏城市的历史发展。",
    });

    expect(
      recommendCreativeProjects({
        question: "江苏历史研究水平很高吗？",
        retrievalResults: [historyResult],
      }),
    ).toEqual([]);
  });

  it("requires retrieval evidence for a non-creative water-themed out-of-domain query", () => {
    expect(
      recommendCreativeProjects({
        question: "火星有哪些运河文化？",
        retrievalResults: [],
      }),
    ).toEqual([]);
  });

  it("never recommends a draft project", () => {
    const draftProject = { ...currentProject, status: "draft" as const };

    expect(
      recommendCreativeProjects({
        question: "有什么文创？",
        retrievalResults: [],
        projects: [draftProject],
      }),
    ).toEqual([]);
  });

  it("matches an explicitly linked future city project without expanding Jiangsu-wide work", () => {
    const suzhouProject = {
      ...currentProject,
      slug: "future-suzhou-work" as unknown as CreativeProject["slug"],
      scope: "city" as const,
      citySlugs: ["suzhou" as const],
      sortOrder: 2,
    };
    const recommendations = recommendCreativeProjects({
      question: "苏州有什么伴手礼？",
      retrievalResults: [],
      projects: [currentProject, suzhouProject],
    });

    expect(recommendations.map((recommendation) => recommendation.project.slug)).toEqual([
      "future-suzhou-work",
    ]);
    expect(recommendations[0].reasons).toEqual(
      expect.arrayContaining(["explicit-creative-intent", "city"]),
    );
  });

  it("deduplicates a project that matches explicit, theme, and section signals", () => {
    const recommendations = recommendCreativeProjects({
      question: "江苏大运河有什么文创？",
      retrievalResults: [waterwaysResult],
      projects: [currentProject, currentProject],
    });

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].reasons).toEqual([
      "explicit-creative-intent",
      "theme",
      "section",
    ]);
    expect(recommendations[0].score).toBeGreaterThan(6);
  });

  it("supports the documented English water-culture vocabulary", () => {
    const [recommendation] = recommendCreativeProjects({
      question: "Tell me about the Grand Canal in Jiangsu",
      retrievalResults: [waterwaysResult],
    });

    expect(recommendation.matchedThemes).toContain("water_culture");
    expect(getCreativeRecommendationReasonLabel(recommendation, "en")).toBe(
      "Related to the water-culture theme in your question",
    );
  });

  it("does not recommend the current project for English Nanjing history", () => {
    const result = createRetrievalResult({
      city: "nanjing",
      section: "history",
      title: "Nanjing history",
      content: "Nanjing served as a capital in several historical periods.",
    });

    expect(
      recommendCreativeProjects({
        question: "Tell me about Nanjing history",
        retrievalResults: [result],
      }),
    ).toEqual([]);
  });

  it("uses waterways content plus its section as evidence when the question omits the keyword", () => {
    const recommendations = recommendCreativeProjects({
      question: "这种文化如何影响江苏城市生活？",
      retrievalResults: [waterwaysResult],
    });

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].reasons).toEqual(expect.arrayContaining(["theme", "section"]));
  });

  it("does not let a waterways section qualify without supporting water-culture text", () => {
    const weakSectionResult = createRetrievalResult({
      section: "waterways",
      title: "城市交流网络",
      content: "这段资料讨论城市之间的一般联系。",
    });

    expect(
      recommendCreativeProjects({
        question: "这种联系有什么特点？",
        retrievalResults: [weakSectionResult],
      }),
    ).toEqual([]);
  });

  it("matches the international-exchange theme deterministically", () => {
    const result = createRetrievalResult({
      section: "other",
      title: "江苏国际交流",
      content: "江苏通过国际交流与跨文化活动连接不同地区。",
    });
    const [recommendation] = recommendCreativeProjects({
      question: "江苏国际交流有哪些特点？",
      retrievalResults: [result],
    });

    expect(recommendation.matchedThemes).toContain("international_exchange");
    expect(getCreativeRecommendationReasonLabel(recommendation, "zh")).toBe(
      "与问题中的国际交流主题相关",
    );
  });

  it("uses stable score, sortOrder, and slug ordering with a result cap", () => {
    const projects = Array.from({ length: 5 }, (_, index) => ({
      ...currentProject,
      slug: `future-${index}` as unknown as CreativeProject["slug"],
      sortOrder: index % 2,
    }));
    const recommendations = recommendCreativeProjects({
      question: "有什么文创？",
      retrievalResults: [],
      projects,
    });

    expect(recommendations).toHaveLength(MAX_CREATIVE_RECOMMENDATIONS);
    expect(recommendations.map((recommendation) => recommendation.project.slug)).toEqual([
      "future-0",
      "future-2",
      "future-4",
    ]);
  });
});
