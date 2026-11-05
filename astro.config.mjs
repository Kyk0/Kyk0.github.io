import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kyry.me',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [mdx(), sitemap()],
  // Old project pages, merged into K1 Shoes.
  redirects: {
    '/projects/k1-heel-shoes': '/projects/k1-shoes/',
    '/projects/k1-klompen': '/projects/k1-shoes/',
  },
});
