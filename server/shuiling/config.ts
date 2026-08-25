export const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-pro";
export const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
export const DEEPSEEK_TEMPERATURE = 0.2;
export const DEEPSEEK_MAX_TOKENS = 900;
export const DEEPSEEK_TIMEOUT_MS = 25_000;
export const RATE_LIMIT_REQUIRED_BEFORE_PUBLIC_LAUNCH = true;

export type ServerEnvironment = Record<string, string | undefined>;

export type DeepSeekConfig = {
  apiKey: string | null;
  model: string;
  baseUrl: string;
  endpoint: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
};

export function getDeepSeekConfig(environment: ServerEnvironment = process.env): DeepSeekConfig {
  const apiKey = environment.DEEPSEEK_API_KEY?.trim() || null;
  const model = environment.DEEPSEEK_MODEL?.trim() || DEFAULT_DEEPSEEK_MODEL;
  const baseUrl = (environment.DEEPSEEK_BASE_URL?.trim() || DEFAULT_DEEPSEEK_BASE_URL).replace(
    /\/+$/u,
    "",
  );

  return {
    apiKey,
    model,
    baseUrl,
    endpoint: `${baseUrl}/chat/completions`,
    temperature: DEEPSEEK_TEMPERATURE,
    maxTokens: DEEPSEEK_MAX_TOKENS,
    timeoutMs: DEEPSEEK_TIMEOUT_MS,
  };
}
