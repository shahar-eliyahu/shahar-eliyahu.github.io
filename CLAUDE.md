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
src/_data/                site.json, home.json (homepage text), skills.json, skillLogos.json,
                          projectCategories.json
lib/skills.js             skills validation and the skillLogo filter
src/assets/img/skills/    technology logos (SVG) + CREDITS.txt
src/assets/fonts/         Inter variable WOFF2 (self-hosted) + OFL licence
src/projects/*.md         one file per project (front matter = data, body = description)
src/projects/projects.11tydata.js   defaults for all projects; slug = file name; layout; permalink
                                    /projects/<slug>/ only with `detailPage: true` (else false)
src/_includes/layouts/base.njk      page shell
src/_includes/layouts/project.njk   project detail page (one template for all projects)
src/_includes/partials/   nav, footer, components.njk (macros), contact-mascot.njk, sections/, project/, visuals/
src/assets/css/           tokens.css → base.css → sections.css → visuals.css (load order matters)
src/assets/js/main.js     nav, scroll progress, reveal, active link, pointer effects
src/assets/js/editor.js   hero profile editor (tabs, typing)
src/assets/js/gallery.js  shared media: gallery, lightbox, video (explorer and detail pages)
src/assets/js/projects.js Project Explorer (filters, picker tabs); uses ProjectGallery
src/assets/projects_media/<slug>/   project media: images/ and videos/ (owner-supplied, permanent;
                                    copied as-is by the `src/assets` passthrough)
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

Front matter fields: `title`, `summary`, `order` (required), plus `subtitle`, `year`, `type`, `role`, `team`,
`excerpt`, `categories[]`, `technologies[]`, `featured`, `featuredOrder`, `cover{src,alt,fit,position}`,
`gallery[{src,alt,caption,fit,position}]`, `videoPoster`,
`links{github,demo,video}`, `visual{id,label,kicker,headline}`,
`detailPage`, `caseStudy{features[],architecture,challenges[{challenge,solution}],results,lessons,
sections[{id,title,text,media[],note,items[{title,text,media[],note}],tools[{name,use}],links[{label,url}]}]}`
(a `media` entry is an image `{src,alt,caption,fit,position}` or a video `{video,title,poster}`).
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
   `assets/js/gallery.js` (`ProjectGallery`). Images go in `src/assets/projects_media/<slug>/images/`,
   local videos in `.../videos/` (file names as the owner gave them; never rename or move them);
   videos use `links.video` or a case-study `media` entry (YouTube / Vimeo / local `.mp4`/`.webm`).
   No new gallery or player code.
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
  Current categories, in this order: `ai-ml` (AI & Machine Learning), `applications`
  (Applications) and `software-engineering` (Software Engineering; owner-added for Zoo
  Management System, now also Car Management System. Pacman AI and Tactical AI Battle stay
  in AI & ML).
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
| `src \| projectAsset(slug)` | public image URL (`projectAsset(slug, "videos")` for videos; file names URL-encoded) |
| `section.media \| sectionMedia(project)` | a case-study `media` list as gallery items (images with intrinsic size, videos) |
| `items \| mediaIsPortrait` | true when every item is a portrait image (height > 1.2 × width) |
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
- Accent roles: **blue = actions and links**, **violet = markers** (project numbers in the
  explorer, hero label, editor caret, illustration detection boxes). The brand gradient (blue-600 → violet-600) appears only on
  the primary button, the logo mark, the scroll bar and nav underline.
- Depth comes from layered navy surfaces, 1px borders, soft black shadows and two faint fixed
  ambient radial gradients on `body`. No particles, no animated backgrounds, glow only on hover.
- Radii: cards 16px, buttons 10px, tags 6px, hero label pill. Detection boxes in the vision
  illustration stay square on purpose (bounding-box motif).
- All 7 illustrations were recolored through `--viz-*` tokens (dark cards). Their shapes and
  animations are unchanged.
- Contrast after the palette change: every text element meets WCAG AA (lowest 5.4:1, explorer
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
  `--text-h1`: `clamp(3rem, 0.66rem + 6.7vw, 7rem)` (112px at ≥ ~1570px,
  107 at 1440, 79 at 1024, 62 at 768; was `clamp(3rem, 8.2vw, 8rem)`, 118–128px), weight 600,
  letter-spacing −0.03em (`--tracking-display`). Phones (≤ 650px) keep `clamp(2.9rem, 15vw, 5rem)` (58.5 at 390, 48 at
  320); the curve keeps tablets above phones. Intro: `--text-lead`, `--color-text-secondary`, max 36ch.
  The vision project illustration keeps its own detection boxes.
- Button hierarchy (`button()` macro in `components.njk`):
  `primary` (brand gradient, one per view) → `secondary` (solid raised surface) →
  `ghost` (text and icon, for profile links). Contact still uses `light` / `dark-outline`.
  The macro takes `icon` / `trailingIcon` (from `partials/icons.njk`, inline SVG, no
  library) and adds hidden "(opens in a new tab)" text to external links.
- GitHub and LinkedIn sit in `.hero-links`, so they wrap together. On mobile, the main actions
  are full width and the profile links share one row.
- **Section headings are just the title** (owner decision): `sectionTitle(title)` renders
  `.section-title > h2` only. The numbers (01–03), the small kickers (ABOUT, SELECTED WORK,
  TOOLS) and the Contact label were removed from the templates, CSS and `home.json`. Space under
  headings: 56px (40px on phones); the About text starts level with its heading on desktop.

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

- **Split grid:** `--split-columns` (`tokens.css`: `minmax(220px, 0.42fr) minmax(0, 1fr)`) places
  the About heading beside its text at 1024px+.
- **About:** text only. The Focus / Interests / Approach list was removed (template, CSS and
  `home.json → about.facts`). `.about-text`: max 68ch, a 2px blue→violet accent line on the left,
  the first paragraph as a slightly larger lead (`--text-lead`). Below 1024px the heading sits
  above the text. In the two-column layout (1024px+) the section (`.about-section`) has 72px
  bottom padding instead of 104: the content is short there, and 104 + the next section's 104
  read as an empty gap (owner request). Tablet and phones keep the normal padding.
- **Skills (category rows, featured + "Show more", logos):** 61 technologies, the owner's CV list
  (exact names; never add skills that aren't on the CV), in **five broad categories** (owner's
  order): Programming Languages (9) · AI & Machine Learning (25, includes computer vision and
  NLP) · Data & Processing (7) · Platforms & Systems (11) · Development Tools (9). New skills go
  into one of these by primary role; don't add categories or subcategories.
  - **Data:** `skills.json` → `{ name, featured: [...], more: [...] }`. Each skill appears once;
    `featured` (exactly 5 per category, owner request: recognisable tools with logos, chosen
    for relevance, never concept skills like OOP / CNN / Data Cleaning; 25 in total) always
    shows, `more` sits behind "Show more" (`[]` = no control); `more` lists tools first,
    concepts last. Featured order is also tuned so rows wrap cleanly at 320px (e.g. Android,
    Firebase, Linux, …). C and Spark Structured Streaming are featured because they are the only
    remaining logo-bearing skills in their categories. `skillLogos.json` maps skill
    name → logo id (`src/assets/img/skills/<id>.svg`); unmapped skills are text-only.
    `lib/skills.js` (`validateSkills` on `eleventy.before`) fails the build on a duplicate skill
    or category name, an unknown key (a typo like `featurd` would silently hide skills), an
    empty `featured`, a logo mapping for an unknown skill or a missing SVG; `skillLogo` is the
    filter. Template and CSS never name a category or a count.
  - **Judgement calls in the grouping:** OOP, Data Structures & Algorithms and REST APIs sit in
    Programming Languages (core programming concepts); CUDA / GPU Training and Data Annotation in
    AI & ML (used for model training / datasets); Jetpack Compose and Azure AI Document
    Intelligence in Platforms & Systems (Android UI toolkit; Azure service); Claude and ChatGPT
    in Development Tools (coding assistants).
  - **Logos:** vendored, no runtime dependency. devicon 2.18.0 (MIT, multi-colour originals) and
    Simple Icons 16.36.0 (CC0, brand colour) where devicon has none or is unsuitable
    (Linux 194KB, Jetpack Compose mostly navy, YOLO, MediaPipe, NVIDIA for CUDA, GitHub, Cursor).
    Black/navy parts that vanish on the dark tags were set to `#E2E8F0` (as on the brands'
    dark-background versions): scikit-learn text, pandas bars, Kafka, GitHub, Cursor, YOLO.
    Credits and the devicon licence: `src/assets/img/skills/CREDITS.txt` (`.txt`, because a
    `.md` there would be built as a page). Text-only by design: concepts (OOP, Fine-tuning, …),
    SQL (no single logo), ChatGPT (no licensed OpenAI mark in either set), spaCy (its mark is a
    wordmark, illegible at 18px), DistilBERT, NLTK, Florence-2, OpenMP, MPI.
    `<img alt="" width height loading="lazy">`: decorative (the name is the text), no layout shift.
  - **Layout:** `.skills-list` of `.skill-row`s with 1px separators, no cards. Phones: the `h3`
    (3px blue→violet marker, as the About line) above the tags. 651px+: grid `224px | 1fr` (fits
    "Programming Languages", 215px, on one line);
    1200px+: `240px | 1fr` and full-size featured tags (20px logos, 0.875rem); below 1200px all
    tags are compact (18px logos, 0.8125rem), which keeps most rows on one line at 768–1199px.
    Extras (`.is-extra`) are quieter: transparent, `--color-border`, secondary text. Plain
    wrapping (no `text-wrap: balance`: with inline tags it added lines on phones).
  - **Expansion:** one `ul` per category (labelled by its heading) holds featured + extras, so
    "Show more" (a `<button aria-expanded aria-controls=<ul id>>`, name "Show more <category>
    skills" via sr-only text; no count, owner request) always follows the last visible tag; it toggles `.is-expanded` on
    the row (main.js), the label becomes "Show less", focus stays on the button. CSS hides
    extras only under `.js`; without JS all 61 show and the buttons are hidden. 44px hit area via
    `::after`. No animation (only a colour transition, removed by reduced motion).
  - Collapsed height: 680px at 1440px, 757px at 1024px, 854px at 768px, 1017px at 390px,
    1089px at 320px (13–28% shorter than the earlier eight-category version).
- **Contact:** a compact band on the inverse surface (grid texture + glow kept). Heading uses
  `--text-h2`, like every section heading. Phones and tablet: text, then actions; 1024px+: text left, a 500px
  action column right. Actions are a grid: **Email Me** (`light`, primary) full width on top;
  Download CV, GitHub, LinkedIn (`dark-outline`) share one row from 651px (on phones CV is full
  width and GitHub / LinkedIn share a row). The glow is a radial gradient (no `blur()`), masked to
  fade out before the band ends, so no clipped edge shows against the footer.
  - **Accent:** the headline's last word (from `home.json`, split in the template) gets a
    blue→violet gradient text (`.contact-accent`; 6.2–6.7:1 on the band). Copy unchanged.
  - **Mascot (owner-approved):** `partials/contact-mascot.njk`, inline SVG
    (no assets, no library), included after the Email Me link inside `.contact-email-wrap`
    (`margin-top: 50px` makes room). A lopsided lavender square (`--mascot-*` tokens), dot eyes,
    relaxed arched brows (right one higher: curious), soft smile; two small hands. Two SVG
    layers: body (z 0, 18px hidden behind the button, z 1) and hands (z 2) on the button's top
    edge; the wrapper has no z-index so the button sits between them. `aria-hidden`,
    `pointer-events: none` everywhere: clicks on the hands land on the link.
    - **State** (data attributes; CSS turns them into poses / faces with transitions):
      `data-mood` idle · email · approve · cheer, `data-point` left/right (gesturing hand),
      `data-entrance` pending → playing → done. Three mouths (soft / pleased / open happy),
      happy eyes via CSS `ry`.
    - **One-shot moves** are Web Animations from main.js (never CSS keyframes on the same
      element), each cancelled on the next state change, so rapid pointer moves can't stack:
      entrance (body pop 1.25s + 250ms delay, hands fade in, right hand taps the button twice),
      two nods (760ms) after 2s continuous hover / keyboard focus on Email Me (timer cleared on
      leave, re-armed on return), one approving nod (420ms) per secondary button entered.
    - **Triggers:** `pointerenter/leave` (mouse / pen only) and `focus/blur` (only when
      `:focus-visible`, so a tap doesn't count); hover wins over focus. Eyes look at the active
      button, otherwise follow the pointer in the band (hover-capable devices only).
    - **Entrance:** IntersectionObserver on Email Me (threshold 0.6), once per load; works on
      direct `/#contact`; an interaction during it cancels it. The hidden start
      (`translateY(36px)`, hands transparent) only applies with `.js` and motion allowed, so
      without JS the mascot simply rests; the body has `transition: none` while playing so CSS
      transitions don't fight the animation.
    - **Reduced motion:** no entrance, nods, gestures, poses (`!important` override), eye
      tracking or blink; the face still changes statically. **Touch:** resting state; taps
      go straight to the links.
- **Footer:** content unchanged, 72px tall. On the homepage (`body:has(.contact)`) its full-bleed
  border becomes a container-width divider, so contact and footer read as one closing block;
  other pages keep the full-width border.

## Typography (owner-approved)

- **Inter for headings and body** (owner's pick after comparing Space Grotesk + Inter, Manrope and
  Plus Jakarta Sans in a temporary dev-only preview, since removed), self-hosted: one
  variable WOFF2 (`src/assets/fonts/inter-latin-wght-normal.woff2`, weights 100–900, latin
  subset, Fontsource 5.3.0, OFL in `inter-OFL.txt`), `@font-face` at the top of `base.css`,
  preloaded in `layouts/base.njk`. Google Fonts now only serves IBM Plex Mono (code, labels).
  Space Grotesk is gone. Tokens: `--font-body` / `--font-display` = Inter + system fallbacks.
- **Type system** (owner-approved audit; tokens in `tokens.css` §4, use them, don't add literals):

  | Step | Token | Size | Line height / tracking | Used by |
  |---|---|---|---|---|
  | Display | `--text-h1` | 112 / 107 (1440) / 79 / 62 (768); phones 58.5 / 48 | 0.95 / −0.03em | hero name |
  | H2 | `--text-h2` | 52 / 44.5 (1024) / 39.4 (768) / 34 | 1.1 / −0.022em | `.section-heading`: About, Projects, Skills, Contact headline, project page titles |
  | H3 | `--text-h3` | 28 / ~27 (1024) / ~26 (768) / 24 | 1.2 / −0.015em | explorer panel titles, project section titles |
  | H4 | `--text-h4` | 17 | 1.3 | Skills categories, pager titles |
  | Lead | `--text-lead` | 20 (≥ 1440) / 18 | 1.55 | hero intro, About lead, project intro |
  | Body | `--text-body` | 17 | 1.65 | every paragraph and list (About, excerpts, Contact, project text, features, challenges) |
  | UI | `--text-ui` / `--text-sm` | 15 / 14 | 1.4 | buttons + nav / small UI (badges, chips, small buttons, labels) |
  | Small | `--text-small` | 13 | — | footer, pager label, Show more |
  | Mono label | `--text-mono` | 12 (badge 11) | 0.08em (`--tracking-label`) | project meta, counts, challenge labels |

  - **Measures:** `--measure-body: 62ch` (About block, project text; in Inter that is up to ~80
    characters a line), `--measure-lead: 56ch` (project intro). Narrower blocks stay: hero intro
    36ch, explorer excerpt 60ch, Contact sentence 52ch, Contact headline 18ch.
  - **Spacing:** section heading → content 48px (32 on phones, `.section-title`); heading → its
    intro 16 (Contact, project title); H3 → text 16 (12 inside the explorer card); paragraph →
    paragraph 16; small label → content 8, H4 → content 12.
  - **Exceptions (deliberate):** hero name sizes; hero editor (12.2–13.7px mono, 1.85); Skills
    tags 14/13px; explorer picker tabs (16/15px, 1.35; tab index / category); Email Me 15.7px
    (0.98rem); logo 18.4px; hero pill 0.14em; Contact band padding 80/48.

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
  the right. **Numbers are relative to the visible (filtered) list**: All 01–10, Applications
  01–03, AI & ML 01–05, Software Engineering 01–02. `projects.js` renumbers on every filter change; the order and data never
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
  back to All / the first visible project. On phones the chips are a swipeable row:
  `applyFilter` calls `revealIn(filterRow, chip)`, so the chosen chip (tapped, or restored
  from `?category=`) scrolls into view, once, horizontally only; nothing happens when it's
  already clear of the faded edges, the row is already at that end, or the chips wrap
  (651px+). `revealTab` uses the same helper for the project strip.
- **Actions: both are intended and kept.** **"Explore Project"** opens the project's internal
  detail page (full description, screenshots, videos, technical write-up) and becomes the
  **primary** action as soon as the page exists (`project.url`, Phase 4B). **GitHub** always stays
  directly available in the explorer as a separate button (secondary once Explore exists), so
  visitors never have to open the detail page to reach the repository. Until detail pages exist,
  Explore is *not rendered* (no broken links or placeholder pages) and "View on GitHub" is the
  primary button. **All ten projects now have a page**, so every panel shows Explore Project
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
- **Portrait media** (EasyFill, CarKeep, Anyone Can Cook): when every gallery image is a portrait
  screenshot (sizes read from the file headers at build time, `imageSize` in `lib/projects.js`), the
  gallery gets `.is-portrait` (square stage on phones, 48×72 thumbnails) and the panel
  `.has-portrait-media`: from 651px a two-column grid, media column `minmax(200px, 36%)` whose stage
  stretches to the text's height (308×454 at 1440), **capped** at the height the tallest
  screenshot needs at the column's width: `max-height: calc((100cqi - 2 × --space-3) × 2.17 +
  2 × --space-3)` (the gallery is an inline-size container; 2.17 = CarKeep and EasyFill's
  height / width). Without the cap, a narrow column beside tall text (651-800px, and 1024-1150px
  where the desktop picker narrows the panel) left an empty band of up to 280px between the
  image and the thumbnails (owner-approved fix). With the cap, the gallery column is
  `justify-content: center`: the image, counter and thumbnails stay together, centred beside the
  text; image sizes are unchanged at every width (Anyone Can Cook's slightly shorter 2.03
  screenshots keep about 30px inside the stage). A future screenshot taller than 2.17 would show
  slightly narrower, never cropped. Phones stack it (panel about 1270px tall at 390, because of
  the longer summary). Projects with landscape or no images are unaffected.
- **Lightbox:** native `<dialog>` + `showModal()` (focus trap, Escape). Focus starts on Close and
  returns to the image link; page scroll is locked while open; arrows and swipe step through that
  project's images; backdrop click closes. Images are links to the full file, so it works
  without JS. The image fills the viewer (`object-fit: contain`), so small files such as the
  565px EasyFill diagram are enlarged; a click in the empty margin beside the picture still
  closes (`outsidePicture` in `gallery.js`).
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
  which turns on "Explore Project" (primary) with GitHub secondary in the explorer. **All ten
  projects are enabled** (EasyFill first as the reviewed example, then the other six, owner
  request; Anyone Can Cook and Zoo Management System were added later with their full
  write-ups). Every page now has its
  complete owner-approved write-up (see Status).
- **Data cascade defaults:** `layout`, `templateEngineOverride: "md"` (bodies are plain Markdown,
  so `{{ }}` stays literal), `caseStudy: {}`, and computed `description` = `summary`.
- **Sections** (each only with real content): Overview (Markdown body), Key features
  (`caseStudy.features` list), Architecture & implementation, Challenges & solutions (list of
  `{challenge, solution}`), Results & evaluation, Lessons learned (all Markdown, via the `markdown`
  filter). "At a glance" appears only with `role` / `team`. "On this page" appears with 3+
  sections. Previous / next only links projects that have a page. Validation fails on a wrong shape
  and rejects the old `caseStudy.enabled`.
- **Custom sections** (`caseStudy.sections`, owner-approved, first used by EasyFill): an ordered
  list rendered after the Overview body by the same template (`.case-section`), each with `id`
  (anchor), `title`, Markdown `text`, `media`, `items` (sub-sections with their own media),
  `tools` (tech badge + use) and `links` (secondary buttons, GitHub icon for github.com). Media go
  through `partials/project/case-media.njk` → `gallery.njk` with `galleryItems` / `galleryStrip`:
  - Images: a **strip** (`.gallery.is-strip`, `data-gallery-strip`): every image visible at its
    intrinsic ratio (`--media-ratio`, `width` / `height` attributes), portrait ones 170px wide
    (220 beside the overview text), shrinking together on phones (no wrap); each opens the
    lightbox, which steps through that strip. `gallery.js` skips swipe for strips. Several
    images that aren't all portrait get `.is-row`: each item grows by `--media-aspect`
    (width / height, set only in row mode), giving one shared height (223px at 1440 for the
    Computer Vision examples); below a 30rem section they stack, each centred and capped at
    `22rem × aspect` wide. Single landscape images keep their natural width up to the column.
    A strip image's `caption` sits below it (`.gallery.is-strip .gallery-caption`, static).
  - Optional `note` (Markdown) on a section or item: `.case-note`, small muted text after that
    block's media (sources, caveats). Section notes follow `.case-body`, item notes follow the
    item's media (or its text, for text and video items).
  - Items: `has-portrait-media` (all images portrait) is the only case that puts media beside
    the text (36rem+); landscape images and rows sit below the text. `.case-body` and image
    items use `grid-template-columns: minmax(0, 1fr)`, otherwise a wide table stretches the
    section instead of scrolling (found at 390px). `.case-items` got the same single
    `minmax(0, 1fr)` column in the Retail round (owner-approved): a table inside an item had
    widened the whole item list on phones (page overflow of 20-87px at 390-320px) instead of
    scrolling in its own box. The video-card two-column rule still overrides it; other pages
    were pixel-checked unchanged. A single image inside an item (not a row,
    not portrait) is capped at `34rem × --media-aspect` wide, i.e. 34rem tall (Pacman's fleeing
    screenshot: 500×542); the CV item charts are wide enough never to hit it. Every strip item
    now carries `--media-aspect` (no visual change for EasyFill).
  - **Tables** (Markdown in `text`): `eleventy.config.js` wraps every Markdown table in
    `.table-scroll` (`role="region"`, `tabindex="0"`), which scrolls sideways inside a framed
    box; cells don't wrap except the sticky first column (min 8.5rem); header row on
    `--color-surface-raised`; tabular numbers; `|---:|` alignment comes inline from markdown-it.
    The CV tables fit from 768px and scroll at 390 and below.
  - Videos: the normal stage with Play, inside a **video card** (`.case-item.is-video`) with a
    square stage, so landscape and portrait videos share one frame and are letterboxed by the
    native `<video>` (contain), never cropped. Two cards side by side when the section is 30rem+.
    Optional `poster` (a frame of the video in `images/`): `.gallery-poster` is `object-fit:
    contain` on black, matching the player, so nothing shifts on Play (this also applies to
    `videoPoster`). Without a poster the illustration is the backdrop. The poster is a normal
    lazy `<img>`; the video file is still requested only on Play. Cards have **no "Open video in
    a new tab" link** (owner request): `case-media.njk` sets `galleryNoVideoSource`, which
    `gallery.njk` honours; the explorer gallery keeps the link. The Play link still points to
    the file (no-JS fallback), and if a file fails to play, `gallery.js` marks it
    `data-failed` so the next Play opens it in a new tab (the error message says so).
    The `<video>` is created on Play with `preload="none"` (nothing is fetched before Play).
  - **Main video** (a video in a section's own `media`, `.case-body > .case-media.is-video`): a
    framed player whose stage takes the poster's shape (`--media-aspect`, set by
    `case-media.njk` from the poster's size, which `sectionMedia` reads at build time; 16:9
    without a poster), width `min(100%, 34rem × aspect)`. Cards are unaffected.
  - Layouts use container queries on the section (`container: case / inline-size`): 36rem+ puts
    portrait media beside the text and lays tools out as a subgrid (badge | use). The detail
    page's main column is narrower at 1024 (526px inside) than at 768 (627px), so viewport
    breakpoints would get this wrong.
  - With sections: no gallery under the header and no `summary` introduction (the sections carry
    the media and the overview); a section with `tools` hides the aside Technologies card.
    Validation: `id` / `title` required, unique ids not clashing with a fixed `caseStudy` key,
    existing files and `alt`, no mixed image/video list, links with `label` and `url`.
  - The page-top gallery sizes are scoped to `.project-page-media .gallery-stage` so they never
    reach section media.
- **Header:** back link `/?project=<slug>#projects` (the explorer re-selects the project), meta
  (category · year · `type` badge), h1, optional `subtitle` (`.project-subtitle`, lead size),
  `summary` as the introduction (unless custom sections are used), actions with
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
- **EasyFill content** (owner-supplied copy and media, used verbatim): subtitle, summary, six
  technologies, explorer gallery (welcome screen, autofill, recommendation; all portrait), and five
  custom sections: Project Overview, Key Features (four items, three with screenshots), Technology
  & Architecture (diagram + eight tools), Distress Detection Demonstrations (hand and voice videos,
  720p, about 8 and 5.5 MB) and Testing & Evaluation (secondary link to
  `github.com/shahar-eliyahu/EasyFill-Testing`; the main repository stays `links.github`). No
  `year` (owner request). Terminology was checked against the EasyFill source: hand and voice
  detection are signal processing, statistics and threshold rules (no trained models); the only
  ML is MediaPipe's pre-trained face landmarker, so never call the demos "AI detection". The long
  `Backup_Demo.mp4` was removed by the owner and must not come back. `form-upload-loading.jpg`
  is in the folder but unused (it's still published by the passthrough). Video thumbnails
  (owner request): `hand-distress-detection-poster.webp` (frame at 3s) and
  `voice-distress-detection-poster.webp` (8s, the recording dialog), about 16 KB each, grabbed from
  the redacted videos with headless Chrome (seek → canvas → WebP, no ffmpeg) and checked for
  personal data. The architecture PNG is
  only 565×511. The videos keep their index at the end of the file (no fast-start); they play,
  but a "web optimized" re-export would start faster. Role and team are still missing.

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
- **About / Skills / Contact redesign (done, commit `48b3a0a1555bd399e77a7248313b657ba641005e`):**
  text-only About, Skills as compact rows of tags, compact Contact band merging into the footer.
- **Portfolio redesign finalised (owner-approved, committed after `48b3a0a`, pushed to
  `origin/portfolio-redesign`, not merged):** Skills as five categories with logos and
  "Show more"; the Contact mascot; section labels and numbers removed; Inter self-hosted with
  the unified type system; About bottom padding on desktop. The temporary font preview used to
  choose Inter was removed before this commit.
- **EasyFill integration (done, owner-approved, commit "feat(portfolio): complete EasyFill
  project integration", pushed):** owner media in
  `src/assets/projects_media/easyfill/` (the new media convention for all projects), `subtitle`,
  portrait explorer layout, custom case-study sections with image strips and video cards, lightbox
  enlarges small images.
- **Computer Vision integration (done, owner-approved, commit "feat(portfolio): complete computer
  vision case study", pushed):** slug and URL stay
  `computer-vision`; media in `src/assets/projects_media/computer-vision/images/` (four charts
  as PNG). New title "Computer Vision: YOLO Object
  Detection", subtitle, no `year`
  (owner request), eight custom sections, two Markdown tables. Numbers are the owner-approved
  chart values (the CV repository README shows 0.829 / 0.713 / 0.563 for "original + aug";
  the portfolio uses 0.827 / 0.716 / 0.564). Keep the baseline comparison (default Ultralytics
  augmentation, 0.576) and the controlled runs (0.564) separate. Shared additions: photo rows,
  captions below strips, `note`, tables.
  - **Image cleanup (owner-approved Option A, done, commit `07c8190`, pushed):** the three
    Flickr30k detection photos (`object-detection1/2/3.webp`) are **no longer part of the
    current portfolio files**: removed from `projects_media`, from the Explorer gallery and
    from the Overview (the "Object Detection Examples" sub-block, its captions and the photo
    credit note are gone; the Overview is text only). Reason: the photos belong to their
    Flickr authors (one CC BY-NC-ND 2.0, one all rights reserved, one unverified), and the
    Flickr30k terms don't grant redistribution. The originals are kept outside the repository
    in `C:\Users\shaha\Projects\portfolio-private-media\computer-vision\` (SHA-256 verified).
    Explorer gallery now: `baseline_model_comparison.png` (cover) →
    `final_model_comparison.png` → `confusion_matrix_final_model.png`, all `fit: contain`.
    The Flickr30k *dataset* references (dataset text, the "Flickr30k" tool badge, the
    annotation limitation) stay. Don't re-add Flickr30k photos without verified rights.
- **Pacman AI integration (done, owner-approved, commit "feat(portfolio): complete pacman ai
  case study", pushed):** slug, URL, order 6,
  `ai-ml`, no year (unchanged). Media in `src/assets/projects_media/pacman-ai/`:
  `collecting-coins.png` (cover, 862 KB, kept by owner decision), `Fleeing_from_a_ghost.png`,
  `videos/PacmanCoinsEscape.mp4` (398 KB, 15.2 s, 960×1040, H.264 High + AAC, fast start), and
  `pacman-video-poster.webp` (frame at 5 s, 560×607, 57 KB, made with headless Chrome).
  Subtitle, `type` "Classical AI & Search Algorithms Project", five sections. Copy checked
  against the PacMan-CPP source: classical search-based game AI, no machine learning; ties go to
  the cell nearer the target coin and only the previous cell is avoided (no longer history).
- **Tactical AI Battle integration (done, owner-approved, commit "feat(portfolio): complete
  tactical ai battle case study", pushed):** slug, URL,
  order 7 (last), `ai-ml`, no year (unchanged). Media in
  `src/assets/projects_media/tactical-ai-battle/`: `battle.png` (cover), `visibility.png`,
  `danger_map.png` (1088×800, about 20 KB each), `videos/Demo.mp4` (owner's web-optimized
  re-export: 537 KB, 21.9 s, 1278×940 (decodes 1280×941), H.264 High 4.0 + AAC, fast start, no
  window title bar) and `tactical-video-poster.webp` (frame at 6.6 s with two grenade blasts,
  700×515, 36 KB). Seven sections, built only from existing components (no code changes). Copy
  checked against the Tactical-AI-Battle C++ source; owner-approved corrections: rocks and
  trees (not water) block sight and fire; the commander computes and merges every member's view
  cone and receives reports of spotted enemies, wounds and low ammo, and assigns the medic and
  provider; BFS cover is judged against known enemies; one shared "Dynamic Danger Map". "Finite
  State Machines (FSM)" is spelled out on first use. Classical game AI only, no machine learning.
- **CarKeep integration (done, owner-approved, commit "feat(portfolio): complete carkeep case
  study", pushed):** slug, URL, order 5,
  `applications`, no year (unchanged). Technologies corrected: Flutter, Dart, Supabase,
  PostgreSQL, Row Level Security (the old "Firebase" tag was wrong; `pubspec.yaml` uses
  `supabase_flutter`). Media in `src/assets/projects_media/carkeep/`: four portrait phone
  screenshots (`home.png`, `vehicle_overview.jpg` 738×1600; `history.jpg`, `documents.jpg`
  945×2048; 54-70 KB), `videos/Demo.mp4` (2.9 MB, 17.9 s, 392×850, H.264 High 3.0, no audio,
  fast start, red screen-recording indicator accepted) and `carkeep-video-poster.webp` (frame
  at 5.0 s, Hyundai i20 overview, 392×850, 16 KB). Explorer uses the portrait layout. Six
  sections; `home.png` appears once (Overview, beside the text), Vehicle Management uses
  `vehicle_overview.jpg`. Copy checked against the CarKeep repository (RLS on 7 tables, 25
  policies, owner/admin/member, `delete-account` Edge Function, unit/widget/integration tests).
  Owner approved publishing vehicle number 34856793 (fictional) and the filename "Shahar
  Eliyahu.pdf". The CarKeep repository README still says "under active development" (owner's
  repo, not changed). No code changes.
- **Real-Time Retail Trend Detection integration (done, owner-approved, commit "feat(portfolio):
  complete retail trend detection case study", pushed):**
  slug, URL, order 3, `ai-ml` unchanged; `year` removed (owner request). Five-person team project
  for a Big Data Analysis course (no teammate names). Media: five landscape matplotlib charts in
  `src/assets/projects_media/retail-trend-detection/images/` (32-109 KB; no video). Seven
  sections: two Markdown tables (validation, test; values match the repository README rounded
  to three decimals), workflow as a numbered list, three chart sub-blocks, a "Two-Stage
  Experiment" sub-block and a "Test Results" sub-block. Copy checked against the repository:
  topic `retail_stream`, simulated bursty replay of Online Retail II on one machine,
  `applyInPandasWithState`, history = each product's last 60 days *with activity*, exactly 45
  features (`numFeatures 45`), 10 s trigger, 1-day watermark, checkpointing, single Random
  Forest at 0.25. The streaming output rows are model alerts; their `Y` is the heuristic label
  from the dataset, never the prediction. The stage-2 chart is the two-stage experiment
  (threshold 0.35, candidate subset), captioned as such.
- **NLP Sentiment Analysis integration (done, owner-approved, commit "feat(portfolio): complete
  NLP sentiment analysis case study", pushed):** slug `nlp-sentiment`, URL, order 4, `ai-ml`
  unchanged; title changed from "NLP
  Final Project" (so Retail's "Next" and CarKeep's "Previous" links show the new title);
  `year` removed (owner request). Course project, no team or authorship statements. Media:
  five landscape result charts already in `src/assets/projects_media/nlp-sentiment/images/`
  (34-48 KB; no copy needed, no video). Eight sections: workflow as a numbered list, two text
  model sub-blocks, one Markdown table (6 runs, accuracy and F1), four full-width chart
  sub-blocks (F1 Score, Accuracy, Word2Vec + LSTM, DistilBERT). Table values were checked
  against the confusion-matrix counts; averages 0.736 / 0.907. Copy checked against the
  NLP-Final-Project code (spaCy, IMDb + Wikipedia Word2Vec, LSTM 128 with frozen embeddings,
  distilbert-base-uncased, 2,500 + 2,500 sample, stratified 20% split). Reordering happens
  before the split, so each data order has its own test set: never write "the same 1,000 test
  reviews" across orders and never claim data order caused a difference. Two owner-approved
  caption corrections: the LSTM error pattern holds overall (not in the shuffled run) and
  DistilBERT errors are "roughly balanced" (reversed is 60 vs 41). No code changes.
- **Anyone Can Cook integration (done, owner-approved, commit "feat(portfolio): add Anyone Can
  Cook case study and fix portrait gallery spacing", pushed):** the eighth project. Slug `anyone-can-cook`, URL `/projects/anyone-can-cook/`, `applications`,
  **`order: 1.5`** (owner decision: second, right after EasyFill, without renumbering the
  other projects; so EasyFill's "Next" and Computer Vision's "Previous" now link to it), no
  `year`, no `visual` (real screenshots and a poster cover every case). Personal project in a
  private Android beta (signed APK for family and friends; not on any store): never claim a
  public release, users, ratings or production readiness, and never call Gemini a trained
  model. Media in `src/assets/projects_media/anyone-can-cook/` (the owner's folder was
  `Anyone-Can-Cook`; renamed to lowercase with approval, because media URLs use the slug and
  GitHub Pages is case-sensitive; Windows hides such a mismatch in local builds): four
  portrait screenshots (540×1095 PNG, 22-53 KB), `Architecture.png` (1956×594, white,
  readable through the viewer), `videos/Demo.mp4` (owner's file, unchanged: 18 MB, 76.8 s,
  1080×2340, H.264 Main 5.1 about 66 fps, fast start, **silent** AAC track) and
  `anyone-can-cook-video-poster.webp` (frame at 53 s, cooking step 3 of 4 with a timer,
  540×1170, 30 KB, headless Chrome). Explorer: portrait layout, home (cover, owner request) →
  cooking → Remy → catalog. Nine sections; each screenshot once, main video (CarKeep pattern, 249×540 frame) with
  the caption in the section text. Copy checked against the Anyone-Can-Cook-App repository;
  owner-approved corrections: rate limits are **per IP**, not per device; links are pasted
  (no Android share target), so "added as a link" / "paste a link"; the wake phrase works
  with hands-free mode on in the cooking screen. Test counts are counted test functions
  (205 Flutter, 148 backend). The same commit holds the portrait gallery spacing fix in
  `sections.css` (see Portrait media), the only code change. An optional smaller re-export of
  the video (about 540 wide, 30 fps, no audio) is the owner's choice.
- **Zoo Management System integration (done, owner-approved, committed locally in `1c85a5b`
  "feat(portfolio): add Zoo Management System and Software Engineering category"; not yet
  pushed to GitHub):**
  the ninth project, a Java OOP course project. File `src/projects/zoo-management-system-oop.md`,
  slug and URL `zoo-management-system-oop` (they must match the owner's media folder,
  `src/assets/projects_media/zoo-management-system-oop/images/`), `software-engineering`
  (owner decision; first added as `applications`), `order: 8`
  (last; so Tactical AI Battle's "Next" links to it), no `year`, no `visual`. The OOP design
  is the original console course project; the Swing dashboard is a **later extension**, never
  part of the course submission. No AI or ML, no team or contribution statements, no
  deployment or user claims, no bug-fix history. Media: 12 owner PNG screenshots (seven
  1380×900 dashboard screens, four smaller dialogs; replaced once by the owner during the
  work, same layouts); **8 are used**: explorer 01 overview (cover) → 06 aquarium → 05 cats →
  02 penguins (landscape gallery); page 01 (Overview), 05 / 02 / 04 (three data-structure
  sub-blocks), 06 (Dashboard section, full width) and a "Dashboard Actions" sub-block with a
  row of 08 add-animal, 10 next-year, 09 feeding (one shared height, about 205px at 1440;
  stacked on phones). 03, 07, 11 and 12 stay in the folder, unreferenced and untracked
  (owner decision; the `src/assets` passthrough would still publish them if committed).
  Six sections: Overview, Object-Oriented Design, Hand-Written Data Structures, The Swing
  Dashboard, Technology & Methodology, Explore the Source Code. Owner-approved changes to the
  supplied copy: Section 1 in third person ("A Swing dashboard was later added…"), and the
  "Dashboard Actions" title. Copy checked against Zoo-OOP-Java-Project commit `ab2c880`
  (the owner's local copy at `C:\Users\shaha\Projects\Zoo-OOP-Java-Project` has 49 tracked
  files deleted in its working tree, including `src/gui`; never touch it). The same commit
  adds the Software Engineering category and one small JavaScript change in
  `src/assets/js/projects.js`: the shared `revealIn` helper, which keeps the selected
  category chip visible in the swipeable filter row on phones (see Filters). No CSS or
  template changes.
- **Car Management System integration (Implemented and owner-reviewed):** the tenth project, written in C. File `src/projects/car-management-system-c.md`,
  slug and URL `car-management-system-c`, `software-engineering`, `order: 9` (last; so Zoo's
  "Next" links to it), `type` "C Programming Project", no `year`, no `visual`. Positioned as an
  independent software engineering project (owner rule): **never mention a course,
  university or assignment**, no commercial or production claims, no bug-fix history (the
  repository README's AddressSanitizer list stays out). The only history on the page is one
  owner-approved Overview sentence: the original numbered menu, and the dashboard added later.
  The emphasis is the implementation (memory, pointers, data structures, sorting and searching,
  function pointers, modules, persistence, input validation); the terminal dashboard is secondary
  (one short section). **Writing style (owner rule, applies to all project pages):** a
  professional, high-level overview, not source-code documentation; no individual function
  names, exact field restrictions, edge-case exceptions or internal loops; simplify or remove
  over-specific sentences rather than lengthening them. Background facts the copy must stay
  consistent with: customers are a **dynamic array**, only their purchase histories are
  doubly linked lists; garages are a singly linked list; cars are sorted and `bsearch`ed by
  price, brand and serial (sorted by the same key first), parts are sorted by price or brand
  with `qsort` and found by serial with a **linear** scan; the comma check is in the dashboard
  only, and garage addresses may contain commas; `freeCarInventory` is never called. Subtitle
  "Data Structures and Memory Management in C" (owner decision: "System Programming" overstated
  it). Portability: only Windows with MSYS2 GCC is verified, so the page says "compiled with
  GCC" and names no operating systems. Media: the five PNG screenshots from the repository's
  `docs/screenshots/` (1419 px wide, landscape, 130-170 KB, copied unchanged, SHA-256
  verified) in `src/assets/projects_media/car-management-system-c/images/`. Explorer 01
  dashboard (cover) → 02 cars search → 03 customers → 04 sell; page 01 (Overview), 03
  ("Customers and Purchase Histories"), 02 / 05 (sub-blocks "Searching the Car Inventory",
  "Sorting the Parts Inventory"), 04 (System Interaction). The sample customer IDs fail the
  Israeli ID check digit (owner-checked). Eight sections: Project Overview, Dynamic Memory
  Management and Data Structures, Sorting, Searching, and Function Pointers, Modular
  Architecture and System Operations, Text and Binary File Persistence, System Interaction,
  Technology & Methodology, Explore the Source Code. Copy checked against
  Car-Management-C-Project commit `d8526c3`. No code changes.
- **Pushed to `origin/portfolio-redesign` (owner-approved backup, 2026-10-31, up to
  `64b3d23`):** not a release; `main` and the live site are unchanged. The owner accepted
  that the earlier Computer Vision commit `f66c3f5`, which still contains the three
  Flickr30k photos, is now in the public branch history. The current files no longer
  contain them. Before the site is published (merge and deploy), the owner may still decide
  on a clean publishing approach (for example a fresh squashed branch); pushing further
  commits to `portfolio-redesign` as backups is fine with approval.
- `main` still serves the old hand-written site. This branch has no root `index.html`, so
  **merging before the Actions deploy exists would break the live site.**

## Roadmap

3. **Dark design system.** 3A (tokens, surfaces) and 3B (hero, editor, hierarchy) are done.
   The palette will be re-evaluated after the layout redesign.
4. **New sections.** 4A (Project Explorer) and 4B (project detail pages) are done; all ten
   projects have a page. About, Skills and Contact have been redesigned. Possible later: expanded
   About (education, hackathon, experience timeline), skills linked to projects.
5. **Project content.** Ten project pages (EasyFill, Anyone Can Cook, Computer Vision,
   Real-Time Retail Trend Detection, NLP Sentiment Analysis, CarKeep, Pacman AI, Tactical AI
   Battle, Zoo Management System, Car Management System), each with owner-approved copy and
   media in `src/assets/projects_media/<slug>/`. The first nine are reviewed and committed.
   The first eight are also pushed to `origin/portfolio-redesign` (up to `64b3d23`); Zoo
   Management System is committed locally (`1c85a5b`) but not yet pushed. Car Management
   System is implemented and owner-reviewed. More projects may follow.
   Still open per project: `role` / `team` where wanted.
6. **Polish:** accessibility (keyboard, focus, contrast), performance, Open Graph tags, favicon, 404, sitemap.
7. **Launch (with approval only):** GitHub Actions deploy workflow, switch the Pages source to
   Actions, then merge.

## Design requirements

- Professional, modern "dark tech + creative developer" look: polished but not cluttered.
- Keep the 7 animated project illustrations. The hero has no detection box (removed in 3B);
  its signature element is the interactive profile editor.
- Fonts: Inter (headings and body, self-hosted), IBM Plex Mono (code and labels).
- Fully responsive (breakpoints: 1199px for the hero, 850px, 650px), no horizontal scroll
  down to 320px.
- Respect `prefers-reduced-motion`. Pointer effects only on hover-capable devices. Content must
  stay visible without JS (`.js` class gates reveal animations).
- Real screenshots only, with descriptive alt text. Keep images small (webp, under 500 KB).
- **No em dashes (—) or en dashes (–) in any user-facing text** (owner rule): titles, copy,
  captions, alt text, labels, metadata. Use a comma, colon, period or parentheses, or reword;
  ranges use a plain hyphen ("6-13 Hz"). Code comments and internal docs are exempt.

## Open questions for the owner

- Should projects list programming languages (for example Python) in `technologies` so skills link to them?
- Role, team size, type and missing years for projects. EasyFill role and team.
