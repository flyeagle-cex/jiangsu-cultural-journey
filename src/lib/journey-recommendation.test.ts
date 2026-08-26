import { describe, expect, it } from "vitest";

import { cities, cityBySlug } from "@/data/cities";
import {
  DEFAULT_RECOMMENDATION_LIMIT,
  recommendJourneyCities,
  scoreJourneyInterestSection,
} from "@/lib/journey-recommendation";
import type {
  BilingualText,
  City,
  CityHighlight,
  CitySection,
  CitySlug,
} from "@/types/city";
import type { JourneyInterest } from "@/types/user-preferences";

const bilingual = (value: string): BilingualText => ({
  zh: value,
  en: `${value} EN`,
});

function createHighlight(
  id: string,
  keywords: string[] = [],
  summary = "正式资料内容",
): CityHighlight {
  return {
    id,
    title: bilingual(`条目${id}`),
    summary: bilingual(summary),
    keywords,
  };
}

function createSection(
  id: JourneyInterest,
  {
    intro = "正式专题介绍",
    highlights = [],
  }: {
    intro?: string;
    highlights?: CityHighlight[];
  } = {},
): CitySection {
  return {
    id,
    intro: bilingual(intro),
    highlights,
  };
}

function createCity(
  slug: CitySlug,
  order: number,
  sections: CitySection[],
): City {
  return {
    ...cities[0],
    slug,
    order,
    sections,
  };
}

describe("journey recommendation scoring", () => {
  it("scores a richer matching section above an empty section", () => {
    const emptySection = createSection("history", { intro: "", highlights: [] });
    const richSection = createSection("history", {
      highlights: [
        createHighlight("one", ["甲", "乙", "丙"]),
        createHighlight("two", ["丁", "戊", "己"], "更完整的正式文化资料内容"),
      ],
    });

    expect(scoreJourneyInterestSection(emptySection)).toBe(1);
    expect(scoreJourneyInterestSection(richSection)).toBeGreaterThan(
      scoreJourneyInterestSection(emptySection),
    );
  });

  it("returns zero for a missing section", () => {
    expect(scoreJourneyInterestSection(undefined)).toBe(0);
  });
});

describe("recommendJourneyCities", () => {
  it("returns no suggestions when no explicit interests are selected", () => {
    expect(recommendJourneyCities({ interests: [] })).toEqual([]);
  });

  it("ranks a single interest by descending score with matching reasons", () => {
    const results = recommendJourneyCities({ interests: ["history"] });

    expect(results).toHaveLength(DEFAULT_RECOMMENDATION_LIMIT);
    expect(results.every((result) => result.matchedInterests.includes("history"))).toBe(true);
    expect(results.every((result) => result.reasons[0]?.interest === "history")).toBe(true);
    expect(results.map((result) => result.score)).toEqual(
      [...results.map((result) => result.score)].sort((left, right) => right - left),
    );
  });

  it("adds section scores across multiple selected interests", () => {
    const history = createSection("history", {
      highlights: [createHighlight("history", ["古城", "遗址", "文脉"])],
    });
    const waterways = createSection("waterways", {
      highlights: [createHighlight("waterways", ["运河", "水系", "码头"])],
    });
    const city = createCity("nanjing", 1, [history, waterways]);

    const [result] = recommendJourneyCities(
      { interests: ["history", "waterways"] },
      [city],
    );

    expect(result.score).toBe(
      Number(
        (scoreJourneyInterestSection(history) + scoreJourneyInterestSection(waterways)).toFixed(2),
      ),
    );
    expect(result.matchedInterests).toEqual(["history", "waterways"]);
    expect(result.reasons).toHaveLength(2);
  });

  it("uses city order as the deterministic tie-break", () => {
    const section = createSection("nature", {
      highlights: [createHighlight("same", ["山", "水", "湖"])],
    });
    const laterCity = createCity("suzhou", 2, [section]);
    const earlierCity = createCity("nanjing", 1, [section]);

    const results = recommendJourneyCities(
      { interests: ["nature"] },
      [laterCity, earlierCity],
    );

    expect(results.map((result) => result.citySlug)).toEqual(["nanjing", "suzhou"]);
  });

  it("uses favorites only for the saved flag, never score or order", () => {
    const withoutFavorites = recommendJourneyCities({ interests: ["food"] });
    const savedSlug = withoutFavorites[1].citySlug;
    const withFavorite = recommendJourneyCities({
      interests: ["food"],
      favoriteCities: [savedSlug],
    });

    expect(withFavorite.map(({ citySlug, score }) => ({ citySlug, score }))).toEqual(
      withoutFavorites.map(({ citySlug, score }) => ({ citySlug, score })),
    );
    expect(withoutFavorites.every((result) => !result.saved)).toBe(true);
    expect(withFavorite.find((result) => result.citySlug === savedSlug)?.saved).toBe(true);
  });

  it("is identical across ten runs with the same input", () => {
    const input = { interests: ["history", "waterways"] as JourneyInterest[] };
    const expected = recommendJourneyCities(input);

    for (let run = 0; run < 10; run += 1) {
      expect(recommendJourneyCities(input)).toEqual(expected);
    }
  });

  it("respects a finite limit and safely handles invalid limits", () => {
    expect(recommendJourneyCities({ interests: ["heritage"], limit: 2 })).toHaveLength(2);
    expect(recommendJourneyCities({ interests: ["heritage"], limit: 0 })).toEqual([]);
    expect(recommendJourneyCities({ interests: ["heritage"], limit: Number.NaN })).toHaveLength(
      DEFAULT_RECOMMENDATION_LIMIT,
    );
  });

  it("ignores invalid interests without crashing", () => {
    const invalidInterests = ["invalid-interest"] as unknown as JourneyInterest[];
    expect(recommendJourneyCities({ interests: invalidInterests })).toEqual([]);
  });

  it("skips cities that have no matching section and retains low-scoring empty sections", () => {
    const missing = createCity("nanjing", 1, [createSection("food")]);
    const empty = createCity("suzhou", 2, [
      createSection("history", { intro: "", highlights: [] }),
    ]);

    const results = recommendJourneyCities({ interests: ["history"] }, [missing, empty]);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ citySlug: "suzhou", score: 1 });
  });

  it("produces valid grounded reasons from all five interests in real city data", () => {
    const allInterests: JourneyInterest[] = [
      "nature",
      "history",
      "heritage",
      "food",
      "waterways",
    ];
    const results = recommendJourneyCities({ interests: allInterests });

    expect(results).toHaveLength(DEFAULT_RECOMMENDATION_LIMIT);
    for (const result of results) {
      expect(cityBySlug.has(result.citySlug)).toBe(true);
      expect(Number.isFinite(result.score)).toBe(true);
      expect(result.score).toBeGreaterThan(0);
      expect(new Set(result.matchedInterests).size).toBe(result.matchedInterests.length);
      expect(result.reasons).toHaveLength(result.matchedInterests.length);

      const city = cityBySlug.get(result.citySlug);
      expect(city).toBeDefined();
      for (const reason of result.reasons) {
        const section = city?.sections.find((candidate) => candidate.id === reason.interest);
        const firstHighlight = section?.highlights[0];
        expect(section).toBeDefined();
        expect(reason.evidence.zh).toBeTruthy();
        expect(reason.evidence.en).toBeTruthy();
        if (firstHighlight) {
          expect(reason.evidence.zh).toContain(firstHighlight.title.zh);
          expect(reason.evidence.en).toContain(firstHighlight.title.en);
        }
      }
    }
  });
});
