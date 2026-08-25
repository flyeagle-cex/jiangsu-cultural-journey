import type { BilingualText, CitySlug } from "@/types/city";

export type CreativeSlug = "water-spirit-global-voyage";

export type CreativeCategory = "cultural_ip" | "daily_goods" | "souvenir";

export type CreativeTheme = "water_culture" | "international_exchange";

export type CreativeAssetKind =
  | "cover"
  | "product"
  | "packaging"
  | "detail"
  | "scene"
  | "concept"
  | "design_board"
  | "other";

export type CreativeAsset = {
  id: string;
  src: string;
  alt: BilingualText;
  kind: CreativeAssetKind;
  width?: number;
  height?: number;
};

/**
 * Read-only inventory for original files that have not yet been prepared as
 * public web assets. It intentionally has no URL so pages cannot accidentally
 * load the large source artwork.
 */
export type CreativeSourceAsset = {
  id: string;
  fileName: string;
  width: number;
  height: number;
  observedKind: CreativeAssetKind | null;
};

export type CreativeCulturalLink = {
  type: "city" | "waterways" | "heritage" | "history" | "food" | "story" | "other";
  title: BilingualText;
  citySlug?: CitySlug;
};

export type CreativeContentProvenance =
  | "userProvided"
  | "derived"
  | "temporaryTranslation";

export type CreativeProject = {
  slug: CreativeSlug;
  name: BilingualText;
  subtitle: BilingualText | null;
  description: BilingualText | null;
  concept: BilingualText | null;
  scope: "jiangsu" | "city" | "multi-city";
  citySlugs: CitySlug[];
  categories: CreativeCategory[];
  themes: CreativeTheme[];
  culturalLinks: CreativeCulturalLink[];
  coverAsset: CreativeAsset | null;
  gallery: CreativeAsset[];
  sourceArchive: {
    fileName: string;
    entryCount: number;
  };
  sourceAssets: CreativeSourceAsset[];
  designer: string | null;
  year: number | null;
  status: "published" | "draft";
  featured: boolean;
  sortOrder: number;
  metadataProvenance: {
    nameZh: CreativeContentProvenance;
    nameEn: CreativeContentProvenance;
    categories: CreativeContentProvenance;
    themes: CreativeContentProvenance;
    sourceAssets: CreativeContentProvenance;
  };
};
