# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`README.md` is the authoritative tour of the stack, the layout table, and the styling split — read it rather than re-deriving that from the tree. This file covers what is only visible by reading several files together.

## Commands

```sh
npm run dev      # http://localhost:4321
npm run build    # astro check, then dist/  — this is what CI runs
npm run check    # types only, faster than a full build
npm run format   # prettier over src/**/*.{astro,ts,tsx,css}
npm run preview  # serve dist/
```

There is no test suite. `astro check` is the only automated gate, so it has to stay green — a lot of the design here is deliberately arranged to turn a mistake into a type error (see "Failure modes are compile errors" below), and that only pays off if the check runs.

Verifying visual work means looking at it: `npm run dev`, then check **both schemes** (the header toggle) and **both compositions** (the panorama has separate wide and narrow SVGs that swap at 48em — editing one does not touch the other).

## Architecture

**Static by construction.** `output: "static"`; every page is prerendered. Exactly one component ships JavaScript — `hero/SpotCards.tsx`, hydrated with a `client:*` directive. Adding a second is a real decision, not a detail. `scene.css` is imported from `Hero.astro` rather than the layout so it code-splits onto the landing page alone.

**Content vs. configuration.** Prose lives in `src/content/` behind Zod schemas in `src/content.config.ts`. Identity, nav, and the landing page's structured copy live in `src/data/site.ts` — TypeScript specifically so consumers are checked against it. Long-form goes in a collection; a field several components read goes in `site.ts`.

**The scene is a system, not a drawing.** `src/components/figures/` is a drawing vocabulary; `src/components/hero/` composes it. Everything is built on one figure skeleton documented at the top of both `figures/types.ts` and `styles/scene.css` — one set of joint origins in `scene.css` drives every figure at every placement. Never respell a figure inline; extend its component. Geometry helpers (`smoothPath`, `channel`, `areteTopFor`) live in `types.ts` so a river or a path is authored as the points you care about rather than as hand-tuned bezier handles.

### Invariants that break silently if violated

- **A CSS `transform` overrides an SVG `transform` attribute.** Anything animated must be a *child* of a plain positioning group. `Place` and `Spot` exist to enforce that; positioning a figure that also animates loses its position the moment a keyframe touches it.
- **The scene must read as finished with zero motion.** Every animation sits behind `prefers-reduced-motion`; each element's static pose is a composed frame on its own.
- **`light-dark()` returns a `<color>` and nothing else.** A scheme-dependent *number* (opacity, length) written that way silently computes to the fallback instead of failing. Those are spelled out per scheme in `global.css` across three states: default/system, `[data-theme="dark"]`, `[data-theme="light"]`. The toggle narrows `color-scheme`; it never restates a colour.
- **New scene markup needs its paint added to `scene.css`.** An unstyled SVG class renders as black fill with no error, and `astro check` will not catch it.
- **Depth in the panorama is carried by the ORDER of the `--mg-terrain-*` values**, not their exact values. Retune them together and keep the march monotonic, or the planes collapse into one mass.
- **The pass's two moving numbers are computed at runtime, not written down.** `hero/PassGeometry.astro` measures both from the live DOM and writes them into custom properties the keyframes read: where the pass ends (the offset-distance at which the craft is fully behind the cliff's arete, `--mg-pass-end`) and the array's nine tracking bearings (`--mg-track-0`..`8`). Both depend on how the three independently-laid-out layers happen to fall at a given viewport, so the values in `scene.css` are fallbacks only. Changing the band, the cliff layer, the station or the mast head does not need re-measuring — but it does need a look, because nothing type-checks it.
- **The panorama's `max-height` in `Horizon.astro` must equal its own aspect ratio** (260/1200 = 21.67%). If they disagree, `slice` starts cropping the sides or scaling by height, which also breaks the cliff layer's scale match with `CliffFace.astro`.

### Failure modes are compile errors

The previous stack routed hover cards by loose strings, so a typo produced a figure that silently did nothing when hovered. The replacement closes that loop in two places, and both must stay closed: `SpotKey` in `figures/types.ts` (what the SVG components are typed against) and `spotKey` in `content.config.ts` (what `Hero.astro` `.parse`s each YAML id through). Adding a hover card means adding the key to **both** and an entry to `src/content/spots.yaml` whose top-level key matches the `data-spot` on the SVG group.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages. It is a user site served from the domain root, so there is no `base` — if this ever moves to a project repo, set `base` in `astro.config.mjs` and every href picks it up.

## Working notes

`todos.md` is the running wish list, in the owner's own words. It is a source of intent, not a spec — check it before proposing scene or content work, and don't treat an unticked line as an assignment.
