import { describe, expect, it, vi } from "vitest";

import { loadServerKnowledgeCorpus } from "./corpus";
import { generateShuiLingAnswer } from "./generate-answer";

function groundedResponse(output: { answer: string; citations: string[]; insufficientEvidence: boolean }) {
  return new Response(
    JSON.stringify({ choices: [{ message: { content: JSON.stringify(output) } }] }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

const environment = { DEEPSEEK_API_KEY: "test-secret" };

describe("Stage 7C grounded answer generation", () => {
  it("derives citation metadata from server evidence and filters fake E99", async () => {
    const fetcher = vi.fn(async () =>
      groundedResponse({
        answer: "无锡资料显示其饮食具有偏甜特征。",
        citations: ["E1", "E99"],
        insufficientEvidence: false,
      }),
    ) as unknown as typeof fetch;

    const response = await generateShuiLingAnswer(
      { question: "为什么无锡饮食偏甜？", currentCity: "nanjing", language: "zh" },
      { environment, fetcher, chunks: await loadServerKnowledgeCorpus() },
    );
    expect(response.insufficientEvidence).toBe(false);
    expect(response.citations).toHaveLength(1);
    expect(response.citations[0]).toMatchObject({ evidenceId: "E1", city: "wuxi" });
    expect(JSON.stringify(response)).not.toContain("E99");
    expect(response.citations[0].sourceDocument).toMatch(/无锡/u);
  });

  it("does not call DeepSeek when retrieval has no grounded evidence", async () => {
    const fetcher = vi.fn();
    const response = await generateShuiLingAnswer(
      { question: "江苏有哪些火星殖民基地？", language: "zh" },
      { environment, fetcher: fetcher as unknown as typeof fetch, chunks: await loadServerKnowledgeCorpus() },
    );
    expect(response.insufficientEvidence).toBe(true);
    expect(response.citations).toEqual([]);
    expect(response.retrieval.resultCount).toBe(0);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects a factual answer with only invented citations", async () => {
    const fetcher = vi.fn(async () =>
      groundedResponse({ answer: "没有有效引用。", citations: ["E99"], insufficientEvidence: false }),
    ) as unknown as typeof fetch;
    await expect(
      generateShuiLingAnswer(
        { question: "为什么无锡饮食偏甜？", language: "zh" },
        { environment, fetcher, chunks: await loadServerKnowledgeCorpus() },
      ),
    ).rejects.toMatchObject({ code: "DEEPSEEK_INVALID_RESPONSE" });
  });

  it("returns a controlled no-key error while preserving retrieval metadata", async () => {
    await expect(
      generateShuiLingAnswer(
        { question: "南京有什么代表性的鸭类美食？", language: "zh" },
        { environment: {}, chunks: await loadServerKnowledgeCorpus() },
      ),
    ).rejects.toMatchObject({
      code: "DEEPSEEK_NOT_CONFIGURED",
      retrieval: { scope: "city", resultCount: expect.any(Number) },
    });
  });

  it("sends both Nanjing and Yangzhou evidence for a comparison", async () => {
    let requestBody = "";
    const fetcher = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      requestBody = String(init?.body);
      return groundedResponse({
        answer: "两地运河文化各有资料记载。",
        citations: ["E1", "E2"],
        insufficientEvidence: false,
      });
    }) as unknown as typeof fetch;

    const response = await generateShuiLingAnswer(
      { question: "南京和扬州的大运河文化有什么不同？", language: "zh" },
      { environment, fetcher, chunks: await loadServerKnowledgeCorpus() },
    );
    expect(response.retrieval.scope).toBe("multi-city");
    expect(new Set(response.citations.map((citation) => citation.city))).toEqual(
      new Set(["nanjing", "yangzhou"]),
    );
    expect(requestBody).toContain("City: 南京");
    expect(requestBody).toContain("City: 扬州");
    const providerPayload = JSON.parse(requestBody) as {
      messages: Array<{ content: string }>;
    };
    expect(providerPayload.messages.map((message) => message.content).join("\n")).not.toMatch(
      /(?:[A-Za-z]:[\\/]|file:\/\/)/u,
    );
  });
});
