import {
    allProjects,
    featuredProjects,
    projectCategories,
    projectTechnologies,
    projectAsset,
    projectsUsing,
    categoryDetails,
} from "./lib/projects.js";
import { profileEditor } from "./lib/profile-code.js";

export default function (eleventyConfig) {
    // Static files copied as-is. The CV keeps its original public URL.
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/Shahar_Eliyahu_CV.pdf");

    // Rebuild when project helpers change during `npm start`
    eleventyConfig.addWatchTarget("./lib/");

    // Project collections (see lib/projects.js)
    eleventyConfig.addCollection("projects", allProjects);
    eleventyConfig.addCollection("featuredProjects", featuredProjects);
    eleventyConfig.addCollection("projectCategories", projectCategories);
    eleventyConfig.addCollection("projectTechnologies", projectTechnologies);

    eleventyConfig.addFilter("projectAsset", projectAsset);
    eleventyConfig.addFilter("projectsUsing", projectsUsing);
    eleventyConfig.addFilter("categoryDetails", categoryDetails);

    // Hero editor: profile facts -> highlighted Java / Python / C++ (lib/profile-code.js)
    eleventyConfig.addFilter("profileEditor", profileEditor);

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
