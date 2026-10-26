/*
 * Project content helpers: collections, lookups and build-time validation.
 *
 * Projects are the Markdown files in src/projects/. Categories are defined in
 * src/_data/projectCategories.json. Nothing here hardcodes a project or a category.
 */

import fs from "node:fs";
import path from "node:path";

const PROJECTS_GLOB = "src/projects/*.md";
const CATEGORIES_FILE = "src/_data/projectCategories.json";
const IMAGE_ROOT = "src/assets/img/projects";
const IMAGE_URL_ROOT = "/assets/img/projects";
const VISUALS_DIR = "src/_includes/partials/visuals";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function loadCategories() {
    return JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf8"));
}

const byOrder = (a, b) =>
    (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
    a.data.title.localeCompare(b.data.title);

const byFeaturedOrder = (a, b) =>
    (a.data.featuredOrder ?? Infinity) - (b.data.featuredOrder ?? Infinity) ||
    byOrder(a, b);

const isExternal = (src) => /^(https?:)?\/\//.test(src);

// "cover.webp" -> "/assets/img/projects/<slug>/cover.webp"
// Absolute paths ("/…") and full URLs are returned unchanged.
export function projectAsset(src, slug) {
    if (!src) return "";
    if (src.startsWith("/") || isExternal(src)) return src;
    return `${IMAGE_URL_ROOT}/${slug}/${src}`;
}

export const normalizeTech = (name) => String(name).trim().toLowerCase();


/* COLLECTIONS */

const sortedProjects = (collectionApi) =>
    collectionApi.getFilteredByGlob(PROJECTS_GLOB).sort(byOrder);

// The main collection. Validates every project once per build.
export function allProjects(collectionApi) {
    const projects = sortedProjects(collectionApi);
    validate(projects, loadCategories());
    return projects;
}

export function featuredProjects(collectionApi) {
    return sortedProjects(collectionApi)
        .filter((p) => p.data.featured)
        .sort(byFeaturedOrder);
}

// [{ id, label, ..., projects: [...], count }] in projectCategories.json order.
// Categories with no projects are kept (count: 0); UIs decide whether to show them.
// "All projects" is not a category: it's simply collections.projects.
export function projectCategories(collectionApi) {
    const projects = sortedProjects(collectionApi);

    return loadCategories().map((category) => {
        const members = projects.filter((p) => p.data.categories.includes(category.id));
        return { ...category, projects: members, count: members.length };
    });
}

// { "pytorch": { name: "PyTorch", projects: [...] }, ... } built from project tags
export function projectTechnologies(collectionApi) {
    const index = {};

    for (const project of sortedProjects(collectionApi)) {
        for (const tech of project.data.technologies) {
            const key = normalizeTech(tech);
            index[key] ??= { name: tech, projects: [] };
            index[key].projects.push(project);
        }
    }
    return index;
}


/* FILTERS */

// Projects tagged with a technology, matched case-insensitively.
// {{ collections.projects | projectsUsing("PyTorch") }}
export function projectsUsing(projects, tech) {
    const key = normalizeTech(tech);
    return (projects || []).filter((p) =>
        p.data.technologies.some((t) => normalizeTech(t) === key)
    );
}

// Categories that have projects in the given list, with counts, in config order.
// Empty categories are left out, so filter UIs never show a dead button.
// {{ galleryProjects | categoryCounts }}
export function categoryCounts(projects) {
    return loadCategories()
        .map((category) => ({
            ...category,
            count: (projects || []).filter((p) => p.data.categories.includes(category.id)).length,
        }))
        .filter((category) => category.count > 0);
}

// Category objects for a list of category ids, in projectCategories.json order.
// {{ project.data.categories | categoryDetails }}
export function categoryDetails(ids) {
    return loadCategories().filter((c) => (ids || []).includes(c.id));
}


/* MEDIA
 * One ordered media list per project for the explorer gallery, built from
 * existing front matter: `cover`, `gallery`, `links.video` (+ optional
 * `videoPoster`). Nothing is invented: with no real media the list holds a
 * single illustration item. */

const VIDEO_FILE = /\.(mp4|webm)$/i;

// Classify links.video: YouTube / Vimeo embed, local file, or external link
export function projectVideo(project) {
    const d = project.data;
    const url = d.links?.video;

    if (!url) {
        return null;
    }

    const title = `${d.title} video`;
    const poster = d.videoPoster ? projectAsset(d.videoPoster, d.slug) : "";
    let m;

    if ((m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/))) {
        return { provider: "youtube", url, title, poster,
            embed: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0` };
    }

    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) {
        return { provider: "vimeo", url, title, poster,
            embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1` };
    }

    if (!isExternal(url) && VIDEO_FILE.test(url)) {
        const src = projectAsset(url, d.slug);
        return { provider: "file", url: src, src, title, poster };
    }

    return { provider: "external", url, title, poster };
}

// [{ kind: "image" | "video" | "illustration", ... }] in display order
export function projectMedia(project) {
    const d = project.data;
    const items = [];
    const seen = new Set();

    const addImage = (img) => {
        if (!img?.src || seen.has(img.src)) {
            return;
        }
        seen.add(img.src);
        items.push({
            kind: "image",
            src: projectAsset(img.src, d.slug),
            alt: img.alt,
            caption: img.caption || "",
            fit: img.fit === "contain" ? "contain" : "cover",
            position: img.position || "",
        });
    };

    addImage(d.cover);
    (d.gallery || []).forEach(addImage);

    if (!items.length) {
        items.push({ kind: "illustration" });
    }

    const video = projectVideo(project);

    if (video && video.provider !== "external") {
        items.push({ kind: "video", ...video });
    }

    return items;
}


/* DETAIL PAGES */

// The collection entry for a page URL (the detail page's own project)
export function findProject(projects, url) {
    return (projects || []).find((p) => p.url === url) || null;
}

// Previous / next among projects that have a detail page, in explorer order.
// {% set nav = collections.projects | projectNeighbors(page.url) %}
export function projectNeighbors(projects, url) {
    const published = (projects || []).filter((p) => p.url);
    const index = published.findIndex((p) => p.url === url);

    if (index < 0) {
        return { prev: null, next: null };
    }

    return {
        prev: published[index - 1] || null,
        next: published[index + 1] || null,
    };
}


/* VALIDATION
 * Fails the build on content errors so mistakes never reach the site. */

function validate(projects, categories) {
    const errors = [];
    const warnings = [];
    const categoryIds = new Set(categories.map((c) => c.id));
    const orders = new Map();

    const seenIds = new Set();
    categories.forEach((category, i) => {
        const where = `${CATEGORIES_FILE} [${i}]`;
        if (!SLUG_PATTERN.test(category.id ?? "")) {
            errors.push(`${where}: \`id\` must be lowercase-with-hyphens, got "${category.id}"`);
        }
        if (!category.label) errors.push(`${where}: missing \`label\``);
        if (seenIds.has(category.id)) errors.push(`${where}: duplicate id "${category.id}"`);
        seenIds.add(category.id);
    });

    for (const project of projects) {
        const d = project.data;
        const where = path.relative(".", project.inputPath);
        const fail = (msg) => errors.push(`${where}: ${msg}`);

        if (!d.title) fail("missing `title`");
        if (!d.summary) fail("missing `summary`");
        if (d.excerpt && d.excerpt.length > 120) {
            warnings.push(`${where}: \`excerpt\` is ${d.excerpt.length} characters; aim for about 2 lines (under 120)`);
        }
        if (!SLUG_PATTERN.test(d.slug)) {
            fail(`file name must be lowercase-with-hyphens (it becomes the slug), got "${d.slug}"`);
        }

        if (typeof d.order !== "number") {
            fail("`order` must be a number");
        } else if (orders.has(d.order)) {
            warnings.push(`${where}: same \`order\` (${d.order}) as ${orders.get(d.order)}`);
        } else {
            orders.set(d.order, where);
        }

        if (!Array.isArray(d.categories)) fail("`categories` must be a list");
        for (const id of d.categories || []) {
            if (!categoryIds.has(id)) {
                fail(`unknown category "${id}" (defined: ${[...categoryIds].join(", ")})`);
            }
        }

        if (!Array.isArray(d.technologies)) fail("`technologies` must be a list");

        if (d.featured && d.featuredOrder != null && typeof d.featuredOrder !== "number") {
            fail("`featuredOrder` must be a number");
        }

        const images = [
            ...(d.cover?.src ? [["cover", d.cover]] : []),
            ...(d.gallery || []).map((img, i) => [`gallery[${i}]`, img]),
        ];
        for (const [field, img] of images) {
            if (!img.src) fail(`${field}: missing \`src\``);
            if (!img.alt) fail(`${field}: missing \`alt\` text`);
            if (img.src && !img.src.startsWith("/") && !isExternal(img.src)) {
                const file = path.join(IMAGE_ROOT, d.slug, img.src);
                if (!fs.existsSync(file)) fail(`${field}: image not found at ${file}`);
            }
        }

        if (d.cover?.position && !/^[a-z0-9%.\s-]+$/i.test(d.cover.position)) {
            fail('`cover.position` must be a CSS object-position such as "center" or "50% 20%"');
        }

        if (d.cover?.fit && !["cover", "contain"].includes(d.cover.fit)) {
            fail('`cover.fit` must be "cover" or "contain"');
        }

        for (const [i, img] of (d.gallery || []).entries()) {
            if (img.fit && !["cover", "contain"].includes(img.fit)) {
                fail(`gallery[${i}]: \`fit\` must be "cover" or "contain"`);
            }
        }

        const localFiles = [
            ["videoPoster", d.videoPoster],
            ["links.video", d.links?.video && !isExternal(d.links.video) ? d.links.video : ""],
        ];
        for (const [field, file] of localFiles) {
            if (file && !file.startsWith("/") && !fs.existsSync(path.join(IMAGE_ROOT, d.slug, file))) {
                fail(`${field}: file not found at ${path.join(IMAGE_ROOT, d.slug, file)}`);
            }
        }
        if (d.links?.video && !isExternal(d.links.video) && !VIDEO_FILE.test(d.links.video)) {
            fail("`links.video` must be a URL or a local .mp4 / .webm file");
        }

        if (d.visual?.id && !fs.existsSync(path.join(VISUALS_DIR, `${d.visual.id}.njk`))) {
            warnings.push(`${where}: no illustration partial for visual.id "${d.visual.id}"`);
        }

        if (d.detailPage !== undefined && typeof d.detailPage !== "boolean") {
            fail("`detailPage` must be true or false");
        }

        const cs = d.caseStudy || {};
        if ("enabled" in cs) {
            fail("`caseStudy.enabled` was replaced by `detailPage: true`");
        }
        for (const key of ["features", "challenges"]) {
            if (cs[key] !== undefined && !Array.isArray(cs[key])) {
                fail(`\`caseStudy.${key}\` must be a list`);
            }
        }
        (cs.challenges || []).forEach((item, i) => {
            if (!item?.challenge || !item?.solution) {
                fail(`caseStudy.challenges[${i}]: needs both \`challenge\` and \`solution\``);
            }
        });
        for (const key of ["architecture", "results", "lessons"]) {
            if (cs[key] !== undefined && typeof cs[key] !== "string") {
                fail(`\`caseStudy.${key}\` must be Markdown text`);
            }
        }
    }

    warnings.forEach((w) => console.warn(`[projects] warning: ${w}`));

    if (errors.length) {
        throw new Error(`Invalid project content:\n  - ${errors.join("\n  - ")}`);
    }
}
