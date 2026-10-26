/*
 * Hero profile editor: turns the profile facts in src/_data/home.json
 * (hero.profile.facts) into syntax-highlighted Java, Python and C++.
 *
 * The facts are the single source of truth; each language below only
 * describes syntax. String facts become fields, list facts become a list
 * field. Output is HTML: one <span class="code-line"> per line, tokens as
 * <span class="tok-*">. Leading indentation is a separate `tok-ws` span so
 * the typing animation can insert it instantly (like an editor's auto-indent).
 */

const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

// Token helpers: [type, text]
const kw = (t) => ["keyword", t];
const ty = (t) => ["type", t];
const nm = (t) => ["name", t];
const fd = (t) => ["field", t];
const st = (t) => ["string", `"${t}"`];
const pu = (t) => ["punct", t];
const me = (t) => ["meta", t];
const sp = [null, " "];

const pascalCase = (text) =>
    String(text)
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join("");

const snakeCase = (text) => text.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const entries = (facts) => Object.entries(facts);
const isList = (value) => Array.isArray(value);


/* LANGUAGES
 * Each returns an array of lines: { indent, tokens }. Indent is in levels. */

const LANGUAGES = {
    java: {
        label: "Java",
        filename: (facts) => `${pascalCase(facts.name)}.java`,
        indentWidth: 4,
        lines(facts) {
            const lines = [
                { tokens: [kw("import"), sp, ty("java.util.List"), pu(";")] },
                { tokens: [] },
                { tokens: [kw("public"), sp, kw("class"), sp, nm(pascalCase(facts.name)), sp, pu("{")] },
            ];
            for (const [key, value] of entries(facts)) {
                if (isList(value)) {
                    lines.push({ indent: 1, tokens: [ty("List"), pu("<"), ty("String"), pu(">"), sp, fd(key), sp, pu("="), sp, ty("List"), pu("."), fd("of"), pu("(")] });
                    value.forEach((item, i) => lines.push({ indent: 2, tokens: [st(item), ...(i < value.length - 1 ? [pu(",")] : [])] }));
                    lines.push({ indent: 1, tokens: [pu(");")] });
                } else {
                    lines.push({ indent: 1, tokens: [ty("String"), sp, fd(key), sp, pu("="), sp, st(value), pu(";")] });
                }
            }
            lines.push({ tokens: [pu("}")] });
            return lines;
        },
    },

    python: {
        label: "Python",
        filename: () => "profile.py",
        indentWidth: 4,
        lines(facts) {
            const lines = [
                { tokens: [kw("from"), sp, ty("dataclasses"), sp, kw("import"), sp, ty("dataclass")] },
                { tokens: [] },
                { tokens: [] },
                { tokens: [me("@dataclass"), pu("("), fd("frozen"), pu("="), kw("True"), pu(")")] },
                { tokens: [kw("class"), sp, nm("Profile"), pu(":")] },
            ];
            for (const [key, value] of entries(facts)) {
                const field = snakeCase(key);
                if (isList(value)) {
                    lines.push({ indent: 1, tokens: [fd(field), pu(":"), sp, ty("tuple"), pu("["), ty("str"), pu(", ...]"), sp, pu("="), sp, pu("(")] });
                    value.forEach((item) => lines.push({ indent: 2, tokens: [st(item), pu(",")] }));
                    lines.push({ indent: 1, tokens: [pu(")")] });
                } else {
                    lines.push({ indent: 1, tokens: [fd(field), pu(":"), sp, ty("str"), sp, pu("="), sp, st(value)] });
                }
            }
            return lines;
        },
    },

    cpp: {
        label: "C++",
        filename: () => "profile.cpp",
        indentWidth: 4,
        lines(facts) {
            const lines = [
                { tokens: [me("#include"), sp, ["string", "<string>"]] },
                { tokens: [me("#include"), sp, ["string", "<vector>"]] },
                { tokens: [] },
                { tokens: [kw("struct"), sp, nm("Profile"), sp, pu("{")] },
            ];
            for (const [key, value] of entries(facts)) {
                if (isList(value)) {
                    lines.push({ indent: 1, tokens: [ty("std::vector"), pu("<"), ty("std::string"), pu(">"), sp, fd(key), sp, pu("="), sp, pu("{")] });
                    value.forEach((item) => lines.push({ indent: 2, tokens: [st(item), pu(",")] }));
                    lines.push({ indent: 1, tokens: [pu("};")] });
                } else {
                    lines.push({ indent: 1, tokens: [ty("std::string"), sp, fd(key), sp, pu("="), sp, st(value), pu(";")] });
                }
            }
            lines.push({ tokens: [pu("};")] });
            return lines;
        },
    },
};


function renderLines(lines, indentWidth) {
    return lines
        .map(({ indent = 0, tokens }) => {
            const width = indent * indentWidth;
            const ws = width ? `<span class="tok-ws">${" ".repeat(width)}</span>` : "";
            const body = tokens
                .map(([type, text]) => (type ? `<span class="tok-${type}">${escapeHtml(text)}</span>` : escapeHtml(text)))
                .join("");
            // --ws lets CSS give wrapped lines a hanging indent
            return `<span class="code-line" style="--ws: ${width}">${ws}${body}</span>`;
        })
        .join("");
}


/*
 * Filter: {{ hero.profile | profileEditor }} ->
 * { defaultLanguage, languages: [{ id, label, filename, html, isDefault }] }
 */
export function profileEditor(profile) {
    const facts = profile.facts || {};
    const order = profile.languages || Object.keys(LANGUAGES);
    const defaultLanguage = profile.defaultLanguage || order[0];

    for (const [key, value] of entries(facts)) {
        if (!/^[a-z][A-Za-z0-9]*$/.test(key)) {
            throw new Error(`home.json hero.profile.facts: "${key}" must be a camelCase identifier`);
        }
        if (!(typeof value === "string" || (isList(value) && value.every((v) => typeof v === "string")))) {
            throw new Error(`home.json hero.profile.facts.${key}: must be a string or a list of strings`);
        }
    }

    const languages = order.map((id) => {
        const lang = LANGUAGES[id];
        if (!lang) throw new Error(`home.json hero.profile.languages: unknown language "${id}"`);
        return {
            id,
            label: lang.label,
            filename: lang.filename(facts),
            html: renderLines(lang.lines(facts), lang.indentWidth),
            isDefault: id === defaultLanguage,
        };
    });

    if (!languages.some((l) => l.isDefault)) {
        throw new Error(`home.json hero.profile.defaultLanguage: "${defaultLanguage}" is not in languages`);
    }

    return { defaultLanguage, languages };
}
