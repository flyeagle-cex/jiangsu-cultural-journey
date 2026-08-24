export type Language = "zh" | "en";

/** Text that is already ready for both language modes. */
export type BilingualText = {
  zh: string;
  en: string;
};

/** Chinese-first text used only while ingesting or revising source material. */
export type DraftTranslatableText = {
  zh: string;
  en?: string;
};

/** Published city content is complete in both supported languages. */
export type TranslatableText = BilingualText;

export type CitySlug =
  | "nanjing"
  | "suzhou"
  | "wuxi"
  | "changzhou"
  | "zhenjiang"
  | "yangzhou"
  | "taizhou"
  | "nantong"
  | "yancheng"
  | "huaian"
  | "suqian"
  | "xuzhou"
  | "lianyungang";

export type CitySectionId =
  | "overview"
  | "nature"
  | "history"
  | "heritage"
  | "food"
  | "waterways";

export type CityDataStatus = "brief" | "expanded" | "reviewed";

export type CityHighlight = {
  /** Stable within a city and suitable for future anchors or RAG chunk IDs. */
  id: string;
  title: TranslatableText;
  summary: TranslatableText;
  keywords: string[];
  mediaIds?: string[];
};

export type CitySection = {
  id: CitySectionId;
  intro: TranslatableText;
  highlights: CityHighlight[];
};

export type CitySourceDocument = {
  kind: "docx";
  fileName: string;
  dataStatus: CityDataStatus;
  note: string;
};

export type CityMedia = {
  id: string;
  kind: "image" | "video";
  src: string;
  alt: TranslatableText;
  credit?: string;
};

export type CityMapIdentity = {
  slug: CitySlug;
  order: number;
  adcode: number;
  mapName: string;
  name: BilingualText;
  tagline: BilingualText;
  coordinates: [longitude: number, latitude: number];
};

export type City = CityMapIdentity & {
  summary: TranslatableText;
  searchTerms: {
    zh: string[];
    en: string[];
  };
  sections: CitySection[];
  media: CityMedia[];
  sources: CitySourceDocument[];
};

export type CityDraftHighlight = Omit<CityHighlight, "title" | "summary"> & {
  title: DraftTranslatableText;
  summary: DraftTranslatableText;
};

export type CityDraftSection = Omit<CitySection, "intro" | "highlights"> & {
  intro: DraftTranslatableText;
  highlights: CityDraftHighlight[];
};

export type CityDraft = Omit<City, "summary" | "sections"> & {
  summary: DraftTranslatableText;
  sections: CityDraftSection[];
};

export const CITY_SECTION_ORDER = [
  "overview",
  "nature",
  "history",
  "heritage",
  "food",
  "waterways",
] as const satisfies readonly CitySectionId[];

export const CITY_SECTION_LABELS: Record<CitySectionId, BilingualText> = {
  overview: { zh: "城市名片", en: "City Profile" },
  nature: { zh: "自然风光", en: "Nature" },
  history: { zh: "历史文化", en: "History & Culture" },
  heritage: { zh: "非遗技能", en: "Living Heritage" },
  food: { zh: "特色美食", en: "Local Food" },
  waterways: { zh: "大运河与水系", en: "Grand Canal & Waterways" },
};

export function resolveText(text: TranslatableText, language: Language) {
  return text[language];
}
