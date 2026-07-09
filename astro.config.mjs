// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";

import tailwindcss from "@tailwindcss/vite";
import rehypeShortHeading from "./src/plugins/rehype-short-heading.mjs";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeShortHeading],
    }),
  },
  integrations: [pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
});
