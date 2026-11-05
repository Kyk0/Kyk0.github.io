# kyry.me

Personal site of Kyrylo Kolesnichenko. Astro, static output, one hand-written stylesheet.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

All content lives in `src/content/`. Adding content never needs a component change.
Dates are quoted strings: `"2026"`, `"2026-09"` or `"2026-09-22"`. A partial date is
fine when the exact day isn't known.

## Site sections

| nav | page | what is there |
|---|---|---|
| 00 home | `/` | hero video, intro, Specification, featured projects, selected papers, 3 recent posts |
| 01 projects | `/projects/` | project grid; a page per project with text, media and papers |
| 02 publications | `/publications/` | every paper from every project, with citation and BibTeX copy |
| 03 blog | `/blog/` | workshops, talks, press, guides (in the menu only once a post is published) |
| 04 cv | `/cv/` | HTML CV and `/cv.pdf` |

**Everything is managed in the project file.** There is no separate publications or news
folder: papers, videos and photos all go in `src/content/projects/<slug>.mdx`.
The publications page, the CV publication list, the home page and RSS collect them
from there. A paper without a bigger project still gets a small project file
(see `mi-rol.mdx`, `vlm-bias.mdx`). Projects with no `robots`, or with `other: true`, are listed under
"Other research".

## Add or edit a project

Create `src/content/projects/<slug>.mdx`. The page appears at `/projects/<slug>/`.

```yaml
---
title: Expressive Motion
summary: One line, shown on the index and home page.
start: "2026-03"
end: "2026-09"          # or "present", or omit for a single date
robots: [Booster K1]
venue: IROS 2026 LBR    # optional
status: in progress     # optional
role: What I did, in one or two sentences.
stack: [Isaac Lab, MuJoCo]
links:
  - { label: code, url: "https://github.com/..." }
media:                  # top-of-page video/image, also the thumbnail
  src: /media/<slug>/clip.mp4
  alt: What is in the clip
  caption: Short caption.
  position: 50% 30%      # optional crop focus; smaller 2nd number shows more of the top
  link: { label: post on X, url: "https://x.com/..." }   # optional, shown after the caption
gallery:                # more videos and photos, shown under the text
  - { src: /media/<slug>/turn.mp4, alt: What is in the clip, caption: Short caption. }
  - { src: /media/<slug>/robot.jpg, alt: What is in the photo, caption: Short caption. }
papers:                 # shown on this page, on /publications/ and in the CV
  - title: Paper title
    authors: [Kyrylo Kolesnichenko, Second Author, Jong-Hoon Kim]   # my name is bolded
    year: 2027
    date: "2027-05-20"   # optional, orders papers within a year
    venue: Full venue name (ABBR 2027)
    status: accepted     # optional: accepted / to appear / ...
    arxiv: "2701.01234"  # optional; also pdf, code, video (URLs)
    selected: true       # show on the home page
    teaser: /media/<slug>/figure.jpg   # optional image for paper lists (default: the project's top media)
featured: true          # show on the home page
order: 1                # lower comes first; also gives the ID P-01
---

## Summary
Markdown body. Tables, footnotes[^1] and side notes work:

<aside>A side note. Sits in the margin on wide screens, inline on phones.</aside>

<Figure src="/media/<slug>/photo.jpg" alt="..." caption="..." />

[^1]: Footnote text.
```

- `<Figure>` needs no import inside `.mdx`.
- The top `media`, photos and videos in `gallery`, and `<Figure>` open in a full-screen
  viewer on click (arrows or swipe to move through everything on the page, Esc to close).
  Without JS the click opens the file.
- If a media file doesn't exist yet, the page shows a dashed placeholder naming the exact
  path to put it at. Drop the file there and it appears.
- BibTeX is generated from the paper fields. To use your own, add `bibtex: |` followed
  by the entry. If the author list contains `…`, no BibTeX is shown until it is complete.
- Don't add papers that are under review.
- `TODO`s and placeholders for missing media show only in `npm run dev`; the built site leaves
  them out (a field that is only a TODO, a gallery item whose file is missing, a TODO caption).
- Unfinished projects and the index of where each project's code and data live are kept
  outside this repo (it is public).

## Write a blog post

Create `src/content/posts/<slug>.md` (or `.mdx`). The page appears at `/blog/<slug>/`, and the
post is listed on `/blog/`, on the home page (3 newest), in RSS and in `llms.txt`.

```yaml
title: Reinforcement learning workshop
date: "2026-10-15"          # quoted; YYYY, YYYY-MM or YYYY-MM-DD
kind: workshop              # workshop, talk, press, award, release, guide or note
summary: One line for the lists.
url: https://medium.com/...  # optional: published elsewhere; listed here, links there, no page here
where: Advanced Telerobotics Research Lab, Kent State University
duration: 3 hours           # optional
audience: Lab members       # optional
links:                      # slides, code, video, the article
  - { label: slides, url: /media/blog/rl-workshop.pdf }
draft: true                 # only in `npm run dev`; delete the line to publish
```

`/blog/` and the menu item exist only once there is a published post. Don't put hostnames,
IPs or usernames of the lab machines in guides.

## Edit the bio and links

- `src/content/meta/bio.md`: bio paragraph, the sidebar (`role`, `portrait`,
  `affiliations`, `links`) and the big video at the top of the home page (`hero`).
  Portrait: put a photo at `public/media/me.jpg` (portrait orientation, 4:5).
- `updated:` in `bio.md` is the REV date in the sidebar. Bump it when you edit the site.

## Replace the CV

- **HTML CV** (`/cv/`): one YAML file per section in `src/content/cv/`. `order` sets the
  position. Publications (position 4) and projects (position 5) come from the project
  files automatically. Set `compact: true` for a label/value list like skills.
- **PDF** (`/cv.pdf`): built from the LaTeX in `~/CV-storage/cv` (`tectonic -X compile main.tex`)
  on a copy with two changes: the email in `sections/heading.tex` is kkolesni@kent.edu (not
  the gmail), and the paper under review is listed only as "One paper, IEEE ICRA 2027, under review." (its bullet in
  `sections/experience.tex` and its entry in `sections/publications.tex`). Do the same for any
  new PDF before copying it to `public/cv.pdf`, and check it has no phone number.

## Media

Put files under `public/media/<project-slug>/` (subfolders are fine, e.g.
`public/media/expressive-motion/iros-2026/`). Videos loop muted. Keep clips short:
H.264 MP4, ≤ 1280 px wide, a few MB, plus a `poster:` JPG. With reduced motion turned
on, videos don't autoplay and get controls instead.

## If the dev server shows stale content

After changing `src/content.config.ts`: `npx astro dev stop && rm -rf .astro && npm run dev`.

## Search and link previews

- Every page: title, description, canonical URL, Open Graph and Twitter card (`public/og.png`,
  or the project's image), `twitter:creator`, favicon and `apple-touch-icon.png`.
- Home page: schema.org `Person` + `WebSite` (JSON-LD, built from `bio.md`).
- Project pages: schema.org `CreativeWork` with its papers as `ScholarlyArticle`; a project
  with exactly one paper also gets Google Scholar `citation_*` tags.
- `public/robots.txt` allows all crawlers (AI crawlers named explicitly) and points to the sitemap.
- `/llms.txt` and `/llms-full.txt` (https://llmstxt.org): plain-text versions of the site for LLMs and
  AI search, generated from the content by `src/lib/llms.ts`. The paper under review is written
  there by hand, like `UnderReview.astro`.
- The home page has `Person`, `WebSite` and `ProfilePage` JSON-LD.

## Analytics

Cloudflare Web Analytics, no cookies. Put the site token in `SITE.cfAnalyticsToken` in
`src/lib/util.ts`; the beacon is added to the built site only (not `npm run dev`). Stats:
dash.cloudflare.com → Analytics & Logs → Web Analytics → kyry.me.

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). The domain is set by `public/CNAME` (`kyry.me`).

`_sources/` holds the CV source PDF and is not published. `_sources/*.pdf` is git-ignored
because the original CV contains a phone number.
