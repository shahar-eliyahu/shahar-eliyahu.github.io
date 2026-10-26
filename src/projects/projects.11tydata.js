/*
 * Defaults for every project in this folder (Eleventy data cascade).
 * A project's front matter only needs the fields that differ from these.
 * The full field reference is in the README.
 */
export default {
    // Case-study pages are not built yet, so no project produces a page.
    permalink: false,

    categories: [],
    technologies: [],

    featured: false,

    gallery: [],
    links: {},

    caseStudy: {
        enabled: false,
    },

    eleventyComputed: {
        // The file name is the slug: easyfill.md -> "easyfill"
        slug: (data) => data.page.fileSlug,
    },
};
