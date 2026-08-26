import { cityManifest } from "@/data/city-manifest";
import { getPublishedCreativeProjects } from "@/lib/creative";
import type { CitySlug } from "@/types/city";
import type { CreativeProject, CreativeSlug } from "@/types/creative";
import type { UserSavedState } from "@/types/user-saved-state";

export const USER_SAVED_STATE_KEY = "jiangsu-cultural-journey:user-saved-state";

export const DEFAULT_USER_SAVED_STATE: UserSavedState = {
  version: 1,
  favoriteCities: [],
  favoriteCreativeProjects: [],
};

export type UserSavedStateStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const cityOrder = new Map(cityManifest.map((city) => [city.slug, city.order]));
const publishedCreativeProjects = getPublishedCreativeProjects();

function createDefaultState(): UserSavedState {
  return {
    version: 1,
    favoriteCities: [],
    favoriteCreativeProjects: [],
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

export function parseUserSavedState(
  value: unknown,
  projects: readonly CreativeProject[] = publishedCreativeProjects,
): UserSavedState {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.favoriteCities) ||
    !Array.isArray(value.favoriteCreativeProjects)
  ) {
    return createDefaultState();
  }

  return {
    version: 1,
    favoriteCities: normalizeCities(value.favoriteCities),
    favoriteCreativeProjects: normalizeCreativeProjects(value.favoriteCreativeProjects, projects),
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
