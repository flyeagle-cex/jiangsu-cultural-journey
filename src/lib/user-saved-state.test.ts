import { describe, expect, it } from "vitest";

import { creativeManifest } from "@/data/creative-manifest";
import {
  DEFAULT_USER_SAVED_STATE,
  USER_SAVED_STATE_KEY,
  clearUserSavedState,
  isFavoriteCity,
  isFavoriteCreativeProject,
  parseUserSavedState,
  readUserSavedState,
  toggleFavoriteCity,
  toggleFavoriteCreativeProject,
  writeUserSavedState,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import type { CreativeProject } from "@/types/creative";

function createMemoryStorage(initialValue?: string): UserSavedStateStorage & { value: string | null } {
  let value = initialValue ?? null;

  return {
    get value() {
      return value;
    },
    getItem(key) {
      return key === USER_SAVED_STATE_KEY ? value : null;
    },
    setItem(key, nextValue) {
      if (key === USER_SAVED_STATE_KEY) value = nextValue;
    },
    removeItem(key) {
      if (key === USER_SAVED_STATE_KEY) value = null;
    },
  };
}

describe("user saved state storage", () => {
  it("returns the versioned default state without browser storage", () => {
    expect(readUserSavedState(null)).toEqual(DEFAULT_USER_SAVED_STATE);
    expect(readUserSavedState(createMemoryStorage())).toEqual(DEFAULT_USER_SAVED_STATE);
  });

  it("restores a valid state in canonical city and creative order", () => {
    const storage = createMemoryStorage(
      JSON.stringify({
        version: 1,
        favoriteCities: ["suzhou", "nanjing"],
        favoriteCreativeProjects: ["water-spirit-global-voyage"],
      }),
    );

    expect(readUserSavedState(storage)).toEqual({
      version: 1,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
    });
  });

  it("recovers from invalid JSON, unknown structures, and wrong versions", () => {
    expect(readUserSavedState(createMemoryStorage("not-json"))).toEqual(DEFAULT_USER_SAVED_STATE);
    expect(parseUserSavedState({ version: 1, favoriteCities: [] })).toEqual(DEFAULT_USER_SAVED_STATE);
    expect(
      parseUserSavedState({ version: 2, favoriteCities: [], favoriteCreativeProjects: [] }),
    ).toEqual(DEFAULT_USER_SAVED_STATE);
  });

  it("deduplicates favorites and filters unknown city and creative slugs", () => {
    expect(
      parseUserSavedState({
        version: 1,
        favoriteCities: ["suzhou", "fake-city", "nanjing", "suzhou"],
        favoriteCreativeProjects: [
          "water-spirit-global-voyage",
          "fake-creative",
          "water-spirit-global-voyage",
        ],
      }),
    ).toEqual({
      version: 1,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
    });
  });

  it("rejects a draft project slug even when it exists in a supplied object", () => {
    const draftProject: CreativeProject = {
      ...creativeManifest[0],
      status: "draft",
    };

    expect(
      parseUserSavedState(
        {
          version: 1,
          favoriteCities: [],
          favoriteCreativeProjects: [draftProject.slug],
        },
        [draftProject],
      ).favoriteCreativeProjects,
    ).toEqual([]);
  });

  it("toggles city and creative favorites without duplicates", () => {
    const withCity = toggleFavoriteCity(DEFAULT_USER_SAVED_STATE, "suzhou");
    const withCreative = toggleFavoriteCreativeProject(withCity, "water-spirit-global-voyage");

    expect(isFavoriteCity(withCreative, "suzhou")).toBe(true);
    expect(isFavoriteCreativeProject(withCreative, "water-spirit-global-voyage")).toBe(true);
    expect(toggleFavoriteCity(withCreative, "suzhou").favoriteCities).toEqual([]);
    expect(
      toggleFavoriteCreativeProject(withCreative, "water-spirit-global-voyage")
        .favoriteCreativeProjects,
    ).toEqual([]);
  });

  it("writes normalized state, clears storage, and handles write failures", () => {
    const storage = createMemoryStorage();
    expect(
      writeUserSavedState(
        {
          version: 1,
          favoriteCities: ["suzhou", "nanjing", "suzhou"],
          favoriteCreativeProjects: [],
        },
        storage,
      ),
    ).toBe(true);
    expect(JSON.parse(storage.value ?? "null").favoriteCities).toEqual(["nanjing", "suzhou"]);
    expect(clearUserSavedState(storage)).toBe(true);
    expect(storage.value).toBeNull();

    const failingStorage: UserSavedStateStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    expect(writeUserSavedState(DEFAULT_USER_SAVED_STATE, failingStorage)).toBe(false);
    expect(clearUserSavedState(failingStorage)).toBe(false);
  });
});
