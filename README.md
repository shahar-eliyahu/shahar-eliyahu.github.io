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
├── package.json
├── src/
│   ├── index.njk               # Homepage: assembles the section partials
│   ├── Shahar_Eliyahu_CV.pdf   # Published at /Shahar_Eliyahu_CV.pdf
│   │
│   ├── _data/                  # Site-wide content (JSON)
│   │   ├── site.json           # Name, email, CV, social links, navigation
│   │   ├── home.json           # Homepage text: hero, about, section titles, contact
│   │   └── skills.json         # Skill groups
│   │
│   ├── projects/               # One Markdown file per project
│   │   ├── projects.11tydata.json   # Shared settings for all projects
│   │   └── *.md
│   │
│   ├── _includes/
│   │   ├── layouts/base.njk    # Page shell: <head>, nav, footer, scripts
│   │   └── partials/
│   │       ├── nav.njk, footer.njk
│   │       ├── components.njk  # Reusable macros: sectionTitle, button, profileButtons
│   │       ├── project-row.njk # How one project is displayed
│   │       ├── sections/       # hero, about, projects, skills, contact
│   │       └── visuals/        # Optional animated illustration per project
│   │
│   └── assets/
│       ├── css/
│       │   ├── tokens.css      # Theme: all colors, fonts, shadows
│       │   ├── base.css        # Reset, nav, buttons, section titles, reveal
│       │   ├── sections.css    # Homepage sections
│       │   └── visuals.css     # Project illustrations
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

### Projects

Each project is one file in `src/projects/`. To **add a project**, create a new `.md` file:

```yaml
---
title: My Project
order: 8                  # position on the homepage (lower = earlier)
summary: >-
  One or two sentences describing the project.
tech: [Python, PyTorch, Docker]
links:
  github: https://github.com/shahar-eliyahu/my-project
visual:
  id: myproject           # CSS class "myproject-visual" + optional partial visuals/myproject.njk
  label: MACHINE LEARNING # small caption in the top-left of the visual
  kicker: PYTORCH         # small text above the headline
  headline: Image Classifier
---
```

The homepage handles the rest. Project numbers ("PROJECT 08") and the alternating
left/right layout are assigned automatically from `order`.

- **Edit** a project by changing its file.
- **Reorder** projects by changing `order`.
- **Remove** a project by deleting its file.
- **Animated illustration (optional):** add markup in `src/_includes/partials/visuals/<id>.njk`
  and styles under a `.<id>-visual` block in `src/assets/css/visuals.css`. If there's no
  partial, the card shows just the label and headline.

The Markdown body below the `---` is reserved for future case-study pages.

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
