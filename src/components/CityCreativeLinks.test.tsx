import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { CityCreativeLinks } from "@/components/CityCreativeLinks";
import { LanguageProvider } from "@/context/LanguageContext";
import { creativeManifest } from "@/data/creative-manifest";

function renderCityCreativeLinks(
  projects?: Parameters<typeof CityCreativeLinks>[0]["projects"],
) {
  return renderToStaticMarkup(
    <LanguageProvider>
      <MemoryRouter>
        <CityCreativeLinks citySlug="suzhou" projects={projects} />
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe("city creative links", () => {
  it("renders no visible section for the current Jiangsu-wide project", () => {
    expect(renderCityCreativeLinks()).toBe("");
  });

  it("automatically renders a future explicitly linked published project", () => {
    const currentProject = creativeManifest[0];
    const suzhouProject = {
      ...currentProject,
      slug: "future-suzhou" as unknown as typeof currentProject.slug,
      scope: "city" as const,
      citySlugs: ["suzhou" as const],
    };
    const html = renderCityCreativeLinks([suzhouProject]);

    expect(html).toContain("城市文创");
    expect(html).toContain("一水灵韵，万国舟行");
    expect(html).toContain("cover-overview.webp");
    expect(html).toContain('href="/creative/future-suzhou"');
    expect(html).not.toContain("暂无");
  });
});
