import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, toDate, getPapers, getPosts, postHref, sortKey } from '../lib/util';

const dated = (d?: string) => !!d && /^\d{4}/.test(d);

// Feed of projects (dated by their latest known date), papers and blog posts.
export async function GET(context: APIContext) {
  const projects = (await getCollection('projects', (p) => !p.data.soon))
    .map((p) => ({ p, date: [p.data.end, p.data.start].find(dated) }))
    .filter((x) => x.date)
    .map(({ p, date }) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: toDate(date!),
      link: `/projects/${p.id}/`,
      categories: ['project'],
      key: sortKey(date!),
    }));
  const papers = (await getPapers()).map(({ paper, id }) => ({
    title: paper.title,
    description: `${paper.venue}, ${paper.year}${paper.status ? `, ${paper.status}` : ''}.`,
    pubDate: toDate(paper.date ?? String(paper.year)),
    link: `/publications/#${id}`,
    categories: ['paper'],
    key: sortKey(paper.date ?? String(paper.year)),
  }));
  const posts = (await getPosts())
    .filter((p) => dated(p.data.date) && !p.data.draft)
    .map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: toDate(p.data.date),
      link: postHref(p),
      categories: ['post', p.data.kind],
      key: sortKey(p.data.date),
    }));
  const items = [...projects, ...papers, ...posts].sort((a, b) => b.key.localeCompare(a.key)).map(({ key, ...item }) => item);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    trailingSlash: false,
    items,
  });
}
