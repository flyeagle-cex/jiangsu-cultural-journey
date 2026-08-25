const QUERY_STOP_WORDS = [
  "please",
  "tell me",
  "about",
  "what",
  "which",
  "could",
  "would",
  "介绍一下",
  "告诉我",
  "为什么",
  "有哪些",
  "有没有",
  "代表性的",
  "代表性",
  "可以",
  "请问",
  "什么",
  "比较",
  "关于",
  "一下",
];

const ENGLISH_CULTURE_TERMS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bgrand\s+canal\b/gu, "大运河"],
  [/\bcanals?\b/gu, "运河"],
  [/\bwaterways?\b/gu, "水系"],
  [/\bheritage\b/gu, "非遗"],
  [/\bhistory\b/gu, "历史"],
  [/\bfoods?\b/gu, "美食"],
  [/\bcuisine\b/gu, "美食"],
  [/\bgardens?\b/gu, "园林"],
  [/\bwetlands?\b/gu, "湿地"],
  [/\blakes?\b/gu, "湖"],
  [/\bnature\b/gu, "自然"],
  [/\broutes?\b/gu, "路线"],
  [/\bsources?\b/gu, "资料来源"],
];

const DOMAIN_SINGLE_CHARACTERS = new Set([
  "鸭",
  "醋",
  "茶",
  "酒",
  "湖",
  "山",
  "河",
  "园",
  "塔",
  "桥",
  "盐",
  "湿",
]);

export function normalizeQuery(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[，。！？；：、,.!?;:"“”‘’（）()【】\[\]{}<>《》…—–_-]+/gu, " ")
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s']/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function translateEnglishCultureTerms(value: string) {
  let normalized = normalizeQuery(value);
  for (const [pattern, replacement] of ENGLISH_CULTURE_TERMS) {
    normalized = normalized.replace(pattern, ` ${replacement} `);
  }
  return normalized.replace(/\s+/gu, " ").trim();
}

export function removeQueryStopWords(value: string) {
  let result = ` ${value} `;
  for (const stopWord of [...QUERY_STOP_WORDS].sort((left, right) => right.length - left.length)) {
    result = result.replaceAll(stopWord, " ");
  }
  return result.replace(/\s+/gu, " ").trim();
}

export function tokenizeChineseText(value: string, { query = false } = {}) {
  const normalized = translateEnglishCultureTerms(value);
  const prepared = query ? removeQueryStopWords(normalized) : normalized;
  const tokens: string[] = [];

  for (const match of prepared.matchAll(/[\p{Script=Han}]+|[a-z]+|\d+/gu)) {
    const segment = match[0];
    if (!/[\p{Script=Han}]/u.test(segment)) {
      if (segment.length > 1) tokens.push(segment);
      continue;
    }

    for (const character of segment) {
      if (DOMAIN_SINGLE_CHARACTERS.has(character)) tokens.push(character);
    }
    for (const size of [2, 3]) {
      for (let index = 0; index <= segment.length - size; index += 1) {
        tokens.push(segment.slice(index, index + size));
      }
    }
  }

  return tokens;
}

export function uniqueQueryTokens(value: string) {
  return [...new Set(tokenizeChineseText(value, { query: true }))];
}
