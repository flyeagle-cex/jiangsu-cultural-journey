import { cityManifest } from "@/data/city-manifest";
import { normalizeQuery, translateEnglishCultureTerms } from "@/rag/normalize-query";
import type { ResolvedRetrievalScope, RetrievalScope } from "@/rag/types";
import type { CitySlug } from "@/types/city";

const CITY_QUERY_NAMES = cityManifest.map((city) => ({
  slug: city.slug,
  names: [
    city.name.zh,
    city.slug,
    normalizeQuery(city.name.en),
    normalizeQuery(city.name.en).replace(/\s+/gu, ""),
  ],
}));

const GLOBAL_QUERY_PATTERNS = [
  /江苏哪个城市/u,
  /江苏哪些城市/u,
  /十三市/u,
  /哪些城市/u,
  /江苏哪里/u,
  /哪个地方/u,
  /比较江苏各地/u,
  /哪个城市最/u,
  /across jiangsu/u,
  /which cit(?:y|ies)/u,
];

export function detectQueryCities(query: string): CitySlug[] {
  const normalized = normalizeQuery(query);
  const compact = normalized.replace(/\s+/gu, "");
  return CITY_QUERY_NAMES.filter(({ names }) =>
    names.some((name) => normalized.includes(name) || compact.includes(name.replace(/\s+/gu, ""))),
  ).map(({ slug }) => slug);
}

export function isGlobalQueryIntent(query: string) {
  const normalized = translateEnglishCultureTerms(query);
  return GLOBAL_QUERY_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function resolveRetrievalScope(
  query: string,
  { currentCity, scope = "auto" }: { currentCity?: CitySlug; scope?: RetrievalScope } = {},
): ResolvedRetrievalScope {
  const explicitCitySlugs = detectQueryCities(query);
  const globalIntent = scope === "all" || isGlobalQueryIntent(query);

  if (globalIntent || (scope === "city" && !explicitCitySlugs.length && !currentCity)) {
    return {
      kind: "all",
      citySlugs: [],
      explicitCitySlugs,
      isGlobalIntent: globalIntent,
      usesCurrentCity: false,
    };
  }

  if (explicitCitySlugs.length) {
    return {
      kind: explicitCitySlugs.length > 1 ? "multi-city" : "city",
      citySlugs: explicitCitySlugs,
      explicitCitySlugs,
      isGlobalIntent: false,
      usesCurrentCity: false,
    };
  }

  if (currentCity) {
    return {
      kind: "city",
      citySlugs: [currentCity],
      explicitCitySlugs: [],
      isGlobalIntent: false,
      usesCurrentCity: true,
    };
  }

  return {
    kind: "all",
    citySlugs: [],
    explicitCitySlugs: [],
    isGlobalIntent: false,
    usesCurrentCity: false,
  };
}
