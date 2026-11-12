import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dates are plain strings so partial dates work: "2026", "2026-09", "2026-09-22".
const isoish = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'use YYYY, YYYY-MM or YYYY-MM-DD');

const link = z.object({ label: z.string(), url: z.string() });

const media = z.object({
  src: z.string(), // path under /public, e.g. /media/expressive-motion/k1-catwalk.mp4
  alt: z.string(),
  caption: z.string().optional(),
  poster: z.string().optional(),
  wide: z.boolean().optional(), // gallery: take the whole row
  fit: z.enum(['cover', 'contain']).optional(), // "contain": show the whole picture in its own proportions, e.g. wide figures
  link: z.object({ label: z.string(), url: z.string() }).optional(), // shown after the caption, e.g. the post the video comes from
  position: z.string().optional(), // crop focus for thumbnails and the top image, CSS object-position, e.g. "50% 30%" shows more of the top
});

// Home page text and sidebar: bio.md
const meta = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/meta' }),
  schema: z.object({
    title: z.string().optional(),
    role: z.string().optional(), // one line under the name in the sidebar
    portrait: media.optional(), // sidebar photo
    hero: media.extend({ href: z.string().optional() }).optional(), // big video at the top of the home page
    updated: isoish.optional(),
    affiliations: z.array(link).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().optional() })).optional(),
  }),
});

// A paper lives inside its project's file. /publications/ and the CV collect them from there.
const paper = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number(),
  date: isoish.optional(), // for ordering inside a year
  venue: z.string(),
  status: z.string().optional(), // "accepted", "to appear", ...
  teaser: z.string().optional(), // image for paper lists; default is the project's top media
  type: z.enum(['inproceedings', 'article', 'misc']).default('inproceedings'),
  arxiv: z.string().optional(), // "2609.27003"
  pdf: z.string().optional(),
  code: z.string().optional(),
  video: z.string().optional(),
  bibtex: z.string().optional(), // overrides the generated entry
  selected: z.boolean().default(false), // show on the home page
  todo: z.string().optional(),
});

// Everything about a project is in one file: text, media and papers.
const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one line, used on index and home
    start: z.string(), // YYYY[-MM] or "TODO"
    end: z.string().optional(), // YYYY[-MM], "present", or omit for single date
    robots: z.array(z.string()).default([]),
    venue: z.string().optional(),
    status: z.string().optional(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    links: z.array(link).default([]),
    media: media.optional(), // shown at the top of the page and as the thumbnail
    gallery: z.array(media).default([]), // more videos and photos, shown under the text
    papers: z.array(paper).default([]),
    featured: z.boolean().default(false),
    other: z.boolean().default(false), // listed under "Other research" (projects without robots are too)
    soon: z.boolean().default(false), // announced only: listed under "Coming soon", no media yet
    order: z.number().default(100), // lower = earlier in lists; also the project ID (P-01, …)
    pinned: z.boolean().default(false), // listed first, whatever its order
  }),
});

// Blog: workshops, talks, press and guides. One file per post.
const posts = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // YYYY[-MM[-DD]] or "TODO"
    kind: z.enum(['workshop', 'talk', 'press', 'award', 'release', 'guide', 'note']),
    summary: z.string(), // one line, used in lists
    url: z.string().optional(), // published elsewhere (Medium, ...): listed here and links there, no page on this site
    where: z.string().optional(), // venue or host, e.g. "Advanced Telerobotics Research Lab"
    duration: z.string().optional(), // workshops and talks, e.g. "3 hours"
    audience: z.string().optional(),
    links: z.array(link).default([]), // slides, code, video, the article
    media: media.optional(), // shown at the top of the post
    gallery: z.array(media).default([]), // more videos and photos, shown under the text
    pinned: z.boolean().default(false), // listed first on /blog/ and the home page
    draft: z.boolean().default(false), // shown only in `npm run dev`
  }),
});

// One YAML file per CV section.
const cv = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cv' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    compact: z.boolean().default(false), // two-column label/value list, e.g. skills
    entries: z.array(
      z.object({
        what: z.string(),
        where: z.string().optional(),
        place: z.string().optional(),
        when: z.string().optional(),
        note: z.string().optional(),
        bullets: z.array(z.string()).default([]),
        links: z.array(link).default([]),
      }),
    ),
  }),
});

export const collections = { meta, projects, posts, cv };
