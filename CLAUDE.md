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
12. **Responsive design is required in every phase** (see below).

Also: never invent project details (roles, results, years, screenshots). Leave fields empty
until the owner provides real information. Don't download external images or generate fake
screenshots.

### Responsive design (required for every phase)

Every new feature, component, section or visual change is designed and built for desktop,
tablet and mobile **in the same task**. Mobile work isn't postponed. A final mobile polish
pass will still happen once the whole site is complete.

- Use a mobile-first approach where practical.
- Test at **1920, 1440, 1024, 768, 390 and 320px**.
- Keep text readable, tap targets comfortable (about 44px or more) and spacing right for each size.
- No horizontal overflow, overlapping elements, broken layouts or needless empty space.
- Interactive elements must work with touch as well as mouse and keyboard. Don't rely on hover alone.
- Animations must stay smooth on mobile and respect `prefers-reduced-motion`.
- Don't just shrink the desktop layout. Restructure it when needed (stacking, reordering,
  hiding duplicate content, changing grids).
- When a mobile-specific decision is needed, pick a sensible option consistent with the
  design system and note it in the report.
- **Every phase's validation summary must include the responsive checks** (the widths
  tested and the results).

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

1. `--palette-*`: raw colors (navy scale, cool grays, blue, violet).
2. Semantic colors used by components: `--color-bg(-alt)`, `--color-surface(-raised)`,
   `--color-text(-muted/-subtle)`, `--color-primary(-hover/-bright/-deep/-soft)`, `--color-link`,
   `--color-accent(-strong)`, `--color-on-*`, `--color-border(-strong/-control)`, `--color-focus`,
   `--color-inverse-*` (deepest areas: contact, footer), and gradients `--gradient-brand`,
   `--gradient-accent-line`, `--gradient-ambient`.
3. `--viz-*`: scene colors for the project illustrations.
4. Typography (`--font-*`, `--text-*`, `--leading-*`, `--tracking-*`), spacing (`--space-1…9`),
   radii (`--radius-sm/md/lg/pill`), shadows (`--shadow-*`), layout and motion (`--max-width`,
   `--nav-height`, `--ease-out`, `--duration-*`).

Components must only use semantic tokens, never hex or rgba literals. Transparency:
`color-mix(in srgb, var(--token) N%, transparent)`. A new theme remaps layer 2 (and `--viz-*`).
Older rules still use literal sizes and spacing. Move them to the tokens when a component is
redesigned (Phase 3B), not as a separate churn pass.

## Dark theme decisions (Phase 3A)

- Palette: background `#0b1020`, surfaces `#141d35` / `#1a2442`, text `#e8eeff`,
  muted `#9aa6c4`. Blue `#3b82f6` (links use the lighter `#60a5fa` for contrast), violet
  `#a78bfa` / `#8b5cf6`. `color-scheme: dark` is set, plus `<meta name="theme-color">`.
- Accent roles: **blue = actions and links**, **violet = markers** (section and project numbers,
  hero label, editor caret, illustration detection boxes). The brand gradient (blue-600 → violet-600) appears only on
  the primary button, the logo mark, the scroll bar and nav underline.
- Depth comes from layered navy surfaces, 1px borders, soft black shadows and two faint fixed
  ambient radial gradients on `body`. No particles, no animated backgrounds, glow only on hover.
- Radii: cards 16px, buttons 10px, tags 6px, hero label pill. Detection boxes in the vision
  illustration stay square on purpose (bounding-box motif).
- All 7 illustrations were recolored through `--viz-*` tokens (dark cards). Their shapes and
  animations are unchanged.
- Contrast: every text element is at least 6.7:1 (WCAG AA); the focus ring is `#93c5fd`, 2px.
- Fixed a long-standing bug: `.hero-label` was `inline-flex` and sat beside the name on wide
  screens. It's now block-level (`flex` + `fit-content`).

## Hero and buttons (Phase 3B)

- Hero is a two-column grid at 1200px and up (`.hero-layout`, 0.95fr / 1.05fr): name, intro and
  actions on the left, the profile editor on the right. Below 1200px it stacks (editor below the
  intro, max 640px wide), including on mobile.
- **The detection box around the name was removed** (owner decision), along with its label,
  the 0.97 counter, the `box-draw` / `label-in` keyframes and the JS counter. The name is plain
  `--text-h1` (up to 9.75rem). Intro: `--text-lead`, `--color-text-secondary`, max 36ch.
  The vision project illustration keeps its own detection boxes.
- Button hierarchy (`button()` macro in `components.njk`):
  `primary` (brand gradient, one per view) → `secondary` (solid raised surface) →
  `ghost` (text and icon, for profile links). Contact still uses `light` / `dark-outline`.
  The macro takes `icon` / `trailingIcon` (from `partials/icons.njk`, inline SVG, no
  library) and adds hidden "(opens in a new tab)" text to external links.
- GitHub and LinkedIn sit in `.hero-links`, so they wrap together. On mobile, the main actions
  are full width and the profile links share one row.
- Section numbers align to the kicker baseline. The contact block uses the full container width.

## Hero profile editor

- **Data:** `home.json → hero.profile` holds `facts` (the only copy of the profile facts: string
  or list-of-strings values, camelCase keys), `languages` (`java`, `python`, `cpp`) and
  `defaultLanguage` (**`java`**). Only verified facts go here. Never add invented stats or skills.
- **Code generation:** `lib/profile-code.js` (the `profileEditor` filter) derives Java
  (`ShaharEliyahu.java`, class plus `List.of`), Python (`profile.py`, frozen dataclass plus tuple) and
  C++ (`profile.cpp`, struct plus `std::vector`) at build time, as highlighted HTML
  (`.code-line` > `.tok-keyword|type|name|field|string|punct|meta`, indentation in `.tok-ws`,
  `--ws` = indent width). A new fact appears in all three languages automatically. The generated
  code compiles (checked with javac, Python and MSVC).
- **Markup** (`hero.njk`): WAI-ARIA tabs (`role="tablist"` / `tab` / `tabpanel`, roving
  tabindex). All language `<pre>`s share one grid cell, so the height is that of the longest snippet
  and never jumps. Inactive panels are `visibility: hidden`. Tabs only show with JS; without JS
  the full Java code is shown with its filename.
- **Behaviour** (`assets/js/editor.js`, vanilla): click or arrow / Home / End switches language,
  updates `aria-selected`, the filename and the panel, and restarts typing. Re-selecting the
  current tab does nothing. There's no auto-cycling.
- **Typing:** plays in an `aria-hidden` overlay (`.editor-typing`) over the real code. The real
  code stays in the accessibility tree (opacity 0 while typing), and there's no `aria-live`, so nothing
  is announced per character. Per-character steps with slight jitter; indentation appears at once;
  short pause per line. Duration scales with length, clamped to 2–3.4s (about 2.7s per snippet). A
  `runId` plus `cancelAnimationFrame` cancels any previous run, so rapid switching never mixes languages.
  Initial typing starts when the editor scrolls into view (IntersectionObserver). The caret is solid
  while typing and blinks at the end.
- **Reduced motion:** code appears complete immediately and the caret doesn't blink.
- **Wrapping:** `pre-wrap` with a hanging indent, so narrow screens wrap lines under the code
  instead of scrolling. The line-number gutter is 3rem (2.25rem on mobile).
- Syntax colours are tokens (`--color-code-*`). Strings use a mint (`--palette-mint-300`) that
  appears nowhere else. All tokens meet AA on the panel (lowest: punctuation 4.9:1).

## Visual hierarchy principles (all phases)

- Important headings must stand out clearly: size, weight and space before color.
- Descriptive text needs strong contrast (`--color-text-secondary` for leads, `-muted` for
  body) and a comfortable line length (about 36–70ch).
- Interactive elements must look interactive. Important actions are buttons, not small text
  links. Use one primary action per area.
- Technology tags must stand apart from their background (border plus surface contrast).
- Create hierarchy with whitespace and typography. Avoid giving everything the same weight.
- Never rely on glow to make content noticeable. Glow is only a hover accent.

## Requirements for the project gallery redesign (next layout phase)

- EasyFill gets a prominent "Featured Graduation Project" presentation above the gallery
  (driven by `collections.featuredProjects`, with `type` as metadata).
- Project titles and descriptions must be more readable than in the current rows.
- GitHub, Demo and Project Details actions are clearly visible buttons, shown only when the
  data exists. Details appear only once case-study pages exist.
- Technology tags must be clearly distinguishable.
- Media and content must feel balanced. Keep the animated illustrations as the media fallback,
  and fix the vision illustration's headline overlapping its detection boxes.
- All cards should look polished and consistent.
- Category filters are generated from `collections.projectCategories`, with a virtual "All"
  filter, filtering on `data-categories`, and empty categories hidden.
- Never invent screenshots, demo links or project information.

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
- **Phase 2 (done, commit `8c9ec85`):** project content model, categories, featured
  projects, media fallback, validation, docs.
- **Phase 3A (done, commit `db1ba51`):** dark visual foundation. Tokens, typography, surfaces,
  recolored illustrations.
- **Phase 3B (done):** hero redesign (two columns, bigger name,
  detection box removed), interactive Java/Python/C++ profile editor with typing animation,
  button hierarchy with icons, section-number and contact alignment fixes.
- `main` still serves the old hand-written site. This branch has no root `index.html`, so
  **merging before the Actions deploy exists would break the live site.**

## Roadmap

3. **Dark design system.** 3A (tokens, surfaces) and 3B (hero, editor, hierarchy) are done.
   The palette will be re-evaluated after the layout redesign.
4. **New sections.** First, a deferred refinement: the hero name looks slightly too large
   and heavy. Refine its font size, weight and spacing while keeping the current layout. Then: "Featured Graduation Project" section for EasyFill above the gallery,
   a filterable project card grid (virtual "All" filter plus generated category filters), expanded
   About (education, hackathon, experience timeline), skills linked to projects, contact upgrades.
5. **Case-study pages** at `/projects/<slug>/`: enable the conditional permalink in
   `projects.11tydata.js` plus a `project` layout. Publish only projects with real content.
6. **Polish:** accessibility (keyboard, focus, contrast), performance, Open Graph tags, favicon, 404, sitemap.
7. **Launch (with approval only):** GitHub Actions deploy workflow, switch the Pages source to
   Actions, then merge.

## Design requirements

- Professional, modern "dark tech + creative developer" look: polished but not cluttered.
- Keep the 7 animated project illustrations. The hero has no detection box (removed in 3B);
  its signature element is the interactive profile editor.
- Fonts: Space Grotesk (display), Inter (body), IBM Plex Mono (labels).
- Fully responsive (breakpoints: 1199px for the hero, 850px, 650px), no horizontal scroll
  down to 320px.
- Respect `prefers-reduced-motion`. Pointer effects only on hover-capable devices. Content must
  stay visible without JS (`.js` class gates reveal animations).
- Real screenshots only, with descriptive alt text. Keep images small (webp, under 500 KB).

## Open questions for the owner

- Should projects list programming languages (for example Python) in `technologies` so skills link to them?
- Role, team size, type and missing years for projects. EasyFill case-study content and screenshots.
