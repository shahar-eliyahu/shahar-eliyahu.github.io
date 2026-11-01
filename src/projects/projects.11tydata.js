/*
 * Defaults for every project in this folder (Eleventy data cascade).
 * A project's front matter only needs the fields that differ from these.
 * The full field reference is in the README.
 */
export default {
    // Detail pages are opt-in per project: `detailPage: true` publishes
    // /projects/<slug>/ with layouts/project.njk and turns on the
    // "Explore Project" button in the explorer. No other changes are needed.
    detailPage: false,
    layout: "layouts/project.njk",

    // Project bodies are plain Markdown (no template tags), so `{{ }}` in a
    // write-up can never break the build.
    templateEngineOverride: "md",

    categories: [],
    technologies: [],

    featured: false,

    gallery: [],
    links: {},

    caseStudy: {},

    eleventyComputed: {
        // The file name is the slug: easyfill.md -> "easyfill"
        slug: (data) => data.page.fileSlug,

        permalink: (data) =>
            data.detailPage === true ? `/projects/${data.page.fileSlug}/` : false,

        // <meta name="description"> on the detail page
        description: (data) => data.summary,
    },
};
