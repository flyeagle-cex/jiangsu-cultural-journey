import { cityManifest } from "@/data/city-manifest";
import { getPublishedCreativeProjects } from "@/lib/creative";
import type { CityMapIdentity } from "@/types/city";
import type { CreativeProject } from "@/types/creative";

export type SavedStateIntent = "all" | "cities" | "creative" | null;
export type ResolvedSavedStateIntent = Exclude<SavedStateIntent, null>;

export type SavedStateResult = {
  intent: ResolvedSavedStateIntent;
  cities: CityMapIdentity[];
  creativeProjects: CreativeProject[];
};

type SavedStateSource = {
  favoriteCities: readonly string[];
  favoriteCreativeProjects: readonly string[];
};

const INTENT_PHRASES: Record<ResolvedSavedStateIntent, ReadonlySet<string>> = {
  all: new Set([
    "我的收藏",
    "我收藏了什么",
    "我收藏了哪些东西",
    "看看我的收藏",
    "查看我的收藏",
    "带我看看我的收藏",
    "my favorites",
    "my saved items",
    "show my favorites",
    "what have i saved",
    "what did i save",
  ]),
  cities: new Set([
    "我的城市收藏",
    "我收藏的城市",
    "我收藏了哪些城市",
    "看看我收藏的城市",
    "my saved cities",
    "show my saved cities",
    "which cities did i save",
  ]),
  creative: new Set([
    "我的文创收藏",
    "我收藏的文创",
    "我收藏了哪些文创",
    "看看我收藏的文创",
    "my saved creative works",
    "show my saved creative works",
    "my saved creative projects",
    "what creative works did i save",
  ]),
};

function normalizeSavedStateQuery(query: string): string {
  return query
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[，。！？、；：,.!?;:]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function detectSavedStateIntent(query: string): SavedStateIntent {
  const normalizedQuery = normalizeSavedStateQuery(query);
  if (!normalizedQuery) return null;

  for (const intent of ["all", "cities", "creative"] as const) {
    if (INTENT_PHRASES[intent].has(normalizedQuery)) return intent;
  }

  return null;
}

export function buildSavedStateResult(
  intent: ResolvedSavedStateIntent,
  savedState: SavedStateSource,
  projects: readonly CreativeProject[] = getPublishedCreativeProjects(),
): SavedStateResult {
  const favoriteCitySlugs = new Set(savedState.favoriteCities);
  const favoriteCreativeSlugs = new Set(savedState.favoriteCreativeProjects);
  const cities = cityManifest.filter((city) => favoriteCitySlugs.has(city.slug));
  const creativeProjects = getPublishedCreativeProjects(projects)
    .filter((project) => favoriteCreativeSlugs.has(project.slug))
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.slug.localeCompare(right.slug),
    );

  return { intent, cities, creativeProjects };
}
