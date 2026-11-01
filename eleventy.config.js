import {
    allProjects,
    featuredProjects,
    projectCategories,
    projectTechnologies,
    projectAsset,
    socialImage,
    projectsUsing,
    categoryDetails,
    categoryCounts,
    projectMedia,
    projectVideo,
    sectionMedia,
    mediaIsPortrait,
    projectNeighbors,
    findProject,
} from "./lib/projects.js";
import { codeEditor } from "./lib/code-samples.js";
import { skillLogo, validateSkills } from "./lib/skills.js";

export default function (eleventyConfig) {
    // Static files copied as-is. The CV keeps its original public URL.
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/Shahar_Eliyahu_CV.pdf");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/favicon.svg");
    eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

    // Rebuild when project helpers change during `npm start`
    eleventyConfig.addWatchTarget("./lib/");

    // Project collections (see lib/projects.js)
    eleventyConfig.addCollection("projects", allProjects);
    eleventyConfig.addCollection("featuredProjects", featuredProjects);
    eleventyConfig.addCollection("projectCategories", projectCategories);
    eleventyConfig.addCollection("projectTechnologies", projectTechnologies);

    eleventyConfig.addFilter("projectAsset", projectAsset);
    eleventyConfig.addFilter("socialImage", socialImage);
    eleventyConfig.addFilter("projectsUsing", projectsUsing);
    eleventyConfig.addFilter("categoryDetails", categoryDetails);
    eleventyConfig.addFilter("categoryCounts", categoryCounts);
    eleventyConfig.addFilter("projectMedia", projectMedia);
    eleventyConfig.addFilter("projectVideo", projectVideo);
    eleventyConfig.addFilter("sectionMedia", sectionMedia);
    eleventyConfig.addFilter("mediaIsPortrait", mediaIsPortrait);
    eleventyConfig.addFilter("projectNeighbors", projectNeighbors);
    eleventyConfig.addFilter("findProject", findProject);

    // Markdown in front matter fields (project case-study sections), rendered
    // with Eleventy's own markdown-it instance (no extra dependency)
    let markdownLibrary;
    eleventyConfig.amendLibrary("md", (library) => {
        markdownLibrary = library;

        // Tables scroll inside their own box on narrow screens (never the
        // page); the box is focusable so keyboard users can scroll it too, and
        // named after its section so each landmark on a page is distinct
        library.renderer.rules.table_open = (tokens, idx, options, env) => {
            const nth = tokens.slice(0, idx + 1).filter((token) => token.type === "table_open").length;
            const name = env?.tableLabel ? `${env.tableLabel} table` : "Table";
            const label = library.utils.escapeHtml(nth > 1 ? `${name} ${nth}` : name);

            return `<div class="table-scroll" role="region" aria-label="${label}" tabindex="0">\n<table>\n`;
        };
        library.renderer.rules.table_close = () => "</table>\n</div>\n";
    });
    eleventyConfig.addFilter("markdown", (text, tableLabel) =>
        text ? markdownLibrary.render(String(text), { tableLabel }) : ""
    );
    eleventyConfig.addFilter("markdownInline", (text) => (text ? markdownLibrary.renderInline(String(text)) : ""));

    // Hero editor: code samples -> highlighted HTML (lib/code-samples.js)
    eleventyConfig.addFilter("codeEditor", codeEditor);

    // Skills: logo URL per skill, and validation of the skills data (lib/skills.js)
    eleventyConfig.addFilter("skillLogo", skillLogo);
    eleventyConfig.on("eleventy.before", validateSkills);

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
