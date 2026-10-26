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
│   │       │   ├── row.njk     # One project on the homepage
│   │       │   ├── media.njk   # Cover image, or animated illustration fallback
│   │       │   └── macros.njk  # techTags, categoryList, projectLinks
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
│       └── js/main.js          # Navigation, scroll effects, reveal, pointer effects
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

Everything on the site is generated from these files: the homepage list, numbering,
alternating layout, category membership and counts, featured selection and technology lookups.
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
  One or two sentences shown on the homepage.
year: "2025–2026"
type: Final degree project            # free text, e.g. "Course project", "Hackathon"
role: >-
  What you personally did on the project.
team: 4                               # team size; omit for solo or unknown

# --- Classification -------------------------------------------------------
categories: [applications]            # ids from src/_data/projectCategories.json; several allowed
technologies: [Kotlin, Android, MediaPipe]

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
| `summary` | yes | Short text for the homepage and cards |
| `order` | yes | Number, lower comes first. Gaps are fine (10, 20, 30…) |
| `year` | | Text, e.g. `"2025"` or `"2025–2026"` (quote it) |
| `type` | | Free text: final degree project, course project, hackathon… |
| `role` | | Your role and contributions |
| `team` | | Team size |
| `categories` | | List of category ids. A project can have several, or none |
| `technologies` | | List of technology tags (also used to link skills to projects) |
| `featured`, `featuredOrder` | | Featured projects also stay in the normal list |
| `cover` | | `{ src, alt }`. Replaces the illustration on the homepage. `alt` is required |
| `gallery` | | List of `{ src, alt, caption }` (caption optional). GIFs work like any image |
| `links.github`, `links.demo`, `links.video` | | Each one shown only if present |
| `visual` | | Animated illustration and its captions (fallback when there's no `cover`) |
| `caseStudy` | | `enabled` plus optional `problem`, `solution`, `architecture`, `challenges`, `results`, `lessons` (Markdown) |
| Markdown body | | Detailed description |

Defaults for every field live in `src/projects/projects.11tydata.js`, so a project file
only contains what is specific to that project.

### Editing, ordering, removing

- **Edit:** change the project's file. The homepage updates automatically.
- **Reorder:** change `order`. Numbers ("PROJECT 01") and left/right alternation follow it.
- **Remove:** delete the file and its image folder.
- **Change categories or technologies:** edit the lists in the front matter (see [Categories](#categories)).

### Images and screenshots

- Put files in `src/assets/img/projects/<slug>/` and reference them **by file name only**
  (`src: cover.webp`). The site turns that into `/assets/img/projects/<slug>/cover.webp`.
- Every image needs `alt` text that describes what it shows. The build fails without it,
  and also fails if a referenced file is missing.
- Prefer `.webp` (or optimized `.png`/`.jpg`), around 1600px wide or less, and well under 500 KB each.
  Don't commit raw videos. Link to them with `links.video` (YouTube and similar).
- Without a `cover`, the project shows its animated illustration (`visual`). Without either,
  it shows its title on a plain card.

### Featured projects

To feature a project, add `featured: true` to its front matter, and optionally `featuredOrder: 2`
to set its position among featured projects. The first featured project (`featuredOrder: 1`)
is the primary one. That's EasyFill, which will get its own "Featured Graduation Project"
section in a later design phase. Featured projects still appear in the normal project list.

Being a graduation project is project information (`type: Final degree project`), not a category.

### Links

Add any of these under `links:`. Each one is shown only if present:
`github` (repository), `demo` (live demo), `video` (YouTube or similar).

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
