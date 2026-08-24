import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputPath = path.resolve(process.argv[3] ?? "screenshots/welcome-playwright.png");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const storageKey = "jiangsu-cultural-journey:welcome-seen";

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "zh-CN",
  reducedMotion: "no-preference",
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

await page.goto(targetUrl, { waitUntil: "networkidle" });
const welcome = page.getByRole("dialog", { name: /你好！我是水灵/ });
await welcome.waitFor({ state: "visible" });
await page.waitForTimeout(700);
await page.screenshot({ path: outputPath, fullPage: false });

await page.getByRole("button", { name: /跳过/ }).click();
await welcome.waitFor({ state: "detached" });
const storedAfterSkip = await page.evaluate((key) => window.localStorage.getItem(key), storageKey);

await page.reload({ waitUntil: "networkidle" });
const dialogsAfterReload = await page.getByRole("dialog").count();

const result = {
  outputPath,
  storedAfterSkip,
  dialogsAfterReload,
  consoleErrors,
  failedResponses,
};
console.log(JSON.stringify(result, null, 2));
await browser.close();

if (storedAfterSkip !== "true" || dialogsAfterReload !== 0 || consoleErrors.length || failedResponses.length) {
  process.exitCode = 2;
}
