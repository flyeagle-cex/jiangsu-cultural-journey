import { describe, expect, it } from "vitest";

import {
  GRAND_CANAL_CITY_SLUGS,
  getAdjacentMapCity,
  getMapCity,
  withSelectedMapCity,
} from "@/lib/map-explorer";

describe("map explorer selection", () => {
  it("resolves URL selections and safely falls back to the first city", () => {
    expect(getMapCity("yangzhou").name.en).toBe("Yangzhou");
    expect(getMapCity("not-a-city").slug).toBe("nanjing");
    expect(getMapCity(null).slug).toBe("nanjing");
  });

  it("moves through the city register with wraparound", () => {
    expect(getAdjacentMapCity("nanjing", -1).slug).toBe("lianyungang");
    expect(getAdjacentMapCity("lianyungang", 1).slug).toBe("nanjing");
    expect(getAdjacentMapCity("suzhou", 1).slug).toBe("wuxi");
  });

  it("preserves unrelated URL state when selecting a city", () => {
    const current = new URLSearchParams("theme=canal&lang=en");
    const next = withSelectedMapCity(current, "suzhou");

    expect(next.get("city")).toBe("suzhou");
    expect(next.get("theme")).toBe("canal");
    expect(next.get("lang")).toBe("en");
    expect(current.has("city")).toBe(false);
  });

  it("defines the eight Jiangsu cities used by the schematic canal axis", () => {
    expect(GRAND_CANAL_CITY_SLUGS).toEqual([
      "suzhou",
      "wuxi",
      "changzhou",
      "zhenjiang",
      "yangzhou",
      "huaian",
      "suqian",
      "xuzhou",
    ]);
  });
});
