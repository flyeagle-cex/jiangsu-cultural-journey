import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputPath = path.resolve(process.argv[3] ?? "screenshots/homepage-mobile-playwright.png");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
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
await page.evaluate(() => {
  window.localStorage.setItem("jiangsu-cultural-journey:welcome-seen", "true");
});
await page.reload({ waitUntil: "networkidle" });
await page.locator('svg[role="group"]').waitFor({ state: "visible" });
await page.screenshot({ path: outputPath, fullPage: false });

const metrics = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  documentScrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
  menuButtons: document.querySelectorAll('button[aria-label="Open navigation menu"]').length,
  visibleMapWidth: document.querySelector('svg[role="group"]')?.getBoundingClientRect().width ?? 0,
}));

console.log(JSON.stringify({ outputPath, metrics, consoleErrors }, null, 2));
await browser.close();

if (metrics.documentScrollWidth > metrics.innerWidth || metrics.bodyScrollWidth > metrics.innerWidth || consoleErrors.length) {
  process.exitCode = 2;
}
