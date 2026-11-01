/*
 * Hero code editor: turns the code samples in src/_data/home.json
 * (hero.editor.samples) into syntax-highlighted HTML at build time.
 *
 * Each language below only lists its keywords; everything else is classified
 * by the same small set of rules. Output: one <span class="code-line"> per
 * line, tokens as <span class="tok-*">. Leading indentation is a separate
 * `tok-ws` span so the typing animation can insert it instantly (like an
 * editor's auto-indent).
 */

const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const words = (text) => new Set(text.split(" "));

const LANGUAGES = {
    java: { label: "Java", keywords: words("class final import interface private public return this void") },
    python: { label: "Python", keywords: words("class def for if in return") },
    cpp: { label: "C++", keywords: words("bool class const double int operator public return struct"), directives: true },
    kotlin: { label: "Kotlin", keywords: words("class data false fun true val") },
};

// A word, a number, a string, or a run of punctuation (whitespace stays plain)
const TOKEN = /\s+|"(?:[^"\\]|\\.)*"|\d+(?:\.\d+)?|[A-Za-z_]\w*(?:::\w+)*|[^\sA-Za-z_\d"]+/g;

// The name right after one of these is being declared
const DECLARES = new Set(["class", "interface", "struct"]);


function classify(token, previousWord, nextChar, keywords) {
    if (/^\s/.test(token)) return null;
    if (/^["\d]/.test(token)) return "string";
    if (!/^[A-Za-z_]/.test(token)) return "punct";
    if (keywords.has(token)) return "keyword";
    if (DECLARES.has(previousWord) || nextChar === "(") return "name";
    if (/^[A-Z]/.test(token) || token.startsWith("std::")) return "type";
    return "field";
}


const span = (type, text) => (type ? `<span class="tok-${type}">${escapeHtml(text)}</span>` : escapeHtml(text));


function highlightLine(line, language) {
    const [, indent, code] = line.match(/^( *)(.*)$/);
    const ws = indent ? `<span class="tok-ws">${indent}</span>` : "";
    const directive = language.directives && code.match(/^(#\w+)(\s+)(.*)$/);

    if (directive) {
        return ws + span("meta", directive[1]) + directive[2] + span("string", directive[3]);
    }

    let previousWord = null;
    let body = "";

    for (const match of code.matchAll(TOKEN)) {
        const token = match[0];

        body += span(classify(token, previousWord, code[match.index + token.length], language.keywords), token);

        if (/^[A-Za-z_]/.test(token)) {
            previousWord = token;
        }
    }

    return ws + body;
}


/*
 * Filter: {{ hero.editor | codeEditor }} ->
 * { defaultLanguage, languages: [{ id, label, title, html, isDefault }] }
 */
export function codeEditor(editor) {
    const samples = editor.samples || [];
    const defaultLanguage = editor.defaultLanguage || samples[0]?.language;

    const languages = samples.map(({ language: id, title, code }) => {
        const language = LANGUAGES[id];

        if (!language) {
            throw new Error(`home.json hero.editor.samples: unknown language "${id}"`);
        }
        if (!title || !Array.isArray(code) || !code.every((line) => typeof line === "string")) {
            throw new Error(`home.json hero.editor.samples (${id}): needs a title and code as a list of lines`);
        }

        return {
            id,
            label: language.label,
            title,
            // --ws lets CSS give wrapped lines (phones) a hanging indent
            html: code.map((line) => `<span class="code-line" style="--ws: ${line.search(/\S|$/)}">${highlightLine(line, language)}</span>`).join(""),
            isDefault: id === defaultLanguage,
        };
    });

    if (!languages.some((language) => language.isDefault)) {
        throw new Error(`home.json hero.editor.defaultLanguage: "${defaultLanguage}" has no sample`);
    }

    return { defaultLanguage, languages };
}
