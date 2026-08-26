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
  isFavoriteCity,
  isFavoriteCreativeProject,
  readUserSavedState,
  toggleFavoriteCity,
  toggleFavoriteCreativeProject,
  writeUserSavedState,
  type UserSavedStateStorage,
} from "@/lib/user-saved-state";
import type { CitySlug } from "@/types/city";
import type { CreativeSlug } from "@/types/creative";
import type { UserSavedState } from "@/types/user-saved-state";

type UserSavedStateContextValue = {
  favoriteCities: CitySlug[];
  favoriteCreativeProjects: CreativeSlug[];
  toggleCity: (slug: CitySlug) => void;
  toggleCreative: (slug: CreativeSlug) => void;
  clearAll: () => void;
  isCityFavorite: (slug: CitySlug) => boolean;
  isCreativeFavorite: (slug: CreativeSlug) => boolean;
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

  const clearAll = useCallback(() => setState(createDefaultState()), []);

  const isCityFavorite = useCallback(
    (slug: CitySlug) => isFavoriteCity(state, slug),
    [state],
  );

  const isCreativeFavorite = useCallback(
    (slug: CreativeSlug) => isFavoriteCreativeProject(state, slug),
    [state],
  );

  const value = useMemo<UserSavedStateContextValue>(
    () => ({
      favoriteCities: state.favoriteCities,
      favoriteCreativeProjects: state.favoriteCreativeProjects,
      toggleCity,
      toggleCreative,
      clearAll,
      isCityFavorite,
      isCreativeFavorite,
    }),
    [clearAll, isCityFavorite, isCreativeFavorite, state, toggleCity, toggleCreative],
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

