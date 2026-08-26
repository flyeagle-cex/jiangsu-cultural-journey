// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { JourneyRecommendations } from "@/components/JourneyRecommendations";
import { UserInterestSelector } from "@/components/UserInterestSelector";
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/context/LanguageContext";
import { UserSavedStateProvider } from "@/context/UserSavedStateContext";
import { cityBySlug } from "@/data/cities";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function createStorage(state: unknown): UserSavedStateStorage {
  let serialized = JSON.stringify(state);
  return {
    getItem: (key) => (key === USER_SAVED_STATE_KEY ? serialized : null),
    setItem: (key, value) => {
      if (key === USER_SAVED_STATE_KEY) serialized = value;
    },
    removeItem: (key) => {
      if (key === USER_SAVED_STATE_KEY) serialized = "";
    },
  };
}

function setLanguage(language: "zh" | "en") {
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
}

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

async function renderRecommendations(
  state: unknown,
  language: "zh" | "en" = "zh",
  withInterestSelector = false,
) {
  setLanguage(language);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(
      <MemoryRouter>
        <LanguageProvider>
          <UserSavedStateProvider storage={createStorage(state)}>
            {withInterestSelector && <UserInterestSelector />}
            <JourneyRecommendations />
          </UserSavedStateProvider>
        </LanguageProvider>
      </MemoryRouter>,
    );
  });

  return container;
}

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("JourneyRecommendations", () => {
  it("shows transparent zero-interest guidance instead of fake suggestions", async () => {
    const view = await renderRecommendations({
      version: 2,
      favoriteCities: [],
      favoriteCreativeProjects: [],
      interests: [],
    });

    expect(view.querySelector('[data-journey-recommendations="empty"]')).not.toBeNull();
    expect(view.textContent).toContain("兴趣探索建议");
    expect(view.textContent).toContain("选择至少一个兴趣主题后");
    expect(view.querySelectorAll("[data-recommended-city]")).toHaveLength(0);
  });

  it("renders three grounded city suggestions, links, and a presentation-only saved label", async () => {
    const view = await renderRecommendations({
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });
    const cards = view.querySelectorAll("[data-recommended-city]");

    expect(cards).toHaveLength(3);
    expect(cards[0].getAttribute("data-recommended-city")).toBe("nanjing");
    expect(cards[0].getAttribute("data-recommendation-saved")).toBe("true");
    expect(cards[0].textContent).toContain("已收藏");
    const firstHistoryHighlight = cityBySlug
      .get("nanjing")
      ?.sections.find((section) => section.id === "history")
      ?.highlights[0];
    expect(firstHistoryHighlight).toBeDefined();
    expect(cards[0].textContent).toContain(firstHistoryHighlight?.title.zh);
    expect(cards[0].querySelector('a[href="/city/nanjing"]')).not.toBeNull();
    expect([...cards].every((card) => card.textContent?.includes("推荐依据"))).toBe(true);
  });

  it("switches bilingual labels and evidence without changing the ranked city order", async () => {
    const zhView = await renderRecommendations({
      version: 2,
      favoriteCities: [],
      favoriteCreativeProjects: [],
      interests: ["food"],
    });
    const zhOrder = [...zhView.querySelectorAll("[data-recommended-city]")].map((card) =>
      card.getAttribute("data-recommended-city"),
    );

    act(() => root?.unmount());
    container?.remove();
    root = null;
    container = null;

    const enView = await renderRecommendations(
      {
        version: 2,
        favoriteCities: [],
        favoriteCreativeProjects: [],
        interests: ["food"],
      },
      "en",
    );
    const enOrder = [...enView.querySelectorAll("[data-recommended-city]")].map((card) =>
      card.getAttribute("data-recommended-city"),
    );

    expect(enView.textContent).toContain("Interest-based Suggestions");
    expect(enView.textContent).toContain("Why this fits");
    expect(enView.textContent).toContain("Matches your interest in Local Food");
    expect(enOrder).toEqual(zhOrder);
  });

  it("recomputes immediately when interests are selected or cleared", async () => {
    const view = await renderRecommendations(
      {
        version: 2,
        favoriteCities: [],
        favoriteCreativeProjects: [],
        interests: [],
      },
      "zh",
      true,
    );
    const historyButton = view.querySelector<HTMLButtonElement>('[data-interest="history"]');
    const foodButton = view.querySelector<HTMLButtonElement>('[data-interest="food"]');

    expect(historyButton).not.toBeNull();
    expect(foodButton).not.toBeNull();
    await act(async () => historyButton?.click());
    const historyTop = view
      .querySelector("[data-recommended-city]")
      ?.getAttribute("data-recommended-city");

    await act(async () => historyButton?.click());
    expect(view.querySelectorAll("[data-recommended-city]")).toHaveLength(0);

    await act(async () => foodButton?.click());
    const foodTop = view
      .querySelector("[data-recommended-city]")
      ?.getAttribute("data-recommended-city");

    expect(historyTop).toBe("nanjing");
    expect(foodTop).not.toBe(historyTop);

    const clearButton = [...view.querySelectorAll<HTMLButtonElement>("button")].find(
      (button) => button.textContent === "清除兴趣",
    );
    await act(async () => clearButton?.click());
    expect(view.querySelector('[data-journey-recommendations="empty"]')).not.toBeNull();
  });
});
