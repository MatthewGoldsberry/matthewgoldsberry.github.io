import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

/**
 * Content collections and their schemas.
 *
 * The schemas are the point of this file. Under the previous stack the hover
 * cards were routed by a `frame:` string and keyed by a `key:` string, both
 * matched with a template `if`. A typo in either produced no error and no card —
 * the satellite simply did nothing when you hovered it, and the only way to find
 * out was to hover every figure on the page. Here the same mistake fails the
 * build and names the file and the field.
 */

/**
 * Keys that a hover card may attach to. Mirrors `SpotKey` in
 * components/figures/types.ts, which is what the SVG components are typed
 * against — the two together are what make a mismatched key impossible.
 *
 * Exported because the id of a spot entry is its key, and ids are not covered
 * by a collection schema. Hero.astro runs each id through this on the way in,
 * so an unknown key throws during the build instead of rendering a dead figure.
 */
export const spotKey = z.enum([
  "leopardsat",
  "habsat",
  "cubesats",
  "climbing",
  "fishing",
  "camping",
  "hiking",
]);

/**
 * Hover cards for the figures in the hero.
 *
 * Keyed by spot rather than an array: the YAML key becomes the entry id, which
 * is also the value that must match `data-spot` on the SVG group. One spelling
 * of the key, in the one place it identifies the entry.
 */
const spots = defineCollection({
  loader: file("src/content/spots.yaml"),
  schema: z.object({
    title: z.string(),
    text: z.string(),
    image: z.string().optional(),
    /**
     * How the card fits `image` into its slot — same meaning as a project's
     * `imageFit`. "contain" (the default) shows the whole image, inset: right
     * for a mission patch, whose emblem reaches every edge. "cover" fills the
     * slot and crops: right for a photograph, which letterboxed into the
     * card's short, wide slot became a thin strip.
     */
    imageFit: z.enum(["cover", "contain"]).default("contain"),
    /** Optional link through to the work this figure stands for. */
    href: z.string().optional(),
  }),
});

/**
 * Project writeups.
 *
 * `order` drives the sort on the projects index and the featured strip on the
 * landing page; `featured` selects which ones the landing page shows at all.
 */
const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    /** Used for <meta name="description"> and the card blurb if `summary` is absent. */
    description: z.string(),
    /** Card blurb. Kept separate from `description` so the card can be tighter. */
    summary: z.string().optional(),
    /** Card image, relative to /public. */
    image: z.string(),
    imageAlt: z.string(),
    /**
     * How the card/row fits `image` into its box. "cover" (the default) fills
     * the box and crops — right for a wide dashboard screenshot, where the
     * box is closer to its own aspect ratio. "contain" shows the whole image
     * uncropped instead — for a square mission patch, whose emblem reaches to
     * every edge, a wide cover box crops off its top and bottom.
     */
    imageFit: z.enum(["cover", "contain"]).default("cover"),
    tech: z.array(z.string()).default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    /** Lower sorts first. */
    order: z.number().default(99),
    featured: z.boolean().default(false),
    /** Shown as a badge on the card when set. */
    status: z.string().optional(),
    /**
     * Whether `status` names something still moving (building, deployed and
     * running) versus something finished. Controls the badge's styling — the
     * blinking dot is an instrument reading a live state, so it is wrong on a
     * project that is simply done. Ignored when `status` is unset.
     */
    ongoing: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

/**
 * The standalone prose pages — experience, research. Each is Markdown with a
 * little structured frontmatter for the page header.
 */
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Optional lede under the h1. */
    lede: z.string().optional(),
    /**
     * An image shown beside the title and lede, not just in `<meta>` tags —
     * distinct from a project's `image` (OG-only) because most pages using
     * this layout have no such image and shouldn't grow one. Requires
     * `heroImageAlt` alongside it.
     */
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    /**
     * A single action button anchored to the header itself rather than
     * flowing after it in the body — so it can sit inside the space
     * `heroImage` reserves instead of pushing the divider below that space
     * down by its own height. Both required together; neither means no
     * button.
     */
    heroActionLabel: z.string().optional(),
    heroActionHref: z.string().optional(),
  }),
});

export const collections = { spots, projects, pages };
