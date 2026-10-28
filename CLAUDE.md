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
8. Commit as **`shahar-eliyahu <shahar25806@gmail.com>`** (author and committer). This is set in
   the repository-local `.git/config`; never change the global Git config (it still holds the
   old college address, which must not be used). Never amend or rewrite earlier commits
   (`a66e52e`…`2d7d2e9` carry the old address and stay as they are). Check
   `git config --show-origin user.email` before committing.
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
about, interactive Project Explorer (EasyFill marked as the graduation project), skills,
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
src/projects/projects.11tydata.js   defaults for all projects; slug = file name; layout; permalink
                                    /projects/<slug>/ only with `detailPage: true` (else false)
src/_includes/layouts/base.njk      page shell
src/_includes/layouts/project.njk   project detail page (one template for all projects)
src/_includes/partials/   nav, footer, components.njk (macros), sections/, project/, visuals/
src/assets/css/           tokens.css → base.css → sections.css → visuals.css (load order matters)
src/assets/js/main.js     nav, scroll progress, reveal, active link, pointer effects
src/assets/js/editor.js   hero profile editor (tabs, typing)
src/assets/js/gallery.js  shared media: gallery, lightbox, video (explorer and detail pages)
src/assets/js/projects.js Project Explorer (filters, picker tabs); uses ProjectGallery
src/assets/img/projects/<slug>/     project images (create when real images exist)
src/Shahar_Eliyahu_CV.pdf           must stay published at /Shahar_Eliyahu_CV.pdf
```

## Architecture decisions

- **Content is separate from presentation.** Templates never name a specific project or
  category. Everything is derived from `src/projects/*.md` and `src/_data/*.json`.
- **Slug = file name** (`easyfill.md` → `easyfill`). It's unique by construction, and drives the image
  folder and the future URL `/projects/<slug>/`.
- **Validation fails the build** (`lib/projects.js`): required fields, slug format, unknown
  category ids, malformed category config, missing image files and missing alt text, wrongly
  shaped `caseStudy` sections and the retired `caseStudy.enabled`. Warnings cover duplicate
  `order` values and a missing illustration partial.
- **Name collision gotcha:** global data files merge into every page's data (arrays concatenate).
  Never give a `_data` file the same name as a project front matter field (that's why it's
  `projectCategories.json`, not `categories.json`).
- **Git-CMS ready:** all content is flat Markdown/JSON, so a git-based CMS (such as Decap) could
  be added later without a rewrite. No admin panel exists or is planned for now.
- **Absolute asset URLs** (`/assets/...`) are fine because this is a root-domain user site.

## Projects

Front matter fields: `title`, `summary`, `order` (required), plus `year`, `type`, `role`, `team`,
`excerpt`, `categories[]`, `technologies[]`, `featured`, `featuredOrder`, `cover{src,alt,fit,position}`,
`gallery[{src,alt,caption,fit,position}]`, `videoPoster`,
`links{github,demo,video}`, `visual{id,label,kicker,headline}`,
`detailPage`, `caseStudy{features[],architecture,challenges[{challenge,solution}],results,lessons}`.
The Markdown body is the detail page's Overview. Step-by-step guide and a complete example:
README → "Adding a New Project"; full field reference: README → "Managing projects".

### Adding or changing projects (rules for AI-assisted work)

Follow README → "Adding a New Project". Don't re-derive the process; these rules govern it:

1. **One Markdown file per project** in `src/projects/<slug>.md`, read by the existing collection
   (`allProjects`) and rendered by the shared `layouts/project.njk`. Never write per-project HTML,
   copy a template, or add a project-specific layout or partial for its page.
2. **Follow the schema above exactly.** Use only existing fields and category ids from
   `src/_data/projectCategories.json`. A new field or category is a schema change (see rule 9).
3. **Reuse the shared media components:** `partials/project/gallery.njk`, `lightbox.njk` and
   `assets/js/gallery.js` (`ProjectGallery`). Images go in `src/assets/img/projects/<slug>/`;
   videos use `links.video` (YouTube / Vimeo / local `.mp4`/`.webm`). No new gallery or player code.
4. **Preserve the Project Explorer:** filters and counts, relative numbering, and the direct
   **GitHub** button on every project. "Explore Project" comes only from `detailPage: true`;
   never hard-code it or link to a page that isn't built.
5. **`detailPage: true` only when the owner asks for it or has approved the page's content.**
   Otherwise leave it out; the project is still complete in the explorer.
6. **Never invent** details, features, architecture, metrics, results, team size, roles,
   screenshots, videos or links. Use only what the owner provides or what already exists in the
   repository (CV, existing text). Leave a field out rather than filling it with a placeholder.
7. **Keep responsive design and accessibility intact:** `alt` text for every image (required by
   the build), `fit: contain` for portrait screenshots, no layout changes for a single project.
8. **Test:** `npm run build` (validates every project file and must pass with no new warnings),
   then check the explorer entry (filters, numbering, buttons) and the detail page if enabled, at
   a desktop width (1440px) and a phone width (390px), plus 320px when layout is affected.
9. **Schema changes update the docs in the same change:** validation in `lib/projects.js`, the
   README guide, field reference and complete example, and the field list above.

- Media (`partials/project/gallery.njk`, items from `projectMedia`): real images (`cover`,
  `gallery`) and an embeddable video; with no real images, the animated illustration
  (`partials/visuals/<visual.id>.njk` + `.<id>-visual` CSS, `aria-hidden`, never presented as
  a screenshot) or a patterned fallback with the title. The 7 custom illustrations are a
  signature of the site and must be preserved.
- Picker items and panels carry `data-project` and `data-categories`, which the filters use
  (see Project Explorer).

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
- Featured projects stay in `collections.projects`. Since the 4A revision the homepage renders
  every project the same way; the featured flag is kept for future use.
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
| `projects \| categoryCounts` | non-empty categories with counts for that list (filter chips) |
| `src \| projectAsset(slug)` | public image URL |
| `n \| pad` | `1` → `"01"` |
| `project \| projectMedia` | ordered gallery items: `image` / `video` / `illustration` |
| `project \| projectVideo` | `links.video` classified: youtube / vimeo / file / external (+ embed URL) |
| `projects \| findProject(page.url)` | the collection entry for a detail page |
| `projects \| projectNeighbors(page.url)` | `{ prev, next }` among projects that have a page |
| `text \| markdown` / `markdownInline` | Markdown from front matter (Eleventy's own markdown-it) |

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

- Palette (**lightened in the 4A refinement**: slate-blue instead of near-black, owner
  request): background `#172238`, alternate sections `#1b2842`, cards `#23314c`, raised
  `#2b3b59`, borders `#34445f` / `#44567a`, contact and footer `#131c30`. Text `#f1f5f9`, card titles
  `#f8fafc`, body `#dbe2ec`, secondary `#c6d0de`, muted `#a9b5ca`, code punctuation `#9aa7c0`.
  Blue `#3b82f6` (links `#60a5fa`), violet `#a78bfa` / `#8b5cf6`. All set in the palette layer of
  `tokens.css` (the scale names were kept, so semantic tokens follow). `color-scheme: dark`, plus
  `<meta name="theme-color" content="#172238">`.
- Accent roles: **blue = actions and links**, **violet = markers** (section and project numbers,
  hero label, editor caret, illustration detection boxes). The brand gradient (blue-600 → violet-600) appears only on
  the primary button, the logo mark, the scroll bar and nav underline.
- Depth comes from layered navy surfaces, 1px borders, soft black shadows and two faint fixed
  ambient radial gradients on `body`. No particles, no animated backgrounds, glow only on hover.
- Radii: cards 16px, buttons 10px, tags 6px, hero label pill. Detection boxes in the vision
  illustration stay square on purpose (bounding-box motif).
- All 7 illustrations were recolored through `--viz-*` tokens (dark cards). Their shapes and
  animations are unchanged.
- Contrast after the palette change: every text element meets WCAG AA (lowest 5.4:1, section
  numbers); editor tokens at least 4.98:1; the focus ring is `#93c5fd`, 2px.
- Section separation comes from tone (bg / bg-alt / contact) plus a 1px line, not heavy borders.
  Vertical rhythm: sections 104px (72px on phones), title gap 56px (40px), contact 80px top / 48px bottom (48px on phones).
- Fixed a long-standing bug: `.hero-label` was `inline-flex` and sat beside the name on wide
  screens. It's now block-level (`flex` + `fit-content`).

## Hero and buttons (Phase 3B)

- Hero is a two-column grid at 1200px and up (`.hero-layout`, 0.95fr / 1.05fr): name, intro and
  actions on the left, the profile editor on the right. Below 1200px it stacks (editor below the
  intro, max 640px wide), including on mobile.
- **The detection box around the name was removed** (owner decision), along with its label,
  the 0.97 counter, the `box-draw` / `label-in` keyframes and the JS counter. The name is plain
  `--text-h1`: `clamp(3rem, 8.2vw, 8rem)`, weight 600, letter-spacing −0.035em (refined in 4A,
  about 18% smaller than in 3B). Intro: `--text-lead`, `--color-text-secondary`, max 36ch.
  The vision project illustration keeps its own detection boxes.
- Button hierarchy (`button()` macro in `components.njk`):
  `primary` (brand gradient, one per view) → `secondary` (solid raised surface) →
  `ghost` (text and icon, for profile links). Contact still uses `light` / `dark-outline`.
  The macro takes `icon` / `trailingIcon` (from `partials/icons.njk`, inline SVG, no
  library) and adds hidden "(opens in a new tab)" text to external links.
- GitHub and LinkedIn sit in `.hero-links`, so they wrap together. On mobile, the main actions
  are full width and the profile links share one row.
- Section numbers align to the kicker baseline.

## Navigation

- `.nav-inner` is a 3-column grid (`1fr auto 1fr`): logo left, links **centred** on desktop,
  menu button right. Links have 12×14px padding (44px tap rows), with the gradient underline under
  the text. The header turns into a translucent card surface once scrolled.
- Phones (650px and below): the grid is `1fr auto` (logo | menu button); the drawer lists full-width
  link rows aligned with the logo.
- Active link: an IntersectionObserver band (35–45% of the viewport) picks the section, plus
  `isAtBottom()`: at the bottom of the page the last section (Contact) is always active, because on
  tall screens a short Contact never reaches the band.

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
  appears nowhere else. All tokens meet AA on the (lighter) panel: lowest is keyword 4.98:1,
  punctuation and line numbers 5.6:1.

## About, Skills, Contact (homepage sections)

Design-only redesign (owner request): compact, text-led, no new interactions or widgets. Copy is
unchanged except the Skills heading ("Tech Stack" → "Skills", matching the nav).

- **Shared grid:** `--split-columns` (`tokens.css`: `minmax(220px, 0.42fr) minmax(0, 1fr)`) is used
  at 1024px+ by About (heading | text) and the Skills rows (name | tags), so the About accent line
  and the skill tags start on the same vertical.
- **About:** text only. The Focus / Interests / Approach list was removed (template, CSS and
  `home.json → about.facts`). `.about-text`: max 68ch, a 2px blue→violet accent line on the left,
  the first paragraph as a slightly larger lead (`--text-lead`). Below 1024px the heading sits
  above the text.
- **Skills:** `.skills-list` of `.skill-row`s (an `h3` name plus a `ul.tech-list` labelled by it),
  separated by 1px lines. Tags reuse the explorer's `.tech-badge` (consistent with projects); hover
  only brightens the border and text. Phones: name above tags; 651px+: 200px name column. The old
  cards and their cursor spotlight (`main.js`) were removed.
- **Contact:** a compact band on the inverse surface (grid texture + glow kept). Heading
  `clamp(2rem, …, 3.25rem)`. Phones and tablet: text, then actions; 1024px+: text left, a 500px
  action column right. Actions are a grid: **Email Me** (`light`, primary) full width on top;
  Download CV, GitHub, LinkedIn (`dark-outline`) share one row from 651px (on phones CV is full
  width and GitHub / LinkedIn share a row). The glow is a radial gradient (no `blur()`), masked to
  fade out before the band ends, so no clipped edge shows against the footer.
- **Footer:** content unchanged, 72px tall. On the homepage (`body:has(.contact)`) its full-bleed
  border becomes a container-width divider, so contact and footer read as one closing block;
  other pages keep the full-width border.

## Visual hierarchy principles (all phases)

- Important headings must stand out clearly: size, weight and space before color.
- Descriptive text needs strong contrast (`--color-text-secondary` for leads, `-muted` for
  body) and a comfortable line length (about 36–70ch).
- Interactive elements must look interactive. Important actions are buttons, not small text
  links. Use one primary action per area.
- Technology tags must stand apart from their background (border plus surface contrast).
- Create hierarchy with whitespace and typography. Avoid giving everything the same weight.
- Never rely on glow to make content noticeable. Glow is only a hover accent.

## Project Explorer (Phase 4A)

Owner decision: replaced the card grid (too bulky and repetitive) with an interactive explorer.
Markup: `partials/sections/projects.njk` (filters, picker, panels, lightbox `<dialog>`) →
`project/panel.njk` (one preview) → `project/gallery.njk` (media). Behaviour:
`assets/js/projects.js` (vanilla). CSS: the "PROJECTS: PROJECT EXPLORER" block in `sections.css`,
**written mobile first** (base = phone; `min-width: 651px` tablet; `min-width: 1024px` desktop).

- **Layout:** filters on top. **Desktop (1024px+):** a vertical picker (290px, sticky) of numbered
  project names plus category, with the selected one marked by a gradient bar; the preview panel on
  the right. **Numbers are relative to the visible (filtered) list**: All 01–07, Applications
  01–02, AI & ML 01–05. `projects.js` renumbers on every filter change; the order and data never
  change, and the number is `aria-hidden` so tab names stay clean. **Below 1024px:** the picker is a swipeable strip of full-name pills (edge-faded,
  scroll-snap), auto-scrolled to the selection, with the preview below at full width. Filters are a
  swipeable row on phones and wrap from 651px.
- **Panel:** gallery → info, in **one compact column** (owner request, refinement 2): meta
  (category · year · `type` badge) → **title** → `excerpt` → **Technologies** (a readable 0.875rem/600
  heading plus *all* badges at 0.875rem, wrapping naturally; no "+N") → actions. On phones the main
  action is full width.
- **Semantics:** without JS the picker items are `#project-<slug>` anchor links and all panels are
  stacked. JS upgrades them to ARIA tabs (`tablist` with orientation vertical / horizontal by
  breakpoint, roving tabindex, arrows / Home / End over *visible* projects) and `tabpanel`s
  (`.is-selected` plus `hidden`). CSS hides unselected panels under `.js` to avoid a flash.
- **Filters:** generated from `categoryCounts` plus a virtual "All Projects". They hide picker items;
  if the selected project is filtered out, the first visible one is selected (always valid).
  A polite live region announces "Showing N projects in X. Selected: Y". URL:
  `?category=<id>&project=<slug>` (`replaceState`, category always first); invalid values fall
  back to All / the first visible project.
- **Actions: both are intended and kept.** **"Explore Project"** opens the project's internal
  detail page (full description, screenshots, videos, technical write-up) and becomes the
  **primary** action as soon as the page exists (`project.url`, Phase 4B). **GitHub** always stays
  directly available in the explorer as a separate button (secondary once Explore exists), so
  visitors never have to open the detail page to reach the repository. Until detail pages exist,
  Explore is *not rendered* (no broken links or placeholder pages) and "View on GitHub" is the
  primary button. **All seven projects now have a page**, so every panel shows Explore Project
  (primary) + GitHub (secondary, new tab); a project added without `detailPage` falls back to
  "View on GitHub" automatically. Demo if
  `links.demo`; "Watch video" only for videos that can't play inline.
- **Media model** (`projectMedia` / `projectVideo` in `lib/projects.js`): cover, then gallery
  images (deduplicated), or a single illustration item if there are none, then the video if
  embeddable. Video: YouTube (watch / youtu.be / shorts) embeds via `youtube-nocookie.com`, Vimeo via
  `player.vimeo.com` (`dnt=1`), local `.mp4` / `.webm` plays natively, other URLs are external links.
  Optional `videoPoster`; otherwise the illustration sits behind the play button.
- **Gallery:** with real media the stage is 16:10 on phones, 2:1 on tablet and 5:2 on desktop.
  **Illustration only** (`.gallery.is-illustration-only`, no real media yet) uses a strip about 37%
  shorter: 5:2 on phones, 16:5 on tablet, 4:1 on desktop (856×214 at 1440px). Images
  are top-anchored `cover` (`position` overrides; `fit: contain` for portrait). Thumbnails, prev/next
  (44px), the "n / N" counter and swipe (`touch-action: pan-y`; a swipe never triggers the image
  link) only appear when there are 2+ items. An illustration alone shows no thumbnails (never fake
  ones). Media changes are announced ("Image 2 of 3: alt").
- **Lightbox:** native `<dialog>` + `showModal()` (focus trap, Escape). Focus starts on Close and
  returns to the image link; page scroll is locked while open; arrows and swipe step through that
  project's images; backdrop click closes. Images are links to the full file, so it works
  without JS.
- **Video:** nothing loads until Play is pressed (no autoplay, no third-party requests before
  then). The player (iframe or `<video controls playsinline>`) replaces the poster and takes focus;
  a loading ring shows until ready. A file `error` shows a message and keeps the "Open video in a
  new tab" link. Gallery overlays (nav, counter, source link) hide while playing so the native
  controls are clear. Switching media or project removes the player (stops playback).
- **Motion:** panel fade-and-rise (280ms), media crossfade (220ms), staggered picker items on filter
  change; all via the Web Animations API and skipped with reduced motion.
- **Sizes** (live content, illustration only): selected panel about 563px and Projects section
  about 985px tall at 1440px; about 960px at 390px. With real media the stage returns to 856×342.
  All controls are at least 44×44px.
- **Gotcha:** sibling selectors see hidden panels (`.explorer-panel + .explorer-panel` matched
  every panel after the first). Stacked-layout spacing is scoped to `html:not(.js)`.

## Project detail pages (Phase 4B)

- **One template for every project:** `layouts/project.njk` (chained into `base.njk`). There are
  no per-project HTML files.
- **Opt-in per project:** `detailPage: true`. `projects.11tydata.js` computes
  `permalink: /projects/<slug>/` only then (otherwise `false`). The URL makes `project.url` truthy,
  which turns on "Explore Project" (primary) with GitHub secondary in the explorer. **All seven
  projects are enabled** (EasyFill first as the reviewed example, then the other six, owner
  request). The six have only their existing data (summary, category, year, technologies, GitHub,
  illustration); their write-ups will be added later.
- **Data cascade defaults:** `layout`, `templateEngineOverride: "md"` (bodies are plain Markdown,
  so `{{ }}` stays literal), `caseStudy: {}`, and computed `description` = `summary`.
- **Sections** (each only with real content): Overview (Markdown body), Key features
  (`caseStudy.features` list), Architecture & implementation, Challenges & solutions (list of
  `{challenge, solution}`), Results & evaluation, Lessons learned (all Markdown, via the `markdown`
  filter). "At a glance" appears only with `role` / `team`. "On this page" appears with 3+
  sections. Previous / next only links projects that have a page. Validation fails on a wrong shape
  and rejects the old `caseStudy.enabled`.
- **Header:** back link `/?project=<slug>#projects` (the explorer re-selects the project), meta
  (category · year · `type` badge), h1, `summary` as the introduction, actions with
  `showExplore = false` (no link to the page itself; GitHub is primary).
- **Media:** the same `gallery.njk` with page-level sizes: real media 16:10 on phones, 16:9 on
  tablet, then a fixed `clamp(360px, 38vw, 540px)` height at full width on desktop (a capped
  aspect ratio shrank the width). An illustration alone is a strip: 5:2, 4:1, then 5:1.
- **Layout:** mobile first. Phones and tablet: details (Technologies, At a glance, On this page)
  stacked above the sections. Desktop (1024px+): sections plus a sticky 300px details column.
- **Summary-only pages** (no Overview or `caseStudy` sections yet): `.project-layout.is-summary-only`,
  no `.project-main` is rendered and the details span the full width (no sticky column beside empty
  space). The `summary` is shown once, as the introduction; it's never repeated as an Overview.
  Adding any section switches the page to the normal two-column layout automatically.
- **Illustrations in short strips:** `.project-visual` is a size container (`container-type: size`).
  `visuals.css` adapts three illustrations with `@container (max-height: 170px)` (phone strips,
  about 115–145px tall): NLP tokens are shifted by their own size (always inside) and kept below
  the label; CarKeep's badges become one row above the road (two badges under 340px wide); the
  vision boxes shrink and swap sides (person right, vehicle low left) so their tracking motion
  never collides with the label or each other. Taller cards keep the original design. This also
  fixed the same clipping in the explorer on phones.
- **Shared JS:** `gallery.js` exposes `window.ProjectGallery.create(scope, { announce })`. The
  explorer creates one per panel; galleries outside `[data-explorer]` set themselves up and
  announce through `[data-gallery-status]`. `partials/project/lightbox.njk` is included once per
  page.
- **Nav on detail pages:** links point to `/#…` and "Projects" gets `aria-current="page"`.
  `main.js` runs the section highlight only on the homepage (`onHomepage`), so it can't clear that.
- **EasyFill content** comes only from the summary and the CV (5 features; evaluation with
  real-user tests and synthetic data). Overview, architecture, challenges, lessons, role, team and
  screenshots are still missing and intentionally left out.

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
- **Phase 3B (done, commit `b1db7f8`):** hero redesign (two columns, bigger name,
  detection box removed), interactive Java/Python/C++ profile editor with typing animation,
  button hierarchy with icons, section-number and contact alignment fixes.
- **Phase 4A (done, commit `2d7d2e9dbaf1ecbe5b0619c1f57fbf188577bfab`):** hero name refinement;
  lighter slate-blue palette site-wide; centred desktop navigation; **interactive Project
  Explorer** (filters, picker, preview, screenshot/video gallery, lightbox, in-page video), card
  excerpts, media model.
- **Phase 4B (done, commit `32cc0af9c6166f985836981c0be0a8bdad03559a`):** reusable project
  detail page template (EasyFill as the reviewed example), shared gallery/lightbox/video script,
  "Adding a New Project" docs.
- **All detail pages (done, commit `2c0ac273c5231a432a8b1efad2b1a13753983df0`):** `detailPage: true`
  for the other six projects (existing data only), summary-only page layout, illustration fixes
  for short strips.
- **About / Skills / Contact redesign (in progress, awaiting review):** text-only About, Skills
  as compact rows of tags, compact Contact band merging into the footer.
- `main` still serves the old hand-written site. This branch has no root `index.html`, so
  **merging before the Actions deploy exists would break the live site.**

## Roadmap

3. **Dark design system.** 3A (tokens, surfaces) and 3B (hero, editor, hierarchy) are done.
   The palette will be re-evaluated after the layout redesign.
4. **New sections.** 4A (Project Explorer) and 4B (project detail pages) are done; all seven
   projects have a page. About, Skills and Contact have been redesigned. Possible later: expanded
   About (education, hackathon, experience timeline), skills linked to projects.
5. **Project content:** fill the seven pages with real write-ups and screenshots from the owner
   (Overview, `caseStudy`, `role` / `team`, media). No template changes needed.
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
