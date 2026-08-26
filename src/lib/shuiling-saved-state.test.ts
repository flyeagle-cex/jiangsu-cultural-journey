import { describe, expect, it } from "vitest";

import { creativeManifest } from "@/data/creative-manifest";
import {
  buildSavedStateResult,
  detectSavedStateIntent,
} from "@/lib/shuiling-saved-state";

describe("detectSavedStateIntent", () => {
  it.each([
    ["我的收藏", "all"],
    ["我收藏了哪些城市", "cities"],
    ["看看我收藏的文创", "creative"],
    ["  带我看看我的收藏！ ", "all"],
  ] as const)("detects the Chinese saved-state query %s", (query, intent) => {
    expect(detectSavedStateIntent(query)).toBe(intent);
  });

  it.each([
    ["my favorites", "all"],
    ["show my saved cities", "cities"],
    ["what creative works did I save?", "creative"],
  ] as const)("detects the English saved-state query %s", (query, intent) => {
    expect(detectSavedStateIntent(query)).toBe(intent);
  });

  it.each([
    "南京有哪些值得收藏的文化",
    "有哪些值得收藏的文创",
    "收藏非遗有什么意义",
    "what souvenirs should I save",
    "介绍一下我收藏的南京",
    "有什么文创？",
  ])("does not overmatch the cultural query %s", (query) => {
    expect(detectSavedStateIntent(query)).toBeNull();
  });
});

describe("buildSavedStateResult", () => {
  it("filters invalid city slugs and preserves canonical city order", () => {
    const result = buildSavedStateResult("cities", {
      favoriteCities: ["suzhou", "fake-city", "nanjing"],
      favoriteCreativeProjects: [],
    });

    expect(result.cities.map((city) => city.slug)).toEqual(["nanjing", "suzhou"]);
  });

  it("returns only saved published creative projects in stable order", () => {
    const result = buildSavedStateResult("creative", {
      favoriteCities: [],
      favoriteCreativeProjects: ["fake-creative", "water-spirit-global-voyage"],
    });

    expect(result.creativeProjects.map((project) => project.slug)).toEqual([
      "water-spirit-global-voyage",
    ]);
    expect(result.creativeProjects[0]?.name.zh).toBe("一水灵韵，万国舟行");
  });

  it("never returns a saved project when its manifest entry is draft", () => {
    const publishedProject = creativeManifest[0];
    expect(publishedProject).toBeDefined();
    if (!publishedProject) return;

    const result = buildSavedStateResult(
      "creative",
      {
        favoriteCities: [],
        favoriteCreativeProjects: [publishedProject.slug],
      },
      [{ ...publishedProject, status: "draft" }],
    );

    expect(result.creativeProjects).toEqual([]);
  });

  it("keeps valid saved cities and creative works together", () => {
    const result = buildSavedStateResult("all", {
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
    });

    expect(result.cities.map((city) => city.slug)).toEqual(["nanjing"]);
    expect(result.creativeProjects.map((project) => project.slug)).toEqual([
      "water-spirit-global-voyage",
    ]);
  });
});
