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
│   │   ├── skills.json         # Skill categories: featured + more
│   │   ├── skillLogos.json     # Skill name → logo file
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
│   │       │   ├── gallery.njk # Screenshots / video / illustration fallback (also image strips)
│   │       │   ├── case-media.njk # Media of one detail-page section (uses gallery.njk)
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
│       ├── projects_media/<slug>/  # Project media: images/ and videos/ (create when needed)
│       └── js/
│           ├── main.js         # Navigation, scroll effects, reveal, active link, pointer effects
│           ├── editor.js       # Hero Java / Python / C++ editor (tabs, typing)
│           ├── gallery.js      # Shared gallery, lightbox and video (explorer and detail pages)
│           └── projects.js     # Project Explorer (filters, picker tabs)
└── _site/                      # Build output (generated, git-ignored)
```

---

## Updating content

### Personal details, links, CV

Edit `src/_data/site.json`, which holds the name, email, GitHub, LinkedIn, CV path and navigation.

To replace the CV, overwrite `src/Shahar_Eliyahu_CV.pdf` and keep the same filename,
so existing links keep working.

### Hero, About, Contact text

Edit `src/_data/home.json`. About is text only: its `paragraphs` may contain simple HTML such as
`<strong>`, and the first paragraph is shown as a slightly larger introduction. The last word of
the contact `title` is highlighted automatically.

### Skills

Edit `src/_data/skills.json`. Each category is one row on the page:

```json
{
    "name": "Data & Processing",
    "featured": ["Pandas", "NumPy", "Apache Spark", "Apache Kafka"],
    "more": ["Spark Structured Streaming", "EDA", "Data Cleaning"]
}
```

- `featured`: 5 recognisable technologies (ideally ones with a logo), always visible, in this
  order. Keep concepts such as OOP or Data Cleaning in `more`.
- `more`: everything else, revealed by the category's "Show more" button ("Show less" when
  open). Use `[]` when there's nothing more; no button is shown then.
- To add a skill, add its name to one of the two lists. To feature a different one, move names
  between the lists, or between categories. Categories appear in the file's order.
- The five categories are deliberately broad (Programming Languages, AI & Machine Learning, Data &
  Processing, Platforms & Systems, Development Tools): put a new skill where its main use fits
  rather than adding a category. A new category is just another `{ name, featured, more }`.
- Each skill may appear only once in the whole file; the build stops with a message otherwise.

**Logos.** `src/_data/skillLogos.json` maps a skill's exact name to a logo file in
`src/assets/img/skills/` (`"Python": "python"` → `python.svg`). Skills without an entry are shown
as text, which is right for concepts (OOP, Fine-tuning, …). To add a logo, take the official SVG
from [devicon](https://devicon.dev) (MIT) or [Simple Icons](https://simpleicons.org) (CC0), save
it as `src/assets/img/skills/<id>.svg`, add the mapping, and note it in `CREDITS.txt`. Check it on
the dark background: black or navy parts need the brand's light (dark-mode) variant. The build
stops if a mapped file is missing or a mapping names an unknown skill.

Skills are linked to projects automatically. There's no manual mapping: a skill matches every
project whose `technologies` list contains the same name, ignoring case. For example,
`collections.projects | projectsUsing("C++")` returns Pacman AI and Tactical AI Battle. To link
a skill to a project, add the skill's exact name to that project's `technologies`.

Projects have their own guide below: [Adding a New Project](#adding-a-new-project).

---

## Adding a New Project

Every project is **one Markdown file** in `src/projects/`. You never write HTML for a project.
The site builds everything from that file: the entry in the Project Explorer, its category and
filter counts, its gallery, its buttons and (optionally) its own detail page.

### Step 1: Create the file

Create `src/projects/<slug>.md`. The **file name is the project's slug**. Use lowercase letters,
digits and hyphens only (e.g. `face-recognition-app.md`). The slug is used for:

- the media folder: `src/assets/projects_media/<slug>/` (`images/` and `videos/`)
- the detail page address: `/projects/<slug>/` (only if you enable it)
- explorer links: `/?project=<slug>`

The easiest start is to copy the [complete example](#complete-example) below and delete what you
don't need.

### Step 2: Fill in the basics

Only three fields are required: **`title`**, **`summary`** and **`order`**. Everything else is
optional. Leave out what you don't have (no empty placeholders).

| What | Field | Notes |
|---|---|---|
| Title | `title` | The project name |
| Subtitle | `subtitle` | A short tagline under the title (explorer and detail page) |
| Summary | `summary` | 2–4 sentences. Introduction on the detail page; fallback text in the explorer |
| Short description | `excerpt` | About two lines (under ~120 characters) for the explorer. The build warns if it's longer |
| Year | `year` | Text in quotes, e.g. `"2026"` or `"2025–2026"` |
| Badge | `type` | e.g. `Final degree project`, `Course project`, `Hackathon`. Shown as a small badge |
| Categories | `categories` | A list of category ids: `[ai-ml]`, `[applications]` or both |
| Technologies | `technologies` | A list, shown in this order (all of them) |
| GitHub | `links.github` | The repository URL. Always shown as a direct button |
| Position | `order` | A number; lower comes first (see [Order and numbering](#order-and-numbering)) |

**Categories and filters.** The available ids are defined in `src/_data/projectCategories.json`
(currently `ai-ml` and `applications`). The explorer's filter buttons and their counts are
generated automatically. A new project appears under every category it lists, and the build
fails if you use an id that doesn't exist. To add a new category, see [Categories](#categories).

### Step 3: Add screenshots and a video (optional)

1. Put images in `src/assets/projects_media/<slug>/images/` and videos in
   `src/assets/projects_media/<slug>/videos/` (images: `.webp`, `.png`, `.jpg` or `.gif`, at most
   ~2000px tall, well under 500 KB each; videos: short `.mp4` / `.webm`, 720p, a few MB).
   Everything in these folders is published, so keep only files meant for the site there.
2. Reference them by **file name only**:
   - `cover`: the first image shown (`src` and `alt` are required).
   - `gallery`: more screenshots (each needs `src` and `alt`; `caption`, `fit` and `position` are optional).
   - `fit: contain` shows a **portrait phone screenshot** whole instead of cropping it. When
     *every* image is a portrait screenshot (taller than wide, detected automatically), the explorer
     shows them in a tall column beside the text.
3. For a video, set `links.video` to a **YouTube or Vimeo URL** (plays inside the page after the
   visitor presses Play) or to a small local **`.mp4` / `.webm`** file in the `videos/` folder.
   `videoPoster` is an optional preview image. Any other video URL becomes a "Watch video" button.

Without any images, the explorer shows the project's animated illustration (`visual`), or a
plain panel with the title if it has none. Creating a new animated illustration is optional and
needs a small partial in `src/_includes/partials/visuals/<id>.njk` plus styles in
`src/assets/css/visuals.css`. A project works fine without one.

### Step 4: Write the detailed content (optional)

Long-form content is shown on the project's **detail page**:

- **Overview:** the Markdown body *below* the closing `---`. Use `###` for subheadings, because
  the page already provides the "Overview" heading.
- **`caseStudy`** (each part optional; empty parts are simply not shown):
  - `features`: a list of short points (Key features)
  - `architecture`: Markdown text (Architecture & implementation)
  - `challenges`: a list of `challenge` / `solution` pairs (Challenges & solutions)
  - `results`: Markdown text (Results & evaluation)
  - `lessons`: Markdown text (Lessons learned)
  - `sections`: your own sections with their own titles and media (see
    [Custom sections](#custom-sections)). Use them when the fixed sections above don't fit.
- **`role`** and **`team`** fill the "At a glance" box.

Write only real, verified information. The page has no fixed minimum: a project with only a few
features and a results sentence is fine.

### Step 5: Turn on the detail page (optional)

Add **`detailPage: true`**. The next build then automatically:

- creates the page **`/projects/<slug>/`** from the shared template (no new HTML or template);
- shows an **Explore Project** button for this project in the explorer (as the main button);
- keeps the **GitHub** button as a separate, direct link;
- adds "Back to Projects", an "On this page" list (with 3 or more sections) and Previous / Next
  links between projects that have pages.

**Adding a project without a detail page yet:** leave out `detailPage` (it defaults to `false`).
The project still appears in the explorer with its gallery, technologies and **View on GitHub**
button, and no Explore Project button is shown (so there are no broken links). Add
`detailPage: true` later, once the content is ready.

### Step 6: Preview, build and check

```bash
npm start         # live preview at http://localhost:8080
npm run build     # production build into _site/ (also validates every project file)
```

- Open `http://localhost:8080/?project=<slug>#projects` to see the project selected in the
  explorer, and `http://localhost:8080/projects/<slug>/` for its detail page (if enabled).
- **`npm run build` is the automated check.** It fails with a message naming the file and field
  if something is wrong: missing `title` / `summary`, a non-numeric `order`, an invalid file name,
  an unknown category, a missing image or `alt` text, an invalid `fit`, a `challenges` entry
  without a `solution`, and so on. The repository has no separate test suite.
- Then check by hand, at a desktop width and a phone width (your browser's device toolbar, e.g.
  1440px and 390px):
  - the project appears in the right filters with the right count;
  - the GitHub (and demo) links open the right pages;
  - images aren't badly cropped (use `fit: contain` or `position` if they are);
  - the video plays, if there is one;
  - the detail page shows the sections you wrote and no empty ones.

### Order and numbering

- Projects appear in the explorer sorted by `order` (lowest first). Gaps are fine (10, 20, 30 lets
  you insert later). If two projects share an `order`, the build warns and sorts them by title.
- The numbers next to project names (01, 02, …) are **not stored anywhere**. They are the
  position in the currently visible list and renumber automatically when a filter is applied.
- Previous / Next on detail pages follows the same order, counting only projects that have a page.

### Complete example

A copyable file using every supported field. Save it as `src/projects/<slug>.md`, replace the
values, and **delete every line you don't have real content for**. The image and video files
must exist in `src/assets/projects_media/<slug>/images/` (videos in `.../videos/`), or the build stops and tells you which one is
missing.

```markdown
---
title: My New Project
subtitle: A short tagline under the title
summary: >-
  Two to four sentences describing what the project does and why. This is the
  introduction at the top of the detail page.
excerpt: "About two lines for the Project Explorer, under ~120 characters."
year: "2026"
type: Course project
role: >-
  What you personally built or were responsible for.
team: 3
categories: [ai-ml]
technologies: [Python, PyTorch, Docker]
order: 80

cover:
  src: cover.webp
  alt: Main screen of My New Project showing the results dashboard
gallery:
  - src: settings.webp
    alt: Settings screen with the model options
    caption: Optional caption shown on the image
  - src: phone.webp
    alt: The mobile view on a phone
    fit: contain

links:
  github: https://github.com/shahar-eliyahu/my-new-project
  demo: https://example.com/my-new-project
  video: https://www.youtube.com/watch?v=VIDEO_ID
videoPoster: video-poster.webp

detailPage: true
caseStudy:
  features:
    - First key feature, in one short sentence
    - Second key feature
  architecture: >-
    How the system is built: main components, data flow and important
    technical decisions. **Markdown** works here.
  challenges:
    - challenge: A real problem you ran into
      solution: How you solved it
  results: >-
    What the project achieved and how it was evaluated.
  lessons: >-
    What you learned.
  # Custom sections (optional): see "Custom sections" below
  sections:
    - id: demos
      title: Demonstrations
      text: One or two sentences introducing the videos.
      items:
        - title: First demo
          text: What this video shows.
          media:
            - video: first-demo.mp4
              title: First demo
---

The Overview: a few paragraphs of plain Markdown about the motivation
and what the project does.

### A subheading inside the overview

More text, lists, [links](https://example.com) and `inline code` all work.
```

The full list of fields with every option is in the [field reference](#field-reference) below.

---

## Managing projects

These sections are the detailed reference for the steps above.

### Field reference

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Display name |
| `subtitle` | | Short tagline under the title in the explorer and on the detail page |
| `summary` | yes | Full description (detail-page introduction, unless the page uses `caseStudy.sections`; the explorer shows it if there's no `excerpt`) |
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
| `videoPoster` | | Preview image for the video's play button (file in the project's `images/` folder) |
| `links.github`, `links.demo`, `links.video` | | Each one shown only if present. `links.video` is a YouTube / Vimeo URL or a local `.mp4` / `.webm` in `videos/` (plays in the gallery); other URLs become a "Watch video" button |
| `visual` | | Animated illustration and its captions (fallback when there's no `cover`) |
| `detailPage` | | `true` publishes the project's own page at `/projects/<slug>/` and shows "Explore Project" in the explorer. Default `false` |
| `caseStudy` | | Detail-page sections, all optional: `features` (list), `architecture` (Markdown), `challenges` (list of `{ challenge, solution }`), `results` (Markdown), `lessons` (Markdown), `sections` (custom sections, see [Custom sections](#custom-sections)) |
| Markdown body | | The detail page's Overview (plain Markdown) |

Defaults for every field live in `src/projects/projects.11tydata.js`, so a project file
only contains what is specific to that project.

### Editing, ordering, removing

- **Edit:** change the project's file. The homepage updates automatically.
- **Reorder:** change `order`. The Project Explorer list follows it (EasyFill is `order: 1`, so it comes first).
- **Remove:** delete the file and its media folder.
- **Change categories or technologies:** edit the lists in the front matter (see [Categories](#categories)).

### Screenshots and videos

The homepage **Project Explorer** shows each project's media in a gallery: a main view, thumbnails,
previous/next arrows, swipe on phones, a full-size image viewer, and an in-page video player.
Until a project has real media, its animated illustration is shown (no empty or fake thumbnails).

**Add screenshots:**

1. Put the files in `src/assets/projects_media/<slug>/images/`, e.g. `src/assets/projects_media/easyfill/images/`.
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
  # video: demo.mp4                                 # or a small local .mp4 / .webm in videos/
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
  technical explanation). It's the main button, and appears automatically for every project with
  `detailPage: true` (currently all seven). Without a detail page it's simply not shown, so
  there's never a broken link.
- **GitHub** is always available directly in the explorer, so visitors can open the repository
  without visiting the detail page. It's a separate secondary button next to Explore Project, or
  the main button for a project without a detail page.

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

### Project detail pages

Every project can have its own page at `/projects/<slug>/`, generated from its Markdown file by
one shared template. You never create HTML pages by hand. **All seven current projects have
one.** A project with only a summary (no Overview or `caseStudy` yet) gets a compact page with its
introduction, illustration, technologies and links; it grows automatically as you add sections.

**To give a project its page:**

1. Add `detailPage: true` to its front matter.
2. Write whatever real content you have:
   - **Overview:** the Markdown body below the front matter (headings, lists and links work).
   - **Key features:** `caseStudy.features`, a list.
   - **Architecture & implementation:** `caseStudy.architecture`, Markdown text.
   - **Challenges & solutions:** `caseStudy.challenges`, a list of `challenge` / `solution` pairs.
   - **Results & evaluation:** `caseStudy.results`. **Lessons learned:** `caseStudy.lessons`.
   - **At a glance:** `role` and `team`.
3. Add screenshots or a video as described above. They appear in the page's gallery.

For a richer page with media inside the sections, use [custom sections](#custom-sections) instead.

Then the site automatically:

- builds `/projects/<slug>/` with your title, category, year, badges, introduction (`summary`),
  technologies, gallery and links;
- shows only the sections you filled in, plus an "On this page" list once there are 3 or more;
- turns on the **Explore Project** button in the explorer (GitHub stays as a separate button);
- links Previous / Next between projects that have pages, and "Back to Projects" to the explorer
  with that project selected.

The build fails with a clear message if a section has the wrong shape (for example a challenge
without a solution).

### Custom sections

`caseStudy.sections` is an ordered list of sections, each with its own heading and media. It's for
pages that need screenshots or videos *inside* the sections (EasyFill is the example). Each
section can have any of these parts, shown in this order:

```yaml
caseStudy:
  sections:
    - id: features                 # required: lowercase-with-hyphens, becomes the #anchor
      title: Key Features          # required: the section heading
      text: |-                     # Markdown: paragraphs, lists, tables (see below)
        One or two short paragraphs.
      media:                       # images (a strip, each opens the viewer) or videos, not both
        - src: screen.jpg          # a file in images/, `alt` required
          alt: What the screen shows
          caption: Shown under the image and in the viewer   # optional
      note: Small print after the media (sources, caveats).   # optional, Markdown
      items:                       # sub-sections: a feature, a demo…
        - title: A feature
          text: What it does.
          media:                   # portrait images: beside the text; others: below it; a video: a card
            - src: step-1.jpg
              alt: First step
            - src: step-2.jpg
              alt: Second step
          note: Optional small print after this item's media.
        - title: A demo
          media:
            - video: demo.mp4      # a file in videos/, or a YouTube / Vimeo URL
              title: Demo of the feature   # names the play button for screen readers
              poster: demo-poster.webp     # optional: a frame of the video (in images/), shown before Play
      tools:                       # technology + what it was used for
        - name: Kotlin
          use: Android application development.
      links:                       # secondary buttons
        - label: View Evaluation Repository on GitHub
          url: https://github.com/…
```

- **Images** keep their own shape (nothing is cropped) and open the full-size viewer. Portrait
  screenshots sit beside the text when there's room; other images (charts, diagrams, photos) go
  below it. Several images that aren't all portrait form a row of equal height (each as wide as
  its shape allows), which stacks one per line on phones. A `caption` sits under its image.
  A single image inside an item is at most about 34rem (544px) tall, so a square screenshot
  doesn't take over its block.
- **Tables:** write a normal Markdown table in `text` (`|---:|` right-aligns a numeric column).
  It gets the site's table style, and on narrow screens it scrolls sideways inside its own box
  (keyboard-focusable) with the first column kept in view, so the page never scrolls sideways.
- **`note`:** optional small print after the media of a section or item: a source credit, a
  caveat about how results compare. Keep it to one or two sentences.
- **Videos** are cards of one size, so landscape and portrait videos line up (shown whole, never
  cropped). Nothing loads until the visitor presses Play; the player has the normal controls and
  fullscreen. Two video items sit side by side when there's room. Cards show only the Play button
  (no separate "Open video in a new tab" link).
- **A main video** (a video in a section's own `media`, not in an item) gets a single framed
  player shaped like the video, taken from its `poster` (16:9 without one), at most about 34rem
  tall and full width on phones. Pacman AI is the example.
- **Video thumbnails** (`poster`, optional): a real frame from the video, saved as a small `.webp`
  in `images/`. It's shown whole in the card, letterboxed like the video itself, with the Play
  button on top. Without one, the project's illustration is shown instead. Take the frame from the
  published (already redacted) video and check it for personal information. `videoPoster` does
  the same for `links.video` in the explorer gallery.
- With custom sections, the page's media come from the sections: the gallery under the header and
  the `summary` introduction are left out (the explorer still uses `cover`, `gallery` and
  `summary`). A section with `tools` replaces the side "Technologies" box.
- The Markdown body still works and comes first, as "Overview"; don't also add a section for it.
- The build fails on a missing `id` / `title`, a duplicate `id`, a missing file or `alt` text, a list
  mixing images and videos, a `text` / `note` that isn't text, or a link without `label` / `url`.

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
