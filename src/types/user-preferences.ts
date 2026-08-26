import type { CitySectionId } from "@/types/city";

export type JourneyInterest = Exclude<CitySectionId, "overview">;

export const JOURNEY_INTEREST_ORDER = [
  "nature",
  "history",
  "heritage",
  "food",
  "waterways",
] as const satisfies readonly JourneyInterest[];
