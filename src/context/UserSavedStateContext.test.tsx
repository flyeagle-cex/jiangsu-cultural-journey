// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { UserSavedStateProvider, useSavedItems } from "@/context/UserSavedStateContext";
import {
  USER_SAVED_STATE_KEY,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function createMemoryStorage(initialValue?: string) {
  let value = initialValue ?? null;
  let writes = 0;

  const storage: UserSavedStateStorage = {
    getItem: (key) => (key === USER_SAVED_STATE_KEY ? value : null),
    setItem: (key, nextValue) => {
      if (key === USER_SAVED_STATE_KEY) {
        value = nextValue;
        writes += 1;
      }
    },
    removeItem: (key) => {
      if (key === USER_SAVED_STATE_KEY) value = null;
    },
  };

  return {
    storage,
    get value() {
      return value;
    },
    get writes() {
      return writes;
    },
  };
}

function SavedStateProbe({ onRender }: { onRender: (value: string) => void }) {
  const savedItems = useSavedItems();
  const value = `${savedItems.favoriteCities.join(",")}|${savedItems.favoriteCreativeProjects.join(",")}`;

  useEffect(() => {
    onRender(value);
  }, [onRender, value]);

  return (
    <div>
      <output data-testid="saved-state">{value}</output>
      <button onClick={() => savedItems.toggleCity("nanjing")} type="button">
        Toggle city
      </button>
      <button
        onClick={() => savedItems.toggleCreative("water-spirit-global-voyage")}
        type="button"
      >
        Toggle creative
      </button>
      <button onClick={savedItems.clearAll} type="button">
        Clear
      </button>
    </div>
  );
}

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("UserSavedStateProvider", () => {
  it("restores initial state and persists immediate cross-component updates", async () => {
    const memory = createMemoryStorage(
      JSON.stringify({
        version: 1,
        favoriteCities: ["suzhou"],
        favoriteCreativeProjects: [],
      }),
    );
    const renders: string[] = [];
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <UserSavedStateProvider storage={memory.storage}>
          <SavedStateProbe onRender={(value) => renders.push(value)} />
        </UserSavedStateProvider>,
      );
    });

    expect(container.querySelector("output")?.textContent).toBe("suzhou|");
    expect(memory.writes).toBeGreaterThan(0);

    const buttons = container.querySelectorAll("button");
    await act(async () => buttons[0].click());
    await act(async () => buttons[1].click());

    expect(container.querySelector("output")?.textContent).toBe(
      "nanjing,suzhou|water-spirit-global-voyage",
    );
    expect(JSON.parse(memory.value ?? "null")).toEqual({
      version: 1,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
    });
    expect(renders.at(-1)).toBe("nanjing,suzhou|water-spirit-global-voyage");

    await act(async () => buttons[2].click());
    expect(container.querySelector("output")?.textContent).toBe("|");
  });
});
