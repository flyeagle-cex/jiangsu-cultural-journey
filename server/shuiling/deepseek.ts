import type { ShuiLingChatErrorCode } from "../../src/assistant/types";
import type { DeepSeekConfig } from "./config";

export type DeepSeekGroundedOutput = {
  answer: string;
  citations: string[];
  insufficientEvidence: boolean;
};

type DeepSeekChatEnvelope = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

export class DeepSeekRequestError extends Error {
  constructor(public readonly code: ShuiLingChatErrorCode) {
    super(code);
    this.name = "DeepSeekRequestError";
  }
}

function parseGroundedOutput(value: string): DeepSeekGroundedOutput | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const output = parsed as Partial<DeepSeekGroundedOutput>;
    if (
      typeof output.answer !== "string" ||
      !Array.isArray(output.citations) ||
      !output.citations.every((citation) => typeof citation === "string") ||
      typeof output.insufficientEvidence !== "boolean"
    ) {
      return null;
    }
    return {
      answer: output.answer.trim(),
      citations: output.citations,
      insufficientEvidence: output.insufficientEvidence,
    };
  } catch {
    return null;
  }
}

async function readGroundedOutput(response: Response) {
  try {
    const envelope = (await response.json()) as DeepSeekChatEnvelope;
    const content = envelope.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? parseGroundedOutput(content) : null;
  } catch {
    return null;
  }
}

export async function requestDeepSeekGroundedAnswer({
  config,
  systemPrompt,
  userPrompt,
  fetcher = fetch,
  signal,
}: {
  config: DeepSeekConfig;
  systemPrompt: string;
  userPrompt: string;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
}) {
  if (!config.apiKey) throw new DeepSeekRequestError("DEEPSEEK_NOT_CONFIGURED");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let response: Response;
      try {
        response = await fetcher(config.endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            thinking: { type: "disabled" },
            stream: false,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
          }),
          signal: controller.signal,
        });
      } catch (error) {
        if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
          throw new DeepSeekRequestError("DEEPSEEK_TIMEOUT");
        }
        throw new DeepSeekRequestError("DEEPSEEK_UPSTREAM_ERROR");
      }

      if (response.status === 429) {
        throw new DeepSeekRequestError("DEEPSEEK_RATE_LIMITED");
      }
      if (!response.ok) {
        throw new DeepSeekRequestError("DEEPSEEK_UPSTREAM_ERROR");
      }

      const output = await readGroundedOutput(response);
      if (output) return output;
    }

    throw new DeepSeekRequestError("DEEPSEEK_INVALID_RESPONSE");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
