import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { characters } from "../src/data/characters.ts";
import { locations } from "../src/data/locations.ts";
import { connections } from "../src/data/lore.ts";
import { arcs } from "../src/data/arcs.ts";
import { volumes } from "../src/data/volumes.ts";
import { navigation } from "../src/data/navigation.ts";
import { devils } from "../src/data/devils.ts";
import { arcsForVolume } from "../src/lib/archive.ts";

test("character relationships, locations and lore resolve to existing records", () => {
  const ids = new Set(characters.map((character) => character.id));
  assert.equal(ids.size, characters.length);
  for (const id of [...characters.flatMap((c) => c.relationships), ...locations.flatMap((l) => l.characters), ...connections.flatMap((c) => [c.from, c.to])]) assert.ok(ids.has(id), id);
  for (const part of ["1", "2"] as const) assert.ok(characters.some((character) => character.parts.includes(part)));
});

test("all navigation destinations have route files", () => {
  assert.equal(navigation.length, 7);
  for (const item of navigation) assert.ok(existsSync(`src/app${item.href === "/" ? "" : item.href}/page.tsx`), item.href);
});

test("artwork references exist and use raster extensions", () => {
  assert.ok(existsSync("public/images/placeholders/artwork.png"));
  for (const character of characters) {
    if (!character.artwork) continue;
    assert.match(character.artwork, /^\/images\/.+\.(png|webp|avif|jpe?g)$/i);
    assert.ok(existsSync(`public${character.artwork}`));
  }
});

test("classified records have explicit types and local artwork paths", () => {
  assert.equal(new Set(devils.map((file) => file.id)).size, devils.length);
  assert.equal(devils.find((file) => file.id === "CM-002")?.type, "fiend");
  assert.equal(devils.find((file) => file.id === "CM-005")?.subcategory, "Primal Fear");
  assert.equal(devils.find((file) => file.id === "CM-007")?.subcategory, "Horseman");
  for (const file of devils) {
    assert.ok(file.type === "devil" || file.type === "fiend");
    if (!file.artwork) continue;
    assert.match(file.artwork, /^\/images\/devils\/.+\.(png|webp|avif|jpe?g)$/i);
    assert.ok(existsSync("public" + file.artwork));
  }
});

test("volume and arc boundaries preserve the prototype content without undefined descriptions", () => {
  assert.equal(volumes.length, 24);
  assert.equal(volumes[10].chapters, "89–97");
  assert.equal(volumes[11].part, "2");
  assert.equal(volumes[11].chapters, null);
  assert.equal(volumes[23].chapters, "223–232");
  assert.ok(existsSync("public/images/placeholders/manga-cover.png"));
  for (const volume of volumes) {
    if (!volume.cover) continue;
    assert.match(volume.cover, /^\/images\/volumes\/.+\.(png|webp|avif|jpe?g)$/i);
    assert.ok(existsSync(`public${volume.cover}`));
  }
  assert.deepEqual(arcsForVolume(arcs, volumes[0]).map((arc) => arc.name), ["Introduction", "Bat Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[10]).map((arc) => arc.name), ["Control Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[11]).map((arc) => arc.name), ["Academy Saga"]);
  assert.ok(arcs.every((arc) => arc.description && !arc.description.includes("undefined")));
});
