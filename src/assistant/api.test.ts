import { describe, expect, it, vi } from "vitest";

import { requestShuiLingAnswer, ShuiLingApiError } from "@/assistant/api";

describe("Shuiling browser API client", () => {
  it("calls only the same-origin Shuiling endpoint", async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          answer: "回答",
          citations: [],
          insufficientEvidence: true,
          retrieval: { scope: "all", citySlugs: [], fellBackToGlobal: false, resultCount: 0 },
          promptVersion: "7c-deepseek-v1",
        }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;
    await requestShuiLingAnswer(
      { question: "问题", language: "zh" },
      { fetcher },
    );
    expect(fetcher).toHaveBeenCalledWith(
      "/api/shuiling/chat",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("maps a controlled server error without exposing raw internals", async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: { code: "DEEPSEEK_RATE_LIMITED", message: "safe" },
        }),
        { status: 429 },
      ),
    ) as unknown as typeof fetch;
    await expect(
      requestShuiLingAnswer({ question: "问题", language: "zh" }, { fetcher }),
    ).rejects.toBeInstanceOf(ShuiLingApiError);
    await expect(
      requestShuiLingAnswer({ question: "问题", language: "zh" }, { fetcher }),
    ).rejects.toMatchObject({ code: "DEEPSEEK_RATE_LIMITED" });
  });
});
