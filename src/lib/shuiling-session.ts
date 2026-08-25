export const SHUILING_WELCOME_STORAGE_KEY = "jiangsu-shuiling-welcome-seen";
export const SHUILING_WELCOME_REPLAY_EVENT = "jiangsu-shuiling-welcome-replay";
const SHUILING_CITY_HINT_PREFIX = "jiangsu-shuiling-city-hint-seen:";
const SHUILING_HOME_HINT_KEY = "jiangsu-shuiling-home-hint-seen";

function getSessionStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function hasSeenShuiLingWelcome() {
  return getSessionStorage()?.getItem(SHUILING_WELCOME_STORAGE_KEY) === "true";
}

export function dismissShuiLingWelcome() {
  getSessionStorage()?.setItem(SHUILING_WELCOME_STORAGE_KEY, "true");
}

export function showWelcomeAgain() {
  const storage = getSessionStorage();
  storage?.removeItem(SHUILING_WELCOME_STORAGE_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SHUILING_WELCOME_REPLAY_EVENT));
  }
}

export function hasSeenCityHint(citySlug: string) {
  return getSessionStorage()?.getItem(`${SHUILING_CITY_HINT_PREFIX}${citySlug}`) === "true";
}

export function markCityHintSeen(citySlug: string) {
  getSessionStorage()?.setItem(`${SHUILING_CITY_HINT_PREFIX}${citySlug}`, "true");
}

export function hasSeenHomeHint() {
  return getSessionStorage()?.getItem(SHUILING_HOME_HINT_KEY) === "true";
}

export function markHomeHintSeen() {
  getSessionStorage()?.setItem(SHUILING_HOME_HINT_KEY, "true");
}
