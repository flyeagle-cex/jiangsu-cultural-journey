// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ShuiLingGuide } from "@/components/ShuiLingGuide";
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/context/LanguageContext";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

function renderGuide(onAskAI = vi.fn()) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root?.render(
      <MemoryRouter initialEntries={["/"]}>
        <LanguageProvider>
          <ShuiLingGuide hidden={false} mode="assistant" onAskAI={onAskAI} />
          <LocationProbe />
        </LanguageProvider>
      </MemoryRouter>,
    );
  });
  return onAskAI;
}

async function openGuide() {
  const trigger = container?.querySelector<HTMLButtonElement>(
    'button[aria-label="打开水灵导览"]',
  );
  await act(async () => trigger?.click());
}

beforeAll(() => {
  let language: string | null = "zh";
  let sessionValue: string | null = "true";
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => (key === LANGUAGE_STORAGE_KEY ? language : null),
      setItem: (key: string, value: string) => {
        if (key === LANGUAGE_STORAGE_KEY) language = value;
      },
      removeItem: (key: string) => {
        if (key === LANGUAGE_STORAGE_KEY) language = null;
      },
      clear: () => {
        language = null;
      },
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: {
      getItem: () => sessionValue,
      setItem: (_key: string, value: string) => {
        sessionValue = value;
      },
      removeItem: () => {
        sessionValue = null;
      },
      clear: () => {
        sessionValue = null;
      },
      key: () => null,
      length: 0,
    } satisfies Storage,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("ShuiLingGuide active actions", () => {
  it("opens the existing AI callback exactly once from Ask Shuiling", async () => {
    const onAskAI = renderGuide();
    await openGuide();

    const askButton = [...(container?.querySelectorAll("button") ?? [])].find((button) =>
      button.textContent?.includes("问问水灵"),
    );
    expect(askButton?.textContent).not.toContain("下一阶段");

    await act(async () => askButton?.click());
    expect(onAskAI).toHaveBeenCalledTimes(1);
    expect(onAskAI).toHaveBeenCalledWith({ citySlug: undefined });
    expect(container?.querySelector("[data-open='false']")).not.toBeNull();
  });

  it("navigates the Creative Center action to /creative", async () => {
    renderGuide();
    await openGuide();

    const creativeLink = [...(container?.querySelectorAll("a") ?? [])].find((link) =>
      link.textContent?.includes("文创中心"),
    );
    expect(creativeLink?.getAttribute("href")).toBe("/creative");

    await act(async () => creativeLink?.click());
    expect(container?.querySelector('[data-testid="location"]')?.textContent).toBe("/creative");
  });
});
