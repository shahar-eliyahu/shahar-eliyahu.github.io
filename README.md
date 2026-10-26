# shahar-eliyahu.github.io

Personal portfolio of Shahar Eliyahu, built with [Eleventy (11ty)](https://www.11ty.dev/).

Content (projects, about, skills, links) lives in plain data and Markdown files.
Eleventy turns it into a static site of plain HTML, CSS and vanilla JavaScript.
There's no framework, no database and no backend.

---

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer, which includes npm

## Local development

```bash
npm install      # first time only
npm start        # dev server with live reload at http://localhost:8080
```

Edits to anything in `src/` rebuild the site and refresh the browser automatically.

## Production build

```bash
npm run build    # clean build into _site/
```

`_site/` is the complete static website. It's generated output and isn't committed.
To preview a finished build without the dev server, serve that folder with any static server,
for example `npx serve _site`.

---

## Project structure

```
.
├── eleventy.config.js          # Eleventy setup: folders, collections, filters
├── lib/projects.js             # Project collections, lookups and content validation
├── package.json
├── src/
│   ├── index.njk               # Homepage: assembles the section partials
│   ├── Shahar_Eliyahu_CV.pdf   # Published at /Shahar_Eliyahu_CV.pdf
│   │
│   ├── _data/                  # Site-wide content (JSON)
│   │   ├── site.json           # Name, email, CV, social links, navigation
│   │   ├── home.json           # Homepage text: hero, about, section titles, contact
│   │   ├── skills.json         # Skill groups
│   │   └── projectCategories.json  # Project categories (id, label, order)
│   │
│   ├── projects/               # One Markdown file per project
│   │   ├── projects.11tydata.js     # Defaults shared by all projects
│   │   └── <slug>.md
│   │
│   ├── _includes/
│   │   ├── layouts/base.njk    # Page shell: <head>, nav, footer, scripts
│   │   └── partials/
│   │       ├── nav.njk, footer.njk
│   │       ├── components.njk  # Reusable macros: sectionTitle, button, profileButtons
│   │       ├── project/
│   │       │   ├── panel.njk   # One project preview in the Project Explorer
│   │       │   ├── gallery.njk # Screenshots / video / illustration fallback
│   │       │   └── macros.njk  # techTags, categoryList, projectActions
│   │       ├── sections/       # hero, about, projects, skills, contact
│   │       └── visuals/        # Optional animated illustration per project
│   │
│   └── assets/
│       ├── css/
│       │   ├── tokens.css      # Theme: all colors, fonts, shadows
│       │   ├── base.css        # Reset, nav, buttons, section titles, reveal
│       │   ├── sections.css    # Homepage sections
│       │   └── visuals.css     # Project illustrations
│       ├── img/projects/<slug>/  # Project images (create when needed)
│       └── js/
│           ├── main.js         # Navigation, scroll effects, reveal, active link, pointer effects
│           ├── editor.js       # Hero Java / Python / C++ editor (tabs, typing)
│           └── projects.js     # Project Explorer (filters, picker, gallery, lightbox, video)
└── _site/                      # Build output (generated, git-ignored)
```

---

## Updating content

### Personal details, links, CV

Edit `src/_data/site.json`, which holds the name, email, GitHub, LinkedIn, CV path and navigation.

To replace the CV, overwrite `src/Shahar_Eliyahu_CV.pdf` and keep the same filename,
so existing links keep working.

### Hero, About, Contact text

Edit `src/_data/home.json`. About paragraphs may contain simple HTML such as `<strong>`.

### Skills

Edit `src/_data/skills.json`. Each group has a `name` and a list of `items`.

Skills are linked to projects automatically. There's no manual mapping: a skill matches every
project whose `technologies` list contains the same name, ignoring case. For example,
`collections.projects | projectsUsing("C++")` returns Pacman AI and Tactical AI Battle. To link
a skill to a project, add the skill's exact name to that project's `technologies`.

Projects have their own section below: [Managing projects](#managing-projects).

---

## Managing projects

Each project is **one Markdown file** in `src/projects/`. The **file name is the slug**:
`easyfill.md` → slug `easyfill`, images in `src/assets/img/projects/easyfill/`, and
(once case studies exist) the page `/projects/easyfill/`. Use lowercase letters, digits and hyphens.

Everything on the site is generated from these files: the Project Explorer entries, their order,
category membership and filter counts, badges and technology lookups.
Templates never mention a specific project.

### Adding a new project

1. Create `src/projects/<slug>.md` (copy the example below and delete the fields you don't need).
2. If it has images, put them in `src/assets/img/projects/<slug>/`.
3. Run `npm start` and check the homepage. The build fails with a clear message if
   something is wrong, such as an unknown category, a missing image or missing alt text.

### Complete example

Only `title`, `summary` and `order` are required. Leave out anything you don't have yet.
Don't use empty placeholders.

```yaml
---
# --- Basics ---------------------------------------------------------------
title: EasyFill
summary: >-
  The full description of the project (kept for the detail page).
excerpt: "About two lines for the homepage card, condensed from the summary."
year: "2025–2026"
type: Final degree project            # optional badge on the card, e.g. "Hackathon"
role: >-
  What you personally did on the project.
team: 4                               # team size; omit for solo or unknown

# --- Classification -------------------------------------------------------
categories: [applications]            # ids from src/_data/projectCategories.json; several allowed
technologies: [Kotlin, Android, MediaPipe]   # all are shown, in this order

# --- Placement ------------------------------------------------------------
order: 1                              # homepage position, lower comes first
featured: true                        # optional, default false
featuredOrder: 1                      # position among featured projects

# --- Media (files in src/assets/img/projects/<slug>/) ---------------------
cover:
  src: cover.webp
  alt: EasyFill form screen with the calm-mode interface
gallery:
  - src: screen-1.webp
    alt: Distress level indicator during form filling
    caption: Optional caption
  - src: demo.gif
    alt: Voice-assisted form filling in action

# --- Links (all optional) ---------------------------------------------------
links:
  github: https://github.com/shahar-eliyahu/EasyFill
  demo: https://example.com
  video: https://www.youtube.com/watch?v=...

# --- Animated illustration (used when there is no cover image) -------------
visual:
  id: easyfill                        # partials/visuals/easyfill.njk + .easyfill-visual CSS
  label: EASYFILL
  kicker: PTSD
  headline: Adaptive Support

# --- Case study (pages are not built yet, so keep enabled: false) ----------
caseStudy:
  enabled: false
  problem: >-
    Markdown text…
  solution: …
  architecture: …
  challenges: …
  results: …
  lessons: …
---

The Markdown body is the project's detailed description. It's shown on its
future case-study page.
```

(The values above are illustrative. Real project files only contain verified information.)

### Field reference

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Display name |
| `summary` | yes | Full description (detail pages; cards fall back to it if there's no `excerpt`) |
| `excerpt` | | About two lines (under ~120 characters) shown on the card. Condense the summary; don't add new facts |
| `order` | yes | Number, lower comes first. Gaps are fine (10, 20, 30…) |
| `year` | | Text, e.g. `"2025"` or `"2025–2026"` (quote it) |
| `type` | | Free text: final degree project, course project, hackathon… Shown as a small badge on the card |
| `role` | | Your role and contributions |
| `team` | | Team size |
| `categories` | | List of category ids. A project can have several, or none |
| `technologies` | | List of technology tags, shown in this order under "Technologies" in the Project Explorer. Also links skills to projects |
| `featured`, `featuredOrder` | | Marks highlight projects (`collections.featuredProjects`). Not shown differently on the homepage right now |
| `cover` | | `{ src, alt, fit, position }`. First gallery image. `alt` is required. `fit: contain` shows the whole image (portrait phone screenshots); the default fills the frame, anchored to the top. `position` (e.g. `center`, `50% 30%`) chooses which part stays visible |
| `gallery` | | More screenshots: list of `{ src, alt, caption, fit, position }` (only `src` and `alt` required). GIFs work like any image |
| `videoPoster` | | Preview image for the video's play button (file in the project's image folder) |
| `links.github`, `links.demo`, `links.video` | | Each one shown only if present. `links.video` is a YouTube / Vimeo URL or a local `.mp4` / `.webm` (plays in the gallery); other URLs become a "Watch video" button |
| `visual` | | Animated illustration and its captions (fallback when there's no `cover`) |
| `caseStudy` | | `enabled` plus optional `problem`, `solution`, `architecture`, `challenges`, `results`, `lessons` (Markdown) |
| Markdown body | | Detailed description |

Defaults for every field live in `src/projects/projects.11tydata.js`, so a project file
only contains what is specific to that project.

### Editing, ordering, removing

- **Edit:** change the project's file. The homepage updates automatically.
- **Reorder:** change `order`. The Project Explorer list follows it (EasyFill is `order: 1`, so it comes first).
- **Remove:** delete the file and its image folder.
- **Change categories or technologies:** edit the lists in the front matter (see [Categories](#categories)).

### Screenshots and videos

The homepage **Project Explorer** shows each project's media in a gallery: a main view, thumbnails,
previous/next arrows, swipe on phones, a full-size image viewer, and an in-page video player.
Until a project has real media, its animated illustration is shown (no empty or fake thumbnails).

**Add screenshots:**

1. Put the files in `src/assets/img/projects/<slug>/`, e.g. `src/assets/img/projects/easyfill/`.
   Prefer `.webp` (or optimized `.png` / `.jpg`), at most ~1600px wide, well under 500 KB each.
2. In the project's `.md`, add a `cover` (the first image shown) and optionally more under `gallery`:

```yaml
cover:
  src: home.webp
  alt: EasyFill home screen with the form list          # required: describe what it shows
gallery:
  - src: form.webp
    alt: Form filling with the calm-mode interface
    caption: Calm mode adapts the layout to stress signals # optional, shown on the image
    fit: contain                                          # optional: show a portrait phone screenshot whole
  - src: settings.webp
    alt: Accessibility settings screen
    position: center                                      # optional: which part stays visible when cropped
```

- `fit: contain` is best for **portrait phone screenshots** and diagrams (shown whole, centred).
  The default fills the frame and keeps the **top** of the image (where app screens have their header).
- The gallery order is `cover` first, then `gallery` in the order listed.
- The build fails if a file is missing or `alt` text is absent.

**Add a video** (one per project) with `links.video`:

```yaml
links:
  video: https://www.youtube.com/watch?v=VIDEO_ID   # YouTube or Vimeo: plays inside the page
  # video: demo.mp4                                 # or a small local .mp4 / .webm in the image folder
videoPoster: video-poster.webp                       # optional preview image for the play button
```

- YouTube (`watch`, `youtu.be`, `shorts`) and Vimeo links become an in-page player
  (privacy-friendly embed, loaded only when the visitor presses Play, never autoplaying on its own).
  The video appears as the last gallery item with a ▶ thumbnail.
- Local `.mp4` / `.webm` files play natively. Keep them short and small, or use YouTube.
- Any other link (e.g. a Google Drive page) can't be embedded and becomes a "Watch video" button.

### Featured projects

All projects, including EasyFill, appear the same way in the **Project Explorer**: a list of
projects (a swipeable strip on phones and tablets) and a preview of the selected one with its
gallery, description, technologies and buttons. The category filters and their counts are
generated automatically, and the address bar keeps the current filter and project
(`?category=ai-ml&project=pacman-ai`), so a view can be shared.

`featured: true` (with optional `featuredOrder`) marks highlight projects in the data
(`collections.featuredProjects`). EasyFill is the primary one. The homepage doesn't show
featured projects differently at the moment; its "Final degree project" badge comes from `type`.

Being a graduation project is project information (`type: Final degree project`), not a category.

### Links

Add any of these under `links:`. Each one is shown only if present:
`github` (repository), `demo` (live demo), `video` (YouTube or similar).

**Project buttons in the explorer.** Both of these are intended:

- **Explore Project** opens the project's own detail page (full description, screenshots, videos,
  technical explanation). It's the main button, and appears automatically for a project once its
  detail page exists (planned for Phase 4B). Until then it's simply not shown, so there's never a
  broken link.
- **GitHub** is always available directly in the explorer, so visitors can open the repository
  without visiting the detail page. It's the main button for now, and a separate secondary
  button once Explore Project appears.

### Categories

All categories are defined in **one file**, `src/_data/projectCategories.json`:

```json
[
    { "id": "ai-ml", "label": "AI & Machine Learning" },
    { "id": "applications", "label": "Applications" }
]
```

- `id` is the permanent key that project files use (lowercase-with-hyphens). Avoid changing it.
- `label` is the text visitors see. Change it freely.
- The order of the list is the display order.

Category counts and membership are calculated automatically from the project files.
"All Projects" isn't a category. It's simply every project, so never assign it.

| I want to… | Do this |
|---|---|
| **Move a project to another category** | In the project's `.md` file, change `categories: [ai-ml]` to `categories: [applications]` |
| **Put a project in several categories** | List them all: `categories: [ai-ml, applications]` |
| **Add a new category** | Add `{ "id": "game-ai", "label": "Game AI" }` to `projectCategories.json`, then add `game-ai` to the relevant projects |
| **Rename a category** | Change its `label` only |
| **Change the display order** | Reorder the entries in `projectCategories.json` |
| **Remove a category** | Delete its entry, then remove its `id` from projects. The build lists any project still using it |

No HTML, CSS or JavaScript changes are needed for any of these. A category with no projects
is allowed (its count is 0). The build fails with a clear message if a project uses an
unknown category, or if the category file has a duplicate `id`, an invalid `id` or a missing `label`.

### Preparing a case study

1. Add the detailed description as the Markdown body.
2. Fill in whichever `caseStudy` sections you have (`problem`, `solution`, …).
3. Add `cover` and `gallery` images.
4. Leave `caseStudy.enabled: false` for now. Case-study pages (`/projects/<slug>/`) will be
   built in a later phase. Until then the build only shows a warning if it's enabled, and
   publishes no project pages.

Developer notes (template helpers, architecture) are in [CLAUDE.md](CLAUDE.md).

---

## Theme and colors

All colors are defined once, in `src/assets/css/tokens.css`:

1. **Palette:** raw color values (`--palette-blue-700`, …).
2. **Semantic colors:** roles that components use (`--color-bg`, `--color-text`,
   `--color-primary`, `--color-accent`, `--color-border`, …).
3. **Illustration colors:** scene colors for the animated project visuals (`--viz-*`).

Components only use the semantic tokens. To change the look, remap the semantic tokens
in section 2. Don't add hardcoded colors to component CSS. Transparent variants are written as
`color-mix(in srgb, var(--color-primary) 20%, transparent)`.

Fonts, shadows, layout width and easing are tokens in the same file.

---

## Deployment

The site is a GitHub Pages user site. Because the site is now generated by Eleventy, GitHub Pages
has to publish the `_site/` build output, normally through a GitHub Actions workflow, rather
than serving the repository files directly. The deployment workflow hasn't been set up yet.
