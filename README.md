# PortfolioSite

Source for [matthewgoldsberry.github.io](https://matthewgoldsberry.github.io/) — built with
[Astro](https://astro.build), TypeScript, React, and Tailwind, and deployed to GitHub Pages
on every push to `main`.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then writes dist/
npm run preview  # serve dist/ locally
```

`npm run build` runs `astro check` first, so a type error fails the build rather than
shipping a page that renders wrong. CI runs the same command.

## How it is put together

Every page is prerendered to static HTML at build time. Components ship **zero**
JavaScript unless they are explicitly marked with a `client:*` directive — today exactly
one component is, and the result is:

| Page | JavaScript shipped |
| --- | --- |
| Project writeups, experience, research, résumé | ~0.3 kB (the scheme toggle) |
| Landing page | ~0.3 kB, plus the hover-card island loaded on idle |

The scene's stylesheet code-splits the same way: `scene.css` is ~13 kB and only the
landing page requests it.

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | Routes. File-based; `[page].astro` and `projects/[...slug].astro` are generated from content collections |
| `src/content/` | The writing. Markdown writeups plus `spots.yaml` |
| `src/content.config.ts` | Zod schemas for everything in `src/content/` |
| `src/data/site.ts` | Config and the landing page's structured copy — nav, identity, stats, current roles, skills |
| `src/components/figures/` | The SVG drawing vocabulary — one component per figure |
| `src/components/hero/` | The landing composition: orbit band, horizon panorama, plate, hover cards |
| `src/components/ui/` | Buttons, pills, cards, eyebrows, icons |
| `src/components/chrome/` | Header, footer, contact band, scheme toggle |
| `src/styles/` | `global.css` (palette + Tailwind theme + prose), `scene.css` (SVG paint and motion), `content.css` (the classes Markdown may use) |
| `public/` | Media, the résumé PDF, favicon. Served from the root as `/assets/...` |

## Where the styling lives

Three places, and the split is deliberate:

1. **Tailwind utilities**, for anything a component renders. The theme is defined in
   `src/styles/global.css` under `@theme`, driven by the `--mg-*` palette above it.
2. **`src/styles/scene.css`**, for the landscape and the figures. Joint rotation origins
   in local viewBox units, `offset-path`, and multi-stop `@keyframes` have no utility
   form, and the static poses have to sit next to the animations that override them.
3. **`src/styles/content.css`**, for the handful of classes a Markdown body may use
   (`mg-project-header`, `mg-timeline`, `mg-btn`…). Composed with `@apply` from the same
   theme, so values still have one source. Keep it small — a writeup that needs something
   bespoke should become `.mdx` and import a real component.

A few components also carry a scoped `<style>` block. Those are the cases where the
layout is a measured relationship rather than a set of values — the hero's flex sizing,
the panorama's aspect-ratio caps, the plate's two-axis restructure — and utilities would
be a row of arbitrary values with the reasoning stripped out.

## The colour scheme

The palette is one list of `light-dark()` pairs on `:root`. The toggle narrows
`color-scheme` to `only light` / `only dark` rather than restating any colour, so there
is a single definition per value and the SVG landscape follows the scheme for free.

## Adding content

**A project:** drop a Markdown file in `src/content/projects/`. The frontmatter schema is
in `src/content.config.ts`; the build fails and names the field if something is missing.
Set `featured: true` to put it on the landing page, and `order` to place it.

**A page:** drop a Markdown file in `src/content/pages/`. It routes automatically at
`/<filename>/`.

**A hover card:** add an entry to `src/content/spots.yaml`. The top-level key is the
routing key and must match a `data-spot` value in the scene — it is checked against a
closed set at build time, so a typo fails the build instead of producing a figure that
does nothing when you hover it.

## The scene

The landscape and the orbit band are hand-authored SVG, drawn from one figure skeleton so
that a single set of joint origins drives every placement:

```
ground   0        hip      -13.2      elbow  -16.8
ankle   -1.6      shoulder -21.6      wrist  -12.0
knee    -7.2      neck     -22.8      head c -24.8 (r 2.2)
```

Two rules worth knowing before editing it:

- **The scene must read as finished with zero motion.** Every animation sits behind
  `prefers-reduced-motion`, and each element's static pose is a composed frame on its own.
- **A CSS `transform` overrides an SVG `transform` attribute.** Anything animated is
  therefore a child of a plain positioning group, never the positioned element itself. The
  `Place` component exists to enforce that.

The ground station's antenna tracks LEOPARDSat-1 across the orbit band above it. Those two
bands are laid out independently, so the bearing is not one fixed number — the keyframes in
`scene.css` were measured in the browser across a range of viewport widths and averaged.
Re-measure them if the station moves, if the mast head moves, or if the orbit band is re-laid.
