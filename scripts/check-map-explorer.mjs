import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputDirectory = path.resolve(process.argv[3] ?? "screenshots/map-explorer");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "zh-CN",
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    window.localStorage.setItem("jiangsu-cultural-journey:welcome-seen", "true");
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResponses = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(`${targetUrl}?city=suzhou`, { waitUntil: "networkidle" });
  const map = page.locator('svg[role="group"]');
  await map.waitFor({ state: "visible" });

  await page.locator('[data-city-shape="yangzhou"]').hover();
  const hoverPreviewText = await page.locator('[data-map-info="true"]').innerText();
  const cityDuringHover = new URL(page.url()).searchParams.get("city");
  await page.mouse.move(1, 1);

  const yangzhouIndex = page
    .locator('nav[aria-label="十三市索引"] button')
    .filter({ hasText: "扬州" });
  await yangzhouIndex.click();
  const cityAfterIndexClick = new URL(page.url()).searchParams.get("city");

  const yangzhouMarker = page.locator('[data-city-marker="yangzhou"]');
  await yangzhouMarker.focus();
  await yangzhouMarker.press("ArrowRight");
  await page.waitForFunction(() => new URL(window.location.href).searchParams.get("city") === "taizhou");
  const cityAfterArrow = new URL(page.url()).searchParams.get("city");

  await page.getByRole("button", { name: /六类速览/ }).click();
  const preview = page.locator('[data-map-culture-preview="true"]');
  await preview.waitFor({ state: "visible" });

  const outputPath = path.join(outputDirectory, `map-explorer-${viewport.name}.png`);
  await page.locator("#cities").screenshot({ path: outputPath });

  const metrics = await page.evaluate(() => {
    const svg = document.querySelector('svg[role="group"]');
    const info = document.querySelector('[data-map-info="true"]');
    const svgRect = svg?.getBoundingClientRect();
    const infoRect = info?.getBoundingClientRect();
    const tabbableMarkers = [...document.querySelectorAll('[data-city-marker]')].filter(
      (marker) => marker.getAttribute("tabindex") === "0",
    );

    return {
      innerWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      cityShapes: document.querySelectorAll("[data-city-shape]").length,
      cityMarkers: document.querySelectorAll("[data-city-marker]").length,
      cityIndexButtons: document.querySelectorAll('nav[aria-label="十三市索引"] button').length,
      tabbableMarkers: tabbableMarkers.length,
      selectedMarker: tabbableMarkers[0]?.getAttribute("data-city-marker") ?? null,
      canalAxis: document.querySelectorAll('[data-canal-axis="true"]').length,
      previewModules: document.querySelectorAll('[data-map-culture-preview="true"] article').length,
      mobilePanelBelowMap:
        window.innerWidth >= 640 || !svgRect || !infoRect ? true : infoRect.top >= svgRect.bottom - 1,
    };
  });

  results.push({
    viewport,
    outputPath,
    hoverPreviewShowsYangzhou: hoverPreviewText.includes("扬州"),
    cityDuringHover,
    cityAfterIndexClick,
    cityAfterArrow,
    metrics,
    consoleErrors,
    failedResponses,
  });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();

const failed = results.some(
  ({
    hoverPreviewShowsYangzhou,
    cityDuringHover,
    cityAfterIndexClick,
    cityAfterArrow,
    metrics,
    consoleErrors,
    failedResponses,
  }) =>
    !hoverPreviewShowsYangzhou ||
    cityDuringHover !== "suzhou" ||
    cityAfterIndexClick !== "yangzhou" ||
    cityAfterArrow !== "taizhou" ||
    metrics.documentScrollWidth > metrics.innerWidth ||
    metrics.bodyScrollWidth > metrics.innerWidth ||
    metrics.cityShapes !== 13 ||
    metrics.cityMarkers !== 13 ||
    metrics.cityIndexButtons !== 13 ||
    metrics.tabbableMarkers !== 1 ||
    metrics.selectedMarker !== "taizhou" ||
    metrics.canalAxis !== 1 ||
    metrics.previewModules !== 6 ||
    !metrics.mobilePanelBelowMap ||
    consoleErrors.length ||
    failedResponses.length,
);

if (failed) process.exitCode = 2;
