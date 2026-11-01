# CHAINSAW MAN — Archive

Phase 1 migration of the supplied HTML prototype. Next.js App Router, TypeScript, React, Tailwind utilities, CSS Modules, GSAP/ScrollTrigger, `@gsap/react`, and Lucide React.

Use Node.js 22.13+ (22 LTS) or 24+; verification used Node.js 24.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Browser regression checks: `npm run test:e2e` after building (uses installed Google Chrome and starts the production server when needed). `node scripts/check-visuals.mjs` captures the original prototype and Next.js pages while a server is running. Screenshots and failure traces are written to ignored `test-results/`.

## Structure

- `src/app`: server route components and metadata for `/`, `/characters`, `/devils`, `/arcs`, `/locations`, `/volumes`, `/lore`; `/world` redirects to `/locations`.
- `src/components`: interactive selectors, modal profile, navigation shell, raster artwork, a featured volume gallery, reusable typography and decorations.
- `src/animations`: scoped `useGSAP` hooks and ScrollTrigger timelines. Contexts and media queries revert on selection, route unmount and motion-preference changes. Event listeners, scroll locks and focus traps have cleanup.
- `src/data`, `src/types`, `src/lib`: prototype content, interfaces and small helpers. Selection state stays in the root shell while navigating.
- `src/styles`: prototype CSS split by responsibility with a final typography refinement layer. Tailwind preflight is omitted to preserve the prototype reset. Artwork and the volume collection have CSS Modules.
- `public/images`: raster assets and required [character](public/images/README.md) and [volume cover](public/images/volumes/README.md) paths.

The original HTML is unchanged and remains the initial visual reference. No database, authentication or API is used. The 24-volume gallery retains the original archive scope; ranges without verified evidence are explicitly unset. [Metadata sources](src/data/README.md) are recorded. The original arc-description indexing error is corrected. Part-specific home links select the intended saga/cast.

## Assets and accessibility

No licensed character art was supplied. A labeled geometric PNG placeholder is rendered with Next Image on the hero, selection stage and profiles. Replace it only with authorized artwork; see the asset manifest. The prototype's SVG character is not used. Decorative scenery and patterns remain SVG.

Anton, Noto Serif JP and Space Mono use the prototype's Google Fonts stylesheet, with local fallbacks. Internet access is required for the exact fonts; production builds do not fetch them.

Fullscreen overlays trap focus, close with Escape, lock background scrolling and restore focus. Arc tabs support arrow/Home/End keys, redactions support keyboard/touch, and reduced motion disables GSAP entrance/parallax/wipe motion and CSS animation. Narrow layouts retain horizontal cast/arc/volume/location rails.

Verification results and limitations are recorded in `docs/VERIFICATION.md`.
