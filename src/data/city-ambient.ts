import type { CitySlug } from "@/types/city";

export type CitySkylineKind =
  | "ming-wall"
  | "garden-gate"
  | "taihu-bridge"
  | "tianning-pagoda"
  | "jinshan-temple"
  | "five-pavilion-bridge"
  | "opera-pavilion"
  | "river-port"
  | "wetland-tower"
  | "canal-gate"
  | "lake-bridge"
  | "han-gate"
  | "mountain-harbor"
  | "jiangsu-journey";

export type CityAmbientConfig = {
  skyline: CitySkylineKind;
  lineColor: string;
  landmark: string;
};

/**
 * Each city receives one restrained, place-specific skyline motif.
 * The landmark string is intentionally kept as data for visual QA and
 * future bilingual documentation; the SVG remains decorative in the UI.
 */
export const CITY_AMBIENT_CONFIGS: Record<CitySlug, CityAmbientConfig> = {
  nanjing: { skyline: "ming-wall", lineColor: "#EAF1F9", landmark: "明城墙与秦淮画舫" },
  suzhou: { skyline: "garden-gate", lineColor: "#C1DDDB", landmark: "园林屋檐、东方之门与水桥" },
  wuxi: { skyline: "taihu-bridge", lineColor: "#C1DDDB", landmark: "太湖长桥与湖畔塔影" },
  changzhou: { skyline: "tianning-pagoda", lineColor: "#EAF1F9", landmark: "天宁寺塔与运河城廓" },
  zhenjiang: { skyline: "jinshan-temple", lineColor: "#D6CDBE", landmark: "金山寺塔与江河岸线" },
  yangzhou: { skyline: "five-pavilion-bridge", lineColor: "#D6CDBE", landmark: "五亭桥、园林与画舫" },
  taizhou: { skyline: "opera-pavilion", lineColor: "#C1DDDB", landmark: "望海楼与戏曲水榭" },
  nantong: { skyline: "river-port", lineColor: "#C1DDDB", landmark: "濠河城廓、风筝与江港" },
  yancheng: { skyline: "wetland-tower", lineColor: "#EAF1F9", landmark: "湿地观景塔、芦苇与丹顶鹤" },
  huaian: { skyline: "canal-gate", lineColor: "#C1DDDB", landmark: "清江浦闸与漕运水门" },
  suqian: { skyline: "lake-bridge", lineColor: "#C1DDDB", landmark: "骆马湖桥与项王故里城廓" },
  xuzhou: { skyline: "han-gate", lineColor: "#D6CDBE", landmark: "彭城汉阙与云龙山廓" },
  lianyungang: { skyline: "mountain-harbor", lineColor: "#C1DDDB", landmark: "花果山、海港与云台塔影" },
};

export const USER_CENTER_AMBIENT_CONFIG: CityAmbientConfig = {
  skyline: "jiangsu-journey",
  lineColor: "#C1DDDB",
  landmark: "运河桥、塔影与江南水岸",
};
