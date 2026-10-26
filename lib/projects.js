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

// Category objects for a list of category ids, in projectCategories.json order.
// {{ project.data.categories | categoryDetails }}
export function categoryDetails(ids) {
    return loadCategories().filter((c) => (ids || []).includes(c.id));
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

        if (d.visual?.id && !fs.existsSync(path.join(VISUALS_DIR, `${d.visual.id}.njk`))) {
            warnings.push(`${where}: no illustration partial for visual.id "${d.visual.id}"`);
        }

        if (d.caseStudy?.enabled) {
            warnings.push(`${where}: caseStudy.enabled is set, but case-study pages are not built yet`);
        }
    }

    warnings.forEach((w) => console.warn(`[projects] warning: ${w}`));

    if (errors.length) {
        throw new Error(`Invalid project content:\n  - ${errors.join("\n  - ")}`);
    }
}
