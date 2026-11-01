import { test, expect, type Page } from "@playwright/test";

async function visit(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator("#ld")).toBeHidden();
}
async function menuNavigate(page: Page, name: string, path: string) {
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.locator("#ml").getByRole("link", { name }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.locator("#wp")).toHaveCSS("pointer-events", "none");
}

test("all routes, optimized raster assets and browser history work without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const failedAssets: string[] = [];
  page.on("response", (response) => { if (response.url().startsWith("http://localhost:3000") && response.status() >= 400) failedAssets.push(response.url()); });
  await visit(page, "/");
  await expect(page.locator(".hero img")).toBeVisible();
  await expect(page.locator(".hero svg")).toHaveCount(0);
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
  for (const [label, path] of [["CHARACTERS", "/characters"], ["DEVILS & FIENDS", "/devils"], ["STORY ARCS", "/arcs"], ["WORLD & LOCATIONS", "/locations"], ["MANGA VOLUMES", "/volumes"], ["LORE & CONNECTIONS", "/lore"], ["HOME", "/"]]) {
    await menuNavigate(page, label, path);
    await expect(page.locator("main h1")).toHaveCount(1);
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/lore$/);
  await expect(page.locator(".lr")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
});

test("part selection, profile relationships, modal keyboard focus and selection persistence", async ({ page }) => {
  await visit(page, "/characters");
  await page.getByRole("button", { name: /^PART 2/ }).click();
  await page.locator("#cl").getByRole("button", { name: "Asa Mitaka" }).click();
  await expect(page.locator("#cst h3")).toHaveText("Asa Mitaka");
  await page.getByRole("button", { name: "OPEN FILE" }).click();
  const dialog = page.getByRole("dialog", { name: "Character profile" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "CLOSE" })).toBeFocused();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await dialog.getByRole("button", { name: "Yoru", exact: true }).click();
  await expect(dialog.locator("h2")).toHaveText("Yoru");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "OPEN FILE" })).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await menuNavigate(page, "DEVILS & FIENDS", "/devils");
  await menuNavigate(page, "CHARACTERS", "/characters");
  await expect(page.locator("#cst h3")).toHaveText("Asa Mitaka");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.locator(".menu-close")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#ml a").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".menu-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "MENU", exact: true })).toBeFocused();
});

test("dossiers, arc keyboard navigation, location links, volume bounds and lore connections", async ({ page }) => {
  await visit(page, "/devils");
  await page.getByRole("button", { name: "CM-006 Falling Devil" }).click();
  await expect(page.locator("#df h3")).toHaveText("Falling Devil");
  await page.getByRole("button", { name: "Reveal redacted text" }).first().click();
  await expect(page.getByRole("button", { name: "Hide redaction: redacted text" })).toHaveAttribute("aria-pressed", "true");
  await menuNavigate(page, "STORY ARCS", "/arcs");
  await page.getByRole("tab", { name: /Introduction/ }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Control Devil/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: /^PART 2/ }).click();
  await page.getByRole("tab", { name: /Academy Saga/ }).focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /War Devil Arc/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).not.toContainText("undefined");
  await page.getByRole("button", { name: /^PART 1/ }).click();
  await page.getByRole("tab", { name: /Introduction/ }).focus();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel")).toContainText("Denji’s debt, the loss of Pochita, and Makima’s offer.");
  await menuNavigate(page, "WORLD & LOCATIONS", "/locations");
  await page.locator(".loc").last().getByRole("link", { name: "Asa Mitaka" }).click();
  await expect(page).toHaveURL(/\/characters$/);
  await expect(page.locator("#cst h3")).toHaveText("Asa Mitaka");
  await menuNavigate(page, "MANGA VOLUMES", "/volumes");
  await expect(page.getByRole("button", { name: "Previous volume" })).toBeDisabled();
  await page.getByRole("button", { name: "Volume 24", exact: true }).click();
  await expect(page.getByRole("button", { name: "Next volume" })).toBeDisabled();
  await page.getByRole("button", { name: "Previous volume" }).click();
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 23");
  await menuNavigate(page, "LORE & CONNECTIONS", "/lore");
  await page.locator(".lr").getByRole("button", { name: "Pochita", exact: true }).click();
  await expect(page.locator("#pf h2")).toHaveText("Pochita");
});

test("volume gallery shows raster fallbacks, supports arrow keys and links to an arc", async ({ page }) => {
  await visit(page, "/volumes");
  await expect(page.locator("#vf img")).toHaveAttribute("alt", "Volume 1 cover artwork pending");
  await expect.poll(() => page.locator("#vf img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 01");
  await page.getByRole("button", { name: "Volume 1", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "Volume 2", exact: true })).toBeFocused();
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 02");
  await page.keyboard.press("End");
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 24");
  await expect(page.locator("#vf")).toContainText("223–232");
  await expect(page.locator("#vf")).toContainText("4 June 2026");
  await page.keyboard.press("Home");
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 01");
  await page.getByRole("link", { name: "Introduction" }).click();
  await expect(page).toHaveURL(/\/arcs$/);
  await expect(page.getByRole("tab", { name: /Introduction/ })).toHaveAttribute("aria-selected", "true");
});

test("editorial arc and character layouts keep long names contained and related links work", async ({ page }) => {
  await visit(page, "/arcs");
  await page.getByRole("tab", { name: /International Assassins/ }).click();
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const arcTitle = await page.locator("#arc-panel h2").evaluate((element) => ({
      content: element.scrollWidth, box: element.clientWidth,
    }));
    expect(arcTitle.content, `arc title at ${width}px`).toBeLessThanOrEqual(arcTitle.box + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `arc page at ${width}px`).toBeLessThanOrEqual(width + 1);
    const headingTop = await page.locator("main h1").evaluate((element) => element.getBoundingClientRect().top);
    const headerBottom = await page.locator("header").evaluate((element) => element.getBoundingClientRect().bottom);
    expect(headingTop).toBeGreaterThan(headerBottom);
  }
  await expect.poll(() => page.locator("#arc-panel img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("tab", { name: /Introduction/ }).click();
  await page.getByRole("link", { name: /VOL. 01/ }).click();
  await expect(page).toHaveURL(/\/volumes$/);
  await expect(page.locator("[data-volume-label]")).toHaveText("VOL. 01");
  await menuNavigate(page, "STORY ARCS", "/arcs");
  await page.getByRole("link", { name: "Denji", exact: true }).click();
  await expect(page).toHaveURL(/\/characters$/);
  await expect(page.locator("#cst h3")).toHaveText("Denji");
  await page.locator("#cl").getByRole("button", { name: /Kobeni Higashiyama/ }).click();
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const title = await page.locator("#cst h3").evaluate((element) => ({
      content: element.scrollWidth, box: element.clientWidth,
    }));
    expect(title.content, `character title at ${width}px`).toBeLessThanOrEqual(title.box + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `character page at ${width}px`).toBeLessThanOrEqual(width + 1);
  }
  await page.getByRole("button", { name: /^PART 2/ }).click();
  await page.locator("#cl").getByRole("button", { name: /Asa Mitaka/ }).click();
  await expect(page.locator("#cst h3")).toHaveText("Asa Mitaka");
  await page.getByRole("button", { name: "OPEN FILE" }).click();
  await expect(page.getByRole("dialog", { name: "Character profile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Character profile" })).toBeHidden();
});

test("mobile routes fit the viewport and reduced motion leaves content visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/characters", "/devils", "/arcs", "/locations", "/volumes", "/lore"]) {
    await visit(page, path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
    const invisible = await page.locator("main .rv").evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).opacity === "0").length);
    expect(invisible, path).toBe(0);
    await page.screenshot({ path: `test-results/mobile-${path.slice(1) || "home"}.png`, fullPage: true });
  }
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.locator("#mn")).toBeVisible();
  await page.locator("#ml").getByRole("link", { name: "CHARACTERS" }).click();
  await expect(page).toHaveURL(/\/characters$/);
  await page.getByRole("button", { name: /^PART 2/ }).click();
  await page.locator("#cl").getByRole("button", { name: /Yoru/ }).click();
  await expect(page.locator("#cst h3")).toHaveText("Yoru");
});

test("home saga links select the intended part and repeated navigation cleans scroll animations", async ({ page }) => {
  await visit(page, "/");
  await page.getByRole("link", { name: "PART 2 — ACADEMY", exact: true }).click();
  await expect(page).toHaveURL(/\/arcs$/);
  await expect(page.getByRole("tab", { name: /Academy Saga/ })).toHaveAttribute("aria-selected", "true");
  for (let index = 0; index < 3; index++) {
    await menuNavigate(page, "HOME", "/");
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(page.locator(".end .btn")).toBeVisible();
    const oldPage = await page.locator(".view").elementHandle();
    await menuNavigate(page, "DEVILS & FIENDS", "/devils");
    await expect(page.locator("#df")).toBeVisible();
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await expect(page.locator("#ld")).toBeHidden();
    const detachedMutations = await oldPage!.evaluate((element) => new Promise<number>((resolve) => {
      let mutations = 0;
      const observer = new MutationObserver((records) => { mutations += records.length; });
      observer.observe(element, { attributes: true, subtree: true });
      setTimeout(() => { observer.disconnect(); resolve(mutations); }, 400);
    }));
    expect(detachedMutations).toBe(0);
    await oldPage?.dispose();
  }
});

test("home intro plays once per session and scroll sections settle visibly", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#ld")).toBeHidden({ timeout: 5000 });
  await expect(page.locator(".hero h1")).toHaveText("CHAINSAWMAN");
  await expect.poll(() => page.locator(".hero img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => sessionStorage.getItem("csm"))).toBe("1");

  for (const section of [".p1", ".p2", ".end"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator(section).locator("[data-home-reveal]").first().evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    await expect(page.locator(section).getByRole("link")).toBeVisible();
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-csm-seen", "1");
  await expect(page.locator("#ld")).toHaveCSS("display", "none");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  const cta = await page.locator(".hero .go a").first().boundingBox();
  expect(cta).not.toBeNull();
  expect(cta!.x + cta!.width).toBeLessThanOrEqual(391);
});
