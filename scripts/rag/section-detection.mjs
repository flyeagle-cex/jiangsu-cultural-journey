const MAIN_ARABIC_HEADING = /^\s*\d+[、.．](?!\d)\s*/u;
const MAIN_CHINESE_HEADING = /^\s*[一二三四五六七八九十]+[、.．]\s*/u;
const SUB_ARABIC_HEADING = /^\s*\d+(?:\.\d+){1,3}\s*/u;
const SUB_CHINESE_HEADING = /^\s*[（(][一二三四五六七八九十]+[）)]\s*/u;
const STANDALONE_SPECIAL_HEADING = /^(?:资料来源|参考资料|参考文献|信息来源|来源说明|主题线路|文化线路|旅游线路|游览线路|推荐路线|主题路线|人物故事|文化故事|民间故事|历史故事)$/u;

function isCanonicalSectionHeading(text) {
  const value = stripHeadingNumber(text).replace(/\s+/gu, "");
  return /^(?:城市名片|城市概况|总体概况|城市印象|概况|自然风光|自然景观|生态环境|历史文化|历史沿革|城市历史|非物质文化遗产|非遗技能|非遗技艺|传统技艺|特色美食|地方美食|饮食文化|大运河|运河水系|水系文化|水文化|主题线路|文化线路|旅游线路|人物故事|文化故事|参考资料|参考文献|资料来源|展示建议|国际传播|其他专题|附录)/u.test(value);
}

export function stripHeadingNumber(text) {
  return text
    .replace(MAIN_ARABIC_HEADING, "")
    .replace(MAIN_CHINESE_HEADING, "")
    .replace(SUB_ARABIC_HEADING, "")
    .replace(SUB_CHINESE_HEADING, "")
    .trim();
}

export function isStandaloneSpecialHeading(text) {
  const normalized = text.trim().replace(/[：:]$/u, "").replace(/\s+/gu, "");
  if (
    MAIN_ARABIC_HEADING.test(normalized) ||
    MAIN_CHINESE_HEADING.test(normalized) ||
    SUB_ARABIC_HEADING.test(normalized) ||
    SUB_CHINESE_HEADING.test(normalized)
  ) {
    return false;
  }
  return STANDALONE_SPECIAL_HEADING.test(normalized);
}

export function inferHeading(
  text,
  { htmlLevel = null, isStrong = false, isInTable = false } = {},
) {
  const normalized = text.trim();
  if (!normalized || normalized.length > 80) return null;

  if (htmlLevel) {
    return {
      level: htmlLevel,
      isMain:
        htmlLevel === 1 || (MAIN_CHINESE_HEADING.test(normalized) && isCanonicalSectionHeading(normalized)),
      title: normalized,
    };
  }

  // Word tables often use bold, short labels for column headings. Unless Word
  // emitted a real h1-h6 element above, table cells remain content and cannot
  // mutate the document-wide section state.
  if (isInTable) return null;

  if (/文化资料库/u.test(normalized) && normalized.length <= 40) {
    return { level: 1, isMain: true, title: normalized };
  }

  if (
    (MAIN_ARABIC_HEADING.test(normalized) || MAIN_CHINESE_HEADING.test(normalized)) &&
    isCanonicalSectionHeading(normalized)
  ) {
    return { level: 1, isMain: true, title: normalized };
  }

  if (SUB_ARABIC_HEADING.test(normalized) || SUB_CHINESE_HEADING.test(normalized)) {
    const colonIndex = normalized.search(/[:：]/u);
    if (colonIndex >= 0 && normalized.length - colonIndex > 18) return null;
    return { level: 2, isMain: false, title: normalized };
  }

  if (isStrong && normalized.length <= 32 && detectKnowledgeSection(normalized)) {
    return { level: 2, isMain: false, title: normalized };
  }

  return null;
}

export function detectKnowledgeSection(title) {
  const value = stripHeadingNumber(title).replace(/[\s/]+/gu, "");
  if (!value) return null;

  if (/参考资料|参考文献|资料来源|信息来源|来源说明/u.test(value)) return "reference";
  if (/主题线路|文化线路|旅游线路|游览线路|推荐路线|主题路线/u.test(value)) return "route";
  if (/人物故事|文化故事|民间故事|历史故事|传说|典故/u.test(value)) return "story";
  if (/城市名片|城市概况|总体概况|城市印象|地理位置|概况/u.test(value)) return "overview";
  if (/自然风光|自然景观|生态景观|生态环境|山水风光/u.test(value)) return "nature";
  if (/历史文化|历史沿革|城市历史|历史遗迹/u.test(value)) return "history";
  if (/非物质文化遗产|非遗技能|非遗技艺|传统技艺|非遗/u.test(value)) return "heritage";
  if (/特色美食|地方美食|饮食文化|地方名吃|美食/u.test(value)) return "food";
  if (/大运河|运河水系|水系文化|水文化|江河水系|水系|漕运/u.test(value)) return "waterways";
  if (/展示建议|国际传播|其他专题|附录/u.test(value)) return "other";
  return null;
}

export function inferInlineTitle(text) {
  const match = text.match(/^\s*[·•-]?\s*((?:\d+(?:\.\d+){1,3}\s*)?[^：:]{2,42})[:：]\s*(.{12,})$/u);
  if (!match) return null;
  return match[1].trim();
}
