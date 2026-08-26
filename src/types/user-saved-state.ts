import type { CitySlug } from "@/types/city";
import type { CreativeSlug } from "@/types/creative";
import type { JourneyInterest } from "@/types/user-preferences";

export type UserSavedState = {
  version: 2;
  favoriteCities: CitySlug[];
  favoriteCreativeProjects: CreativeSlug[];
  interests: JourneyInterest[];
};
