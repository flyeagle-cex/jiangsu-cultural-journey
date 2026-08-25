import { getPublishedCreativeProjects } from "@/lib/creative";
import { detectQueryCities } from "@/rag/city-detection";
import { MIN_RESULT_SCORE } from "@/rag/scoring";
import type { RetrievalResult } from "@/rag/types";
import type { CitySlug, Language } from "@/types/city";
import type {
  CreativeCulturalLink,
  CreativeProject,
  CreativeTheme,
} from "@/types/creative";

export type CreativeRecommendationReason =
  | "explicit-creative-intent"
  | "theme"
  | "section"
  | "city";

export type CreativeRecommendation = {
  project: CreativeProject;
  score: number;
  reasons: CreativeRecommendationReason[];
  matchedThemes: CreativeTheme[];
};

export type CreativeRecommendationInput = {
  question: string;
  retrievalResults: readonly RetrievalResult[];
  currentCity?: CitySlug;
  projects?: readonly CreativeProject[];
};

export const CREATIVE_RECOMMENDATION_WEIGHTS = Object.freeze({
  explicitCreativeIntent: 6,
  exactThemePhrase: 4,
  strongThemeKeyword: 3,
  retrievalThemeEvidence: 3,
  matchingSection: 2,
  exactCity: 4,
  currentCity: 1,
});

export const MIN_CREATIVE_RECOMMENDATION_SCORE = 5;
export const MAX_CREATIVE_RECOMMENDATIONS = 3;

export const GENERIC_CREATIVE_LOOKUP_QUERIES = [
  "有什么文创",
  "你们有什么文创",
  "有哪些文创",
  "你们有哪些文创",
  "水灵有什么文创",
  "水灵有哪些文创",
  "what creative products are available",
  "what cultural creative products are available",
  "do you have any creative products",
  "do you have any souvenirs",
  "what souvenirs are available",
] as const;

export const EXPLICIT_CREATIVE_QUERY_SIGNALS = [
  "文创",
  "周边",
  "纪念品",
  "纪念礼物",
  "礼物",
  "礼品",
  "伴手礼",
  "创意产品",
  "文化产品",
  "creative product",
  "creative products",
  "cultural creative",
  "souvenir",
  "souvenirs",
  "gift",
  "gifts",
  "merch",
  "merchandise",
] as const;

export const THEME_QUERY_SIGNALS: Record<
  CreativeTheme,
  { exact: readonly string[]; strong: readonly string[] }
> = {
  water_culture: {
    exact: ["水文化", "大运河文化", "water culture", "grand canal culture"],
    strong: [
      "大运河",
      "运河",
      "水乡",
      "江河",
      "水系",
      "漕运",
      "grand canal",
      "canal",
      "waterway",
      "waterways",
      "river culture",
    ],
  },
  international_exchange: {
    exact: ["国际交流", "中外交流", "international exchange", "cross-cultural exchange"],
    strong: ["万国", "跨文化", "global exchange", "cross-cultural"],
  },
};

export const CULTURAL_LINK_QUERY_SIGNALS: Partial<
  Record<CreativeCulturalLink["type"], readonly string[]>
> = {
  waterways: ["大运河", "运河", "水系", "水乡", "grand canal", "canal", "waterway"],
  heritage: ["非遗", "非物质文化遗产", "intangible cultural heritage"],
  history: ["历史", "历史文化", "history", "historical culture"],
  food: ["美食", "饮食", "菜肴", "吃什么", "好吃的", "food", "cuisine"],
  story: ["故事", "传说", "民间故事", "story", "legend"],
};

const REASON_ORDER: readonly CreativeRecommendationReason[] = [
  "explicit-creative-intent",
  "theme",
  "section",
  "city",
];

const REASON_LABELS = {
  zh: {
    explicit: "已收录文创作品",
    water_culture: "与问题中的水文化主题相关",
    international_exchange: "与问题中的国际交流主题相关",
    section: "与检索到的文化专题相关",
    city: "与问题中的城市相关",
  },
  en: {
    explicit: "A published creative work in the archive",
    water_culture: "Related to the water-culture theme in your question",
    international_exchange: "Related to the international-exchange theme in your question",
    section: "Related to the retrieved cultural topic",
    city: "Related to the city in your question",
  },
} as const;

function normalizeRecommendationText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function includesSignal(normalizedText: string, signal: string) {
  const normalizedSignal = normalizeRecommendationText(signal);
  if (/^[a-z0-9 ]+$/u.test(normalizedSignal)) {
    return ` ${normalizedText} `.includes(` ${normalizedSignal} `);
  }
  return normalizedText.includes(normalizedSignal);
}

function includesAnySignal(normalizedText: string, signals: readonly string[]) {
  return signals.some((signal) => includesSignal(normalizedText, signal));
}

export function hasExplicitCreativeIntent(question: string) {
  return includesAnySignal(
    normalizeRecommendationText(question),
    EXPLICIT_CREATIVE_QUERY_SIGNALS,
  );
}

export function getCreativeQueryThemes(question: string): CreativeTheme[] {
  const normalizedQuestion = normalizeRecommendationText(question);
  return (Object.keys(THEME_QUERY_SIGNALS) as CreativeTheme[]).filter((theme) => {
    const signals = THEME_QUERY_SIGNALS[theme];
    return (
      includesAnySignal(normalizedQuestion, signals.exact) ||
      includesAnySignal(normalizedQuestion, signals.strong)
    );
  });
}

export function getCreativeQueryCulturalLinkTypes(
  question: string,
): CreativeCulturalLink["type"][] {
  const normalizedQuestion = normalizeRecommendationText(question);
  return (Object.keys(CULTURAL_LINK_QUERY_SIGNALS) as CreativeCulturalLink["type"][])
    .filter((type) =>
      includesAnySignal(
        normalizedQuestion,
        CULTURAL_LINK_QUERY_SIGNALS[type] ?? [],
      ),
    );
}

export function isCreativeManifestLookup(question: string) {
  const normalizedQuestion = normalizeRecommendationText(question);
  return GENERIC_CREATIVE_LOOKUP_QUERIES.some(
    (genericQuery) => normalizeRecommendationText(genericQuery) === normalizedQuestion,
  );
}

function matchesProjectSection(project: CreativeProject, results: readonly RetrievalResult[]) {
  const linkTypes = new Set<string>(project.culturalLinks.map((link) => link.type));
  return results.some((result) => linkTypes.has(result.chunk.section));
}

function getThemeScore(
  theme: CreativeTheme,
  normalizedQuestion: string,
  normalizedEvidence: string,
) {
  const signals = THEME_QUERY_SIGNALS[theme];
  let score = 0;

  if (includesAnySignal(normalizedQuestion, signals.exact)) {
    score += CREATIVE_RECOMMENDATION_WEIGHTS.exactThemePhrase;
  } else if (includesAnySignal(normalizedQuestion, signals.strong)) {
    score += CREATIVE_RECOMMENDATION_WEIGHTS.strongThemeKeyword;
  }

  if (
    includesAnySignal(normalizedEvidence, signals.exact) ||
    includesAnySignal(normalizedEvidence, signals.strong)
  ) {
    score += CREATIVE_RECOMMENDATION_WEIGHTS.retrievalThemeEvidence;
  }

  return score;
}

function mergeReasons(reasons: Set<CreativeRecommendationReason>) {
  return REASON_ORDER.filter((reason) => reasons.has(reason));
}

export function getCreativeRecommendationReasonLabel(
  recommendation: CreativeRecommendation,
  language: Language,
) {
  const labels = REASON_LABELS[language];
  if (recommendation.reasons.includes("explicit-creative-intent")) return labels.explicit;
  if (recommendation.matchedThemes.includes("water_culture")) return labels.water_culture;
  if (recommendation.matchedThemes.includes("international_exchange")) {
    return labels.international_exchange;
  }
  if (recommendation.reasons.includes("section")) return labels.section;
  return labels.city;
}

export function recommendCreativeProjects({
  question,
  retrievalResults,
  currentCity,
  projects,
}: CreativeRecommendationInput): CreativeRecommendation[] {
  const normalizedQuestion = normalizeRecommendationText(question);
  if (!normalizedQuestion) return [];

  const explicitCreativeIntent = hasExplicitCreativeIntent(question);
  const genericCreativeLookup = isCreativeManifestLookup(question);
  const queryThemes = getCreativeQueryThemes(question);
  const queryCulturalLinkTypes = getCreativeQueryCulturalLinkTypes(question);
  const validResults = retrievalResults.filter(
    (result) => result.score >= MIN_RESULT_SCORE,
  );
  if (!explicitCreativeIntent && validResults.length === 0) return [];

  const explicitCities = detectQueryCities(question);
  const evidenceCities = new Set(validResults.map((result) => result.chunk.city));
  const normalizedEvidence = normalizeRecommendationText(
    validResults
      .map((result) => `${result.chunk.title} ${result.chunk.content}`)
      .join(" "),
  );
  const publishedProjects = getPublishedCreativeProjects(projects);
  const recommendationsBySlug = new Map<string, CreativeRecommendation>();

  for (const project of publishedProjects) {
    const hasExplicitCityMatch = explicitCities.some((city) =>
      project.citySlugs.includes(city),
    );
    if (explicitCities.length > 0 && !hasExplicitCityMatch) continue;
    if (recommendationsBySlug.has(project.slug)) continue;

    let score = 0;
    const reasons = new Set<CreativeRecommendationReason>();
    const matchedThemes: CreativeTheme[] = [];

    if (explicitCreativeIntent) {
      score += CREATIVE_RECOMMENDATION_WEIGHTS.explicitCreativeIntent;
      reasons.add("explicit-creative-intent");
    }

    for (const theme of project.themes) {
      const themeScore = getThemeScore(theme, normalizedQuestion, normalizedEvidence);
      if (themeScore === 0) continue;
      score += themeScore;
      matchedThemes.push(theme);
      reasons.add("theme");
    }

    const hasQueryThemeMatch = project.themes.some((theme) => queryThemes.includes(theme));
    const hasQueryCulturalLinkMatch = project.culturalLinks.some((link) =>
      queryCulturalLinkTypes.includes(link.type),
    );
    const hasSectionMatch =
      hasQueryCulturalLinkMatch || matchesProjectSection(project, validResults);
    if (hasSectionMatch) {
      score += CREATIVE_RECOMMENDATION_WEIGHTS.matchingSection;
      reasons.add("section");
    }

    const hasEvidenceCityMatch = project.citySlugs.some((city) => evidenceCities.has(city));
    if (hasExplicitCityMatch || hasEvidenceCityMatch) {
      score += CREATIVE_RECOMMENDATION_WEIGHTS.exactCity;
      reasons.add("city");
    }
    const hasCurrentCityMatch = Boolean(
      currentCity && project.citySlugs.includes(currentCity),
    );
    if (hasCurrentCityMatch) {
      score += CREATIVE_RECOMMENDATION_WEIGHTS.currentCity;
      reasons.add("city");
    }

    const hasConstrainedProjectSignal =
      hasQueryThemeMatch ||
      hasQueryCulturalLinkMatch ||
      hasExplicitCityMatch ||
      hasCurrentCityMatch;
    if (
      explicitCreativeIntent &&
      !genericCreativeLookup &&
      !hasConstrainedProjectSignal
    ) {
      continue;
    }

    const hasProjectSignal =
      matchedThemes.length > 0 ||
      hasSectionMatch ||
      hasExplicitCityMatch ||
      hasEvidenceCityMatch ||
      hasCurrentCityMatch;
    const hasCulturalOrCreativeSignal =
      (explicitCreativeIntent && (genericCreativeLookup || hasProjectSignal)) ||
      matchedThemes.length > 0 ||
      hasSectionMatch;
    if (!hasCulturalOrCreativeSignal || score < MIN_CREATIVE_RECOMMENDATION_SCORE) continue;

    recommendationsBySlug.set(project.slug, {
      project,
      score,
      reasons: mergeReasons(reasons),
      matchedThemes,
    });
  }

  return [...recommendationsBySlug.values()]
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.project.sortOrder - right.project.sortOrder ||
        left.project.slug.localeCompare(right.project.slug),
    )
    .slice(0, MAX_CREATIVE_RECOMMENDATIONS);
}
