/*
 * Skills helpers: logo lookup and build-time validation.
 *
 * Skills are defined in src/_data/skills.json: each category lists its
 * `featured` technologies (always shown) and `more` (behind "Show more").
 * Logos are mapped by skill name in src/_data/skillLogos.json to SVG files in
 * src/assets/img/skills/. A skill without a mapping is shown as text only.
 */

import fs from "node:fs";

const SKILLS_FILE = "src/_data/skills.json";
const LOGOS_FILE = "src/_data/skillLogos.json";
const LOGO_ROOT = "src/assets/img/skills";
const LOGO_URL_ROOT = "/assets/img/skills";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

// "Python" -> "/assets/img/skills/python.svg", or "" for text-only skills
export function skillLogo(name, logos) {
    const id = logos?.[name];
    return id ? `${LOGO_URL_ROOT}/${id}.svg` : "";
}

// Fails the build with a clear message (same approach as lib/projects.js)
export function validateSkills() {
    const errors = [];
    const skills = readJson(SKILLS_FILE);
    const logos = readJson(LOGOS_FILE);
    const seen = new Map();
    const names = new Set();

    if (!Array.isArray(skills)) errors.push(`${SKILLS_FILE}: must be a list of categories`);

    (Array.isArray(skills) ? skills : []).forEach((group, i) => {
        const where = `${SKILLS_FILE} [${i}]${group?.name ? ` "${group.name}"` : ""}`;
        if (!group?.name) errors.push(`${where}: missing \`name\``);
        if (names.has(group?.name)) errors.push(`${where}: duplicate category name`);
        names.add(group?.name);

        // A misspelt key (e.g. "featurd") would silently hide its skills
        for (const key of Object.keys(group ?? {})) {
            if (!["name", "featured", "more"].includes(key)) {
                errors.push(`${where}: unknown key \`${key}\` (allowed: name, featured, more)`);
            }
        }
        if (!Array.isArray(group?.featured) || group.featured.length === 0) {
            errors.push(`${where}: \`featured\` must be a non-empty list`);
        }
        if (group?.more !== undefined && !Array.isArray(group.more)) {
            errors.push(`${where}: \`more\` must be a list (use [] for none)`);
        }

        for (const skill of [...(group?.featured ?? []), ...(group?.more ?? [])]) {
            if (typeof skill !== "string" || !skill.trim()) {
                errors.push(`${where}: every skill must be a non-empty string`);
                continue;
            }
            if (seen.has(skill)) errors.push(`${where}: "${skill}" is listed twice (also in "${seen.get(skill)}")`);
            seen.set(skill, group?.name);
        }
    });

    for (const [skill, id] of Object.entries(logos)) {
        if (!seen.has(skill)) errors.push(`${LOGOS_FILE}: "${skill}" is not a skill in ${SKILLS_FILE}`);
        if (!fs.existsSync(`${LOGO_ROOT}/${id}.svg`)) errors.push(`${LOGOS_FILE}: "${skill}": missing ${LOGO_ROOT}/${id}.svg`);
    }

    if (errors.length) {
        throw new Error(`Invalid skills content:\n  - ${errors.join("\n  - ")}`);
    }
}
