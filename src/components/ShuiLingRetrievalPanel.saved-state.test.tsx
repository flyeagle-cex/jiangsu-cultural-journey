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

function SavedStateControls() {
  const { toggleCity } = useSavedItems();
  return (
    <button data-testid="toggle-nanjing" onClick={() => toggleCity("nanjing")} type="button">
      Toggle Nanjing
    </button>
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
            <SavedStateControls />
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

describe("ShuiLingRetrievalPanel saved-state orchestration", () => {
  it("answers My Favorites locally and reflects same-tab Context updates", async () => {
    await renderPanel({
      version: 1,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
    });

    await submitQuery("我的收藏");

    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
    expect(document.querySelector('[data-saved-state-intent="all"]')).not.toBeNull();
    expect(document.querySelector('[href="/city/nanjing"]')).not.toBeNull();
    expect(document.querySelector('[href="/city/suzhou"]')).not.toBeNull();
    expect(
      document.querySelector('[href="/creative/water-spirit-global-voyage"]'),
    ).not.toBeNull();
    expect(document.querySelector('[href="/user"]')).not.toBeNull();

    const toggle = document.querySelector<HTMLButtonElement>('[data-testid="toggle-nanjing"]');
    await act(async () => toggle?.click());
    expect(document.querySelector('[href="/city/nanjing"]')).toBeNull();
    expect(document.querySelector('[href="/city/suzhou"]')).not.toBeNull();
  });

  it("returns a local empty state without retrieval or chat requests", async () => {
    await renderPanel({
      version: 1,
      favoriteCities: [],
      favoriteCreativeProjects: [],
    });

    await submitQuery("我的收藏");

    expect(document.body.textContent).toContain("你还没有收藏城市或文创");
    expect(document.querySelector('[href="/#cities"]')).not.toBeNull();
    expect(document.querySelector('[href="/creative"]')).not.toBeNull();
    expect(mocks.search).not.toHaveBeenCalled();
    expect(mocks.answer).not.toHaveBeenCalled();
  });

  it.each(["南京有哪些代表性非遗？", "有什么文创？"])(
    "keeps the existing retrieval pipeline for %s",
    async (query) => {
      mocks.search.mockResolvedValue(emptyRetrieval(query));
      await renderPanel({
        version: 1,
        favoriteCities: ["nanjing"],
        favoriteCreativeProjects: [],
      });

      await submitQuery(query);

      expect(mocks.search).toHaveBeenCalledTimes(1);
      expect(mocks.search).toHaveBeenCalledWith(query, {
        currentCity: undefined,
        topK: 5,
      });
      expect(document.querySelector("[data-saved-state-intent]")).toBeNull();
    },
  );
});
