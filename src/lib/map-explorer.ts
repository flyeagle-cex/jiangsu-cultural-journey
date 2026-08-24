import { cityMarkers, type CityMarker } from "@/data/home";
import type { CitySlug } from "@/types/city";

export const GRAND_CANAL_CITY_SLUGS = [
  "suzhou",
  "wuxi",
  "changzhou",
  "zhenjiang",
  "yangzhou",
  "huaian",
  "suqian",
  "xuzhou",
] as const satisfies readonly CitySlug[];

export function getMapCity(slug: string | null | undefined): CityMarker {
  return cityMarkers.find((city) => city.slug === slug) ?? cityMarkers[0];
}

export function getAdjacentMapCity(slug: CitySlug, step: -1 | 1): CityMarker {
  const currentIndex = cityMarkers.findIndex((city) => city.slug === slug);
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const nextIndex = (safeIndex + step + cityMarkers.length) % cityMarkers.length;
  return cityMarkers[nextIndex];
}

export function withSelectedMapCity(searchParams: URLSearchParams, slug: CitySlug) {
  const nextSearchParams = new URLSearchParams(searchParams);
  nextSearchParams.set("city", slug);
  return nextSearchParams;
}
