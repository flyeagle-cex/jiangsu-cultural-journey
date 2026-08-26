// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { ShuiLingRetrievalPanel } from "@/components/ShuiLingRetrievalPanel";
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/context/LanguageContext";
import {
  UserSavedStateProvider,
  useSavedItems,
} from "@/context/UserSavedStateContext";
import { recommendJourneyCities } from "@/lib/journey-recommendation";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import type { RetrievalResponse } from "@/rag/types";

const mocks = vi.hoisted(() => ({
  answer: vi.fn(),
  search: vi.fn(),
}));

vi.mock("@/assistant/api", () => ({
  requestShuiLingAnswer: mocks.answer,
  ShuiLingApiError: class ShuiLingApiError extends Error {
    code = "DEEPSEEK_UPSTREAM_ERROR" as const;
  },
}));

vi.mock("@/rag/retrieval", () => ({
  searchKnowledge: mocks.search,
}));

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

function emptyRetrieval(query: string): RetrievalResponse {
  return {
    normalizedQuery: query,
    results: [],
    scope: {
      kind: "all",
      citySlugs: [],
      explicitCitySlugs: [],
      isGlobalIntent: false,
      usesCurrentCity: false,
    },
    fellBackToGlobal: false,
    elapsedMs: 1,
  };
}

function PreferenceControls() {
  const { toggleInterest } = useSavedItems();
  return (
    <>
      <button data-testid="toggle-history" onClick={() => toggleInterest("history")} type="button">
        Toggle history
      </button>
      <button data-testid="toggle-food" onClick={() => toggleInterest("food")} type="button">
        Toggle food
      </button>
    </>
  );
}

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

async function renderPanel(state: unknown) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(
      <MemoryRouter>
        <LanguageProvider>
          <UserSavedStateProvider storage={createStorage(state)}>
            <PreferenceControls />
            <ShuiLingRetrievalPanel onOpenChange={vi.fn()} open />
          </UserSavedStateProvider>
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
}

async function submitQuery(query: string) {
  const input = document.querySelector<HTMLInputElement>("#shuiling-retrieval-query");
  expect(input).not.toBeNull();
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  await act(async () => {
    valueSetter?.call(input, query);
    input?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await act(async () => {
    input?.closest("form")?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    await Promise.resolve();
  });
}

function personalizedCityOrder() {
  return [...document.querySelectorAll<HTMLElement>("[data-personalized-city]")].map(
    (item) => item.dataset.personalizedCity,
  );
}

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => (key === LANGUAGE_STORAGE_KEY ? "zh" : null),
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.cancelAnimationFrame = (handle) => window.clearTimeout(handle);
});

beforeEach(() => {
  mocks.answer.mockReset();
  mocks.search.mockReset();
});

afterEach(() => {
  if (root) act(() => root?.unmount());
  document.body.innerHTML = "";
  root = null;
  container = null;
});

describe("ShuiLingRetrievalPanel personalization orchestration", () => {
  it("renders the Stage 10B history ranking locally without RAG or DeepSeek", async () => {
    await renderPanel({
      version: 2,
      favoriteCities: [],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });

    await submitQuery("根据我的兴趣推荐城市");

    const expected = recommendJourneyCities({
      interests: ["history"],
      favoriteCities: [],
      limit: 3,
    }).map((result) => result.citySlug);
    expect(personalizedCityOrder()).toEqual(expected);
    expect(document.querySelector('[data-journey-personalization="results"]')).not.toBeNull();
    expect(document.querySelectorAll("[data-personalized-city]")).toHaveLength(3);
    expect(document.querySelector('[data-creative-recommendation-count]')).toBeNull();
    expect(document.querySelector('[data-assistant-phase="answered"]')).not.toBeNull();
    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
  });

  it("keeps favorites presentation-only and preserves recommendation order", async () => {
    await renderPanel({
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });

    await submitQuery("按我的兴趣推荐几个江苏城市");

    const expected = recommendJourneyCities({
      interests: ["history"],
      favoriteCities: [],
    }).map((result) => result.citySlug);
    expect(personalizedCityOrder()).toEqual(expected);
    expect(
      document.querySelector('[data-personalized-city="nanjing"]')
        ?.getAttribute("data-personalized-city-saved"),
    ).toBe("true");
    expect(document.body.textContent).toContain("已收藏");
  });

  it("shows a local no-interest state even when cities are saved", async () => {
    await renderPanel({
      version: 2,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: [],
      interests: [],
    });

    await submitQuery("根据我的兴趣推荐城市");

    expect(document.querySelector('[data-journey-personalization="empty"]')).not.toBeNull();
    expect(document.body.textContent).toContain("你还没有设置兴趣主题");
    expect(document.querySelector('[href="/user"]')).not.toBeNull();
    expect(document.querySelector("[data-personalized-city]")).toBeNull();
    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
  });

  it("recomputes the active local result from live Context interests", async () => {
    await renderPanel({
      version: 2,
      favoriteCities: [],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });
    await submitQuery("根据我的兴趣推荐城市");

    const historyTop = personalizedCityOrder()[0];
    const toggleHistory = document.querySelector<HTMLButtonElement>('[data-testid="toggle-history"]');
    const toggleFood = document.querySelector<HTMLButtonElement>('[data-testid="toggle-food"]');
    await act(async () => toggleHistory?.click());
    expect(document.querySelector('[data-journey-personalization="empty"]')).not.toBeNull();

    await act(async () => toggleFood?.click());
    const expectedFoodOrder = recommendJourneyCities({ interests: ["food"] }).map(
      (result) => result.citySlug,
    );
    expect(personalizedCityOrder()).toEqual(expectedFoodOrder);
    expect(personalizedCityOrder()[0]).not.toBe(historyTop);
    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
  });

  it("preserves saved-state priority and clears the previous personalization result", async () => {
    await renderPanel({
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });
    await submitQuery("根据我的兴趣推荐城市");
    expect(document.querySelector("[data-journey-personalization]")).not.toBeNull();

    await submitQuery("我的收藏");

    expect(document.querySelector('[data-saved-state-intent="all"]')).not.toBeNull();
    expect(document.querySelector("[data-journey-personalization]")).toBeNull();
    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
  });

  it.each([
    "南京有哪些代表性非遗？",
    "推荐几个江苏城市",
    "有什么文创？",
  ])("keeps the existing non-personalized pipeline for %s", async (query) => {
    mocks.search.mockResolvedValue(emptyRetrieval(query));
    await renderPanel({
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: [],
      interests: ["history"],
    });

    await submitQuery(query);

    expect(mocks.search).toHaveBeenCalledTimes(1);
    expect(mocks.search).toHaveBeenCalledWith(query, {
      currentCity: undefined,
      topK: 5,
    });
    expect(document.querySelector("[data-journey-personalization]")).toBeNull();
  });
});
