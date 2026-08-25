import type {
  CreativeCategory,
  CreativeProject,
  CreativeTheme,
} from "@/types/creative";
import type { BilingualText } from "@/types/city";

export const creativeCategoryLabels: Record<CreativeCategory, BilingualText> = {
  cultural_ip: { zh: "文化 IP", en: "Cultural IP" },
  daily_goods: { zh: "生活用品", en: "Daily Goods" },
  souvenir: { zh: "文化纪念", en: "Cultural Souvenirs" },
};

export const creativeThemeLabels: Record<CreativeTheme, BilingualText> = {
  water_culture: { zh: "水文化", en: "Water Culture" },
  international_exchange: { zh: "国际交流", en: "International Exchange" },
};

export const creativeManifest: CreativeProject[] = [
  {
    slug: "water-spirit-global-voyage",
    name: {
      zh: "一水灵韵，万国舟行",
      // TODO: confirm the official English title with the user.
      en: "Yi Shui Ling Yun, Global Voyages",
    },
    subtitle: null,
    description: null,
    concept: null,
    scope: "jiangsu",
    citySlugs: [],
    categories: ["cultural_ip", "daily_goods", "souvenir"],
    themes: ["water_culture", "international_exchange"],
    culturalLinks: [
      {
        type: "waterways",
        title: { zh: "水文化", en: "Water Culture" },
      },
      {
        type: "other",
        title: { zh: "国际交流", en: "International Exchange" },
      },
    ],
    coverAsset: null,
    gallery: [],
    sourceArchive: {
      fileName: "一水灵韵，万国舟行.zip",
      entryCount: 12,
    },
    sourceAssets: [
      { id: "source-01", fileName: "1.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-02", fileName: "2.png", width: 4961, height: 7016, observedKind: null },
      { id: "source-03", fileName: "3.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-04", fileName: "4.png", width: 4961, height: 7016, observedKind: "packaging" },
      { id: "source-05", fileName: "5.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-06", fileName: "6.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-07", fileName: "7.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-08", fileName: "8.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-09", fileName: "9.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-10", fileName: "10.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-11", fileName: "11.png", width: 4961, height: 7016, observedKind: "product" },
      { id: "source-12", fileName: "12.png", width: 4961, height: 7016, observedKind: "product" },
    ],
    designer: null,
    year: null,
    status: "published",
    featured: true,
    sortOrder: 1,
    metadataProvenance: {
      nameZh: "userProvided",
      nameEn: "temporaryTranslation",
      scope: "derived",
      categories: "derived",
      themes: "derived",
      sourceAssets: "userProvided",
    },
  },
];
