import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { cities } from "@/data/cities";
import {
  cityHeroVisuals,
  citySectionMediaFiles,
  getCityHeroVisual,
  getCitySectionVisual,
} from "@/data/city-media";
import { CITY_SECTION_ORDER } from "@/types/city";

describe("city detail media", () => {
  it("assigns one unique local hero image to every city", () => {
    expect(Object.keys(cityHeroVisuals)).toHaveLength(13);
    const heroPaths = cities.map((city) => getCityHeroVisual(city.slug).src);
    expect(new Set(heroPaths).size).toBe(13);
    heroPaths.forEach((src) => expect(src).toMatch(/^\/assets\/cities\//));
  });

  it("provides bilingual alt text for each city hero", () => {
    cities.forEach((city) => {
      const visual = getCityHeroVisual(city.slug);
      expect(visual.alt.zh.length).toBeGreaterThan(4);
      expect(visual.alt.en.length).toBeGreaterThan(8);
    });
  });

  it("maps confirmed local Word imagery without borrowing another city's photo", () => {
    const mappedFiles = Object.values(citySectionMediaFiles).flatMap((sections) => Object.values(sections));
    expect(mappedFiles).toHaveLength(65);
    expect(new Set(mappedFiles).size).toBe(65);
    mappedFiles.forEach((src) => expect(src).toMatch(/^\/assets\/cities\//));

    cities.forEach((city) => {
      expect(getCitySectionVisual(city.slug, "overview")).toBeNull();
      CITY_SECTION_ORDER.filter((id) => id !== "overview").forEach((id) => {
        const visual = getCitySectionVisual(city.slug, id);
        expect(visual).not.toBeNull();
        expect(visual?.src).toContain(`/assets/cities/${city.slug}-`);
        expect(visual?.alt.zh).toContain(city.name.zh);
        expect(visual?.alt.en).toContain(city.name.en);
      });
    });

    expect(getCitySectionVisual("zhenjiang", "heritage")?.src).toContain("zhenjiang-heritage-02");
    expect(getCitySectionVisual("zhenjiang", "food")?.src).toContain("zhenjiang-food-02");
    expect(getCitySectionVisual("lianyungang", "waterways")?.src).toContain(
      "lianyungang-waterways-02",
    );
    expect(getCitySectionVisual("yangzhou", "food")?.src).toContain("yangzhou-food-01");
  });

  it("keeps every supplied Stage 4 supplement in the local media library", () => {
    const supplementFiles = [
      ...[1, 2].map((index) => `lianyungang-waterways-0${index}.png`),
      ...[1, 2, 3, 4].map((index) => `zhenjiang-heritage-0${index}.png`),
      ...[1, 2, 3, 4, 5, 6, 7].map((index) => `zhenjiang-food-0${index}.png`),
      ...[1, 2, 3, 4, 5, 6].map((index) => `yangzhou-food-0${index}.png`),
    ];

    expect(supplementFiles).toHaveLength(19);
    supplementFiles.forEach((fileName) => {
      expect(existsSync(join(process.cwd(), "public", "assets", "cities", fileName))).toBe(true);
    });
  });
});
