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

  it("routes the existing favorites action to the local User Center", () => {
    const favoritesAction = FUTURE_GUIDE_ACTIONS.find((action) => action.id === "favorites");

    expect(favoritesAction).toMatchObject({
      kind: "navigate",
      target: "/user",
    });
  });

  it("routes the active Creative Center action to its published page", () => {
    const creativeAction = FUTURE_GUIDE_ACTIONS.find((action) => action.id === "creative");

    expect(creativeAction).toMatchObject({
      kind: "navigate",
      target: "/creative",
    });
    expect(creativeAction?.status).toBeUndefined();
  });

  it("uses the formal ask-ai action without stale coming-soon copy", () => {
    const askAction = HOME_GUIDE_ACTIONS.find((action) => action.id === "ask");
    const serializedActions = JSON.stringify([...HOME_GUIDE_ACTIONS, ...FUTURE_GUIDE_ACTIONS]);

    expect(askAction).toMatchObject({ kind: "ask-ai" });
    expect(askAction?.status).toBeUndefined();
    expect(serializedActions).not.toContain("下一阶段");
    expect(serializedActions).not.toContain("next stage");
    expect(serializedActions).not.toContain("即将开放");
    expect(serializedActions).not.toContain("coming soon");
  });
});
