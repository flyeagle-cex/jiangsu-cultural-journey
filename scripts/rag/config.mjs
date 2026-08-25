export const KNOWLEDGE_SECTIONS = [
  "overview",
  "nature",
  "history",
  "heritage",
  "food",
  "waterways",
  "route",
  "story",
  "reference",
  "other",
];

export const CITY_DEFINITIONS = [
  { slug: "nanjing", nameZh: "南京" },
  { slug: "suzhou", nameZh: "苏州" },
  { slug: "wuxi", nameZh: "无锡" },
  { slug: "changzhou", nameZh: "常州" },
  { slug: "zhenjiang", nameZh: "镇江" },
  { slug: "yangzhou", nameZh: "扬州" },
  { slug: "taizhou", nameZh: "泰州" },
  { slug: "nantong", nameZh: "南通" },
  { slug: "yancheng", nameZh: "盐城" },
  { slug: "huaian", nameZh: "淮安" },
  { slug: "suqian", nameZh: "宿迁" },
  { slug: "xuzhou", nameZh: "徐州" },
  { slug: "lianyungang", nameZh: "连云港" },
];

export const CITY_BY_SLUG = Object.fromEntries(CITY_DEFINITIONS.map((city) => [city.slug, city]));

export const DEFAULT_CHUNK_OPTIONS = {
  targetCharacters: 600,
  maxCharacters: 900,
  overlapCharacters: 90,
};
