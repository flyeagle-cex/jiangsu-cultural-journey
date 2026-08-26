import { describe, expect, it } from "vitest";

import { detectJourneyPersonalizationIntent } from "@/lib/shuiling-personalization";

describe("detectJourneyPersonalizationIntent", () => {
  it.each([
    "根据我的兴趣推荐城市",
    "根据我的兴趣推荐几个城市",
    "按我的兴趣推荐城市",
    "按我的兴趣推荐几个江苏城市",
    "根据我的偏好推荐城市",
    "按照我的偏好推荐城市",
    "推荐适合我的城市",
    "推荐几个适合我的江苏城市",
    "我适合去哪座城市",
    "我适合去江苏哪个城市",
    "哪些城市适合我",
    "水灵，根据我的兴趣推荐一下",
  ])("detects the explicit Chinese personalization query %s", (query) => {
    expect(detectJourneyPersonalizationIntent(query)).toBe("city-recommendation");
  });

  it.each([
    "recommend cities based on my interests",
    "recommend a city based on my interests",
    "suggest cities based on my interests",
    "which cities fit my interests",
    "which Jiangsu cities fit my interests",
    "where should I go based on my interests",
    "recommend cities based on my preferences",
    "suggest a Jiangsu city for me based on my interests",
    "which Jiangsu cities fit me",
  ])("detects the explicit English personalization query %s", (query) => {
    expect(detectJourneyPersonalizationIntent(query)).toBe("city-recommendation");
  });

  it.each([
    "推荐几个江苏城市",
    "江苏有什么城市值得去",
    "第一次去江苏推荐去哪",
    "推荐历史文化城市",
    "推荐适合旅游的城市",
    "recommend some Jiangsu cities",
    "which Jiangsu cities should tourists visit",
    "recommend historical cities in Jiangsu",
    "recommend food based on my interests",
    "我的兴趣是什么",
    "我的收藏",
    "",
  ])("does not overmatch the non-personalized query %s", (query) => {
    expect(detectJourneyPersonalizationIntent(query)).toBeNull();
  });

  it("normalizes punctuation, whitespace, width, and letter case deterministically", () => {
    expect(
      detectJourneyPersonalizationIntent("  RECOMMEND   CITIES based on MY INTERESTS！ "),
    ).toBe("city-recommendation");
    expect(detectJourneyPersonalizationIntent("水灵， 按我的兴趣推荐几个江苏城市。"))
      .toBe("city-recommendation");
  });
});
