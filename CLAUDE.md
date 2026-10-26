# CLAUDE.md

Guidance for Claude Code when working on this repository. For step-by-step content editing
(adding projects, categories, images), see [README.md](README.md). Don't duplicate it here.

## Development rules (permanent)

1. Work on the `portfolio-redesign` branch unless the owner explicitly approves another branch.
2. Never modify `main` without explicit approval.
3. Never push, merge, or deploy without explicit approval. This includes GitHub Pages settings.
4. Don't commit automatically. Wait for the owner's approval.
5. Preserve existing functionality and content unless a change is explicitly requested.
6. Keep the site static and compatible with GitHub Pages.
7. Avoid unnecessary dependencies, backend services, databases and authentication.
8. Commit with the owner's existing Git author and committer identity. Never change git config.
9. Never include Claude, Anthropic, AI or assistant attribution in commits.
10. Never add `Co-Authored-By` trailers.
11. Keep this file and README.md updated when architectural decisions change.

Also: never invent project details (roles, results, years, screenshots). Leave fields empty
until the owner provides real information. Don't download external images or generate fake
screenshots.

## Project

Personal portfolio of Shahar Eliyahu, a software engineer (B.Sc. Software Engineering, Afeka;
AI specialization). It's a GitHub Pages user site (`shahar-eliyahu.github.io`). The goal is to grow
it from a one-page business card into a polished, interactive developer portfolio: hero,
about, featured graduation project (EasyFill), filterable project gallery, skills,
contact, and per-project case-study pages.

## Stack

- **Eleventy 3** (the only dependency). Nunjucks templates, Markdown and JSON content.
- Plain CSS with design tokens. Vanilla JS. No framework, no build step for CSS or JS.
- Output: static `_site/` (git-ignored).

```bash
npm install
npm start          # dev server + live reload, http://localhost:8080
npm run build      # clean production build into _site/
```

## Structure

```
eleventy.config.js        collections, filters, passthrough, dirs (input: src, output: _site)
lib/projects.js           project collections, lookups, build-time content validation
src/index.njk             homepage = section partials in order
src/_data/                site.json, home.json (homepage text), skills.json, projectCategories.json
src/projects/*.md         one file per project (front matter = data, body = description)
src/projects/projects.11tydata.js   defaults for all projects; slug = file name; permalink: false
src/_includes/layouts/base.njk      page shell
src/_includes/partials/   nav, footer, components.njk (macros), sections/, project/, visuals/
src/assets/css/           tokens.css → base.css → sections.css → visuals.css (load order matters)
src/assets/js/main.js     nav, scroll progress, reveal, active link, hero counter, pointer effects
src/assets/img/projects/<slug>/     project images (create when real images exist)
src/Shahar_Eliyahu_CV.pdf           must stay published at /Shahar_Eliyahu_CV.pdf
```

## Architecture decisions

- **Content is separate from presentation.** Templates never name a specific project or
  category. Everything is derived from `src/projects/*.md` and `src/_data/*.json`.
- **Slug = file name** (`easyfill.md` → `easyfill`). It's unique by construction, and drives the image
  folder and the future URL `/projects/<slug>/`.
- **Validation fails the build** (`lib/projects.js`): required fields, slug format, unknown
  category ids, malformed category config, missing image files and missing alt text. Warnings cover duplicate
  `order` values, a missing illustration partial, and `caseStudy.enabled` before case-study pages exist.
- **Name collision gotcha:** global data files merge into every page's data (arrays concatenate).
  Never give a `_data` file the same name as a project front matter field (that's why it's
  `projectCategories.json`, not `categories.json`).
- **Git-CMS ready:** all content is flat Markdown/JSON, so a git-based CMS (such as Decap) could
  be added later without a rewrite. No admin panel exists or is planned for now.
- **Absolute asset URLs** (`/assets/...`) are fine because this is a root-domain user site.

## Projects

Front matter fields: `title`, `summary`, `order` (required), plus `year`, `type`, `role`, `team`,
`categories[]`, `technologies[]`, `featured`, `featuredOrder`, `cover{src,alt}`,
`gallery[{src,alt,caption}]`, `links{github,demo,video}`, `visual{id,label,kicker,headline}`,
`caseStudy{enabled,problem,solution,architecture,challenges,results,lessons}`. The Markdown body
is the detailed description. Full reference with an example: README → Managing projects.

- Homepage numbering ("PROJECT 01") and left/right alternation are derived from sort order.
- Media fallback (`partials/project/media.njk`): `cover` image → animated illustration
  (`partials/visuals/<visual.id>.njk` + `.<id>-visual` CSS) → plain title. The 7 custom
  illustrations are a signature of the site and must be preserved.
- Each homepage row has `data-project` and `data-categories` attributes for the future JS filter.

## Categories

- Defined only in `src/_data/projectCategories.json`: ordered list of `{ id, label }`.
  Current categories: `ai-ml` (AI & Machine Learning) and `applications` (Applications).
- Projects reference ids in `categories: [...]`. Multiple ids are allowed.
- `collections.projectCategories` = each category plus `projects` and `count`. Empty categories
  stay in the list with `count: 0`. UIs should hide or disable them.
- "All Projects" is a virtual filter (`collections.projects`), never a category.
- The future filter UI must be generated from `collections.projectCategories` and filter on
  `data-categories`. No category names in templates or JS.

## Featured projects

- `featured: true` plus optional `featuredOrder`. `collections.featuredProjects` is sorted by
  `featuredOrder`, then `order`. The first entry is the primary featured project (EasyFill).
- Featured projects stay in `collections.projects`.
- "Graduation project" is metadata (`type: Final degree project`), not a category.

## Template helpers

| Helper | Returns |
|---|---|
| `collections.projects` | all projects, sorted by `order` |
| `collections.featuredProjects` | featured projects |
| `collections.projectCategories` | categories with `projects`, `count` |
| `collections.projectTechnologies` | `{ normalizedName: { name, projects } }` |
| `projects \| projectsUsing("Python")` | projects whose `technologies` include it (case-insensitive) |
| `ids \| categoryDetails` | category objects for a list of ids |
| `src \| projectAsset(slug)` | public image URL |
| `n \| pad` | `1` → `"01"` |

Skills ↔ projects: link skills to projects with `projectsUsing`. Never maintain a manual mapping.

## Theme tokens (`src/assets/css/tokens.css`)

1. `--palette-*`: raw colors.
2. Semantic roles used by components: `--color-bg`, `--color-surface`, `--color-text(-muted)`,
   `--color-primary(-hover/-bright/-soft)`, `--color-accent`, `--color-border(-strong/-control)`,
   `--color-inverse-*` (dark contact/footer areas), and others.
3. `--viz-*`: scene colors for the project illustrations.
4. Fonts (`--font-body/-display/-mono`), shadows (`--shadow-*`), `--max-width`, `--nav-height`, `--ease-out`.

Components must only use semantic tokens, never hex or rgba literals. Transparency:
`color-mix(in srgb, var(--token) N%, transparent)`. A new theme remaps layer 2.

## Validation workflow

- `npm run build` must succeed with no errors or warnings.
- For refactors that shouldn't change the look, compare against the previous build in headless
  Chrome (Playwright, installed outside the repo): DOM, computed styles, screenshots, behavior.
  Screenshot diffs of a few hundred pixels around the EasyFill and data animations are
  timing noise.
- Check the CV URL returns a PDF, all anchors and links resolve, and there are no console errors
  (the favicon 404 is a known gap).

## Status

- **Phase 1 (done, commit `a66e52e`):** migrated to Eleventy with no visual change. Design tokens,
  layouts, partials, data files.
- **Phase 2 (implemented, awaiting owner approval / commit):** project content model,
  categories, featured projects, media fallback, validation, docs.
- `main` still serves the old hand-written site. This branch has no root `index.html`, so
  **merging before the Actions deploy exists would break the live site.**

## Roadmap

3. **Dark design system:** dark navy/charcoal backgrounds, blue (#5B8CFF) and purple (#9B6BFF)
   accents, subtle gradients and glow. Remap tokens and restyle components and illustrations.
4. **New sections:** "Featured Graduation Project" section for EasyFill above the gallery,
   a filterable project card grid (virtual "All" filter plus generated category filters), expanded
   About (education, hackathon, experience timeline), skills linked to projects, contact upgrades.
5. **Case-study pages** at `/projects/<slug>/`: enable the conditional permalink in
   `projects.11tydata.js` plus a `project` layout. Publish only projects with real content.
6. **Polish:** accessibility (keyboard, focus, contrast), performance, Open Graph tags, favicon, 404, sitemap.
7. **Launch (with approval only):** GitHub Actions deploy workflow, switch the Pages source to
   Actions, then merge.

## Design requirements

- Professional, modern "dark tech + creative developer" look: polished but not cluttered.
- Keep the hero object-detection box motif and the 7 animated project illustrations.
- Fonts: Space Grotesk (display), Inter (body), IBM Plex Mono (labels).
- Fully responsive (current breakpoints: 850px, 650px), no horizontal scroll.
- Respect `prefers-reduced-motion`. Pointer effects only on hover-capable devices. Content must
  stay visible without JS (`.js` class gates reveal animations).
- Real screenshots only, with descriptive alt text. Keep images small (webp, under 500 KB).

## Open questions for the owner

- Should projects list programming languages (for example Python) in `technologies` so skills link to them?
- Role, team size, type and missing years for projects. EasyFill case-study content and screenshots.
