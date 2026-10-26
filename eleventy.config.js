export default function (eleventyConfig) {
    // Static files copied as-is. The CV keeps its original public URL.
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/Shahar_Eliyahu_CV.pdf");

    // Projects, ordered by their `order` front matter field
    eleventyConfig.addCollection("projects", (collectionApi) =>
        collectionApi
            .getFilteredByGlob("src/projects/*.md")
            .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
    );

    // "1" -> "01"
    eleventyConfig.addFilter("pad", (value, length = 2) =>
        String(value).padStart(length, "0")
    );

    eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));
}

export const config = {
    dir: {
        input: "src",
        output: "_site",
        includes: "_includes",
        data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
};
