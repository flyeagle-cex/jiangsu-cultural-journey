// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { CityHero } from "@/components/CityHero";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserSavedStateProvider } from "@/context/UserSavedStateContext";
import { getCityBySlug } from "@/data/cities";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function createMemoryStorage() {
  let value: string | null = null;
  const storage: UserSavedStateStorage = {
    getItem: (key) => (key === USER_SAVED_STATE_KEY ? value : null),
    setItem: (key, nextValue) => {
      if (key === USER_SAVED_STATE_KEY) value = nextValue;
    },
    removeItem: (key) => {
      if (key === USER_SAVED_STATE_KEY) value = null;
    },
  };
  return { storage, read: () => JSON.parse(value ?? "null") };
}

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

beforeAll(() => {
  let language: string | null = "zh";
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: () => language,
      setItem: (_key: string, value: string) => {
        language = value;
      },
      removeItem: () => {
        language = null;
      },
      clear: () => {
        language = null;
      },
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("CityHero favorite action", () => {
  it("saves and removes Nanjing through the shared saved-state context", async () => {
    const city = getCityBySlug("nanjing");
    if (!city) throw new Error("Nanjing fixture is missing");
    const memory = createMemoryStorage();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <LanguageProvider>
            <UserSavedStateProvider storage={memory.storage}>
              <CityHero city={city} />
            </UserSavedStateProvider>
          </LanguageProvider>
        </MemoryRouter>,
      );
    });

    const button = container.querySelector<HTMLButtonElement>('button[aria-label="收藏南京"]');
    expect(button?.textContent).toContain("收藏城市");
    expect(button?.getAttribute("aria-pressed")).toBe("false");

    await act(async () => button?.click());
    expect(button?.textContent).toContain("已收藏");
    expect(button?.getAttribute("aria-label")).toBe("取消收藏南京");
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(memory.read().favoriteCities).toEqual(["nanjing"]);

    await act(async () => button?.click());
    expect(button?.textContent).toContain("收藏城市");
    expect(button?.getAttribute("aria-pressed")).toBe("false");
    expect(memory.read().favoriteCities).toEqual([]);
  });
});
