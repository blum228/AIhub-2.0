// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blum228.github.io',
  output: 'static',
  integrations: [
    mdx(),
    react(),
    sitemap()
  ]
});
