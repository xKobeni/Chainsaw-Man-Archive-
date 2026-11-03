# Artwork manifest

The homepage uses the supplied `placeholders/poster1_landing.jpeg`, `placeholders/denji_landing.jpg`, and `placeholders/asa_landing.jpg` artwork. The character index and profiles use the supplied images for Denji, Pochita, Power, Himeno, Kobeni, Reze, Kishibe, and Yoshida. Characters without an image still use `placeholders/artwork.png`, a locally created geometric raster placeholder. The original SVG character has not been copied into the application.

The Story Arcs feature also uses this neutral raster placeholder and labels the missing arc illustration. No licensed arc illustrations were supplied.

For characters still missing artwork, add PNG, WebP, AVIF or JPG files and set each character's `artwork` property in `src/data/characters.ts` to its public URL:

| Character | Recommended file |
| --- | --- |
| Makima | `public/images/characters/makima.webp` |
| Aki Hayakawa | `public/images/characters/aki.webp` |
| Asa Mitaka | `public/images/characters/asa.webp` |
| Yoru | `public/images/characters/yoru.webp` |
| Nayuta | `public/images/characters/nayuta.webp` |
| Fami | `public/images/characters/fami.webp` |

Example public URL: `/images/characters/denji.webp`. Prefer transparent 4:7 artwork, approximately 800×1400 or larger. Do not set paths until files exist; `null` intentionally selects the shared placeholder. Runtime image failures also fall back to it.

`backgrounds/` is reserved for authorized future background imagery. See the [volume cover manifest](volumes/README.md) for the neutral raster fallback and authorized cover paths.

The World & Places gallery uses the neutral raster placeholder until licensed environment images are supplied. Add landscape PNG, WebP, AVIF or JPG files under `public/images/backgrounds/` (for example `tokyo.webp`, `public-safety-hq.webp`, `denjis-home.webp`, `hotel.webp`, `hell.webp`, and `academy.webp`) and set the matching location's `image` field in `src/data/locations.ts` to `/images/backgrounds/<file>`. The gallery does not use the prototype's SVG scenery.
