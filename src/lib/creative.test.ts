import { describe, expect, it } from "vitest";

import {
  getCreativeProjectBySlug,
  getCreativeProjectsByCity,
  getCreativeProjectsByTheme,
  getFeaturedCreativeProjects,
  isCreativeSlug,
} from "@/lib/creative";

describe("creative selectors", () => {
  it("resolves the first official project by slug", () => {
    expect(getCreativeProjectBySlug("water-spirit-global-voyage")?.name.zh).toBe(
      "一水灵韵，万国舟行",
    );
  });

  it("returns undefined for an unknown creative slug", () => {
    expect(getCreativeProjectBySlug("unknown-project")).toBeUndefined();
    expect(isCreativeSlug("unknown-project")).toBe(false);
  });

  it("filters by city without assigning a Jiangsu-wide project to one city", () => {
    expect(getCreativeProjectsByCity("nanjing")).toEqual([]);
  });

  it("filters by cultural theme", () => {
    expect(getCreativeProjectsByTheme("water_culture").map((project) => project.slug)).toEqual([
      "water-spirit-global-voyage",
    ]);
  });

  it("returns published featured projects in sort order", () => {
    expect(getFeaturedCreativeProjects().map((project) => project.slug)).toEqual([
      "water-spirit-global-voyage",
    ]);
  });
});
