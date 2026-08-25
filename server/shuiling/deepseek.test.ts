import { describe, expect, it, vi } from "vitest";

import { getDeepSeekConfig } from "./config";
import { DeepSeekRequestError, requestDeepSeekGroundedAnswer } from "./deepseek";

function providerResponse(content: unknown, status = 200) {
  return new Response(
    JSON.stringify({ choices: [{ message: { content } }] }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

const config = getDeepSeekConfig({ DEEPSEEK_API_KEY: "test-secret" });

describe("DeepSeek native fetch client", () => {
  it("requests non-streaming JSON output with thinking disabled", async () => {
    const fetcher = vi.fn(async () =>
      providerResponse(
        JSON.stringify({ answer: "有资料依据。", citations: ["E1"], insufficientEvidence: false }),
      ),
    ) as unknown as typeof fetch;

    const output = await requestDeepSeekGroundedAnswer({
      config,
      systemPrompt: "Return valid json.",
      userPrompt: "Context E1",
      fetcher,
    });
    expect(output.citations).toEqual(["E1"]);
    const [, init] = vi.mocked(fetcher).mock.calls[0];
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      model: "deepseek-v4-pro",
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      stream: false,
      temperature: 0.2,
    });
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-secret");
  });

  it("retries invalid JSON once and then succeeds", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(providerResponse("not json"))
      .mockResolvedValueOnce(
        providerResponse(
          JSON.stringify({ answer: "第二次成功。", citations: ["E1"], insufficientEvidence: false }),
        ),
      ) as unknown as typeof fetch;

    const output = await requestDeepSeekGroundedAnswer({
      config,
      systemPrompt: "Return valid json.",
      userPrompt: "Context E1",
      fetcher,
    });
    expect(output.answer).toBe("第二次成功。");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("retries empty content once and returns a controlled invalid-response error", async () => {
    const fetcher = vi.fn(async () => providerResponse("")) as unknown as typeof fetch;
    await expect(
      requestDeepSeekGroundedAnswer({
        config,
        systemPrompt: "Return valid json.",
        userPrompt: "Context E1",
        fetcher,
      }),
    ).rejects.toMatchObject({ code: "DEEPSEEK_INVALID_RESPONSE" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([
    [429, "DEEPSEEK_RATE_LIMITED"],
    [500, "DEEPSEEK_UPSTREAM_ERROR"],
  ] as const)("maps HTTP %s to %s", async (status, code) => {
    const fetcher = vi.fn(async () => providerResponse("", status)) as unknown as typeof fetch;
    await expect(
      requestDeepSeekGroundedAnswer({
        config,
        systemPrompt: "Return valid json.",
        userPrompt: "Context E1",
        fetcher,
      }),
    ).rejects.toMatchObject({ code });
  });

  it("maps an aborted request to the controlled timeout error", async () => {
    const fetcher = vi.fn(
      async (_input: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    ) as unknown as typeof fetch;

    await expect(
      requestDeepSeekGroundedAnswer({
        config: { ...config, timeoutMs: 5 },
        systemPrompt: "Return valid json.",
        userPrompt: "Context E1",
        fetcher,
      }),
    ).rejects.toBeInstanceOf(DeepSeekRequestError);
    await expect(
      requestDeepSeekGroundedAnswer({
        config: { ...config, timeoutMs: 5 },
        systemPrompt: "Return valid json.",
        userPrompt: "Context E1",
        fetcher,
      }),
    ).rejects.toMatchObject({ code: "DEEPSEEK_TIMEOUT" });
  });
});
