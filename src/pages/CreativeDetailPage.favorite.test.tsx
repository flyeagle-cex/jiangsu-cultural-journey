// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/context/LanguageContext";
import { UserSavedStateProvider } from "@/context/UserSavedStateContext";
import { creativeManifest } from "@/data/creative-manifest";
import { CREATIVE_DETAIL_PATH } from "@/lib/creative";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import CreativeDetailPage from "@/pages/CreativeDetailPage";

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

function mountDetail(storage: UserSavedStateStorage) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      <MemoryRouter initialEntries={["/creative/water-spirit-global-voyage"]}>
        <LanguageProvider>
          <UserSavedStateProvider storage={storage}>
            <Routes>
              <Route element={<CreativeDetailPage />} path={CREATIVE_DETAIL_PATH} />
            </Routes>
          </UserSavedStateProvider>
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
}

beforeAll(() => {
  let language: string | null = "zh";
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => (key === LANGUAGE_STORAGE_KEY ? language : null),
      setItem: (key: string, value: string) => {
        if (key === LANGUAGE_STORAGE_KEY) language = value;
      },
      removeItem: (key: string) => {
        if (key === LANGUAGE_STORAGE_KEY) language = null;
      },
      clear: () => {
        language = null;
      },
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
});

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("CreativeDetailPage favorite action", () => {
  it("saves and removes the published creative project through the shared context", async () => {
    const memory = createMemoryStorage();
    mountDetail(memory.storage);

    const button = container?.querySelector<HTMLButtonElement>(
      'button[aria-label="收藏作品《一水灵韵，万国舟行》"]',
    );
    expect(button?.textContent).toContain("收藏作品");
    expect(button?.getAttribute("aria-pressed")).toBe("false");

    await act(async () => button?.click());
    expect(button?.textContent).toContain("已收藏");
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(memory.read().favoriteCreativeProjects).toEqual(["water-spirit-global-voyage"]);

    await act(async () => button?.click());
    expect(button?.textContent).toContain("收藏作品");
    expect(button?.getAttribute("aria-pressed")).toBe("false");
    expect(memory.read().favoriteCreativeProjects).toEqual([]);
  });

  it("does not expose a favorite action when a project is a draft", () => {
    const project = creativeManifest[0];
    const originalStatus = project.status;
    project.status = "draft";

    try {
      mountDetail(createMemoryStorage().storage);
      expect(container?.textContent).toContain("一水灵韵，万国舟行");
      expect(container?.querySelector("[data-favorite-state]")).toBeNull();
    } finally {
      project.status = originalStatus;
    }
  });
});
