import { describe, expect, it } from "vitest";

import { BRAND_NAME, BRAND_NAME_EN_UPPER, BRAND_SLOGAN } from "@/data/brand";
import { SHUILING_COPY } from "@/data/shuiling-guide";

describe("official site brand", () => {
  it("keeps the approved bilingual brand identity in one source of truth", () => {
    expect(BRAND_NAME).toEqual({
      zh: "灵舟苏韵",
      en: "Shuiling Boat · Jiangsu Charm",
    });
    expect(BRAND_NAME_EN_UPPER).toBe("SHUILING BOAT · JIANGSU CHARM");
  });

  it("keeps the approved bilingual slogan unchanged", () => {
    expect(BRAND_SLOGAN).toEqual({
      zh: "一水灵韵，万国舟行",
      en: "One Water, One Grace; Boats Sail Across the World",
    });
  });

  it("uses the official brand in the Shuiling welcome copy", () => {
    expect(SHUILING_COPY.welcomeTitle).toEqual({
      zh: "欢迎来到灵舟苏韵",
      en: "Welcome to Shuiling Boat · Jiangsu Charm",
    });
  });
});
