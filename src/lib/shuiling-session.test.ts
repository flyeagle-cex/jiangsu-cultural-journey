import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SHUILING_WELCOME_REPLAY_EVENT,
  SHUILING_WELCOME_STORAGE_KEY,
  dismissShuiLingWelcome,
  hasSeenCityHint,
  hasSeenHomeHint,
  hasSeenShuiLingWelcome,
  markCityHintSeen,
  markHomeHintSeen,
  showWelcomeAgain,
} from "@/lib/shuiling-session";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const originalWindow = globalThis.window;
const dispatchEvent = vi.fn();

beforeEach(() => {
  dispatchEvent.mockClear();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { dispatchEvent, sessionStorage: new MemoryStorage() },
  });
});

afterAll(() => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
});

describe("Shuiling session state", () => {
  it("shows the welcome once per session and supports replay", () => {
    expect(hasSeenShuiLingWelcome()).toBe(false);
    dismissShuiLingWelcome();
    expect(hasSeenShuiLingWelcome()).toBe(true);
    expect(window.sessionStorage.getItem(SHUILING_WELCOME_STORAGE_KEY)).toBe("true");

    showWelcomeAgain();
    expect(hasSeenShuiLingWelcome()).toBe(false);
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: SHUILING_WELCOME_REPLAY_EVENT }));
  });

  it("tracks city hints independently", () => {
    markCityHintSeen("nanjing");
    expect(hasSeenCityHint("nanjing")).toBe(true);
    expect(hasSeenCityHint("suzhou")).toBe(false);
  });

  it("tracks the home prompt for the current session", () => {
    expect(hasSeenHomeHint()).toBe(false);
    markHomeHintSeen();
    expect(hasSeenHomeHint()).toBe(true);
  });
});
