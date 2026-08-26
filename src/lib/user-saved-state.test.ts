import { describe, expect, it } from "vitest";

import { creativeManifest } from "@/data/creative-manifest";
import {
  DEFAULT_USER_SAVED_STATE,
  USER_SAVED_STATE_KEY,
  USER_SAVED_STATE_VERSION,
  clearJourneyInterests,
  clearUserSavedState,
  isFavoriteCity,
  isFavoriteCreativeProject,
  isJourneyInterestSelected,
  parseUserSavedState,
  readUserSavedState,
  toggleFavoriteCity,
  toggleFavoriteCreativeProject,
  toggleJourneyInterest,
  writeUserSavedState,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import type { CreativeProject } from "@/types/creative";
import type { UserSavedState } from "@/types/user-saved-state";

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

  it("migrates v1 favorites to v2 without losing data", () => {
    const storage = createMemoryStorage(
      JSON.stringify({
        version: 1,
        favoriteCities: ["suzhou", "nanjing"],
        favoriteCreativeProjects: ["water-spirit-global-voyage"],
      }),
    );

    expect(readUserSavedState(storage)).toEqual({
      version: 2,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
      interests: [],
    });
  });

  it("normalizes v2 interests in canonical order", () => {
    expect(
      parseUserSavedState({
        version: 2,
        favoriteCities: ["nanjing"],
        favoriteCreativeProjects: [],
        interests: ["food", "history"],
      }),
    ).toEqual({
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: [],
      interests: ["history", "food"],
    });
  });

  it("filters invalid and duplicate interests", () => {
    expect(
      parseUserSavedState({
        version: 2,
        favoriteCities: [],
        favoriteCreativeProjects: [],
        interests: ["waterways", "fake", "food", "food"],
      }).interests,
    ).toEqual(["food", "waterways"]);
  });

  it("recovers from invalid JSON, unknown structures, and future versions", () => {
    expect(readUserSavedState(createMemoryStorage("not-json"))).toEqual(DEFAULT_USER_SAVED_STATE);
    expect(parseUserSavedState({ version: 1, favoriteCities: [] })).toEqual(DEFAULT_USER_SAVED_STATE);
    expect(
      parseUserSavedState({
        version: 99,
        favoriteCities: ["nanjing"],
        favoriteCreativeProjects: [],
        interests: ["history"],
      }),
    ).toEqual(DEFAULT_USER_SAVED_STATE);
  });

  it("deduplicates favorites and filters unknown city and creative slugs", () => {
    expect(
      parseUserSavedState({
        version: 2,
        favoriteCities: ["suzhou", "fake-city", "nanjing", "suzhou"],
        favoriteCreativeProjects: [
          "water-spirit-global-voyage",
          "fake-creative",
          "water-spirit-global-voyage",
        ],
        interests: [],
      }),
    ).toEqual({
      version: 2,
      favoriteCities: ["nanjing", "suzhou"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
      interests: [],
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
          version: 2,
          favoriteCities: [],
          favoriteCreativeProjects: [draftProject.slug],
          interests: [],
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

  it("toggles and clears interests without changing favorites", () => {
    const withFavorites: UserSavedState = {
      version: 2,
      favoriteCities: ["nanjing"],
      favoriteCreativeProjects: ["water-spirit-global-voyage"],
      interests: [],
    };
    const withHistory = toggleJourneyInterest(withFavorites, "history");
    const withFood = toggleJourneyInterest(withHistory, "food");

    expect(isJourneyInterestSelected(withFood, "history")).toBe(true);
    expect(toggleJourneyInterest(withFood, "history").interests).toEqual(["food"]);
    expect(clearJourneyInterests(withFood)).toEqual({
      ...withFavorites,
      interests: [],
    });
  });

  it("writes normalized state, clears storage, and handles write failures", () => {
    const storage = createMemoryStorage();
    expect(
      writeUserSavedState(
        {
          version: 2,
          favoriteCities: ["suzhou", "nanjing", "suzhou"],
          favoriteCreativeProjects: [],
          interests: ["food", "history"],
        },
        storage,
      ),
    ).toBe(true);
    expect(JSON.parse(storage.value ?? "null").favoriteCities).toEqual(["nanjing", "suzhou"]);
    expect(JSON.parse(storage.value ?? "null")).toMatchObject({
      version: USER_SAVED_STATE_VERSION,
      interests: ["history", "food"],
    });
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

  it("does not overwrite data written by a future schema version", () => {
    const futureValue = JSON.stringify({ version: 99, futureData: ["keep-me"] });
    const storage = createMemoryStorage(futureValue);

    expect(writeUserSavedState(DEFAULT_USER_SAVED_STATE, storage)).toBe(false);
    expect(storage.value).toBe(futureValue);
  });
});
