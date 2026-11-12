import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Placeholder project pages remain available, but should not appear in search.
const projectsDir = new URL('./src/content/projects/', import.meta.url);
const pendingProjects = new Set(readdirSync(projectsDir)
  .filter((file) => /\.mdx?$/.test(file))
  .filter((file) => /^soon:\s*true\s*$/m.test(
    readFileSync(new URL(file, projectsDir), 'utf8').split('---')[1] ?? '',
  ))
  .map((file) => `/projects/${file.replace(/\.mdx?$/, '')}/`));

export default defineConfig({
  site: 'https://kyry.me',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [mdx(), sitemap({
    // These pages are deployed from separate GitHub Pages project repositories.
    customPages: [
      'https://kyry.me/sonic-k1/',
      'https://kyry.me/isaaclab-h100/',
    ],
    filter: (page) => !pendingProjects.has(new URL(page).pathname),
  })],
  // Old project pages, merged into K1 Shoes.
  redirects: {
    '/projects/k1-heel-shoes': '/projects/k1-shoes/',
    '/projects/k1-klompen': '/projects/k1-shoes/',
  },
});
