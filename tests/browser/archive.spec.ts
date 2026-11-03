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
  await expect(page.locator(".hero img")).toHaveAttribute("src", /poster1_landing/);
  await expect(page.locator(".hero [data-artwork-placeholder]")).toHaveAttribute("data-artwork-ready", "true");
  await expect(page.locator(".hero svg")).toHaveCount(0);
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
  for (const [label, path] of [["CHARACTERS", "/characters"], ["CLASSIFIED FILES", "/classified-files"], ["STORY ARCS", "/arcs"], ["WORLD & LOCATIONS", "/locations"], ["MANGA VOLUMES", "/volumes"], ["LORE & CONNECTIONS", "/lore"], ["HOME", "/"]]) {
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
  await menuNavigate(page, "CLASSIFIED FILES", "/classified-files");
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

test("supplied character portraits load in the index and profile", async ({ page }) => {
  await visit(page, "/characters");
  for (const [id, file] of [["denji", "Denji"], ["pochita", "pochita"], ["power", "power"], ["himeno", "himeno"], ["kobeni", "kobeni"], ["reze", "reze"], ["kishibe", "kishebe"]]) {
    await page.locator(`#cl [data-character="${id}"]`).click();
    await expect(page.locator("#cst img")).toHaveAttribute("src", new RegExp(`${file}_char`));
    await expect.poll(() => page.locator("#cst img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('#cl [data-character="himeno"]').click();
  await page.getByRole("button", { name: "OPEN FILE" }).click();
  await expect(page.locator("#pf img")).toHaveAttribute("src", /himeno_char/);
  await expect.poll(() => page.locator("#pf img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Close character profile" }).click();
  await page.getByRole("button", { name: /^PART 2/ }).click();
  await page.locator('#cl [data-character="yoshida"]').click();
  await expect(page.locator("#cst img")).toHaveAttribute("src", /yoshida_char/);
  await expect.poll(() => page.locator("#cst img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.locator('#cl [data-character="asa"]').click();
  await expect(page.locator("#cst img")).toHaveAttribute("alt", "Asa Mitaka — artwork pending");
});

test("dossiers, arc keyboard navigation, location links, volume bounds and lore connections", async ({ page }) => {
  await visit(page, "/classified-files");
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

test("classified files filter, search, scroll and redirect", async ({ page }) => {
  const oldRoute = await page.request.get("/devils", { maxRedirects: 0 });
  expect(oldRoute.status()).toBe(308);
  expect(oldRoute.headers().location).toBe("/classified-files");
  await visit(page, "/classified-files");
  await expect(page).toHaveTitle(/Classified Files/);
  await expect(page.locator("#pt")).toHaveText("CLASSIFIED FILES");
  const index = page.getByRole("complementary", { name: "Classified file index" });
  await expect(index.getByRole("button", { name: /CM-002 Blood Fiend/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "No image available for Chainsaw Devil" })).toBeVisible();
  await index.getByRole("button", { name: /FIENDS/ }).click();
  await expect(index.locator("button").filter({ hasText: "CM-002" })).toHaveCount(1);
  await expect(page.locator("#df h3")).toHaveText("Blood Fiend");
  await index.getByRole("button", { name: /ALL FILES/ }).click();
  await index.getByRole("searchbox").fill("戦争");
  await expect(page.locator("#df h3")).toHaveText("War Devil");
  await index.getByRole("searchbox").fill("CM-008");
  await expect(page.locator("#df h3")).toHaveText("Future Devil");
  await index.getByRole("searchbox").fill("not a file");
  await expect(index).toContainText("NO MATCHING FILES");
  await expect(page.locator("#df")).toHaveCount(0);
  await index.getByRole("searchbox").clear();
  const list = index.getByLabel("Matching files");
  await list.getByRole("button", { name: /CM-010 Curse Devil/ }).click();
  await expect(page.locator("#df h3")).toHaveText("Curse Devil");
  await list.getByRole("button", { name: /CM-010 Curse Devil/ }).focus();
  await page.keyboard.press("Home");
  await expect(page.locator("#df h3")).toHaveText("Chainsaw Devil");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#df h3")).toHaveText("Blood Fiend");
  const scroll = await list.evaluate((element) => {
    for (let n = 0; n < 50; n++) element.append(element.querySelector("button")!.cloneNode(true));
    const max = element.scrollHeight - element.clientHeight;
    element.scrollTop = max;
    return { max, top: element.scrollTop, body: window.scrollY };
  });
  expect(scroll.max).toBeGreaterThan(0);
  expect(scroll.top).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(scroll.body);
  await list.hover();
  await page.mouse.wheel(0, -500);
  await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeLessThan(scroll.top);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scroll.body);
  await list.getByRole("button", { name: /CM-010 Curse Devil/ }).click();
  await expect(page.locator("#df h3")).toHaveText("Curse Devil");
  await page.reload();
  await expect(page.locator("#ld")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await expect(index.getByRole("button", { name: /CM-002 Blood Fiend/ })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await index.getByRole("button", { name: /FIENDS/ }).click();
  await expect(page.locator("#df h3")).toHaveText("Blood Fiend");
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
  for (const path of ["/", "/characters", "/classified-files", "/arcs", "/locations", "/volumes", "/lore"]) {
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

test("home section links select the intended part and repeated navigation cleans scroll animations", async ({ page }) => {
  await visit(page, "/");
  await expect(page.locator(".hero a")).toHaveCount(0);
  await expect(page.locator(".hero-tagline")).toContainText("DEVILS. HUNTERS. CONTRACTS.");
  await page.locator(".p1 .btn").click();
  await expect(page).toHaveURL(/\/arcs$/);
  await expect(page.getByRole("button", { name: /^PART 1/ })).toHaveAttribute("aria-pressed", "true");
  await menuNavigate(page, "HOME", "/");
  await page.locator(".p2 .btn").click();
  await expect(page).toHaveURL(/\/characters$/);
  await expect(page.getByRole("button", { name: /^PART 2/ })).toHaveAttribute("aria-pressed", "true");
  for (let index = 0; index < 3; index++) {
    await menuNavigate(page, "HOME", "/");
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(page.locator(".end .btn")).toBeVisible();
    const oldPage = await page.locator(".view").elementHandle();
    await menuNavigate(page, "CLASSIFIED FILES", "/classified-files");
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

test("home intro splits after loading and scroll sections settle visibly", async ({ page }) => {
  await page.addInitScript(() => {
    const gaps: number[] = [];
    const entrances: { gap: number; title: number; tagline: number }[] = [];
    (window as Window & { __splitGaps?: number[]; __heroEntrances?: typeof entrances }).__splitGaps = gaps;
    (window as Window & { __heroEntrances?: typeof entrances }).__heroEntrances = entrances;
    window.addEventListener("csm:reveal", () => {
      const record = () => {
        const top = document.querySelector(".ld-top");
        const bottom = document.querySelector(".ld-bottom");
        const loader = document.querySelector("#ld");
        if (!top || !bottom || !loader || getComputedStyle(loader).display === "none") return;
        const gap = bottom.getBoundingClientRect().top - top.getBoundingClientRect().bottom;
        gaps.push(gap);
        const title = document.querySelector(".hero .t1");
        const tagline = document.querySelector(".hero-tagline-main .word:last-child span");
        if (title && tagline) entrances.push({ gap, title: Number(getComputedStyle(title).opacity), tagline: Number(getComputedStyle(tagline).opacity) });
        requestAnimationFrame(record);
      };
      requestAnimationFrame(record);
    }, { once: true });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#ld")).toBeHidden({ timeout: 8000 });
  const splitGaps = await page.evaluate(() => (window as Window & { __splitGaps?: number[] }).__splitGaps ?? []);
  expect(Math.max(...splitGaps)).toBeGreaterThan(100);
  const entrances = await page.evaluate(() => (window as Window & { __heroEntrances?: { gap: number; title: number; tagline: number }[] }).__heroEntrances ?? []);
  expect(entrances.some(({ gap, title }) => gap > 100 && gap < 600 && title < .9)).toBe(true);
  expect(entrances.some(({ gap, tagline }) => gap > 600 && tagline < .9)).toBe(true);
  await expect(page.locator(".hero-tagline")).toContainText("Every story leaves a mark.");
  await expect(page.locator(".hero h1")).toHaveText("CHAINSAWMAN");
  await expect(page.locator("header")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator("header")).toHaveCSS("color", "rgb(17, 17, 17)");
  await expect(page.locator(".wm b")).toHaveCSS("color", "rgb(207, 38, 45)");
  await expect(page.locator(".hero [data-artwork-placeholder]")).toHaveAttribute("data-artwork-ready", "true");
  expect(await page.evaluate(() => sessionStorage.getItem("csm"))).toBe("1");

  for (const section of [".p1", ".p2", ".end"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    if (section === ".p2") await page.evaluate(() => scrollBy({ top: 100, behavior: "instant" }));
    if (section === ".p1") await expect(page.locator(".hero-scroll")).toHaveClass(/is-past/);
    await expect(page.locator("header")).toHaveCSS("color", section === ".p1" ? "rgb(255, 255, 255)" : "rgb(17, 17, 17)");
    await expect.poll(() => page.locator(section).locator("[data-home-reveal]").first().evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    await expect(page.locator(section).getByRole("link")).toBeVisible();
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-csm-seen", "1");
  await expect(page.locator("#ld")).toBeHidden({ timeout: 8000 });
  const repeatEntrances = await page.evaluate(() => (window as Window & { __heroEntrances?: { gap: number; title: number }[] }).__heroEntrances ?? []);
  expect(repeatEntrances.some(({ gap, title }) => gap > 100 && gap < 600 && title < .9)).toBe(true);
  await expect(page.locator(".hero .t1")).toHaveCSS("opacity", "1");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  const tagline = await page.locator(".hero-tagline").boundingBox();
  expect(tagline).not.toBeNull();
  expect(tagline!.x + tagline!.width).toBeLessThanOrEqual(391);
  expect(tagline!.y + tagline!.height).toBeLessThanOrEqual(844);
});

test("hollow cursor follows fine pointers without replacing the native cursor", async ({ page }) => {
  await visit(page, "/");
  const cursor = page.locator("#custom-cursor");
  await expect(cursor.locator("span")).toHaveCount(1);
  await page.mouse.move(720, 650);
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await expect(cursor).toHaveCSS("pointer-events", "none");
  const menuButton = page.getByRole("button", { name: "MENU", exact: true });
  await menuButton.hover();
  await expect(cursor).toHaveAttribute("data-hover", "true");
  await expect(menuButton).toHaveCSS("cursor", "pointer");
  await page.mouse.move(-10, -10);
  await expect(cursor).toHaveAttribute("data-visible", "false");
  await menuButton.click();
  await expect(page.locator("#mn")).toHaveClass(/on/);
  await page.getByRole("button", { name: /CLOSE/ }).click();
  await menuNavigate(page, "CHARACTERS", "/characters");
  await expect(cursor).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cursor).toBeHidden();
});

test("cursor theme follows section surfaces, artwork and menu overlays", async ({ page }) => {
  await visit(page, "/");
  const cursor = page.locator("#custom-cursor");
  await page.mouse.move(700, 40);
  await expect(cursor).toHaveAttribute("data-theme", "light");
  await expect(cursor).toHaveCSS("color", "rgb(17, 17, 17)");
  await page.locator(".p1").scrollIntoViewIfNeeded();
  await expect(cursor).toHaveAttribute("data-theme", "dark");
  await expect(cursor).toHaveCSS("color", "rgb(207, 38, 45)");
  const artwork = await page.locator(".p1 .part-artwork").boundingBox();
  await page.mouse.move(artwork!.x + 80, artwork!.y + 90);
  await expect(cursor).toHaveAttribute("data-theme", "dark");
  await page.locator(".p1 .btn").hover();
  await expect(cursor).toHaveAttribute("data-theme", "warm");
  await expect(cursor.locator("span")).toHaveCSS("width", "68px");
  await page.mouse.move(680, 420);
  await page.mouse.down();
  await expect(cursor).toHaveAttribute("data-pressed", "true");
  await page.mouse.up();
  await expect(cursor).toHaveAttribute("data-pressed", "false");
  await page.locator(".p2").scrollIntoViewIfNeeded();
  await page.mouse.move(680, 420);
  await expect(cursor).toHaveAttribute("data-theme", "warm");
  await page.locator(".end").scrollIntoViewIfNeeded();
  await page.mouse.move(700, 450);
  await expect(cursor).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.mouse.move(400, 300);
  await expect(cursor).toHaveAttribute("data-theme", "dark");
  await page.locator("#ml a").first().hover();
  await page.mouse.move(1100, 400);
  await expect(cursor).toHaveAttribute("data-theme", "warm");
});

test("cursor yields to text inputs and touch pointers", async ({ page, browser }) => {
  await visit(page, "/classified-files");
  const cursor = page.locator("#custom-cursor");
  const search = page.getByRole("searchbox");
  await search.hover();
  await expect(cursor).toHaveAttribute("data-visible", "false");
  await expect(search).toHaveCSS("cursor", "text");
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const mobile = await touch.newPage();
    await visit(mobile, "/");
    await expect(mobile.locator("#custom-cursor")).toBeHidden();
  } finally {
    await touch.close();
  }
});

test("splash reveals the immediate fallback despite a stalled hero image", async ({ browser }) => {
  const page = await browser.newPage();
  let releaseImage = () => {};
  const heldImage = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route("**/_next/image?*", async (route) => {
    if (route.request().url().includes("poster1_landing")) await heldImage;
    await route.continue().catch(() => {});
  });
  try {
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".hero [data-artwork-placeholder]")).toBeVisible();
    await expect(page.locator("#ld")).toBeHidden({ timeout: 7000 });
    await expect(page.locator(".p1 .part-artwork")).toHaveCSS("opacity", "1");
    releaseImage();
    await expect(page.locator(".hero [data-artwork-placeholder]")).toHaveAttribute("data-artwork-ready", "true");
  } finally {
    releaseImage();
    await page.close();
  }
});

test("home artwork frames stay visible through fast scroll and reduced motion", async ({ page }) => {
  await visit(page, "/");
  for (const section of [".p1", ".p2", ".end"]) {
    const artwork = page.locator(section).locator("[data-home-art]");
    await expect(artwork).toHaveCSS("opacity", "1");
    await expect(artwork).toHaveCSS("clip-path", "none");
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect(page.locator(section).locator("[data-home-reveal]").first()).toHaveCSS("opacity", "1");
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".p1 [data-home-art]")).toHaveCSS("opacity", "1");
  for (const section of [".p1", ".p2", ".end"]) {
    await expect(page.locator(section).locator("[data-home-line]").first()).toHaveCSS("opacity", "1");
    await expect(page.locator(section).locator("[data-home-reveal]").first()).toHaveCSS("opacity", "1");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#ld")).toBeHidden();
  await expect(page.locator(".end [data-home-art]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".end [data-home-reveal]").first()).toHaveCSS("opacity", "1");
});

test("desktop wheel scroll stays synced and mobile and reduced motion use native scrolling", async ({ page, browser }) => {
  await visit(page, "/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(100);
  const early = await page.evaluate(() => scrollY);
  expect(early).toBeGreaterThan(0);
  expect(early).toBeLessThan(600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(550);
  await page.locator(".p1").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy({ top: 100, behavior: "instant" }));
  await expect(page.locator("html")).toHaveAttribute("data-header-dark", "1");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.getByRole("link", { name: "SKIP TO CONTENT" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goBack();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await menuNavigate(page, "CHARACTERS", "/characters");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator("#ld")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, baseURL: "http://localhost:3000" });
  try {
    const touchPage = await mobile.newPage();
    await visit(touchPage, "/");
    await expect(touchPage.locator("html")).not.toHaveClass(/lenis/);
    const touch = await mobile.newCDPSession(touchPage);
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 190, y: 650 }] });
    for (const y of [600, 550, 500, 450, 400, 350, 300]) {
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y }] });
    }
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => touchPage.evaluate(() => scrollY)).toBeGreaterThan(100);
  } finally {
    await mobile.close();
  }
});
