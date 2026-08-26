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

    expect(html).toContain("我的水韵");
    expect(html).toContain("还没有收藏城市。");
    expect(html).toContain("还没有收藏文创作品。");
    expect(html).toContain('href="/#cities"');
    expect(html).toContain('href="/creative"');
    expect(html).toContain("收藏仅保存在当前浏览器中，不会上传个人信息。");
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
      version: 1,
      favoriteCities: [],
      favoriteCreativeProjects: [],
    });

    expect(html).toContain("My Jiangsu Journey");
    expect(html).toContain("Saved Cities");
    expect(html).toContain("Saved Creative Works");
    expect(html).toContain("No cities saved yet.");
    expect(html).toContain("No creative works saved yet.");
    expect(html).toContain(
      "Saved items stay in this browser. No personal information is uploaded.",
    );
  });
});
