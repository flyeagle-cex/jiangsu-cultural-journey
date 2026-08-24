import { chromium } from "playwright-core";
import path from "node:path";

const targetUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputDirectory = path.resolve(process.argv[3] ?? "screenshots/city-pages");
const browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const cities = [
  ["nanjing", "南京"],
  ["suzhou", "苏州"],
  ["wuxi", "无锡"],
  ["changzhou", "常州"],
  ["zhenjiang", "镇江"],
  ["yangzhou", "扬州"],
  ["taizhou", "泰州"],
  ["nantong", "南通"],
  ["yancheng", "盐城"],
  ["huaian", "淮安"],
  ["suqian", "宿迁"],
  ["xuzhou", "徐州"],
  ["lianyungang", "连云港"],
];
const screenshotViewports = [
  { name: "desktop", slug: "suzhou", width: 1440, height: 1000 },
  { name: "tablet", slug: "yancheng", width: 768, height: 1024 },
  { name: "mobile", slug: "lianyungang", width: 390, height: 844 },
];

function cityUrl(slug) {
  return new URL(`/city/${slug}`, targetUrl).href;
}

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const routeContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: "zh-CN",
  reducedMotion: "reduce",
});
await routeContext.addInitScript(() => {
  window.localStorage.setItem("jiangsu-cultural-journey:welcome-seen", "true");
  window.localStorage.setItem("jiangsu-cultural-journey:language", "zh");
});
const routePage = await routeContext.newPage();
const consoleErrors = [];
const failedResponses = [];
routePage.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
routePage.on("pageerror", (error) => consoleErrors.push(error.message));
routePage.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

const routeResults = [];
for (const [slug, chineseName] of cities) {
  await routePage.goto(cityUrl(slug), { waitUntil: "networkidle" });
  await routePage.locator(`[data-city-page="${slug}"]`).waitFor({ state: "visible" });
  const result = await routePage.evaluate(
    ({ slug, chineseName }) => {
      const heroImage = document.querySelector(`[data-city-hero="${slug}"] img`);
      return {
        slug,
        h1: document.querySelector("main h1")?.textContent?.trim() ?? "",
        title: document.title,
        citySections: document.querySelectorAll("[data-city-section]").length,
        anchorLinks: document.querySelectorAll('[data-city-anchor-nav="true"] nav a').length,
        moduleVisuals: document.querySelectorAll("[data-city-section] figure").length,
        heroLoaded:
          heroImage instanceof HTMLImageElement && heroImage.complete && heroImage.naturalWidth > 0,
        heroAlt: heroImage?.getAttribute("alt") ?? "",
        journeyLinks: document.querySelectorAll('[data-city-journey-nav="true"] a').length,
        documentScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        nameMatches: document.querySelector("main h1")?.textContent?.includes(chineseName) ?? false,
      };
    },
    { slug, chineseName },
  );
  routeResults.push(result);
}

await routePage.goto(new URL("/city/not-a-city", targetUrl).href, { waitUntil: "networkidle" });
const invalidRouteShows404 = (await routePage.locator("main").innerText()).includes("404");

await routePage.goto(new URL("/?city=suzhou", targetUrl).href, { waitUntil: "networkidle" });
await routePage.locator('svg[role="group"]').waitFor({ state: "visible" });
await routePage.getByRole("link", { name: /Explore · 城市详情/ }).click();
await routePage.waitForURL(/\/city\/suzhou$/);
const mapExploreDestination = new URL(routePage.url()).pathname;
await routePage.locator('[data-city-anchor-nav="true"] a[href="#city-food"]').click();
await routePage.waitForFunction(() => window.location.hash === "#city-food");
const foodSectionTop = await routePage.locator("#city-food").evaluate((section) => section.getBoundingClientRect().top);
const foodImage = routePage.locator("#city-food img");
await foodImage.waitFor({ state: "visible" });
await routePage.waitForFunction(() => {
  const image = document.querySelector("#city-food img");
  return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
});
const foodImageLoaded = await foodImage.evaluate(
  (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
);
const sectionOutputPath = path.join(outputDirectory, "city-page-section-desktop.png");
await routePage.screenshot({ path: sectionOutputPath, fullPage: false });

await routeContext.close();

const screenshotResults = [];
for (const viewport of screenshotViewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "zh-CN",
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    window.localStorage.setItem("jiangsu-cultural-journey:welcome-seen", "true");
    window.localStorage.setItem("jiangsu-cultural-journey:language", "zh");
  });
  const page = await context.newPage();
  const viewportErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") viewportErrors.push(message.text());
  });
  page.on("pageerror", (error) => viewportErrors.push(error.message));

  await page.goto(cityUrl(viewport.slug), { waitUntil: "networkidle" });
  await page.locator(`[data-city-page="${viewport.slug}"]`).waitFor({ state: "visible" });
  const outputPath = path.join(outputDirectory, `city-page-${viewport.name}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector("[data-city-hero]");
    const heading = document.querySelector("main h1");
    const heroRect = hero?.getBoundingClientRect();
    const headingRect = heading?.getBoundingClientRect();
    return {
      innerWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      heroHeight: heroRect?.height ?? 0,
      headingInsideHero:
        Boolean(heroRect && headingRect) &&
        headingRect.left >= 0 &&
        headingRect.right <= window.innerWidth &&
        headingRect.top >= heroRect.top &&
        headingRect.bottom <= heroRect.bottom,
    };
  });
  screenshotResults.push({ viewport, outputPath, metrics, consoleErrors: viewportErrors });
  await context.close();
}

await browser.close();

const result = {
  routeResults,
  invalidRouteShows404,
  mapExploreDestination,
  foodSectionTop,
  foodImageLoaded,
  sectionOutputPath,
  screenshotResults,
  consoleErrors,
  failedResponses,
};
console.log(JSON.stringify(result, null, 2));

const failed =
  routeResults.length !== 13 ||
  routeResults.some(
    (route) =>
      !route.nameMatches ||
      !route.title.includes(route.h1) ||
      route.citySections !== 6 ||
      route.anchorLinks !== 6 ||
      route.moduleVisuals !== 5 ||
      !route.heroLoaded ||
      !route.heroAlt ||
      route.journeyLinks !== 2 ||
      route.documentScrollWidth > route.innerWidth,
  ) ||
  !invalidRouteShows404 ||
  mapExploreDestination !== "/city/suzhou" ||
  !foodImageLoaded ||
  foodSectionTop < 112 ||
  foodSectionTop > 180 ||
  screenshotResults.some(
    ({ metrics, consoleErrors: viewportErrors }) =>
      metrics.documentScrollWidth > metrics.innerWidth ||
      metrics.bodyScrollWidth > metrics.innerWidth ||
      metrics.heroHeight < 700 ||
      !metrics.headingInsideHero ||
      viewportErrors.length,
  ) ||
  consoleErrors.length ||
  failedResponses.length;

if (failed) process.exitCode = 2;
