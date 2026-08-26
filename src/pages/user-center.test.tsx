// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, matchRoutes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/context/LanguageContext";
import { UserSavedStateProvider } from "@/context/UserSavedStateContext";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import UserCenterPage, { USER_CENTER_PATH } from "@/pages/UserCenterPage";

function createStorage(state: unknown): UserSavedStateStorage {
  const serialized = JSON.stringify(state);
  return {
    getItem: (key) => (key === USER_SAVED_STATE_KEY ? serialized : null),
    setItem: () => undefined,
    removeItem: () => undefined,
  };
}

function renderUserCenter(language: "zh" | "en", state: unknown) {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => (key === LANGUAGE_STORAGE_KEY ? language : null),
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[USER_CENTER_PATH]}>
      <LanguageProvider>
        <UserSavedStateProvider storage={createStorage(state)}>
          <UserCenterPage />
        </UserSavedStateProvider>
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("User Center page", () => {
  it("matches the /user route and renders both empty states without seed data", () => {
    expect(matchRoutes([{ path: USER_CENTER_PATH }], USER_CENTER_PATH)?.at(-1)?.route.path).toBe(
      USER_CENTER_PATH,
    );

    const html = renderUserCenter("zh", {
      version: 1,
      favoriteCities: [],
      favoriteCreativeProjects: [],
    });

    expect(html).toContain("我的灵舟之旅");
    expect(html).toContain("我的兴趣主题");
    expect(html).toContain("选择你更感兴趣的文化主题");
    expect(html).toContain("兴趣探索建议");
    expect(html).toContain("选择至少一个兴趣主题后");
    expect(html).toContain('data-city-ambient="user"');
    expect(html).toContain('data-skyline="jiangsu-journey"');
    expect(html).toContain("运河桥、塔影与江南水岸");
    expect(html).toContain("还没有收藏城市。");
    expect(html).toContain("还没有收藏文创作品。");
    expect(html).toContain('href="/#cities"');
    expect(html).toContain('href="/creative"');
    expect(html).toContain("收藏与兴趣偏好仅保存在当前浏览器中，不会上传个人信息。");
    const document = new DOMParser().parseFromString(html, "text/html");
    const interestButtons = document.querySelectorAll("[data-interest]");
    expect(interestButtons).toHaveLength(5);
    expect([...interestButtons].every((button) => button.getAttribute("aria-pressed") === "false"))
      .toBe(true);
  });

  it("renders saved cities in canonical order with real media and correct links", () => {
    const html = renderUserCenter("zh", {
      version: 1,
      favoriteCities: ["suzhou", "fake-city", "nanjing", "suzhou"],
      favoriteCreativeProjects: [],
    });

    expect(html).toContain('data-saved-city="nanjing"');
    expect(html).toContain('data-saved-city="suzhou"');
    expect(html.indexOf('data-saved-city="nanjing"')).toBeLessThan(
      html.indexOf('data-saved-city="suzhou"'),
    );
    expect(html).toContain("/assets/cities/nanjing.jpeg");
    expect(html).toContain('href="/city/nanjing"');
    expect(html).toContain('href="/city/suzhou"');
    expect(html).not.toContain("fake-city");
  });

  it("renders only the saved published creative project from the manifest", () => {
    const html = renderUserCenter("zh", {
      version: 1,
      favoriteCities: [],
      favoriteCreativeProjects: ["fake-creative", "water-spirit-global-voyage"],
    });

    expect(html).toContain('data-saved-creative="water-spirit-global-voyage"');
    expect(html).toContain("一水灵韵，万国舟行");
    expect(html).toContain("cover-overview.webp");
    expect(html).toContain('href="/creative/water-spirit-global-voyage"');
    expect(html).not.toContain("fake-creative");
  });

  it("renders the English labels and browser-only privacy notice", () => {
    const html = renderUserCenter("en", {
      version: 2,
      favoriteCities: [],
      favoriteCreativeProjects: [],
      interests: ["history", "food"],
    });

    expect(html).toContain("My Shuiling Journey");
    expect(html).toContain("My Interests");
    expect(html).toContain("Interest-based Suggestions");
    expect(html).toContain("Why this fits");
    expect(html).toContain("Nature");
    expect(html).toContain("History &amp; Culture");
    expect(html).toContain("Living Heritage");
    expect(html).toContain("Local Food");
    expect(html).toContain("Grand Canal &amp; Waterways");
    expect(html).toContain("Clear Interests");
    expect(html).toContain("Saved Cities");
    expect(html).toContain("Saved Creative Works");
    expect(html).toContain("No cities saved yet.");
    expect(html).toContain("No creative works saved yet.");
    expect(html).toContain(
      "Saved items and interests stay in this browser. No personal information is uploaded.",
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelector('[data-interest="history"]')?.getAttribute("aria-pressed"))
      .toBe("true");
    expect(document.querySelector('[data-interest="food"]')?.getAttribute("aria-pressed"))
      .toBe("true");
    expect(document.querySelector('[data-interest="nature"]')?.getAttribute("aria-pressed"))
      .toBe("false");
    const interestsSection = html.indexOf('data-user-interests="true"');
    const recommendationsSection = html.indexOf('data-journey-recommendations="ready"');
    const savedCitiesSection = html.indexOf('id="saved-cities-heading"');
    expect(interestsSection).toBeLessThan(recommendationsSection);
    expect(recommendationsSection).toBeLessThan(savedCitiesSection);
  });
});
