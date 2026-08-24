import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputDirectory = path.resolve(process.argv[3] ?? "screenshots");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
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

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.locator('svg[role="group"]').waitFor({ state: "visible" });
  const outputPath = path.join(outputDirectory, `homepage-deep-blue-${viewport.name}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector("#explore");
    const divider = document.querySelector(".ocean-foam-divider");
    const heroImage = document.querySelector(".hero-water-image");
    return {
      innerWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      cityShapes: document.querySelectorAll('#cities [data-city-shape]').length,
      heroBackground: hero ? getComputedStyle(hero).backgroundColor : null,
      dividerHeight: divider ? divider.getBoundingClientRect().height : 0,
      heroImageLoaded:
        heroImage instanceof HTMLImageElement && heroImage.complete && heroImage.naturalWidth > 0,
    };
  });

  results.push({ outputPath, viewport, metrics, consoleErrors });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();

if (
  results.some(
    ({ metrics, consoleErrors }) =>
      metrics.documentScrollWidth > metrics.innerWidth ||
      metrics.bodyScrollWidth > metrics.innerWidth ||
      metrics.cityShapes !== 13 ||
      metrics.dividerHeight < 70 ||
      !metrics.heroImageLoaded ||
      consoleErrors.length,
  )
) {
  process.exitCode = 2;
}
