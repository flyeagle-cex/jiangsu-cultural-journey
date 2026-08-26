// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ShuiLingJourneyRecommendationsCard } from "@/components/ShuiLingJourneyRecommendationsCard";
import { cityBySlug } from "@/data/cities";
import { recommendJourneyCities } from "@/lib/journey-recommendation";
import type { JourneyInterest } from "@/types/user-preferences";

function renderCard({
  favoriteCities = [],
  interests,
  language = "zh",
}: {
  favoriteCities?: Parameters<typeof recommendJourneyCities>[0]["favoriteCities"];
  interests: JourneyInterest[];
  language?: "zh" | "en";
}) {
  const recommendations = recommendJourneyCities({ interests, favoriteCities });
  return renderToStaticMarkup(
    <MemoryRouter>
      <ShuiLingJourneyRecommendationsCard
        interests={interests}
        language={language}
        onNavigate={vi.fn()}
        recommendations={recommendations}
      />
    </MemoryRouter>,
  );
}

describe("ShuiLingJourneyRecommendationsCard", () => {
  it("renders ranked grounded Chinese recommendations with deterministic routes", () => {
    const html = renderCard({
      favoriteCities: ["nanjing"],
      interests: ["history"],
    });
    const expected = recommendJourneyCities({
      interests: ["history"],
      favoriteCities: ["nanjing"],
    });
    const topCity = expected[0];
    const topCityData = topCity ? cityBySlug.get(topCity.citySlug) : undefined;
    const firstEvidence = topCity?.reasons[0]?.evidence.zh;

    expect(topCityData).toBeDefined();
    expect(html).toContain("水灵的兴趣推荐");
    expect(html).toContain("在本地计算生成");
    expect(html).toContain("依据你选择的兴趣");
    expect(html).toContain("历史文化");
    expect(html).toContain(`data-personalized-city="${topCity?.citySlug}"`);
    expect(html).toContain(`href="/city/${topCity?.citySlug}"`);
    expect(html).toContain(topCityData?.name.zh);
    expect(html).toContain(firstEvidence);
    expect(html).toContain('href="/user"');
    expect(html).not.toContain("score");
  });

  it("shows a textual saved indicator without adding a favorite control", () => {
    const html = renderCard({
      favoriteCities: ["nanjing"],
      interests: ["history"],
    });

    expect(html).toContain('data-personalized-city-saved="true"');
    expect(html).toContain("已收藏");
    expect(html).not.toContain("data-favorite-state");
    expect(html).not.toContain("取消收藏");
  });

  it("limits evidence to two reasons while retaining all matched interest labels", () => {
    const interests: JourneyInterest[] = [
      "nature",
      "history",
      "heritage",
      "food",
      "waterways",
    ];
    const html = renderCard({ interests });
    const document = new DOMParser().parseFromString(html, "text/html");
    const cityItems = document.querySelectorAll("[data-personalized-city]");

    expect(cityItems).toHaveLength(3);
    for (const cityItem of cityItems) {
      expect(cityItem.querySelectorAll("[data-personalization-reason]")).toHaveLength(2);
      expect(cityItem.textContent).toContain("自然风光");
      expect(cityItem.textContent).toContain("历史文化");
      expect(cityItem.textContent).toContain("非遗技能");
      expect(cityItem.textContent).toContain("特色美食");
      expect(cityItem.textContent).toContain("大运河与水系");
    }
  });

  it("renders the local empty state with a Manage Interests route", () => {
    const html = renderCard({ interests: [] });

    expect(html).toContain('data-journey-personalization="empty"');
    expect(html).toContain("你还没有设置兴趣主题");
    expect(html).toContain("设置兴趣");
    expect(html).toContain('href="/user"');
    expect(html).not.toContain("data-personalized-city=");
  });

  it("renders complete English labels, reasons, saved state, and links", () => {
    const html = renderCard({
      favoriteCities: ["nanjing"],
      interests: ["history", "waterways"],
      language: "en",
    });

    expect(html).toContain("Shuiling&#x27;s Interest-based Suggestions");
    expect(html).toContain("Based on your interests");
    expect(html).toContain("Matched interests");
    expect(html).toContain("Why this fits");
    expect(html).toContain("Saved");
    expect(html).toContain("View Full Suggestions");
    expect(html).toContain("Matches your interest in History &amp; Culture");
    expect(html).toContain('href="/city/nanjing"');
    expect(html).toContain('href="/user"');
  });
});
