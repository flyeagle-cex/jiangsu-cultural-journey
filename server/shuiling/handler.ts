import {
  SHUILING_CHAT_ERROR_CODES,
  type ShuiLingChatErrorCode,
  type ShuiLingChatErrorResponse,
  type ShuiLingChatRequest,
} from "../../src/assistant/types";
import { KNOWLEDGE_CITY_SLUGS, type KnowledgeChunk } from "../../src/rag/types";
import type { ServerEnvironment } from "./config";
import { generateShuiLingAnswer, ShuiLingGenerationError } from "./generate-answer";

const MAX_REQUEST_BODY_CHARS = 4_000;
const MAX_QUESTION_CHARS = 500;
const citySlugs = new Set<string>(KNOWLEDGE_CITY_SLUGS);
const errorCodes = new Set<string>(SHUILING_CHAT_ERROR_CODES);

const ERROR_MESSAGES: Record<ShuiLingChatErrorCode, string> = {
  DEEPSEEK_NOT_CONFIGURED: "DeepSeek answer generation is not configured.",
  DEEPSEEK_TIMEOUT: "DeepSeek did not respond before the server timeout.",
  DEEPSEEK_RATE_LIMITED: "DeepSeek is temporarily rate limited.",
  DEEPSEEK_UPSTREAM_ERROR: "DeepSeek is temporarily unavailable.",
  DEEPSEEK_INVALID_RESPONSE: "DeepSeek returned an invalid grounded response.",
  INVALID_REQUEST: "The chat request is invalid.",
};

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function errorStatus(code: ShuiLingChatErrorCode) {
  if (code === "INVALID_REQUEST") return 400;
  if (code === "DEEPSEEK_RATE_LIMITED") return 429;
  if (code === "DEEPSEEK_TIMEOUT") return 504;
  if (code === "DEEPSEEK_NOT_CONFIGURED") return 503;
  return 502;
}

function errorResponse(
  code: ShuiLingChatErrorCode,
  retrieval?: ShuiLingChatErrorResponse["retrieval"],
) {
  const body: ShuiLingChatErrorResponse = {
    error: { code, message: ERROR_MESSAGES[code] },
    ...(retrieval ? { retrieval } : {}),
  };
  return jsonResponse(body, errorStatus(code));
}

function validateRequest(value: unknown): ShuiLingChatRequest | null {
  if (!value || typeof value !== "object") return null;
  const request = value as Partial<ShuiLingChatRequest>;
  const question = typeof request.question === "string" ? request.question.trim() : "";
  if (!question || question.length > MAX_QUESTION_CHARS) return null;
  if (request.language !== "zh" && request.language !== "en") return null;
  if (request.currentCity !== undefined && !citySlugs.has(request.currentCity)) return null;
  return {
    question,
    language: request.language,
    ...(request.currentCity ? { currentCity: request.currentCity } : {}),
  };
}

async function parseRequest(request: Request) {
  const body = await request.text();
  if (body.length > MAX_REQUEST_BODY_CHARS) return null;
  try {
    return validateRequest(JSON.parse(body) as unknown);
  } catch {
    return null;
  }
}

export async function handleShuiLingChat(
  request: Request,
  {
    environment = process.env,
    fetcher = fetch,
    chunks,
    projectRoot,
  }: {
    environment?: ServerEnvironment;
    fetcher?: typeof fetch;
    chunks?: readonly KnowledgeChunk[];
    projectRoot?: string;
  } = {},
) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const input = await parseRequest(request);
  if (!input) return errorResponse("INVALID_REQUEST");

  try {
    return jsonResponse(
      await generateShuiLingAnswer(input, {
        environment,
        fetcher,
        chunks,
        projectRoot,
        signal: request.signal,
      }),
    );
  } catch (error) {
    if (error instanceof ShuiLingGenerationError && errorCodes.has(error.code)) {
      return errorResponse(error.code, error.retrieval);
    }
    return errorResponse("DEEPSEEK_UPSTREAM_ERROR");
  }
}
