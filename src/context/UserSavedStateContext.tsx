import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_USER_SAVED_STATE,
  USER_SAVED_STATE_KEY,
  clearJourneyInterests,
  isFavoriteCity,
  isFavoriteCreativeProject,
  isJourneyInterestSelected,
  readUserSavedState,
  toggleFavoriteCity,
  toggleFavoriteCreativeProject,
  toggleJourneyInterest,
  writeUserSavedState,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import type { CitySlug } from "@/types/city";
import type { CreativeSlug } from "@/types/creative";
import type { JourneyInterest } from "@/types/user-preferences";
import type { UserSavedState } from "@/types/user-saved-state";

type UserSavedStateContextValue = {
  favoriteCities: CitySlug[];
  favoriteCreativeProjects: CreativeSlug[];
  interests: JourneyInterest[];
  toggleCity: (slug: CitySlug) => void;
  toggleCreative: (slug: CreativeSlug) => void;
  toggleInterest: (interest: JourneyInterest) => void;
  clearAll: () => void;
  clearInterests: () => void;
  isCityFavorite: (slug: CitySlug) => boolean;
  isCreativeFavorite: (slug: CreativeSlug) => boolean;
  isInterestSelected: (interest: JourneyInterest) => boolean;
};

type UserSavedStateProviderProps = {
  children: ReactNode;
  storage?: UserSavedStateStorage | null;
};

const UserSavedStateContext = createContext<UserSavedStateContextValue | null>(null);

function createDefaultState(): UserSavedState {
  return {
    ...DEFAULT_USER_SAVED_STATE,
    favoriteCities: [],
    favoriteCreativeProjects: [],
    interests: [],
  };
}

export function UserSavedStateProvider({ children, storage }: UserSavedStateProviderProps) {
  const [state, setState] = useState<UserSavedState>(() => readUserSavedState(storage));

  useEffect(() => {
    writeUserSavedState(state, storage);
  }, [state, storage]);

  useEffect(() => {
    if (storage !== undefined || typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === USER_SAVED_STATE_KEY || event.key === null) {
        setState(readUserSavedState());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storage]);

  const toggleCity = useCallback((slug: CitySlug) => {
    setState((currentState) => toggleFavoriteCity(currentState, slug));
  }, []);

  const toggleCreative = useCallback((slug: CreativeSlug) => {
    setState((currentState) => toggleFavoriteCreativeProject(currentState, slug));
  }, []);

  const toggleInterest = useCallback((interest: JourneyInterest) => {
    setState((currentState) => toggleJourneyInterest(currentState, interest));
  }, []);

  const clearAll = useCallback(() => setState(createDefaultState()), []);
  const clearInterests = useCallback(
    () => setState((currentState) => clearJourneyInterests(currentState)),
    [],
  );

  const isCityFavorite = useCallback(
    (slug: CitySlug) => isFavoriteCity(state, slug),
    [state],
  );

  const isCreativeFavorite = useCallback(
    (slug: CreativeSlug) => isFavoriteCreativeProject(state, slug),
    [state],
  );

  const isInterestSelected = useCallback(
    (interest: JourneyInterest) => isJourneyInterestSelected(state, interest),
    [state],
  );

  const value = useMemo<UserSavedStateContextValue>(
    () => ({
      favoriteCities: state.favoriteCities,
      favoriteCreativeProjects: state.favoriteCreativeProjects,
      interests: state.interests,
      toggleCity,
      toggleCreative,
      toggleInterest,
      clearAll,
      clearInterests,
      isCityFavorite,
      isCreativeFavorite,
      isInterestSelected,
    }),
    [
      clearAll,
      clearInterests,
      isCityFavorite,
      isCreativeFavorite,
      isInterestSelected,
      state,
      toggleCity,
      toggleCreative,
      toggleInterest,
    ],
  );

  return <UserSavedStateContext.Provider value={value}>{children}</UserSavedStateContext.Provider>;
}

export function useSavedItems() {
  const context = useContext(UserSavedStateContext);
  if (!context) {
    throw new Error("useSavedItems must be used inside UserSavedStateProvider");
  }
  return context;
}
