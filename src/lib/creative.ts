import { creativeManifest } from "@/data/creative-manifest";
import type { CitySlug } from "@/types/city";
import type { CreativeProject, CreativeSlug, CreativeTheme } from "@/types/creative";

export const CREATIVE_CENTER_PATH = "/creative";
export const CREATIVE_DETAIL_PATH = "/creative/:slug";

export function getCreativeProjectPath(slug: CreativeSlug): string {
  return `${CREATIVE_CENTER_PATH}/${slug}`;
}

export function getCreativeProjectBySlug(slug: string | undefined): CreativeProject | undefined {
  return creativeManifest.find((project) => project.slug === slug);
}

export function getCreativeProjectsByCity(citySlug: CitySlug): CreativeProject[] {
  return creativeManifest.filter((project) => project.citySlugs.includes(citySlug));
}

export function getCreativeProjectsByTheme(theme: CreativeTheme): CreativeProject[] {
  return creativeManifest.filter((project) => project.themes.includes(theme));
}

export function getPublishedCreativeProjects(
  projects: readonly CreativeProject[] = creativeManifest,
): CreativeProject[] {
  return projects.filter((project) => project.status === "published");
}

export function getPublishedCreativeProjectsByCity(
  citySlug: CitySlug,
  projects: readonly CreativeProject[] = creativeManifest,
): CreativeProject[] {
  return getPublishedCreativeProjects(projects)
    .filter((project) => project.citySlugs.includes(citySlug))
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.slug.localeCompare(right.slug),
    );
}

export function getFeaturedCreativeProjects(): CreativeProject[] {
  return getPublishedCreativeProjects()
    .filter((project) => project.featured)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function isCreativeSlug(value: string): value is CreativeSlug {
  return creativeManifest.some((project) => project.slug === value);
}
