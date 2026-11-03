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

test("volume chapters and story arcs match the supplied covers", () => {
  assert.equal(volumes.length, 24);
  assert.deepEqual(volumes.map((volume) => volume.chapters), [
    "1–7", "8–16", "17–25", "26–34", "35–43", "44–52",
    "53–61", "62–70", "71–79", "80–88", "89–97", "98–103",
    "104–112", "113–122", "123–133", "134–143", "144–153", "154–164",
    "165–175", "176–186", "187–198", "199–210", "211–222", "223–232",
  ]);
  assert.equal(volumes[11].part, "2");
  assert.ok(existsSync("public/images/placeholders/manga-cover.png"));
  for (const volume of volumes) {
    assert.equal(volume.cover, `/images/volumes/csm_volume_${volume.number}.jpg`);
    assert.match(volume.cover, /^\/images\/volumes\/.+\.(png|webp|avif|jpe?g)$/i);
    assert.ok(existsSync(`public${volume.cover}`));
  }
  assert.deepEqual(arcsForVolume(arcs, volumes[0]).map((arc) => arc.name), ["Introduction", "Bat Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[4]).map((arc) => arc.name), ["Katana Man", "Bomb Girl"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[8]).map((arc) => arc.name), ["Gun Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[10]).map((arc) => arc.name), ["Control Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[11]).map((arc) => arc.name), ["Justice Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[14]).map((arc) => arc.name), ["Falling Devil", "Chainsaw Man Church"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[17]).map((arc) => arc.name), ["Chainsaw Man Church", "Aging Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[20]).map((arc) => arc.name), ["Aging Devil", "War Devil"]);
  assert.deepEqual(arcsForVolume(arcs, volumes[23]).map((arc) => arc.name), ["War Devil"]);
  for (const arc of arcs) {
    const [first, last = first] = arc.volumes.match(/\d+/g)?.map(Number) ?? [];
    assert.deepEqual(volumes.filter((volume) => arcsForVolume([arc], volume).length).map((volume) => volume.number),
      Array.from({ length: last - first + 1 }, (_, index) => first + index), arc.name);
  }
  assert.ok(arcs.every((arc) => arc.chapters && arc.description.length > 70 && !arc.description.includes("undefined")));
  assert.ok(arcs.every((arc) => /^https:\/\/(www\.viz\.com|books\.shueisha\.co\.jp)\//.test(arc.sourceUrl)));
  assert.equal(arcs.length, 14);
  for (const arc of arcs) {
    assert.match(arc.artwork ?? "", /^\/images\/arcs\/.+\.(png|webp|avif|jpe?g)$/i);
    assert.ok(existsSync(`public${arc.artwork}`), arc.name);
  }
});
