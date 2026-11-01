# Phase 1 verification

The original HTML prototype remains unchanged. Desktop Chrome screenshots were captured for all seven prototype views and the corresponding Next.js routes, then compared for typography, colors, manga compositions, decoration, and spacing. The homepage and character stages intentionally differ where the original character SVG has been replaced by a labeled raster placeholder. This is a visual review, not a pixel-perfect parity claim.

Checks completed against the production build:

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm test` — 4 passed: content references, route files, raster assets, volume/arc bounds.
- `npm run build` — passed; all seven routes statically rendered.
- `npm run test:e2e` — 5 passed in Chrome: routes, image loading and browser errors; menu transitions/history; part and character selection, profile relationships/focus/Escape; dossiers/redactions; arc keyboard tabs; location links; volume bounds; lore profiles; 390 px reduced-motion layouts; repeated navigation and detached animation cleanup.
- Direct responses: `/world` redirects with 308, an unknown route returns 404, placeholder image returns 200.
- `node scripts/check-visuals.mjs` — desktop comparison screenshots, 390 px screenshots for every route, no document overflow, and a successful animated mobile Part 2 route interaction.
- `npm audit --omit=dev` — 0 production dependency advisories.

Limits: No licensed character artwork was supplied. See `public/images/README.md` for the required paths. The exact Google Fonts depend on network access. Chrome desktop and a simulated mobile viewport were checked; Safari and physical devices were not. The full dependency audit reports 16 moderate findings in development tooling (ESLint and its transitive packages). No force upgrade was applied because those tools currently have conflicting peer ranges.

## Volume and typography refinement

After removing the oversized Japanese background lettering and replacing the volume index with an artwork-led gallery, the production build, TypeScript, lint, and four data tests passed. All six Chrome browser tests passed against the production server, including cover fallback loading, gallery keyboard controls, arc links, route navigation, 390 px layout, reduced motion, and repeated GSAP navigation cleanup. Desktop and 390 px screenshots of the volume page were reviewed; desktop home, characters, devils, and locations were also reviewed. None showed document overflow. Licensed manga covers are still pending, and Safari and physical devices remain unchecked.

## Story Arcs and Characters refinement

The redesigned pages were visually reviewed in Chrome at 1440, 820, and 390 px, including a 390 px profile overlay. Long arc and character titles stayed within their containers, headings cleared the fixed header, raster placeholders loaded, and the document had no horizontal overflow. The production build, TypeScript, lint, and four data tests passed. All seven production Chrome browser cases passed across the initial run and a focused rerun after updating assertions for the new selector labels; these cover part filters, keyboard tabs, related links, profiles, reduced motion, mobile layout, and repeated navigation cleanup. Licensed character and arc artwork remains pending; Safari and physical devices were not checked.

## Homepage and intro refinement

The homepage was reviewed in Chrome at 1440, 820, and 390 px after scrolling through all sections; final hero and ending screenshots were rechecked at 1440 and 390 px. Title and CTA bounds also fit a 320 px viewport. The first intro, same-session refresh, reduced-motion skip, visible scroll reveals, image loading, and route navigation were checked. Production build, TypeScript, lint, four data tests, and all eight production Chrome browser tests passed. The live development server was restarted on port 3000. Licensed character artwork remains pending, and Safari and physical devices were not checked.
