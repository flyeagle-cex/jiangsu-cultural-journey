import { describe, expect, it } from "vitest";

import {
  creativeCategoryLabels,
  creativeManifest,
  creativeThemeLabels,
} from "@/data/creative-manifest";
import { cityManifest } from "@/data/city-manifest";

describe("creative manifest", () => {
  it("uses unique slugs and complete bilingual names", () => {
    const slugs = creativeManifest.map((project) => project.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of creativeManifest) {
      expect(project.name.zh.trim()).not.toBe("");
      expect(project.name.en.trim()).not.toBe("");
      expect(["published", "draft"]).toContain(project.status);
    }
  });

  it("only references registered cities, categories, and themes", () => {
    const citySlugs = new Set(cityManifest.map((city) => city.slug));
    const categoryIds = new Set(Object.keys(creativeCategoryLabels));
    const themeIds = new Set(Object.keys(creativeThemeLabels));

    for (const project of creativeManifest) {
      expect(project.citySlugs.every((slug) => citySlugs.has(slug))).toBe(true);
      expect(project.categories.every((category) => categoryIds.has(category))).toBe(true);
      expect(project.themes.every((theme) => themeIds.has(theme))).toBe(true);
    }
  });

  it("keeps all asset identifiers unique within each project", () => {
    for (const project of creativeManifest) {
      const ids = [
        ...project.sourceAssets.map((asset) => asset.id),
        ...project.gallery.map((asset) => asset.id),
        ...(project.coverAsset ? [project.coverAsset.id] : []),
      ];

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("registers source artwork without inventing public asset URLs", () => {
    const [project] = creativeManifest;

    expect(project.sourceArchive.entryCount).toBe(12);
    expect(project.sourceAssets).toHaveLength(12);
    expect(project.coverAsset).toBeNull();
    expect(project.gallery).toEqual([]);
  });

  it("records the Jiangsu scope as derived metadata", () => {
    const [project] = creativeManifest;

    expect(project.scope).toBe("jiangsu");
    expect(project.metadataProvenance.scope).toBe("derived");
  });
});
