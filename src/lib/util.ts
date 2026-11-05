import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = {
  name: 'Kyrylo Kolesnichenko',
  description:
    'Kyrylo Kolesnichenko, undergraduate researcher in humanoid robot learning at the Advanced Telerobotics Research Lab, Kent State University (B.Sc., Vilnius University). Learned locomotion, expressive gaits, robot footwear.',
  me: 'Kolesnichenko',
  x: '@kyry_D',
  // Cloudflare Web Analytics token (dash.cloudflare.com → Analytics & Logs → Web Analytics →
  // kyry.me → "Manage site" → the token in the JS snippet). Empty = no tracking.
  cfAnalyticsToken: '27aa3afcfa9a4cdf835daa06cb812b31',
};

// Partial dates sort as if they were at the end of their period, so "2026"
// (exact date unknown) sits above "2026-09-22" rather than below "2026-01".
export function sortKey(d: string): string {
  const [y, m = '99', day = '99'] = d.split('-');
  return `${y}-${m}-${day}`;
}

export function byDateDesc<T>(get: (x: T) => string) {
  return (a: T, b: T) => sortKey(get(b)).localeCompare(sortKey(get(a)));
}

export function toDate(d: string): Date {
  const [y, m = '01', day = '01'] = d.split('-');
  return new Date(`${y}-${m}-${day}T12:00:00Z`);
}

export function range(start: string, end?: string): string {
  if (!end || end === start) return start;
  return `${start} – ${end}`;
}

// "https://www.github.com/Kyk0/x/" -> "github.com/Kyk0/x"
export const prettyUrl = (u: string) => u.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

export const isTodo = (s?: string) => !!s && s.startsWith('TODO');

// TODOs are shown while editing (`npm run dev`) and left out of the built site.
export const SHOW_TODO = import.meta.env.DEV;
export const hideTodo = (s?: string) => isTodo(s) && !SHOW_TODO;

export function sortProjects(list: CollectionEntry<'projects'>[]) {
  return list.sort((a, b) => Number(b.data.pinned) - Number(a.data.pinned) || a.data.order - b.data.order);
}

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;

// Blog posts, pinned first, then newest first. Drafts only while editing (`npm run dev`); a "TODO" date sorts on top.
// Where a post lives: its page here, or the external article.
export const postHref = (p: Post) => p.data.url ?? `/blog/${p.id}/`;

export async function getPosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft || SHOW_TODO);
  const newest = byDateDesc<Post>((p) => p.data.date);
  return posts.sort((a, b) => Number(b.data.pinned) - Number(a.data.pinned) || newest(a, b));
}

// "2026-10-15" -> "Oct 2026"
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function monthYear(d: string): string {
  const [y, m] = d.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}
export type Paper = Project['data']['papers'][number];

// "Poster at IROS 2026, Pittsburgh" -> "poster-at-iros-2026-pittsburgh", for #anchors
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// Every paper from every project, newest first. `id` is the anchor on /publications/.
export async function getPapers() {
  const projects = await getCollection('projects');
  return projects
    .flatMap((project) => project.data.papers.map((paper) => ({ paper, project, id: slugify(`${paper.year} ${paper.title}`) })))
    .sort(
      (a, b) =>
        b.paper.year - a.paper.year ||
        (b.paper.date ?? `${b.paper.year}-00`).localeCompare(a.paper.date ?? `${a.paper.year}-00`),
    );
}


// "Jong-Hoon Kim" -> "Kim, Jong-Hoon"
function bibName(n: string): string {
  const parts = n.trim().split(/\s+/);
  const last = parts.pop()!;
  return parts.length ? `${last}, ${parts.join(' ')}` : last;
}

// Generated BibTeX, unless the entry provides its own. Returns null when the
// author list is incomplete, so nobody copies a broken citation.
export function bibtex(p: Paper): string | null {
  if (p.bibtex) return p.bibtex.trim();
  if (p.authors.some((a) => a.includes('…'))) return null;
  const first = bibName(p.authors[0]).split(',')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
  const word = p.title.toLowerCase().split(/\W+/).find((w) => w.length > 3) ?? 'paper';
  const fields: [string, string][] = [
    ['title', `{${p.title}}`],
    ['author', p.authors.map(bibName).join(' and ')],
    [p.type === 'article' ? 'journal' : 'booktitle', p.venue],
    ['year', String(p.year)],
  ];
  if (p.arxiv) fields.push(['eprint', p.arxiv], ['archivePrefix', 'arXiv']);
  if (p.status && /to appear/i.test(p.status)) fields.push(['note', 'To appear']);
  const w = Math.max(...fields.map(([k]) => k.length));
  const body = fields.map(([k, v]) => `  ${k.padEnd(w)} = {${v}}`).join(',\n');
  return `@${p.type}{${first}${p.year}${word},\n${body}\n}`;
}

// Plain-text citation for the "copy citation" button.
export function citation(p: Paper): string {
  const venue = p.status && /to appear/i.test(p.status) ? `${p.venue}, to appear` : p.venue;
  const arxiv = p.arxiv ? ` arXiv:${p.arxiv}.` : '';
  const title = /[.?!]$/.test(p.title) ? p.title : `${p.title}.`;
  return `${p.authors.join(', ')}. "${title}" ${venue}, ${p.year}.${arxiv}`;
}

// Stable project ID from its `order`: P-01, P-02, …
export const projectId = (order: number) => `P-${String(order).padStart(2, '0')}`;
