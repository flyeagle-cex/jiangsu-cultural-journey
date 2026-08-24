import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputDirectory = path.resolve(process.argv[3] ?? "screenshots/language-system");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const languageKey = "jiangsu-cultural-journey:language";
const welcomeKey = "jiangsu-cultural-journey:welcome-seen";

const cities = [
  ["nanjing", "Nanjing", "Capital of the Six Dynasties"],
  ["suzhou", "Suzhou", "A double grid of land and water"],
  ["wuxi", "Wuxi", "Where river, lake and canal meet"],
  ["changzhou", "Changzhou", "A historic canal port"],
  ["zhenjiang", "Zhenjiang", "Crossroads of river and canal"],
  ["yangzhou", "Yangzhou", "Born of the canal"],
  ["taizhou", "Taizhou", "Water-shaped Hailing"],
  ["nantong", "Nantong", "Gateway between river and sea"],
  ["yancheng", "Yancheng", "Making salt from the sea"],
  ["huaian", "Huai'an", "Capital of the canal"],
  ["suqian", "Suqian", "Three city identities"],
  ["xuzhou", "Xuzhou", "Crossroads of five provinces"],
  ["lianyungang", "Lianyungang", "A city of mountains, sea and port"],
];

function cityUrl(slug) {
  return new URL(`/city/${slug}`, targetUrl).href;
}

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const consoleErrors = [];
const failedResponses = [];

function observe(page) {
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });
}

const defaultContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-US",
  reducedMotion: "reduce",
});
await defaultContext.addInitScript((key) => window.localStorage.setItem(key, "true"), welcomeKey);
const defaultPage = await defaultContext.newPage();
observe(defaultPage);
await defaultPage.goto(targetUrl, { waitUntil: "networkidle" });
const defaultState = await defaultPage.evaluate((key) => ({
  htmlLanguage: document.documentElement.lang,
  heroHeading: document.querySelector("main h1")?.textContent?.trim() ?? "",
  storedLanguage: window.localStorage.getItem(key),
}), languageKey);

await defaultPage.getByRole("button", { name: "English" }).click();
await defaultPage.waitForFunction(() => document.documentElement.lang === "en");
const switchedState = await defaultPage.evaluate((key) => ({
  htmlLanguage: document.documentElement.lang,
  heroHeading: document.querySelector("main h1")?.textContent?.trim() ?? "",
  pageTitle: document.title,
  description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
  storedLanguage: window.localStorage.getItem(key),
  englishPressed:
    document.querySelector('button[aria-pressed="true"]')?.textContent?.trim() === "English",
}), languageKey);
await defaultPage.reload({ waitUntil: "networkidle" });
const persistedState = await defaultPage.evaluate((key) => ({
  htmlLanguage: document.documentElement.lang,
  heroHeading: document.querySelector("main h1")?.textContent?.trim() ?? "",
  storedLanguage: window.localStorage.getItem(key),
}), languageKey);
await defaultPage.screenshot({
  path: path.join(outputDirectory, "home-english-desktop.png"),
  fullPage: false,
});
await defaultContext.close();

const welcomeContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-US",
  reducedMotion: "reduce",
});
await welcomeContext.addInitScript((key) => window.localStorage.setItem(key, "en"), languageKey);
const welcomePage = await welcomeContext.newPage();
observe(welcomePage);
await welcomePage.goto(targetUrl, { waitUntil: "networkidle" });
const englishWelcome = welcomePage.getByRole("dialog", { name: /Hi! I'm ShuiLing/ });
await englishWelcome.waitFor({ state: "visible" });
const welcomeState = {
  heading: await englishWelcome.locator("h2").innerText(),
  message: await englishWelcome.locator("#welcome-message").innerText(),
  hasSkipButton: (await englishWelcome.getByRole("button", { name: "Skip" }).count()) === 1,
};
await welcomePage.screenshot({
  path: path.join(outputDirectory, "welcome-english-desktop.png"),
  fullPage: false,
});
await welcomeContext.close();

const routeContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: "en-US",
  reducedMotion: "reduce",
});
await routeContext.addInitScript(
  ({ languageKey: storedKey, welcomeKey: seenKey }) => {
    window.localStorage.setItem(storedKey, "en");
    window.localStorage.setItem(seenKey, "true");
  },
  { languageKey, welcomeKey },
);
const routePage = await routeContext.newPage();
observe(routePage);
const routeResults = [];

for (const [slug, englishName, firstHighlight] of cities) {
  await routePage.goto(cityUrl(slug), { waitUntil: "networkidle" });
  await routePage.locator(`[data-city-page="${slug}"]`).waitFor({ state: "visible" });
  routeResults.push(
    await routePage.evaluate(
      ({ englishName, firstHighlight, slug }) => {
        const sections = [...document.querySelectorAll("[data-city-section]")];
        const sectionText = sections.map((section) => section.textContent ?? "").join(" ");
        const contentImages = [...document.querySelectorAll("[data-city-section] img")];
        return {
          slug,
          htmlLanguage: document.documentElement.lang,
          heading: document.querySelector("main h1")?.textContent?.trim() ?? "",
          title: document.title,
          description:
            document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
          sectionCount: sections.length,
          hasExpectedHighlight: sectionText.includes(firstHighlight),
          hasChineseSectionFallback: /[\u3400-\u9fff]/u.test(sectionText),
          allContentAltsEnglish: contentImages.every(
            (image) => !/[\u3400-\u9fff]/u.test(image.getAttribute("alt") ?? ""),
          ),
          nameMatches: document.querySelector("main h1")?.textContent?.trim() === englishName,
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        };
      },
      { englishName, firstHighlight, slug },
    ),
  );
}
await routeContext.close();

const viewportResults = [];
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000, path: "/" },
  { name: "tablet", width: 768, height: 1024, path: "/city/yangzhou" },
  { name: "mobile", width: 390, height: 844, path: "/city/lianyungang" },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "en-US",
    reducedMotion: "reduce",
  });
  await context.addInitScript(
    ({ languageKey: storedKey, welcomeKey: seenKey }) => {
      window.localStorage.setItem(storedKey, "en");
      window.localStorage.setItem(seenKey, "true");
    },
    { languageKey, welcomeKey },
  );
  const page = await context.newPage();
  observe(page);
  await page.goto(new URL(viewport.path, targetUrl).href, { waitUntil: "networkidle" });
  const outputPath = path.join(outputDirectory, `${viewport.name}-english.png`);
  await page.screenshot({ path: outputPath, fullPage: false });
  const metrics = await page.evaluate(() => {
    const heading = document.querySelector("main h1")?.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      headingInsideViewport: Boolean(heading && heading.left >= 0 && heading.right <= window.innerWidth),
      htmlLanguage: document.documentElement.lang,
    };
  });
  viewportResults.push({ ...viewport, outputPath, metrics });
  await context.close();
}

await browser.close();

const result = {
  defaultState,
  switchedState,
  persistedState,
  welcomeState,
  routeResults,
  viewportResults,
  consoleErrors,
  failedResponses,
};
console.log(JSON.stringify(result, null, 2));

const failed =
  defaultState.htmlLanguage !== "zh-CN" ||
  defaultState.heroHeading !== "水韵江苏" ||
  defaultState.storedLanguage !== "zh" ||
  switchedState.htmlLanguage !== "en" ||
  switchedState.heroHeading !== "Jiangsu Cultural Journey" ||
  switchedState.storedLanguage !== "en" ||
  !switchedState.englishPressed ||
  !switchedState.pageTitle.includes("Jiangsu Cultural Journey") ||
  !switchedState.description.startsWith("A bilingual cultural guide") ||
  persistedState.htmlLanguage !== "en" ||
  persistedState.heroHeading !== "Jiangsu Cultural Journey" ||
  persistedState.storedLanguage !== "en" ||
  welcomeState.heading !== "Hi! I'm ShuiLing. Welcome to Jiangsu." ||
  !welcomeState.message.includes("你好！我是水灵") ||
  !welcomeState.hasSkipButton ||
  routeResults.length !== 13 ||
  routeResults.some(
    (route) =>
      route.htmlLanguage !== "en" ||
      !route.nameMatches ||
      !route.title.includes(route.heading) ||
      !route.description ||
      /[\u3400-\u9fff]/u.test(route.description) ||
      route.sectionCount !== 6 ||
      !route.hasExpectedHighlight ||
      route.hasChineseSectionFallback ||
      !route.allContentAltsEnglish ||
      !route.noOverflow,
  ) ||
  viewportResults.some(
    ({ metrics }) =>
      metrics.htmlLanguage !== "en" ||
      metrics.documentWidth > metrics.viewportWidth ||
      !metrics.headingInsideViewport,
  ) ||
  consoleErrors.length > 0 ||
  failedResponses.length > 0;

if (failed) process.exitCode = 2;
