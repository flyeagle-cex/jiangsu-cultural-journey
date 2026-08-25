import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes, matchRoutes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { LanguageProvider } from "@/context/LanguageContext";
import {
  CREATIVE_CENTER_PATH,
  CREATIVE_DETAIL_PATH,
  getCreativeProjectPath,
} from "@/lib/creative";
import CreativeCenterPage from "@/pages/CreativeCenterPage";
import CreativeDetailPage from "@/pages/CreativeDetailPage";

function renderAt(path: string, element: React.ReactNode) {
  return renderToStaticMarkup(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>
    </LanguageProvider>,
  );
}

describe("creative routes and page states", () => {
  it("matches the center and detail route patterns", () => {
    const routeDefinitions = [{ path: CREATIVE_CENTER_PATH }, { path: CREATIVE_DETAIL_PATH }];

    expect(matchRoutes(routeDefinitions, CREATIVE_CENTER_PATH)?.at(-1)?.route.path).toBe(
      CREATIVE_CENTER_PATH,
    );
    expect(
      matchRoutes(routeDefinitions, getCreativeProjectPath("water-spirit-global-voyage"))?.at(-1)
        ?.params.slug,
    ).toBe("water-spirit-global-voyage");
  });

  it("renders the Creative Center with the official project", () => {
    const html = renderAt(CREATIVE_CENTER_PATH, <CreativeCenterPage />);

    expect(html).toContain("文创中心");
    expect(html).toContain("一水灵韵，万国舟行");
    expect(html).toContain("cover-overview.webp");
    expect(html).toContain('fetchPriority="high"');
  });

  it("renders the real cover and all gallery groups without placeholder copy", () => {
    const path = getCreativeProjectPath("water-spirit-global-voyage");
    const html = renderAt(
      path,
      <Routes>
        <Route element={<CreativeDetailPage />} path={CREATIVE_DETAIL_PATH} />
      </Routes>,
    );

    expect(html).toContain("一水灵韵，万国舟行");
    expect(html).toContain("cover-overview.webp");
    expect(html).toContain("gift-set.webp");
    expect(html).toContain("collection-overview.webp");
    expect(html).toContain("packaging-box.webp");
    expect(html).toContain("cap.webp");
    expect(html).toContain("phone-cases.webp");
    expect(html).toContain("mugs.webp");
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain("暂无可公开加载的 Gallery 素材");
    expect(html).not.toContain("待用户补充");
    expect(html).not.toContain("Stage 8B");
  });

  it("renders a recoverable not-found state for an unknown slug", () => {
    const html = renderAt(
      "/creative/unknown-project",
      <Routes>
        <Route element={<CreativeDetailPage />} path={CREATIVE_DETAIL_PATH} />
      </Routes>,
    );

    expect(html).toContain("未找到这件文创作品");
    expect(html).toContain("返回文创中心");
  });
});
