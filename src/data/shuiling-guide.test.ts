import { describe, expect, it } from "vitest";

import {
  FUTURE_GUIDE_ACTIONS,
  HOME_GUIDE_ACTIONS,
  NOT_FOUND_GUIDE_ACTIONS,
  SHUILING_ASSETS,
  getCityGuideActions,
} from "@/data/shuiling-guide";
import { CITY_SECTION_ORDER } from "@/types/city";

describe("Shuiling guide configuration", () => {
  it("uses the supplied Shuiling media paths without auto-loading a city-specific video", () => {
    expect(SHUILING_ASSETS.welcomeVideo).toBeNull();
    expect(SHUILING_ASSETS.poster).toMatch(/shuiling-guide-poster\.webp$/);
    expect(SHUILING_ASSETS.avatar).toMatch(/shuiling-avatar\.webp$/);
  });

  it("provides bilingual home, future and recovery actions", () => {
    [...HOME_GUIDE_ACTIONS, ...FUTURE_GUIDE_ACTIONS, ...NOT_FOUND_GUIDE_ACTIONS].forEach((action) => {
      expect(action.label.zh.length).toBeGreaterThan(0);
      expect(action.label.en.length).toBeGreaterThan(0);
    });
  });

  it("maps every city archive section to an in-page anchor", () => {
    const actions = getCityGuideActions();
    expect(actions.map((action) => action.sectionId)).toEqual(CITY_SECTION_ORDER);
    expect(actions.map((action) => action.target)).toEqual(
      CITY_SECTION_ORDER.map((sectionId) => `#city-${sectionId}`),
    );
  });
});
