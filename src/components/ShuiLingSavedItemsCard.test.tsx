// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ShuiLingSavedItemsCard } from "@/components/ShuiLingSavedItemsCard";
import { buildSavedStateResult } from "@/lib/shuiling-saved-state";

function renderCard(
  language: "zh" | "en",
  intent: "all" | "cities" | "creative",
  favoriteCities: string[],
  favoriteCreativeProjects: string[],
) {
  const result = buildSavedStateResult(intent, {
    favoriteCities,
    favoriteCreativeProjects,
  });

  return renderToStaticMarkup(
    <MemoryRouter>
      <ShuiLingSavedItemsCard language={language} onNavigate={vi.fn()} result={result} />
    </MemoryRouter>,
  );
}

describe("ShuiLingSavedItemsCard", () => {
  it("renders combined saved items with deterministic routes", () => {
    const html = renderCard(
      "zh",
      "all",
      ["suzhou", "nanjing"],
      ["water-spirit-global-voyage"],
    );

    expect(html).toContain("我的收藏");
    expect(html).toContain("收藏城市");
    expect(html).toContain("收藏文创");
    expect(html).toContain('data-saved-city="nanjing"');
    expect(html).toContain('href="/city/nanjing"');
    expect(html).toContain('href="/city/suzhou"');
    expect(html.indexOf("南京")).toBeLessThan(html.indexOf("苏州"));
    expect(html).toContain('data-saved-creative="water-spirit-global-voyage"');
    expect(html).toContain('href="/creative/water-spirit-global-voyage"');
    expect(html).toContain('href="/user"');
  });

  it("renders the all-items empty response with both discovery routes", () => {
    const html = renderCard("zh", "all", [], []);

    expect(html).toContain("你还没有收藏城市或文创");
    expect(html).toContain('href="/#cities"');
    expect(html).toContain('href="/creative"');
    expect(html).toContain("查看全部收藏");
  });

  it("renders a partial empty state without hiding saved cities", () => {
    const html = renderCard("zh", "all", ["nanjing"], []);

    expect(html).toContain('data-saved-city="nanjing"');
    expect(html).toContain("你还没有收藏文创作品。");
    expect(html).not.toContain("你还没有收藏城市或文创。");
  });

  it("renders the targeted English creative empty state", () => {
    const html = renderCard("en", "creative", [], []);

    expect(html).toContain("My Saved Journey");
    expect(html).toContain("Saved Creative Works");
    expect(html).toContain("You haven&#x27;t saved any creative works yet.");
    expect(html).not.toContain("Saved Cities");
    expect(html).toContain("View My Journey");
  });
});
