import { cities as jiangsuCities } from "@/data/cities";
import {
  CITY_SECTION_LABELS,
  type BilingualText,
  type City,
  type CitySection,
  type CitySlug,
} from "@/types/city";
import {
  JOURNEY_INTEREST_ORDER,
  type JourneyInterest,
} from "@/types/user-preferences";

export const DEFAULT_RECOMMENDATION_LIMIT = 3;

export type JourneyRecommendationReason = {
  interest: JourneyInterest;
  label: BilingualText;
  evidence: BilingualText;
};

export type JourneyCityRecommendation = {
  citySlug: CitySlug;
  score: number;
  matchedInterests: JourneyInterest[];
  reasons: JourneyRecommendationReason[];
  saved: boolean;
};

type RecommendJourneyCitiesOptions = {
  interests: readonly JourneyInterest[];
  favoriteCities?: readonly CitySlug[];
  limit?: number;
};

const VALID_INTERESTS = new Set<JourneyInterest>(JOURNEY_INTEREST_ORDER);

function countSourceCharacters(section: CitySection) {
  return [
    section.intro.zh,
    ...section.highlights.flatMap((highlight) => [
      highlight.title.zh,
      highlight.summary.zh,
    ]),
  ].reduce((total, value) => total + value.replace(/\s/g, "").length, 0);
}

/**
 * Scores only content that is present in the matching formal city section.
 * The final detail bonus is capped at two points and uses the Chinese source
 * character count so switching the interface language cannot change ranking.
 */
export function scoreJourneyInterestSection(section: CitySection | undefined) {
  if (!section) return 0;

  const introBonus = section.intro.zh.trim() ? 1 : 0;
  const highlightBonus = Math.min(section.highlights.length * 2, 8);
  const uniqueKeywordCount = new Set(
    section.highlights.flatMap((highlight) =>
      highlight.keywords
        .map((keyword) => keyword.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).size;
  const keywordBonus = Math.min(uniqueKeywordCount / 3, 2);
  const detailBonus = Math.min(countSourceCharacters(section) / 100, 2);

  return Number((1 + introBonus + highlightBonus + keywordBonus + detailBonus).toFixed(2));
}

function formatChineseTitles(titles: readonly BilingualText[]) {
  return titles.map((title) => `「${title.zh}」`).join("、");
}

function formatEnglishTitles(titles: readonly BilingualText[]) {
  return titles.map((title) => `‘${title.en}’`).join(" and ");
}

function buildRecommendationReason(
  interest: JourneyInterest,
  section: CitySection,
): JourneyRecommendationReason {
  const label = CITY_SECTION_LABELS[interest];
  const highlightTitles = section.highlights
    .slice(0, 2)
    .map((highlight) => highlight.title);

  if (highlightTitles.length > 0) {
    return {
      interest,
      label,
      evidence: {
        zh: `与你选择的「${label.zh}」相匹配：本城资料包含${formatChineseTitles(highlightTitles)}等相关内容。`,
        en: `Matches your interest in ${label.en}, including ${formatEnglishTitles(highlightTitles)} in the city guide.`,
      },
    };
  }

  if (section.intro.zh.trim() || section.intro.en.trim()) {
    return {
      interest,
      label,
      evidence: {
        zh: `与你选择的「${label.zh}」相匹配：本城资料在对应专题中有正式介绍。`,
        en: `Matches your interest in ${label.en}; the city guide includes a formal introduction to this theme.`,
      },
    };
  }

  return {
    interest,
    label,
    evidence: {
      zh: `与你选择的「${label.zh}」相匹配：本城资料中设有对应专题。`,
      en: `Matches your interest in ${label.en}; this theme is present in the city guide.`,
    },
  };
}

function normalizeInterests(interests: readonly JourneyInterest[]) {
  const requested = new Set<JourneyInterest>();

  for (const interest of interests) {
    if (VALID_INTERESTS.has(interest)) requested.add(interest);
  }

  return JOURNEY_INTEREST_ORDER.filter((interest) => requested.has(interest));
}

/**
 * Produces local, deterministic city suggestions from explicit interests.
 * `favoriteCities` changes only the returned `saved` flag and never scoring.
 * The optional second parameter exists for isolated fixture tests.
 */
export function recommendJourneyCities(
  {
    interests,
    favoriteCities = [],
    limit = DEFAULT_RECOMMENDATION_LIMIT,
  }: RecommendJourneyCitiesOptions,
  cityData: readonly City[] = jiangsuCities,
): JourneyCityRecommendation[] {
  const normalizedInterests = normalizeInterests(interests);
  const normalizedLimit = Number.isFinite(limit)
    ? Math.max(0, Math.floor(limit))
    : DEFAULT_RECOMMENDATION_LIMIT;

  if (normalizedInterests.length === 0 || normalizedLimit === 0) return [];

  const favoriteSet = new Set<CitySlug>(favoriteCities);

  return cityData
    .map((city) => {
      const matchedSections = normalizedInterests.flatMap((interest) => {
        const section = city.sections.find((candidate) => candidate.id === interest);
        const score = scoreJourneyInterestSection(section);
        return section && score > 0 ? [{ interest, section, score }] : [];
      });
      const score = Number(
        matchedSections
          .reduce((total, match) => total + match.score, 0)
          .toFixed(2),
      );

      return {
        citySlug: city.slug,
        cityOrder: city.order,
        score,
        matchedInterests: matchedSections.map(({ interest }) => interest),
        reasons: matchedSections.map(({ interest, section }) =>
          buildRecommendationReason(interest, section),
        ),
        saved: favoriteSet.has(city.slug),
      };
    })
    .filter((recommendation) => recommendation.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.cityOrder - right.cityOrder,
    )
    .slice(0, normalizedLimit)
    .map(({ cityOrder: _cityOrder, ...recommendation }) => recommendation);
}
