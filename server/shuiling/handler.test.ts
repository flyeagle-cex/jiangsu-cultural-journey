import { describe, expect, it, vi } from "vitest";

import { loadServerKnowledgeCorpus } from "./corpus";
import { handleShuiLingChat } from "./handler";

function request(body: unknown) {
  return new Request("http://localhost/api/shuiling/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/shuiling/chat", () => {
  it.each([
    {},
    { question: "", language: "zh" },
    { question: "test", language: "fr" },
    { question: "test", language: "zh", currentCity: "invalid" },
    { question: "x".repeat(501), language: "zh" },
  ])("rejects invalid input", async (body) => {
    const response = await handleShuiLingChat(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: "INVALID_REQUEST" } });
  });

  it("returns insufficient evidence before checking API configuration", async () => {
    const fetcher = vi.fn();
    const response = await handleShuiLingChat(
      request({ question: "江苏有哪些火星殖民基地？", language: "zh" }),
      {
        environment: {},
        fetcher: fetcher as unknown as typeof fetch,
        chunks: await loadServerKnowledgeCorpus(),
      },
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      citations: [],
      insufficientEvidence: true,
      retrieval: { resultCount: 0 },
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns the standard English insufficient-evidence answer", async () => {
    const response = await handleShuiLingChat(
      request({ question: "江苏有哪些火星殖民基地？", language: "en" }),
      { environment: {}, chunks: await loadServerKnowledgeCorpus() },
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      answer: "The current Jiangsu cultural corpus does not provide enough evidence to answer this question.",
      insufficientEvidence: true,
    });
  });

  it("returns a safe no-key error without provider internals", async () => {
    const response = await handleShuiLingChat(
      request({ question: "南京有什么代表性的鸭类美食？", language: "zh" }),
      { environment: {}, chunks: await loadServerKnowledgeCorpus() },
    );
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toMatchObject({ error: { code: "DEEPSEEK_NOT_CONFIGURED" } });
    expect(JSON.stringify(body)).not.toMatch(/authorization|bearer|choices|usage|reasoning/iu);
  });
});
