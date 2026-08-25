import type { KnowledgeSection } from "@/rag/types";
import type { CitySlug, Language } from "@/types/city";

export const SHUILING_CHAT_ENDPOINT = "/api/shuiling/chat";

export const SHUILING_CHAT_ERROR_CODES = [
  "DEEPSEEK_NOT_CONFIGURED",
  "DEEPSEEK_TIMEOUT",
  "DEEPSEEK_RATE_LIMITED",
  "DEEPSEEK_UPSTREAM_ERROR",
  "DEEPSEEK_INVALID_RESPONSE",
  "INVALID_REQUEST",
] as const;

export type ShuiLingChatErrorCode = (typeof SHUILING_CHAT_ERROR_CODES)[number];

export type ShuiLingChatRequest = {
  question: string;
  currentCity?: CitySlug;
  language: Language;
};

export type ShuiLingCitation = {
  evidenceId: string;
  chunkId: string;
  city: CitySlug;
  section: KnowledgeSection;
  title: string;
  sourceDocument: string;
};

export type ShuiLingRetrievalMetadata = {
  scope: "city" | "multi-city" | "all";
  citySlugs: CitySlug[];
  fellBackToGlobal: boolean;
  resultCount: number;
};

export type ShuiLingChatResponse = {
  answer: string;
  citations: ShuiLingCitation[];
  insufficientEvidence: boolean;
  retrieval: ShuiLingRetrievalMetadata;
  promptVersion: string;
};

export type ShuiLingChatErrorResponse = {
  error: {
    code: ShuiLingChatErrorCode;
    message: string;
  };
  retrieval?: ShuiLingRetrievalMetadata;
};
