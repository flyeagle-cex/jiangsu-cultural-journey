import { describe, expect, it } from "vitest";

import { resolveInitialLanguage } from "@/context/LanguageContext";

describe("language preference", () => {
  it("uses Chinese for a first visit or an invalid stored value", () => {
    expect(resolveInitialLanguage(null)).toBe("zh");
    expect(resolveInitialLanguage("fr")).toBe("zh");
  });

  it("restores either supported language", () => {
    expect(resolveInitialLanguage("zh")).toBe("zh");
    expect(resolveInitialLanguage("en")).toBe("en");
  });
});
