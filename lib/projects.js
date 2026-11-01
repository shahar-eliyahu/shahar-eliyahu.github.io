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
// Project media: src/assets/projects_media/<slug>/images/ and .../videos/
const MEDIA_ROOT = "src/assets/projects_media";
const MEDIA_URL_ROOT = "/assets/projects_media";
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

// "cover.webp" -> "/assets/projects_media/<slug>/images/cover.webp"
// (kind "videos" for video files). File names are URL-encoded, so names with
// spaces work. Absolute paths ("/…") and full URLs are returned unchanged.
export function projectAsset(src, slug, kind = "images") {
    if (!src) return "";
    if (src.startsWith("/") || isExternal(src)) return src;
    const file = src.split("/").map(encodeURIComponent).join("/");
    return `${MEDIA_URL_ROOT}/${slug}/${kind}/${file}`;
}

// The file on disk for a project-relative media path
const mediaFile = (src, slug, kind = "images") => path.join(MEDIA_ROOT, slug, kind, src);

// A project's cover as a social preview image, or null when it wouldn't suit a
// wide link card (portrait screenshots would be cropped to a thin slice).
const SOCIAL_MIN_RATIO = 1.3;

export function socialImage(cover, slug) {
    if (!cover?.src || !slug || cover.src.startsWith("/") || isExternal(cover.src)) return null;
    const size = imageSize(mediaFile(cover.src, slug));
    if (!size || size.width / size.height < SOCIAL_MIN_RATIO) return null;
    return { url: projectAsset(cover.src, slug), alt: cover.alt, ...size };
}

// Intrinsic { width, height } of a local PNG, JPEG, GIF or WebP, read from
// its header (no dependency). null for other formats or unreadable files.
const imageSizes = new Map();

export function imageSize(file) {
    if (imageSizes.has(file)) {
        return imageSizes.get(file);
    }

    let size = null;

    try {
        const b = fs.readFileSync(file);

        if (b.toString("ascii", 1, 4) === "PNG") {
            size = { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
        } else if (b.toString("ascii", 0, 3) === "GIF") {
            size = { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
        } else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
            const chunk = b.toString("ascii", 12, 16);
            if (chunk === "VP8X") {
                size = { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
            } else if (chunk === "VP8L") {
                const bits = b.readUInt32LE(21);
                size = { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
            } else if (chunk === "VP8 ") {
                size = { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
            }
        } else if (b[0] === 0xff && b[1] === 0xd8) {
            // JPEG: walk the segments to the first start-of-frame marker
            for (let i = 2; i + 9 < b.length;) {
                if (b[i] !== 0xff) { i++; continue; }
                const marker = b[i + 1];
                if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
                    size = { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
                    break;
                }
                i += 2 + b.readUInt16BE(i + 2);
            }
        }
    } catch {
        size = null;
    }

    imageSizes.set(file, size);
    return size;
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

    if (!d.links?.video) {
        return null;
    }

    return classifyVideo(d.links.video, d.slug, `${d.title} video`, d.videoPoster);
}

// A video URL or local file name (in videos/) -> gallery video item fields
function classifyVideo(url, slug, title, posterSrc) {
    const poster = posterSrc ? projectAsset(posterSrc, slug) : "";
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
        const src = projectAsset(url, slug, "videos");
        return { provider: "file", url: src, src, title, poster };
    }

    return { provider: "external", url, title, poster };
}

// { src, alt, caption, fit, position } -> gallery image item, with the
// intrinsic size (width / height attributes, portrait detection)
function imageItem(img, slug) {
    const local = !img.src.startsWith("/") && !isExternal(img.src);
    const size = local ? imageSize(mediaFile(img.src, slug)) : null;

    return {
        kind: "image",
        src: projectAsset(img.src, slug),
        alt: img.alt,
        caption: img.caption || "",
        fit: img.fit === "contain" ? "contain" : "cover",
        position: img.position || "",
        width: size?.width || "",
        height: size?.height || "",
        portrait: Boolean(size && size.height > size.width * 1.2),
    };
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
        items.push(imageItem(img, d.slug));
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

// Media of one case-study section (or section item) as gallery items:
// images `{ src, alt, … }` and videos `{ video, title, poster }`.
// {{ section.media | sectionMedia(project) }}
export function sectionMedia(media, project) {
    const d = project.data;

    return (media || []).map((entry) => {
        if (!entry.video) {
            return imageItem(entry, d.slug);
        }

        // A poster is a frame of the video, so its size gives the video's shape
        const local = entry.poster && !entry.poster.startsWith("/") && !isExternal(entry.poster);
        const size = local ? imageSize(mediaFile(entry.poster, d.slug)) : null;

        return {
            kind: "video",
            ...classifyVideo(entry.video, d.slug, entry.title || `${d.title} video`, entry.poster),
            width: size?.width || "",
            height: size?.height || "",
        };
    });
}

// True when every item is a portrait image (phone screenshots): galleries
// then use a taller stage and the explorer puts the media beside the text.
export function mediaIsPortrait(items) {
    return Boolean(items?.length) && items.every((item) => item.kind === "image" && item.portrait);
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
            checkImage(img, field, d.slug, fail);
        }

        if (d.subtitle !== undefined && typeof d.subtitle !== "string") {
            fail("`subtitle` must be text");
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

        checkLocalFile(d.videoPoster, "videoPoster", d.slug, "images", fail);
        checkVideo(d.links?.video, "links.video", d.slug, fail);

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
        if (cs.sections !== undefined) {
            validateSections(cs, d.slug, fail);
        }
    }

    warnings.forEach((w) => console.warn(`[projects] warning: ${w}`));

    if (errors.length) {
        throw new Error(`Invalid project content:\n  - ${errors.join("\n  - ")}`);
    }
}

// A project-relative file (not "/…" or a URL) must exist in its media folder
function checkLocalFile(src, field, slug, kind, fail) {
    if (src && !src.startsWith("/") && !isExternal(src) && !fs.existsSync(mediaFile(src, slug, kind))) {
        fail(`${field}: file not found at ${mediaFile(src, slug, kind)}`);
    }
}

function checkImage(img, field, slug, fail) {
    if (!img?.src) fail(`${field}: missing \`src\``);
    if (!img?.alt) fail(`${field}: missing \`alt\` text`);
    checkLocalFile(img?.src, field, slug, "images", fail);
}

function checkVideo(video, field, slug, fail) {
    if (!video || isExternal(video)) {
        return;
    }
    if (typeof video !== "string" || !VIDEO_FILE.test(video)) {
        fail(`${field} must be a URL or a local .mp4 / .webm file`);
        return;
    }
    checkLocalFile(video, field, slug, "videos", fail);
}

// caseStudy.sections: [{ id, title, text, media, note, items, tools, links }]
function validateSections(cs, slug, fail) {
    if (!Array.isArray(cs.sections)) {
        fail("`caseStudy.sections` must be a list");
        return;
    }

    const isText = (value) => value === undefined || typeof value === "string";
    const isList = (value) => value === undefined || Array.isArray(value);
    const ids = new Set();

    const checkMedia = (media, where) => {
        if (!isList(media)) {
            fail(`${where}.media must be a list`);
            return;
        }
        const videos = (media || []).filter((entry) => entry?.video).length;
        if (videos && videos !== media.length) {
            fail(`${where}.media: use either images or videos in one list, not both`);
        }
        (media || []).forEach((entry, i) => {
            if (entry?.video) {
                checkVideo(entry.video, `${where}.media[${i}].video`, slug, fail);
                checkLocalFile(entry.poster, `${where}.media[${i}].poster`, slug, "images", fail);
            } else {
                checkImage(entry, `${where}.media[${i}]`, slug, fail);
            }
        });
    };

    cs.sections.forEach((section, i) => {
        const where = `caseStudy.sections[${i}]`;

        if (!SLUG_PATTERN.test(section?.id ?? "")) {
            fail(`${where}: \`id\` must be lowercase-with-hyphens (it becomes the #anchor)`);
        } else if (ids.has(section.id)) {
            fail(`${where}: duplicate id "${section.id}"`);
        } else if (cs[section.id] !== undefined) {
            fail(`${where}: id "${section.id}" is also used by \`caseStudy.${section.id}\`; pick another id`);
        }
        ids.add(section?.id);

        if (!section?.title) fail(`${where}: missing \`title\``);
        if (!isText(section?.text)) fail(`${where}.text must be Markdown text`);
        if (!isText(section?.note)) fail(`${where}.note must be Markdown text`);
        checkMedia(section?.media, where);

        for (const key of ["items", "tools", "links"]) {
            if (!isList(section?.[key])) fail(`${where}.${key} must be a list`);
        }
        (Array.isArray(section?.items) ? section.items : []).forEach((item, j) => {
            if (!item?.title) fail(`${where}.items[${j}]: missing \`title\``);
            if (!isText(item?.text)) fail(`${where}.items[${j}].text must be Markdown text`);
            if (!isText(item?.note)) fail(`${where}.items[${j}].note must be Markdown text`);
            checkMedia(item?.media, `${where}.items[${j}]`);
        });
        (Array.isArray(section?.tools) ? section.tools : []).forEach((tool, j) => {
            if (!tool?.name) fail(`${where}.tools[${j}]: missing \`name\``);
        });
        (Array.isArray(section?.links) ? section.links : []).forEach((link, j) => {
            if (!link?.label || !link?.url) fail(`${where}.links[${j}]: needs \`label\` and \`url\``);
        });
    });
}
