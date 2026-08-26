import { BRAND_NAME } from "@/data/brand";
import { CITY_SECTION_LABELS, CITY_SECTION_ORDER, type BilingualText, type CitySectionId } from "@/types/city";

export type ShuiLingMode = "welcome" | "guide" | "assistant";

export type ShuiLingPageKind = "home" | "city" | "not-found";

export type ShuiLingActionKind = "navigate" | "anchor" | "coming-soon";

export type ShuiLingGuideAction = {
  id: string;
  kind: ShuiLingActionKind;
  label: BilingualText;
  target?: string;
  sectionId?: CitySectionId;
  status?: BilingualText;
};

export type ShuiLingAssets = {
  avatar: string;
  poster: string;
  welcomeVideo: string | null;
};

export const SHUILING_ASSETS: ShuiLingAssets = {
  avatar: "/assets/shuiling/shuiling-avatar.webp",
  poster: "/assets/shuiling/shuiling-guide-poster.webp",
  welcomeVideo: null,
};

export const SHUILING_COPY = {
  name: { zh: "水灵 · 江苏数字文化向导", en: "Shuiling · Jiangsu Cultural Guide" },
  welcomeTitle: { zh: `欢迎来到${BRAND_NAME.zh}`, en: `Welcome to ${BRAND_NAME.en}` },
  welcomeBody: {
    zh: "我是水灵，让我陪你一起游历江苏十三市。",
    en: "I'm Shuiling. Let me guide you through Jiangsu's thirteen cities.",
  },
  start: { zh: "开始探索", en: "Start Exploring" },
  later: { zh: "稍后再看", en: "Maybe Later" },
  homePrompt: {
    zh: "不知道从哪开始？我可以带你逛逛。",
    en: "Not sure where to begin? I can show you around.",
  },
  cityPrompt: {
    zh: "想更了解这座城市吗？跟着我继续看看吧。",
    en: "Want to discover more of this city? I'll guide you through it.",
  },
  notFoundPrompt: {
    zh: "好像走错水路啦。我们换条路继续吧。",
    en: "This waterway seems unfamiliar. Let's find another route.",
  },
  cityContents: { zh: "城市导览", en: "City Guide" },
  futureServices: { zh: "后续服务", en: "Coming Next" },
} as const satisfies Record<string, BilingualText>;

export const HOME_GUIDE_ACTIONS: ShuiLingGuideAction[] = [
  {
    id: "cities",
    kind: "navigate",
    label: { zh: "探索十三市", en: "Explore the 13 Cities" },
    target: "/#cities",
  },
  {
    id: "themes",
    kind: "navigate",
    label: { zh: "主题文化", en: "Cultural Themes" },
    target: "/#themes",
  },
  {
    id: "ask",
    kind: "coming-soon",
    label: { zh: "问问水灵", en: "Ask Shuiling" },
    status: {
      zh: "下一阶段，我就可以回答你的江苏文化问题啦。",
      en: "In the next stage, I'll be ready to answer your Jiangsu culture questions.",
    },
  },
];

export const FUTURE_GUIDE_ACTIONS: ShuiLingGuideAction[] = [
  {
    id: "creative",
    kind: "coming-soon",
    label: { zh: "文创中心", en: "Creative Center" },
    status: { zh: "文创中心即将开放。", en: "The Creative Center is coming soon." },
  },
  {
    id: "favorites",
    kind: "navigate",
    label: { zh: "我的收藏", en: "My Favorites" },
    target: "/user",
  },
];

export const NOT_FOUND_GUIDE_ACTIONS: ShuiLingGuideAction[] = [
  {
    id: "cities",
    kind: "navigate",
    label: { zh: "返回十三市地图", en: "Return to the 13-city Map" },
    target: "/#cities",
  },
  {
    id: "home",
    kind: "navigate",
    label: { zh: "返回首页", en: "Return Home" },
    target: "/",
  },
];

export function getCityGuideActions(): ShuiLingGuideAction[] {
  return CITY_SECTION_ORDER.map((sectionId) => ({
    id: sectionId,
    kind: "anchor" as const,
    label: CITY_SECTION_LABELS[sectionId],
    sectionId,
    target: `#city-${sectionId}`,
  }));
}
