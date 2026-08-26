import { cityManifest } from "@/data/city-manifest";
import { getPublishedCreativeProjects } from "@/lib/creative";
import type { CitySlug } from "@/types/city";
import type { CreativeProject, CreativeSlug } from "@/types/creative";
import {
  JOURNEY_INTEREST_ORDER,
  type JourneyInterest,
} from "@/types/user-preferences";
import type { UserSavedState } from "@/types/user-saved-state";

export const USER_SAVED_STATE_KEY = "jiangsu-cultural-journey:user-saved-state";
export const USER_SAVED_STATE_VERSION = 2;

export const DEFAULT_USER_SAVED_STATE: UserSavedState = {
  version: USER_SAVED_STATE_VERSION,
  favoriteCities: [],
  favoriteCreativeProjects: [],
  interests: [],
};

export type UserSavedStateStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const cityOrder = new Map(cityManifest.map((city) => [city.slug, city.order]));
const publishedCreativeProjects = getPublishedCreativeProjects();

function createDefaultState(): UserSavedState {
  return {
    version: USER_SAVED_STATE_VERSION,
    favoriteCities: [],
    favoriteCreativeProjects: [],
    interests: [],
  };
}

function getBrowserStorage(): UserSavedStateStorage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCitySlug(value: unknown): value is CitySlug {
  return typeof value === "string" && cityOrder.has(value as CitySlug);
}

function normalizeCities(values: readonly unknown[]): CitySlug[] {
  return [...new Set(values.filter(isCitySlug))].sort(
    (left, right) => (cityOrder.get(left) ?? 0) - (cityOrder.get(right) ?? 0),
  );
}

function normalizeCreativeProjects(
  values: readonly unknown[],
  projects: readonly CreativeProject[],
): CreativeSlug[] {
  const publishedCreativeBySlug = new Map(
    getPublishedCreativeProjects(projects).map((project) => [project.slug, project]),
  );
  const isPublishedCreativeSlug = (value: unknown): value is CreativeSlug =>
    typeof value === "string" && publishedCreativeBySlug.has(value as CreativeSlug);

  return [...new Set(values.filter(isPublishedCreativeSlug))].sort((left, right) => {
    const leftProject = publishedCreativeBySlug.get(left);
    const rightProject = publishedCreativeBySlug.get(right);
    return (
      (leftProject?.sortOrder ?? 0) - (rightProject?.sortOrder ?? 0) ||
      left.localeCompare(right)
    );
  });
}

function isJourneyInterest(value: unknown): value is JourneyInterest {
  return JOURNEY_INTEREST_ORDER.includes(value as JourneyInterest);
}

function normalizeInterests(values: readonly unknown[]): JourneyInterest[] {
  const selectedInterests = new Set(values.filter(isJourneyInterest));
  return JOURNEY_INTEREST_ORDER.filter((interest) => selectedInterests.has(interest));
}

function containsFutureVersion(storage: UserSavedStateStorage): boolean {
  try {
    const currentValue = storage.getItem(USER_SAVED_STATE_KEY);
    if (currentValue === null) return false;
    const parsedValue: unknown = JSON.parse(currentValue);
    return (
      isRecord(parsedValue) &&
      typeof parsedValue.version === "number" &&
      parsedValue.version > USER_SAVED_STATE_VERSION
    );
  } catch {
    return false;
  }
}

export function parseUserSavedState(
  value: unknown,
  projects: readonly CreativeProject[] = publishedCreativeProjects,
): UserSavedState {
  if (!isRecord(value)) {
    return createDefaultState();
  }

  if (
    !Array.isArray(value.favoriteCities) ||
    !Array.isArray(value.favoriteCreativeProjects)
  ) {
    return createDefaultState();
  }
  const favoriteCities = value.favoriteCities;
  const favoriteCreativeProjects = value.favoriteCreativeProjects;

  const interests =
    value.version === 1
      ? []
      : value.version === USER_SAVED_STATE_VERSION && Array.isArray(value.interests)
        ? normalizeInterests(value.interests)
        : null;
  if (interests === null) return createDefaultState();

  return {
    version: USER_SAVED_STATE_VERSION,
    favoriteCities: normalizeCities(favoriteCities),
    favoriteCreativeProjects: normalizeCreativeProjects(favoriteCreativeProjects, projects),
    interests,
  };
}

export function readUserSavedState(
  storage: UserSavedStateStorage | null = getBrowserStorage(),
): UserSavedState {
  if (!storage) return createDefaultState();

  try {
    const storedValue = storage.getItem(USER_SAVED_STATE_KEY);
    return storedValue === null ? createDefaultState() : parseUserSavedState(JSON.parse(storedValue));
  } catch {
    return createDefaultState();
  }
}

export function writeUserSavedState(
  state: UserSavedState,
  storage: UserSavedStateStorage | null = getBrowserStorage(),
): boolean {
  if (!storage) return false;

  try {
    if (containsFutureVersion(storage)) return false;
    storage.setItem(USER_SAVED_STATE_KEY, JSON.stringify(parseUserSavedState(state)));
    return true;
  } catch {
    return false;
  }
}

export function clearUserSavedState(
  storage: UserSavedStateStorage | null = getBrowserStorage(),
): boolean {
  if (!storage) return false;

  try {
    storage.removeItem(USER_SAVED_STATE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function toggleFavoriteCity(state: UserSavedState, slug: CitySlug): UserSavedState {
  const favoriteCities = state.favoriteCities.includes(slug)
    ? state.favoriteCities.filter((citySlug) => citySlug !== slug)
    : [...state.favoriteCities, slug];

  return parseUserSavedState({ ...state, favoriteCities });
}

export function toggleFavoriteCreativeProject(
  state: UserSavedState,
  slug: CreativeSlug,
): UserSavedState {
  const favoriteCreativeProjects = state.favoriteCreativeProjects.includes(slug)
    ? state.favoriteCreativeProjects.filter((creativeSlug) => creativeSlug !== slug)
    : [...state.favoriteCreativeProjects, slug];

  return parseUserSavedState({ ...state, favoriteCreativeProjects });
}

export function isFavoriteCity(state: UserSavedState, slug: CitySlug): boolean {
  return state.favoriteCities.includes(slug);
}

export function isFavoriteCreativeProject(
  state: UserSavedState,
  slug: CreativeSlug,
): boolean {
  return state.favoriteCreativeProjects.includes(slug);
}

export function toggleJourneyInterest(
  state: UserSavedState,
  interest: JourneyInterest,
): UserSavedState {
  const interests = state.interests.includes(interest)
    ? state.interests.filter((selectedInterest) => selectedInterest !== interest)
    : [...state.interests, interest];

  return parseUserSavedState({ ...state, interests });
}

export function clearJourneyInterests(state: UserSavedState): UserSavedState {
  return state.interests.length === 0
    ? state
    : parseUserSavedState({ ...state, interests: [] });
}

export function isJourneyInterestSelected(
  state: UserSavedState,
  interest: JourneyInterest,
): boolean {
  return state.interests.includes(interest);
}
