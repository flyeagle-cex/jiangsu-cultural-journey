import { cityIdentityBySlug } from "@/data/city-manifest";
import { CITY_SECTION_LABELS, type BilingualText, type CitySectionId, type CitySlug } from "@/types/city";

export type CityVisual = {
  src: string;
  alt: BilingualText;
  objectPosition?: string;
};

export const cityHeroVisuals: Record<CitySlug, CityVisual> = {
  nanjing: {
    src: "/assets/cities/nanjing.jpeg",
    alt: { zh: "南京秦淮河夜景与画舫", en: "Night view and painted boats on Nanjing's Qinhuai River" },
    objectPosition: "center 52%",
  },
  suzhou: {
    src: "/assets/cities/suzhou.jpeg",
    alt: { zh: "苏州古城与北寺塔远景", en: "Suzhou old city and Beisi Pagoda" },
    objectPosition: "center 48%",
  },
  wuxi: {
    src: "/assets/cities/wuxi.jpeg",
    alt: { zh: "无锡古运河水弄堂夜景", en: "Night view of Wuxi's ancient canal neighbourhood" },
    objectPosition: "center 55%",
  },
  changzhou: {
    src: "/assets/cities/changzhou.jpeg",
    alt: { zh: "常州淹城遗址与水系鸟瞰", en: "Aerial view of the Yancheng ruins and waterways in Changzhou" },
    objectPosition: "center 45%",
  },
  zhenjiang: {
    src: "/assets/cities/zhenjiang.jpeg",
    alt: { zh: "镇江城市河道与水岸", en: "Urban waterway and riverbank in Zhenjiang" },
    objectPosition: "center 50%",
  },
  yangzhou: {
    src: "/assets/cities/yangzhou.png",
    alt: { zh: "扬州春日水巷与游船", en: "A tour boat on a spring waterway in Yangzhou" },
    objectPosition: "center 50%",
  },
  taizhou: {
    src: "/assets/cities/taizhou.jpeg",
    alt: { zh: "泰州凤城河与古城夜景", en: "Night view of Taizhou's Fengcheng River and old city" },
    objectPosition: "center 42%",
  },
  nantong: {
    src: "/assets/cities/nantong.jpeg",
    alt: { zh: "南通城市水系鸟瞰", en: "Aerial view of Nantong's urban waterways" },
    objectPosition: "center 50%",
  },
  yancheng: {
    src: "/assets/cities/yancheng.jpeg",
    alt: { zh: "盐城湖荡芦苇与秋日水景", en: "Autumn reeds and wetlands in Yancheng" },
    objectPosition: "center 38%",
  },
  huaian: {
    src: "/assets/cities/huaian.jpeg",
    alt: { zh: "淮安河下古镇传统宅院", en: "Traditional courtyard in Huai'an's Hexia Ancient Town" },
    objectPosition: "center 48%",
  },
  suqian: {
    src: "/assets/cities/suqian.jpeg",
    alt: { zh: "宿迁骆马湖畔落日", en: "Sunset on the shore of Luoma Lake in Suqian" },
    objectPosition: "center 50%",
  },
  xuzhou: {
    src: "/assets/cities/xuzhou.jpeg",
    alt: { zh: "徐州云龙湖晨光", en: "Morning light over Yunlong Lake in Xuzhou" },
    objectPosition: "center 58%",
  },
  lianyungang: {
    src: "/assets/cities/lianyungang.png",
    alt: { zh: "连云港花果山猕猴与山石", en: "A macaque and mountain rock at Huaguo Mountain in Lianyungang" },
    objectPosition: "center 42%",
  },
};

type DetailSectionId = Exclude<CitySectionId, "overview">;

export const citySectionMediaFiles: Record<CitySlug, Partial<Record<DetailSectionId, string>>> = {
  nanjing: {
    nature: "/assets/cities/nanjing-nature.jpeg",
    history: "/assets/cities/nanjing-history.jpeg",
    heritage: "/assets/cities/nanjing-heritage.jpeg",
    food: "/assets/cities/nanjing-food.jpeg",
    waterways: "/assets/cities/nanjing-waterways.jpeg",
  },
  suzhou: {
    nature: "/assets/cities/suzhou-nature.jpeg",
    history: "/assets/cities/suzhou-history.jpeg",
    heritage: "/assets/cities/suzhou-heritage.jpeg",
    food: "/assets/cities/suzhou-food.jpeg",
    waterways: "/assets/cities/suzhou-waterways.jpeg",
  },
  wuxi: {
    nature: "/assets/cities/wuxi-nature.jpeg",
    history: "/assets/cities/wuxi-history.jpeg",
    heritage: "/assets/cities/wuxi-heritage.jpeg",
    food: "/assets/cities/wuxi-food.jpeg",
    waterways: "/assets/cities/wuxi-waterways.jpeg",
  },
  changzhou: {
    nature: "/assets/cities/changzhou-nature.jpeg",
    history: "/assets/cities/changzhou-history.jpeg",
    heritage: "/assets/cities/changzhou-heritage.jpeg",
    food: "/assets/cities/changzhou-food.jpeg",
    waterways: "/assets/cities/changzhou-waterways.jpeg",
  },
  zhenjiang: {
    nature: "/assets/cities/zhenjiang-nature.jpeg",
    history: "/assets/cities/zhenjiang-history.jpeg",
    heritage: "/assets/cities/zhenjiang-heritage-02.png",
    food: "/assets/cities/zhenjiang-food-02.png",
    waterways: "/assets/cities/zhenjiang-waterways.jpeg",
  },
  yangzhou: {
    nature: "/assets/cities/yangzhou-nature.png",
    history: "/assets/cities/yangzhou-history.png",
    heritage: "/assets/cities/yangzhou-heritage.png",
    food: "/assets/cities/yangzhou-food-01.png",
    waterways: "/assets/cities/yangzhou-waterways.png",
  },
  taizhou: {
    nature: "/assets/cities/taizhou-nature.jpeg",
    history: "/assets/cities/taizhou-history.jpeg",
    heritage: "/assets/cities/taizhou-heritage.jpeg",
    food: "/assets/cities/taizhou-food.jpeg",
    waterways: "/assets/cities/taizhou-waterways.jpeg",
  },
  nantong: {
    nature: "/assets/cities/nantong-nature.jpeg",
    history: "/assets/cities/nantong-history.jpeg",
    heritage: "/assets/cities/nantong-heritage.jpeg",
    food: "/assets/cities/nantong-food.jpeg",
    waterways: "/assets/cities/nantong-waterways.jpeg",
  },
  yancheng: {
    nature: "/assets/cities/yancheng-nature.jpeg",
    history: "/assets/cities/yancheng-history.jpeg",
    heritage: "/assets/cities/yancheng-heritage.jpeg",
    food: "/assets/cities/yancheng-food.jpeg",
    waterways: "/assets/cities/yancheng-waterways.jpeg",
  },
  huaian: {
    nature: "/assets/cities/huaian-nature.jpeg",
    history: "/assets/cities/huaian-history.jpeg",
    heritage: "/assets/cities/huaian-heritage.jpeg",
    food: "/assets/cities/huaian-food.png",
    waterways: "/assets/cities/huaian-waterways.jpeg",
  },
  suqian: {
    nature: "/assets/cities/suqian-nature.jpeg",
    history: "/assets/cities/suqian-history.jpeg",
    heritage: "/assets/cities/suqian-heritage.jpeg",
    food: "/assets/cities/suqian-food.png",
    waterways: "/assets/cities/suqian-waterways.jpeg",
  },
  xuzhou: {
    nature: "/assets/cities/xuzhou-nature.jpeg",
    history: "/assets/cities/xuzhou-history.jpeg",
    heritage: "/assets/cities/xuzhou-heritage.jpeg",
    food: "/assets/cities/xuzhou-food.jpeg",
    waterways: "/assets/cities/xuzhou-waterways.jpeg",
  },
  lianyungang: {
    nature: "/assets/cities/lianyungang-nature.png",
    history: "/assets/cities/lianyungang-history.png",
    heritage: "/assets/cities/lianyungang-heritage.png",
    food: "/assets/cities/lianyungang-food.png",
    waterways: "/assets/cities/lianyungang-waterways-02.png",
  },
};

type CitySectionVisualOverride = Partial<Omit<CityVisual, "src">>;

const citySectionVisualOverrides: Partial<
  Record<CitySlug, Partial<Record<DetailSectionId, CitySectionVisualOverride>>>
> = {
  zhenjiang: {
    heritage: {
      alt: {
        zh: "镇江西津渡艺人制作太平泥叫叫",
        en: "An artisan makes Taiping clay whistles at Xijin Ferry in Zhenjiang",
      },
      objectPosition: "center 35%",
    },
    food: {
      alt: {
        zh: "镇江肴肉配姜丝与香醋",
        en: "Zhenjiang cured pork served with ginger and fragrant vinegar",
      },
      objectPosition: "center 62%",
    },
  },
  yangzhou: {
    food: {
      alt: {
        zh: "扬州蟹粉狮子头与淮扬菜展示",
        en: "Yangzhou crab-roe lion's head meatballs and Huaiyang dishes",
      },
      objectPosition: "center 100%",
    },
  },
  lianyungang: {
    waterways: {
      alt: {
        zh: "连云港河道交汇与航运水网航拍",
        en: "Aerial view of intersecting waterways and shipping routes in Lianyungang",
      },
      objectPosition: "center 48%",
    },
  },
};

export function getCityHeroVisual(slug: CitySlug) {
  return cityHeroVisuals[slug];
}

export function getCitySectionVisual(slug: CitySlug, sectionId: CitySectionId): CityVisual | null {
  if (sectionId === "overview") return null;
  const src = citySectionMediaFiles[slug][sectionId];
  if (!src) return null;
  const city = cityIdentityBySlug[slug];
  const section = CITY_SECTION_LABELS[sectionId];
  const visualOverride = citySectionVisualOverrides[slug]?.[sectionId];
  return {
    src,
    alt:
      visualOverride?.alt ??
      ({
        zh: `${city.name.zh} · ${section.zh}资料图片`,
        en: `${city.name.en} · ${section.en} archive image`,
      } satisfies BilingualText),
    objectPosition: visualOverride?.objectPosition,
  };
}
