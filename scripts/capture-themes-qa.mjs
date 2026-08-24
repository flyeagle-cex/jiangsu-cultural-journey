import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputPath = path.resolve(process.argv[3] ?? "screenshots/themes-playwright.png");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "zh-CN",
  reducedMotion: "reduce",
});
const page = await context.newPage();
const consoleErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto(targetUrl, { waitUntil: "networkidle" });
await page.evaluate(() => window.localStorage.setItem("jiangsu-cultural-journey:welcome-seen", "true"));
await page.reload({ waitUntil: "networkidle" });
const themes = page.locator("#themes");
await page.locator('a[href="#themes"]').first().click();
await page.waitForTimeout(250);
await page.screenshot({ path: outputPath, fullPage: false });

const metrics = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  documentScrollWidth: document.documentElement.scrollWidth,
  themeTop: document.querySelector("#themes")?.getBoundingClientRect().top ?? -1,
  themeLinks: document.querySelectorAll("#themes a").length,
  loadedThemeImages: Array.from(document.querySelectorAll("#themes img")).filter(
    (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
  ).length,
}));

console.log(JSON.stringify({ outputPath, metrics, consoleErrors }, null, 2));
await browser.close();

if (
  metrics.documentScrollWidth > metrics.innerWidth ||
  metrics.themeTop < 60 ||
  metrics.themeLinks !== 5 ||
  metrics.loadedThemeImages !== 5 ||
  consoleErrors.length
) {
  process.exitCode = 2;
}
