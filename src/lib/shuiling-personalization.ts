export type JourneyPersonalizationIntent = "city-recommendation" | null;

function normalizePersonalizationQuery(query: string) {
  return query
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[，。！？、；：,.!?;:'"“”‘’()（）]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function detectsChinesePersonalization(normalizedQuery: string) {
  const compactQuery = normalizedQuery.replace(/\s+/gu, "");
  const namesExplicitPreference = /我的(?:兴趣|偏好)/u.test(compactQuery);
  const namesCityOrJourneyTarget = /城市|地方|去哪|去哪里/u.test(compactQuery);
  const asksForSuggestion = /推荐|建议/u.test(compactQuery);
  const allowedEllipticalRequest = /^(?:水灵)?(?:根据|按照|按)我的(?:兴趣|偏好)推荐(?:一下)?$/u.test(
    compactQuery,
  );
  const asksWhichCityFits =
    /我适合去?(?:江苏)?哪(?:一)?(?:座|个)?城市/u.test(compactQuery) ||
    /哪些?(?:江苏)?城市适合我/u.test(compactQuery) ||
    /推荐(?:几个?)?(?:适合我的|适合我去的)(?:江苏)?城市/u.test(compactQuery);

  return (
    (namesExplicitPreference && namesCityOrJourneyTarget && asksForSuggestion) ||
    allowedEllipticalRequest ||
    asksWhichCityFits
  );
}

function detectsEnglishPersonalization(normalizedQuery: string) {
  const namesExplicitPreference = /\bmy (?:interests?|preferences?)\b/u.test(normalizedQuery);
  const namesCityOrJourneyTarget =
    /\b(?:jiangsu )?cit(?:y|ies)\b/u.test(normalizedQuery) ||
    /\bplaces?\b/u.test(normalizedQuery) ||
    /\bwhere should i go\b/u.test(normalizedQuery);
  const asksForSuggestion = /\b(?:recommend|suggest|fit|fits|where should i go)\b/u.test(
    normalizedQuery,
  );
  const asksWhichCityFits = /\bwhich (?:jiangsu )?cit(?:y|ies) (?:would )?fit(?:s)? me\b/u.test(
    normalizedQuery,
  );

  return (
    (namesExplicitPreference && namesCityOrJourneyTarget && asksForSuggestion) ||
    asksWhichCityFits
  );
}

/** Detects only explicit requests to use the user's local journey interests. */
export function detectJourneyPersonalizationIntent(
  query: string,
): JourneyPersonalizationIntent {
  const normalizedQuery = normalizePersonalizationQuery(query);
  if (!normalizedQuery) return null;

  return detectsChinesePersonalization(normalizedQuery) ||
    detectsEnglishPersonalization(normalizedQuery)
    ? "city-recommendation"
    : null;
}
