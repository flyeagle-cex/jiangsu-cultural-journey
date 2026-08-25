import type {
  ShuiLingChatRequest,
  ShuiLingChatResponse,
  ShuiLingRetrievalMetadata,
} from "../../src/assistant/types";
import type { KnowledgeChunk } from "../../src/rag/types";
import {
  buildRagContext,
  evidenceToCitation,
  validateCitationIds,
} from "./context";
import { getDeepSeekConfig, type ServerEnvironment } from "./config";
import { loadServerKnowledgeCorpus } from "./corpus";
import {
  DeepSeekRequestError,
  requestDeepSeekGroundedAnswer,
} from "./deepseek";
import {
  buildRagUserPrompt,
  SHUILING_GROUNDING_SYSTEM_PROMPT,
  SHUILING_PROMPT_VERSION,
} from "./prompt";
import { retrieveServerKnowledge } from "./retrieval";

const INSUFFICIENT_EVIDENCE_ANSWER = {
  zh: "现有江苏十三市文化资料中暂未找到足够依据回答这个问题。",
  en: "The current Jiangsu cultural corpus does not provide enough evidence to answer this question.",
} as const;

function retrievalMetadata(
  retrieval: ReturnType<typeof retrieveServerKnowledge>,
): ShuiLingRetrievalMetadata {
  return {
    scope: retrieval.scope.kind,
    citySlugs: retrieval.scope.citySlugs,
    fellBackToGlobal: retrieval.fellBackToGlobal,
    resultCount: retrieval.results.length,
  };
}

export class ShuiLingGenerationError extends DeepSeekRequestError {
  constructor(
    code: ConstructorParameters<typeof DeepSeekRequestError>[0],
    public readonly retrieval: ShuiLingRetrievalMetadata,
  ) {
    super(code);
    this.name = "ShuiLingGenerationError";
  }
}

export async function generateShuiLingAnswer(
  request: ShuiLingChatRequest,
  {
    environment = process.env,
    fetcher = fetch,
    chunks,
    projectRoot,
    signal,
  }: {
    environment?: ServerEnvironment;
    fetcher?: typeof fetch;
    chunks?: readonly KnowledgeChunk[];
    projectRoot?: string;
    signal?: AbortSignal;
  } = {},
): Promise<ShuiLingChatResponse> {
  const corpus = chunks ?? (await loadServerKnowledgeCorpus(projectRoot));
  const retrieval = retrieveServerKnowledge(request.question, corpus, request.currentCity);
  const metadata = retrievalMetadata(retrieval);

  if (!retrieval.results.length) {
    return {
      answer: INSUFFICIENT_EVIDENCE_ANSWER[request.language],
      citations: [],
      insufficientEvidence: true,
      retrieval: metadata,
      promptVersion: SHUILING_PROMPT_VERSION,
    };
  }

  const config = getDeepSeekConfig(environment);
  if (!config.apiKey) {
    throw new ShuiLingGenerationError("DEEPSEEK_NOT_CONFIGURED", metadata);
  }

  const context = buildRagContext(retrieval.results);
  let output;
  try {
    output = await requestDeepSeekGroundedAnswer({
      config,
      systemPrompt: SHUILING_GROUNDING_SYSTEM_PROMPT,
      userPrompt: buildRagUserPrompt(request.question, request.language, context.text),
      fetcher,
      signal,
    });
  } catch (error) {
    if (error instanceof DeepSeekRequestError) {
      throw new ShuiLingGenerationError(error.code, metadata);
    }
    throw new ShuiLingGenerationError("DEEPSEEK_UPSTREAM_ERROR", metadata);
  }

  if (output.insufficientEvidence) {
    return {
      answer: INSUFFICIENT_EVIDENCE_ANSWER[request.language],
      citations: [],
      insufficientEvidence: true,
      retrieval: metadata,
      promptVersion: SHUILING_PROMPT_VERSION,
    };
  }

  const validCitationIds = validateCitationIds(output.citations, context.evidence);
  if (!output.answer || !validCitationIds.length) {
    throw new ShuiLingGenerationError("DEEPSEEK_INVALID_RESPONSE", metadata);
  }
  const evidenceById = new Map(context.evidence.map((item) => [item.evidenceId, item]));

  return {
    answer: output.answer,
    citations: validCitationIds.map((citationId) => evidenceToCitation(evidenceById.get(citationId)!)),
    insufficientEvidence: false,
    retrieval: metadata,
    promptVersion: SHUILING_PROMPT_VERSION,
  };
}
