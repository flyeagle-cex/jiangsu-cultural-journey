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

const creativeAssetBase = "/assets/creative/water-spirit-global-voyage";

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
    coverAsset: {
      id: "cover-overview",
      src: `${creativeAssetBase}/cover-overview.webp`,
      kind: "cover",
      alt: {
        zh: "一水灵韵，万国舟行水灵主题文创系列组合展示",
        en: "Collection overview of the ShuiLing-themed cultural creative series",
      },
      width: 1273,
      height: 1800,
    },
    gallery: [
      {
        id: "gift-set",
        src: `${creativeAssetBase}/gift-set.webp`,
        kind: "scene",
        alt: {
          zh: "水灵主题文创礼盒与配套产品组合展示",
          en: "ShuiLing-themed creative gift set with coordinated products",
        },
        width: 1273,
        height: 1800,
      },
      {
        id: "collection-overview",
        src: `${creativeAssetBase}/collection-overview.webp`,
        kind: "design_board",
        alt: {
          zh: "水灵主题帽子、手机壳、眼罩、袋类、杯具与徽章系列展示",
          en: "ShuiLing-themed collection of caps, phone cases, eye masks, bags, drinkware, and badges",
        },
        width: 1273,
        height: 1800,
      },
      {
        id: "packaging-box",
        src: `${creativeAssetBase}/packaging-box.webp`,
        kind: "packaging",
        alt: {
          zh: "蓝色水灵主题文创礼盒包装展示",
          en: "Blue ShuiLing-themed cultural creative gift box packaging",
        },
        width: 1273,
        height: 1800,
      },
      {
        id: "cap",
        src: `${creativeAssetBase}/cap.webp`,
        kind: "product",
        alt: { zh: "浅蓝色水灵主题棒球帽", en: "Light blue ShuiLing-themed baseball cap" },
        width: 1273,
        height: 1800,
      },
      {
        id: "phone-cases",
        src: `${creativeAssetBase}/phone-cases.webp`,
        kind: "product",
        alt: {
          zh: "水灵主题蓝色与透明手机壳",
          en: "Blue and transparent ShuiLing-themed phone cases",
        },
        width: 1273,
        height: 1800,
      },
      {
        id: "eye-mask",
        src: `${creativeAssetBase}/eye-mask.webp`,
        kind: "product",
        alt: { zh: "浅蓝色水灵主题眼罩", en: "Light blue ShuiLing-themed eye mask" },
        width: 1273,
        height: 1800,
      },
      {
        id: "tote-bag",
        src: `${creativeAssetBase}/tote-bag.webp`,
        kind: "product",
        alt: { zh: "白色水灵主题帆布袋", en: "White ShuiLing-themed tote bag" },
        width: 1273,
        height: 1800,
      },
      {
        id: "drawstring-pouch",
        src: `${creativeAssetBase}/drawstring-pouch.webp`,
        kind: "product",
        alt: {
          zh: "白色水灵主题抽绳收纳袋",
          en: "White ShuiLing-themed drawstring pouch",
        },
        width: 1273,
        height: 1800,
      },
      {
        id: "bottle",
        src: `${creativeAssetBase}/bottle.webp`,
        kind: "product",
        alt: { zh: "浅蓝色水灵主题保温杯", en: "Light blue ShuiLing-themed insulated bottle" },
        width: 1273,
        height: 1800,
      },
      {
        id: "badges",
        src: `${creativeAssetBase}/badges.webp`,
        kind: "product",
        alt: { zh: "水灵主题圆形徽章", en: "Round ShuiLing-themed badges" },
        width: 1273,
        height: 1800,
      },
      {
        id: "mugs",
        src: `${creativeAssetBase}/mugs.webp`,
        kind: "product",
        alt: { zh: "蓝色与白色水灵主题马克杯", en: "Blue and white ShuiLing-themed mugs" },
        width: 1273,
        height: 1800,
      },
    ],
    sourceArchive: {
      fileName: "一水灵韵，万国舟行.zip",
      entryCount: 12,
    },
    sourceAssets: [
      { id: "source-01", fileName: "1.png", width: 4961, height: 7016, observedKind: "cover" },
      { id: "source-02", fileName: "2.png", width: 4961, height: 7016, observedKind: "scene" },
      { id: "source-03", fileName: "3.png", width: 4961, height: 7016, observedKind: "design_board" },
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
