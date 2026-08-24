import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:4173";
const outputDirectory = path.resolve("..", "_stage4-supplement-qa");
const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const welcomeStorageKey = "jiangsu-cultural-journey:welcome-seen";
const logPath = path.join(outputDirectory, "run.log");

const checks = [
  { city: "zhenjiang", section: "heritage" },
  { city: "zhenjiang", section: "food" },
  { city: "lianyungang", section: "waterways" },
  { city: "yangzhou", section: "food" },
];

await mkdir(outputDirectory, { recursive: true });
await writeFile(logPath, "visual check started\n", "utf8");

async function log(message) {
  await appendFile(logPath, `${message}\n`, "utf8");
}

await log("launching browser");
const browser = await chromium.launch({ executablePath, headless: true, timeout: 15_000 });
await log("browser launched");
const report = [];

try {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await log(`viewport ${viewport.name}`);
    const context = await browser.newContext({
      deviceScaleFactor: 1,
      viewport: { width: viewport.width, height: viewport.height },
    });
    await context.addInitScript(
      ({ key }) => window.localStorage.setItem(key, "true"),
      { key: welcomeStorageKey },
    );

    for (const check of checks) {
      await log(`opening ${check.city}/${check.section}`);
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));

      await page.goto(`${baseUrl}/city/${check.city}`, {
        timeout: 15_000,
        waitUntil: "domcontentloaded",
      });
      await log(`loaded ${check.city}/${check.section}`);
      const section = page.locator(`#city-${check.section}`);
      const image = section.locator("figure img");
      await section.scrollIntoViewIfNeeded();
      await image.waitFor({ state: "visible" });
      await image.evaluate((element) => {
        if (element.complete) return;
        return new Promise((resolve, reject) => {
          element.addEventListener("load", resolve, { once: true });
          element.addEventListener("error", reject, { once: true });
        });
      });
      const imageState = await image.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          alt: element.alt,
          naturalHeight: element.naturalHeight,
          naturalWidth: element.naturalWidth,
          objectPosition: style.objectPosition,
          src: new URL(element.currentSrc).pathname,
        };
      });
      const placeholderCount = await page.locator("[data-section-placeholder='true']").count();
      const brokenImages = await page.locator("img").evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      );

      const screenshotPath = path.join(
        outputDirectory,
        `${viewport.name}-${check.city}-${check.section}.png`,
      );
      await section.locator("figure").screenshot({ path: screenshotPath });
      await log(`captured ${path.basename(screenshotPath)}`);

      report.push({
        ...check,
        viewport: viewport.name,
        image: imageState,
        placeholderCount,
        brokenImages,
        consoleErrors,
        pageErrors,
        screenshotPath,
      });
      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(report, null, 2));

if (
  report.some(
    (entry) =>
      entry.placeholderCount > 0 ||
      entry.brokenImages.length > 0 ||
      entry.consoleErrors.length > 0 ||
      entry.pageErrors.length > 0 ||
      entry.image.naturalWidth === 0,
  )
) {
  process.exitCode = 1;
}
