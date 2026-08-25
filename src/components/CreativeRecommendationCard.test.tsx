import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CreativeRecommendationBlock } from "@/components/CreativeRecommendationCard";
import { recommendCreativeProjects } from "@/lib/creative-recommendation";

function renderBlock(language: "zh" | "en", question = "有什么文创？") {
  const recommendations = recommendCreativeProjects({ question, retrievalResults: [] });
  return renderToStaticMarkup(
    <MemoryRouter>
      <CreativeRecommendationBlock
        language={language}
        onNavigate={vi.fn()}
        recommendations={recommendations}
      />
    </MemoryRouter>,
  );
}

describe("ShuiLing creative recommendation block", () => {
  it("renders the published project, real cover, factual reason, and detail route", () => {
    const html = renderBlock("zh");

    expect(html).toContain("相关文创");
    expect(html).toContain("一水灵韵，万国舟行");
    expect(html).toContain("已收录文创作品");
    expect(html).toContain("cover-overview.webp");
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('href="/creative/water-spirit-global-voyage"');
    expect(html).toContain("查看作品");
    expect(html).not.toContain("购买");
    expect(html).not.toContain("猜你喜欢");
  });

  it("renders deterministic English labels without commerce language", () => {
    const html = renderBlock("en");

    expect(html).toContain("Related Creative Work");
    expect(html).toContain("Yi Shui Ling Yun, Global Voyages");
    expect(html).toContain("A published creative work in the archive");
    expect(html).toContain("View Project");
    expect(html).not.toContain("Buy");
    expect(html).not.toContain("Recommended For You");
  });

  it("renders no section when there is no deterministic match", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <CreativeRecommendationBlock language="zh" onNavigate={vi.fn()} recommendations={[]} />
      </MemoryRouter>,
    );

    expect(html).toBe("");
  });
});
