import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const directory = "test-results/visual";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const prototype = pathToFileURL(resolve("CHAINSAW MAN — Archive.html")).href;
try {
  for (const [name, url] of [["prototype", prototype], ["next", "http://localhost:3000"]]) {
    await page.goto(url);
    await page.locator("#ld").waitFor({ state: "hidden" });
    await page.evaluate(() => document.fonts.ready);
    // Let the original's delayed entrance timeline finish before comparison.
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${directory}/${name}-home-desktop.png` });
    for (const route of ["characters", "devils", "arcs", "locations", "volumes", "lore"]) {
      if (name === "prototype") await page.goto(`${prototype}#${route === "locations" ? "world" : route}`);
      else await page.goto(`http://localhost:3000/${route}`);
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `${directory}/${name}-${route}-desktop.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["", "characters", "devils", "arcs", "locations", "volumes", "lore"]) {
    await page.goto(`http://localhost:3000/${route}`);
    await page.locator("#ld").waitFor({ state: "hidden" });
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("body *")].filter((element) => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map((element) => ({ element: `${element.tagName}.${element.className}`, right: Math.round(element.getBoundingClientRect().right) })),
    }));
    console.log(route || "home", JSON.stringify(layout));
    await page.screenshot({ path: `${directory}/next-${route || "home"}-mobile.png`, fullPage: true });
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://localhost:3000");
  await page.locator("#ld").waitFor({ state: "hidden" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${directory}/next-home-mobile-motion.png` });
  await page.getByRole("link", { name: "PART 2 — ACADEMY", exact: true }).click();
  await page.waitForURL("**/arcs");
  console.log("Mobile animated saga link:", await page.getByRole("tab", { name: "P2 · Academy Saga" }).getAttribute("aria-selected"));
} finally {
  await browser.close();
}
