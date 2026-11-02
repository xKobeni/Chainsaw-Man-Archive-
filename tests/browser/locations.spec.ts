import { test, expect } from "@playwright/test";

test("location controls, keyboard, progress, bounds and related arcs", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/locations");
  const progress = page.getByRole("progressbar", { name: "Location progress" });
  const previous = page.getByRole("button", { name: "Previous location" });
  const next = page.getByRole("button", { name: "Next location" });
  const gallery = page.locator("#hz");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect(progress).toHaveAttribute("aria-valuenow", "3");
  for (let value = 4; value <= 6; value++) {
    await next.click();
    await expect(progress).toHaveAttribute("aria-valuenow", String(value));
  }
  await expect(next).toBeDisabled();
  expect(await gallery.evaluate((element) => element.scrollLeft)).toBeLessThanOrEqual(await gallery.evaluate((element) => element.scrollWidth - element.clientWidth) + 1);
  await previous.click();
  await expect(progress).toHaveAttribute("aria-valuenow", "5");
  await gallery.evaluate((element) => element.scrollTo({ left: 0, behavior: "instant" }));
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await page.locator(".loc").first().getByRole("link", { name: /Bat Devil/ }).click();
  await expect(page).toHaveURL(/\/arcs$/);
  await expect(page.locator("#arc-panel h2")).toHaveText(/Bat Devil/i);
});

test("Lenis leaves vertical wheel scrolling intact and the focused gallery accepts wheel and trackpad input", async ({ page }) => {
  await page.goto("/locations");
  await expect(page.locator("#ld")).toBeHidden();
  const gallery = page.locator("#hz");
  const progress = page.getByRole("progressbar", { name: "Location progress" });
  await page.mouse.move(700, 650);
  await page.mouse.wheel(0, 350);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(await gallery.evaluate((element) => element.scrollLeft)).toBe(0);
  await gallery.focus();
  await page.mouse.wheel(0, 120);
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  await expect.poll(() => gallery.evaluate((element) => Math.round(element.scrollLeft))).toBe(1260);
  for (let index = 0; index < 10; index++) {
    await page.mouse.wheel(100, 0);
    await page.waitForTimeout(15);
  }
  await expect(progress).toHaveAttribute("aria-valuenow", "3");
  await expect(gallery).toHaveCSS("scroll-snap-type", "x mandatory");
});

test("mobile touch swipe advances the native gallery without page overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("/locations");
    const client = await context.newCDPSession(page);
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 330, y: 620 }] });
    for (let x = 310; x >= 50; x -= 20) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: 620 }] });
      await page.waitForTimeout(16);
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(page.getByRole("progressbar", { name: "Location progress" })).toHaveAttribute("aria-valuenow", "2");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  } finally {
    await context.close();
  }
});
