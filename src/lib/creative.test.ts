import { describe, expect, it } from "vitest";

import {
  getCreativeProjectBySlug,
  getCreativeProjectsByCity,
  getCreativeProjectsByTheme,
  getFeaturedCreativeProjects,
  getPublishedCreativeProjects,
  getPublishedCreativeProjectsByCity,
  isCreativeSlug,
} from "@/lib/creative";
import { creativeManifest } from "@/data/creative-manifest";

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

  it("includes published projects and excludes drafts from public listings", () => {
    const publishedProject = creativeManifest[0];
    const draftProject = { ...publishedProject, status: "draft" as const };

    expect(getPublishedCreativeProjects([publishedProject, draftProject])).toEqual([
      publishedProject,
    ]);
  });

  it("returns only explicitly linked published city projects", () => {
    const publishedProject = creativeManifest[0];
    const suzhouProject = {
      ...publishedProject,
      slug: "future-suzhou" as unknown as typeof publishedProject.slug,
      scope: "city" as const,
      citySlugs: ["suzhou" as const],
      sortOrder: 2,
    };
    const draftSuzhouProject = {
      ...suzhouProject,
      slug: "future-suzhou-draft" as unknown as typeof publishedProject.slug,
      status: "draft" as const,
    };

    expect(
      getPublishedCreativeProjectsByCity("suzhou", [
        publishedProject,
        draftSuzhouProject,
        suzhouProject,
      ]).map((project) => project.slug),
    ).toEqual(["future-suzhou"]);
    expect(getPublishedCreativeProjectsByCity("nanjing", [publishedProject])).toEqual([]);
  });
});
