import type { CitySlug } from "@/types/city";
import type { CreativeSlug } from "@/types/creative";

export type UserSavedState = {
  version: 1;
  favoriteCities: CitySlug[];
  favoriteCreativeProjects: CreativeSlug[];
};

