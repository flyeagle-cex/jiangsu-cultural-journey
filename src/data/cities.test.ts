import { describe, expect, it } from "vitest";

import { cities, getCityBySlug } from "@/data/cities";
import { cityManifest } from "@/data/city-manifest";
import { cityMarkers } from "@/data/home";
import { CITY_SECTION_ORDER } from "@/types/city";

const EXPECTED_SLUGS = [
  "nanjing",
  "suzhou",
  "wuxi",
  "changzhou",
  "zhenjiang",
  "yangzhou",
  "taizhou",
  "nantong",
  "yancheng",
  "huaian",
  "suqian",
  "xuzhou",
  "lianyungang",
];

describe("canonical Jiangsu city data", () => {
  it("contains all thirteen cities once and in presentation order", () => {
    expect(cities).toHaveLength(13);
    expect(cities.map((city) => city.slug)).toEqual(EXPECTED_SLUGS);
    expect(new Set(cities.map((city) => city.slug)).size).toBe(13);
    expect(new Set(cities.map((city) => city.adcode)).size).toBe(13);
    expect(new Set(cities.map((city) => city.mapName)).size).toBe(13);
    expect(cities.map((city) => city.order)).toEqual(Array.from({ length: 13 }, (_, index) => index + 1));
  });

  it("provides the same six non-empty modules for every city", () => {
    cities.forEach((city) => {
      expect(city.sections.map((section) => section.id)).toEqual(CITY_SECTION_ORDER);
      city.sections.forEach((section) => {
        expect(section.intro.zh.length).toBeGreaterThan(12);
        expect(section.highlights.length).toBeGreaterThanOrEqual(2);
        expect(new Set(section.highlights.map((highlight) => highlight.id)).size).toBe(
          section.highlights.length,
        );
        section.highlights.forEach((highlight) => {
          expect(highlight.title.zh).toBeTruthy();
          expect(highlight.summary.zh.length).toBeGreaterThan(12);
          expect(highlight.keywords.length).toBeGreaterThanOrEqual(2);
        });
      });
    });
  });

  it("provides complete Chinese and English content for every city", () => {
    let translatedFields = 0;

    cities.forEach((city) => {
      expect(city.name.zh).toBeTruthy();
      expect(city.name.en).toBeTruthy();
      expect(city.tagline.zh).toBeTruthy();
      expect(city.tagline.en).toBeTruthy();
      expect(city.summary.zh.length).toBeGreaterThan(12);
      expect(city.summary.en?.length).toBeGreaterThan(24);
      expect(city.summary.en).not.toMatch(/[\u3400-\u9fff]/u);
      translatedFields += 1;
      expect(city.searchTerms.zh.length).toBeGreaterThanOrEqual(5);
      expect(city.searchTerms.en.length).toBeGreaterThanOrEqual(5);

      city.sections.forEach((section) => {
        expect(section.intro.en?.length).toBeGreaterThan(20);
        expect(section.intro.en).not.toMatch(/[\u3400-\u9fff]/u);
        translatedFields += 1;

        section.highlights.forEach((highlight) => {
          expect(highlight.title.en).toBeTruthy();
          expect(highlight.title.en).not.toMatch(/[\u3400-\u9fff]/u);
          expect(highlight.summary.en?.length).toBeGreaterThan(20);
          expect(highlight.summary.en).not.toMatch(/[\u3400-\u9fff]/u);
          translatedFields += 2;
        });
      });
    });

    expect(translatedFields).toBe(403);
  });

  it("records one traceable Word source for each brief dataset", () => {
    const sourceNames = cities.flatMap((city) => city.sources.map((source) => source.fileName));
    expect(new Set(sourceNames).size).toBe(13);
    cities.forEach((city) => {
      expect(city.sources).toHaveLength(1);
      expect(city.sources[0].kind).toBe("docx");
      expect(city.sources[0].dataStatus).toBe("brief");
      expect(city.sources[0].fileName.endsWith(".docx")).toBe(true);
    });
  });

  it("derives homepage markers from the canonical city records", () => {
    expect(cityMarkers).toHaveLength(cityManifest.length);
    cityMarkers.forEach((marker, index) => {
      const city = cityManifest[index];
      expect(marker.slug).toBe(city.slug);
      expect(marker.mapName).toBe(city.mapName);
      expect(marker.name).toEqual(city.name);
      expect(marker.label).toEqual(city.tagline);
      expect(marker.coordinates).toEqual(city.coordinates);
    });
    cities.forEach((city, index) => {
      expect(city.slug).toBe(cityManifest[index].slug);
      expect(city.adcode).toBe(cityManifest[index].adcode);
      expect(city.name).toEqual(cityManifest[index].name);
      expect(city.tagline).toEqual(cityManifest[index].tagline);
    });
  });

  it("supports stable lookup by route slug", () => {
    expect(getCityBySlug("nanjing")?.name.en).toBe("Nanjing");
    expect(getCityBySlug("lianyungang")?.adcode).toBe(320700);
    expect(getCityBySlug("not-a-city")).toBeUndefined();
  });
});
