# Artwork manifest

No licensed character artwork was supplied. `placeholders/artwork.png` is a locally created geometric raster placeholder, not a character illustration. `CharacterArtwork` renders it with Next.js Image and an explicit ARTWORK PENDING label. The original SVG character has not been copied into the application.

The Story Arcs feature also uses this neutral raster placeholder and labels the missing arc illustration. No licensed arc illustrations were supplied.

Supply authorized PNG, WebP, AVIF or JPG artwork at these recommended paths, then set each character's `artwork` property in `src/data/characters.ts` to its public URL:

| Character | Recommended file |
| --- | --- |
| Denji / home hero | `public/images/characters/denji.webp` |
| Pochita | `public/images/characters/pochita.webp` |
| Makima | `public/images/characters/makima.webp` |
| Power | `public/images/characters/power.webp` |
| Aki Hayakawa | `public/images/characters/aki.webp` |
| Kobeni Higashiyama | `public/images/characters/kobeni.webp` |
| Reze | `public/images/characters/reze.webp` |
| Kishibe | `public/images/characters/kishibe.webp` |
| Asa Mitaka | `public/images/characters/asa.webp` |
| Yoru | `public/images/characters/yoru.webp` |
| Nayuta | `public/images/characters/nayuta.webp` |
| Fami | `public/images/characters/fami.webp` |
| Yoshida | `public/images/characters/yoshida.webp` |

Example public URL: `/images/characters/denji.webp`. Prefer transparent 4:7 artwork, approximately 800×1400 or larger. Do not set paths until files exist; `null` intentionally selects the shared placeholder. Runtime image failures also fall back to it.

`backgrounds/` is reserved for authorized future background imagery. See the [volume cover manifest](volumes/README.md) for the neutral raster fallback and authorized cover paths.

The World & Places gallery uses the neutral raster placeholder until licensed environment images are supplied. Add landscape PNG, WebP, AVIF or JPG files under `public/images/backgrounds/` (for example `tokyo.webp`, `public-safety-hq.webp`, `denjis-home.webp`, `hotel.webp`, `hell.webp`, and `academy.webp`) and set the matching location's `image` field in `src/data/locations.ts` to `/images/backgrounds/<file>`. The gallery does not use the prototype's SVG scenery.
