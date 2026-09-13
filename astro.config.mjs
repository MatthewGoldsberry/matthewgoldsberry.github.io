// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// A user site (matthewgoldsberry.github.io), so it is served from the domain
// root and needs no `base`. If this ever moves to a project repo, set
// `base: "/<repo>/"` here and every `Link` href picks it up automatically.
export default defineConfig({
  site: "https://matthewgoldsberry.github.io/",
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  // Every page is prerendered to HTML at build time. Only components marked
  // with a `client:*` directive ship JavaScript — today that is the hover-card
  // layer on the landing page and nothing else.
  output: "static",
  build: { format: "directory" },
  markdown: {
    shikiConfig: { theme: "github-dark-dimmed", wrap: true },
  },
});
