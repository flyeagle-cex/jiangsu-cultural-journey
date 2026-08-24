import { describe, expect, it } from "vitest";

import { cityMarkers, themeItems } from "@/data/home";

describe("homepage cultural data", () => {
  it("contains exactly thirteen uniquely routed cities", () => {
    expect(cityMarkers).toHaveLength(13);
    expect(new Set(cityMarkers.map((city) => city.slug)).size).toBe(13);
    expect(new Set(cityMarkers.map((city) => city.mapName)).size).toBe(13);
  });

  it("provides bilingual text and valid map coordinates for every city", () => {
    cityMarkers.forEach((city) => {
      expect(city.name.zh).toBeTruthy();
      expect(city.name.en).toBeTruthy();
      expect(city.label.zh).toBeTruthy();
      expect(city.label.en).toBeTruthy();
      expect(city.coordinates[0]).toBeGreaterThan(116);
      expect(city.coordinates[0]).toBeLessThan(122);
      expect(city.coordinates[1]).toBeGreaterThan(30);
      expect(city.coordinates[1]).toBeLessThan(36);
    });
  });

  it("contains the five requested exploration themes with local assets", () => {
    expect(themeItems.map((theme) => theme.id)).toEqual(["canal", "nature", "history", "heritage", "food"]);
    themeItems.forEach((theme) => expect(theme.image.startsWith("/assets/")).toBe(true));
  });
});
