import { describe, expect, it } from "vitest";

import { cityManifest } from "@/data/city-manifest";
import { KNOWLEDGE_CITY_SLUGS, KNOWLEDGE_SECTIONS } from "@/rag/types";

describe("knowledge corpus types", () => {
  it("reuses all 13 existing city slugs", () => {
    expect(KNOWLEDGE_CITY_SLUGS).toEqual(cityManifest.map((city) => city.slug));
    expect(new Set(KNOWLEDGE_CITY_SLUGS).size).toBe(13);
  });

  it("exposes the complete and unique knowledge section set", () => {
    expect(KNOWLEDGE_SECTIONS).toEqual([
      "overview",
      "nature",
      "history",
      "heritage",
      "food",
      "waterways",
      "route",
      "story",
      "reference",
      "other",
    ]);
    expect(new Set(KNOWLEDGE_SECTIONS).size).toBe(KNOWLEDGE_SECTIONS.length);
  });
});
