import { getCollection, getEntry } from 'astro:content';
import { SITE, getPapers, getPosts, postHref, citation, isTodo, range, sortProjects } from './util';

// Plain-text versions of the site for LLMs and AI search (https://llmstxt.org):
// /llms.txt is the index, /llms-full.txt adds every project page.
const site = 'https://kyry.me';
const abs = (u: string) => (u.startsWith('/') ? site + u : u);
// Relative markdown links -> absolute, so the text works outside the site.
const absLinks = (md: string) => md.replace(/\]\((\/[^)]*)\)/g, (_, u) => `](${site}${u})`);
// MDX components -> text; drop lines that are still TODO.
const plain = (md: string) =>
  absLinks(md)
    .replace(/<Figure[^>]*caption="([^"]*)"[^>]*\/>/g, '[Figure: $1]')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<\/?aside>/g, '')
    .split('\n')
    .filter((l) => !/TODO/.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export async function llmsText(full: boolean): Promise<string> {
  const bio = (await getEntry('meta', 'bio'))!;
  const projects = sortProjects(await getCollection('projects', (p) => !p.data.soon));
  const papers = await getPapers();
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  const out: string[] = [];

  out.push(`# ${SITE.name}`, '', `> ${SITE.description}`, '', plain(bio.body ?? ''), '');
  out.push(`Role: ${bio.data.role}.`);
  out.push(`Affiliations: ${bio.data.affiliations?.map((a) => a.label).join('; ')}.`);
  out.push('');

  out.push('## Pages', '');
  out.push(`- [Home](${site}/): overview, featured projects, selected publications`);
  out.push(`- [Projects](${site}/projects/): all research projects`);
  out.push(`- [Publications](${site}/publications/): papers with BibTeX`);
  if (posts.length) out.push(`- [Blog](${site}/blog/): workshops, talks, press, technical notes`);
  out.push(`- [CV](${site}/cv/): education, research, industry, skills ([PDF](${site}/cv.pdf))`);
  out.push('');

  out.push('## Projects', '');
  for (const p of projects) {
    const d = p.data;
    const facts = [d.robots.join(', '), d.venue, isTodo(d.status) ? undefined : d.status].filter(Boolean).join('; ');
    const links = d.links.map((l) => `[${l.label}](${abs(l.url)})`).join(', ');
    out.push(`- [${d.title}](${site}/projects/${p.id}/): ${d.summary}${facts ? ` (${facts})` : ''}${links ? ` Links: ${links}.` : ''}`);
  }
  out.push('');

  out.push('## Publications', '');
  for (const { paper, project } of papers) {
    const url = paper.arxiv ? `https://arxiv.org/abs/${paper.arxiv}` : `${site}/projects/${project.id}/`;
    out.push(`- ${citation(paper)}${paper.status ? ` Status: ${paper.status}.` : ''} [${url}](${url})`);
  }
  out.push('- Walking in Heels: Heel-Aware Humanoid Gait Under Changing Contact Geometry. IEEE International Conference on Robotics and Automation (ICRA 2027), under review.');
  out.push('');

  if (posts.length) {
    out.push('## Blog', '');
    for (const p of posts) out.push(`- [${p.data.title}](${abs(postHref(p))}) (${p.data.kind}${isTodo(p.data.date) ? '' : `, ${p.data.date}`}): ${p.data.summary}`);
    out.push('');
  }

  out.push('## Contact', '');
  for (const l of bio.data.links ?? []) if (l.url) out.push(l.url.startsWith('mailto:') ? `- Email: ${l.url.slice(7)}` : `- ${l.label}: ${abs(l.url)}`);
  out.push('');

  if (full) {
    for (const p of projects) {
      const d = p.data;
      out.push('---', '', `# ${d.title}`, '', `URL: ${site}/projects/${p.id}/`);
      const dates = isTodo(d.start) ? '' : range(d.start, d.end);
      const meta: [string, string | undefined][] = [
        ['Dates', dates],
        ['Robots', d.robots.join(', ')],
        ['Venue', d.venue],
        ['Status', d.status],
        ['Role', d.role],
        ['Stack', d.stack.join(', ')],
      ];
      for (const [k, v] of meta) if (v && !isTodo(v)) out.push(`${k}: ${v}`);
      out.push('', d.summary, '', plain(p.body ?? ''), '');
    }
  }
  if (full) {
    for (const p of posts.filter((p) => !p.data.url)) {
      const d = p.data;
      out.push('---', '', `# ${d.title}`, '', `URL: ${site}/blog/${p.id}/`);
      const meta: [string, string | undefined][] = [
        ['Kind', d.kind],
        ['Date', d.date],
        ['Where', d.where],
        ['Length', d.duration],
        ['Audience', d.audience],
      ];
      for (const [k, v] of meta) if (v && !isTodo(v)) out.push(`${k}: ${v}`);
      for (const l of d.links) out.push(`${l.label}: ${abs(l.url)}`);
      out.push('', d.summary, '', plain(p.body ?? ''), '');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
