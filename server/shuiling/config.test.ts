import { describe, expect, it } from "vitest";

import {
  DEFAULT_DEEPSEEK_BASE_URL,
  DEFAULT_DEEPSEEK_MODEL,
  getDeepSeekConfig,
} from "./config";

describe("DeepSeek server configuration", () => {
  it("uses safe defaults without inventing an API key", () => {
    const config = getDeepSeekConfig({});
    expect(config.apiKey).toBeNull();
    expect(config.model).toBe(DEFAULT_DEEPSEEK_MODEL);
    expect(config.baseUrl).toBe(DEFAULT_DEEPSEEK_BASE_URL);
    expect(config.endpoint).toBe("https://api.deepseek.com/chat/completions");
  });

  it("reads model and base URL from one server-only config boundary", () => {
    const config = getDeepSeekConfig({
      DEEPSEEK_API_KEY: " server-secret ",
      DEEPSEEK_MODEL: "deepseek-v4-flash",
      DEEPSEEK_BASE_URL: "https://example.test/",
    });
    expect(config.apiKey).toBe("server-secret");
    expect(config.model).toBe("deepseek-v4-flash");
    expect(config.endpoint).toBe("https://example.test/chat/completions");
  });
});
