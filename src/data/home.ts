import { cityManifest } from "@/data/city-manifest";
import type { BilingualText, CitySlug } from "@/types/city";

export type LocalizedText = BilingualText;

export type CityMarker = {
  slug: CitySlug;
  mapName: string;
  name: BilingualText;
  label: BilingualText;
  coordinates: [longitude: number, latitude: number];
};

/** The homepage map is a view of the canonical city dataset, not a second copy. */
export const cityMarkers: CityMarker[] = cityManifest.map((city) => ({
  slug: city.slug,
  mapName: city.mapName,
  name: city.name,
  label: city.tagline,
  coordinates: city.coordinates,
}));

export type ThemeItem = {
  id: string;
  title: BilingualText;
  description: BilingualText;
  image: string;
};

export const themeItems: ThemeItem[] = [
  {
    id: "canal",
    title: { zh: "大运河", en: "Grand Canal" },
    description: { zh: "沿水路读懂城市兴衰", en: "Follow the waterway through centuries of city life" },
    image: "/assets/theme-grand-canal.jpeg",
  },
  {
    id: "nature",
    title: { zh: "自然风光", en: "Nature" },
    description: { zh: "从黄海湿地到太湖烟波", en: "From Yellow Sea wetlands to Lake Tai" },
    image: "/assets/theme-nature.jpg",
  },
  {
    id: "history",
    title: { zh: "历史文化", en: "History" },
    description: { zh: "六朝、汉韵与江南文脉", en: "Six Dynasties, Han heritage and Jiangnan learning" },
    image: "/assets/theme-history.jpeg",
  },
  {
    id: "heritage",
    title: { zh: "非遗", en: "Living Heritage" },
    description: { zh: "看见手艺如何延续至今", en: "Meet the crafts still practiced today" },
    image: "/assets/theme-heritage.jpg",
  },
  {
    id: "food",
    title: { zh: "特色美食", en: "Food" },
    description: { zh: "从淮扬味道认识一座城", en: "Understand a city through its table" },
    image: "/assets/theme-food.jpg",
  },
];
