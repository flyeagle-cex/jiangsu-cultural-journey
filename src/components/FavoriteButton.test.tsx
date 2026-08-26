// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FavoriteButton, type FavoriteButtonProps } from "@/components/FavoriteButton";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let container: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

function renderButton(props: FavoriteButtonProps) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<FavoriteButton {...props} />));
  return container.querySelector("button");
}

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("FavoriteButton", () => {
  it("renders the inactive Chinese state and triggers onToggle", () => {
    const onToggle = vi.fn();
    const button = renderButton({
      active: false,
      label: "收藏城市",
      activeLabel: "已收藏",
      ariaLabel: "收藏南京",
      activeAriaLabel: "取消收藏南京",
      onToggle,
    });

    expect(button?.textContent).toContain("收藏城市");
    expect(button?.getAttribute("aria-label")).toBe("收藏南京");
    expect(button?.getAttribute("aria-pressed")).toBe("false");
    expect(button?.getAttribute("data-favorite-state")).toBe("unsaved");

    act(() => button?.click());
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders the active English state without relying on color alone", () => {
    const button = renderButton({
      active: true,
      label: "Save Work",
      activeLabel: "Saved",
      ariaLabel: "Save One Water, One Grace",
      activeAriaLabel: "Remove One Water, One Grace from saved creative works",
      onToggle: vi.fn(),
      compact: true,
    });

    expect(button?.textContent).toContain("Saved");
    expect(button?.getAttribute("aria-label")).toBe(
      "Remove One Water, One Grace from saved creative works",
    );
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(button?.getAttribute("data-favorite-state")).toBe("saved");
  });
});
