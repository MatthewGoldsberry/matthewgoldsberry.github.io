// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkDirective from "remark-directive";
import remarkAdmonitions from "./src/plugins/remark-admonitions.ts";
import rehypeFieldLabels from "./src/plugins/rehype-field-labels.ts";
import rehypeCodeFrame from "./src/plugins/rehype-code-frame.ts";
import rehypeTableFrame from "./src/plugins/rehype-table-frame.ts";

// A user site (matthewgoldsberry.github.io), so it is served from the domain
// root and needs no `base`. If this ever moves to a project repo, set
// `base: "/<repo>/"` here and every `Link` href picks it up automatically.
export default defineConfig({
  site: "https://matthewgoldsberry.github.io/",
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  // Every page is prerendered to HTML at build time. Only components marked
  // with a `client:*` directive ship JavaScript — today that is the hover-card
  // layer on the landing page — plus the code-block copy script in
  // `ProseLayout`.
  output: "static",
  build: { format: "directory" },
  markdown: {
    // Both themes, and no default: Shiki then writes each token's colour as
    // a `--shiki-light` / `--shiki-dark` pair instead of a fixed inline
    // colour, and `.mg-code` in content.css picks between them with
    // `light-dark()` — so code follows the header toggle like everything else.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
      wrap: true,
    },
    // `:::note` / `:::tip` / … callouts in project writeups — see the plugin
    // for why this needs remark-directive rather than mkdocs' own syntax.
    remarkPlugins: [remarkDirective, remarkAdmonitions],
    // Tags a leading "**Label**" bold run as `.mg-field-label` — see the
    // plugin for why this can't just be a CSS selector.
    // Wraps each code block in a `.mg-code` frame with a copy button, and each
    // table in a `.mg-table` frame (border, radius, sideways scroll).
    rehypePlugins: [rehypeFieldLabels, rehypeCodeFrame, rehypeTableFrame],
  },
});
