import {
  SHUILING_CHAT_ENDPOINT,
  SHUILING_CHAT_ERROR_CODES,
  type ShuiLingChatErrorCode,
  type ShuiLingChatErrorResponse,
  type ShuiLingChatRequest,
  type ShuiLingChatResponse,
} from "@/assistant/types";

const errorCodes = new Set<string>(SHUILING_CHAT_ERROR_CODES);

export class ShuiLingApiError extends Error {
  constructor(
    public readonly code: ShuiLingChatErrorCode,
    public readonly retrieval?: ShuiLingChatErrorResponse["retrieval"],
  ) {
    super(code);
    this.name = "ShuiLingApiError";
  }
}

function isChatResponse(value: unknown): value is ShuiLingChatResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Partial<ShuiLingChatResponse>;
  const retrieval = response.retrieval;
  return (
    typeof response.answer === "string" &&
    Array.isArray(response.citations) &&
    response.citations.every(
      (citation) =>
        Boolean(citation) &&
        typeof citation.evidenceId === "string" &&
        typeof citation.chunkId === "string" &&
        typeof citation.city === "string" &&
        typeof citation.section === "string" &&
        typeof citation.title === "string" &&
        typeof citation.sourceDocument === "string",
    ) &&
    typeof response.insufficientEvidence === "boolean" &&
    Boolean(retrieval) &&
    (retrieval?.scope === "city" || retrieval?.scope === "multi-city" || retrieval?.scope === "all") &&
    Array.isArray(retrieval.citySlugs) &&
    typeof retrieval.fellBackToGlobal === "boolean" &&
    typeof retrieval.resultCount === "number" &&
    typeof response.promptVersion === "string"
  );
}

function readError(value: unknown): ShuiLingChatErrorResponse | null {
  if (!value || typeof value !== "object") return null;
  const response = value as Partial<ShuiLingChatErrorResponse>;
  const code = response.error?.code;
  if (!code || !errorCodes.has(code)) return null;
  return response as ShuiLingChatErrorResponse;
}

export async function requestShuiLingAnswer(
  request: ShuiLingChatRequest,
  { signal, fetcher = fetch }: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
) {
  let response: Response;
  try {
    response = await fetcher(SHUILING_CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ShuiLingApiError("DEEPSEEK_UPSTREAM_ERROR");
  }

  let body: unknown;
  try {
    body = (await response.json()) as unknown;
  } catch {
    throw new ShuiLingApiError("DEEPSEEK_INVALID_RESPONSE");
  }

  if (!response.ok) {
    const error = readError(body);
    throw new ShuiLingApiError(error?.error.code ?? "DEEPSEEK_UPSTREAM_ERROR", error?.retrieval);
  }
  if (!isChatResponse(body)) throw new ShuiLingApiError("DEEPSEEK_INVALID_RESPONSE");
  return body;
}
