"use strict";

// ---- Code samples -----------------------------------------------------------
// Real multi-line code for practice and text in the Code symbols focus. It is shown as code (lines,
// indentation, syntax colors) and typed line by line: Return types each line break, and the leading
// indentation of the next line fills in by itself, as an editor would.

const cKeywords = "break case char const continue default do double else enum extern float for goto if int long return short signed sizeof static struct switch typedef union unsigned void while size_t";
const jsKeywords = "async await break case catch class const continue default do else export extends false finally for from function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield";
const codeLanguages = {
  py: { name: "Python", group: "py", line: "#", keywords: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield self" },
  java: { name: "Java", group: "java", line: "//", keywords: "abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public record return short static super switch this throw throws true false try var void while" },
  cs: { name: "C#", group: "cs", line: "//", keywords: "abstract as async await base bool break case catch class const continue decimal default do double else enum false finally float for foreach get if in int interface internal is long namespace new null object out override private protected public readonly record ref return sealed set static string struct switch this throw true try typeof using var virtual void while" },
  c: { name: "C", group: "c", line: "//", meta: true, keywords: cKeywords },
  cpp: { name: "C++", group: "cpp", line: "//", meta: true, keywords: `${cKeywords} auto bool catch class constexpr delete false inline namespace new nullptr private protected public template this throw true try typename using virtual` },
  rs: { name: "Rust", group: "rs", line: "//", meta: true, keywords: "as break const continue crate else enum false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while Some None Ok Err" },
  go: { name: "Go", group: "go", line: "//", keywords: "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false" },
  js: { name: "JavaScript", group: "web", line: "//", keywords: jsKeywords },
  ts: { name: "TypeScript", group: "web", line: "//", keywords: `${jsKeywords} interface type enum implements private public readonly as keyof number string boolean` },
  sql: { name: "SQL", group: "web", line: "--", caseless: true, keywords: "select from where join left right inner outer on group by having order asc desc limit insert into values update set delete create table primary key not null default as and or in is count integer text timestamp" },
  html: { name: "HTML", group: "web", markup: true },
  css: { name: "CSS", group: "web", props: true },
  sh: { name: "Shell", group: "web", line: "#", keywords: "if then else fi for in do done while case esac function return set echo export local" },
  json: { name: "JSON", group: "web", props: true, keywords: "true false null" },
  yaml: { name: "YAML", group: "web", line: "#", props: true, keywords: "true false null" }
};
// Practice offers one chip per group; the web group gathers the scripting, query and markup samples.
const codeGroups = [
  { id: "py", name: "Python" }, { id: "java", name: "Java" }, { id: "cs", name: "C#" }, { id: "c", name: "C" },
  { id: "cpp", name: "C++" }, { id: "rs", name: "Rust" }, { id: "go", name: "Go" },
  { id: "web", name: "Web & shell", description: "JavaScript, TypeScript, SQL, HTML, CSS, shell, JSON and YAML." }
];

// Leading spaces on each line: indentation the typist doesn't type.
function indentPositions(code) {
  const positions = new Set();
  let atLineStart = true;
  for (let index = 0; index < code.length; index++) {
    if (code[index] === "\n") atLineStart = true;
    else if (atLineStart && code[index] === " ") positions.add(index);
    else atLineStart = false;
  }
  return positions;
}

// A light highlighter for display only: comments, strings, numbers, keywords, calls, keys and tags.
// It returns one class name (or "") per character.
function highlightCode(code, langId) {
  const lang = codeLanguages[langId] ?? {};
  const fold = (word) => lang.caseless ? word.toLowerCase() : word;
  const keywords = new Set((lang.keywords ?? "").split(" ").filter(Boolean).map(fold));
  const classes = new Array(code.length).fill("");
  const paint = (from, to, name) => classes.fill(name, from, to);
  const lineEnd = (from) => {
    const end = code.indexOf("\n", from);
    return end === -1 ? code.length : end;
  };
  let index = 0;
  let lineStart = 0;
  let inTag = false;
  while (index < code.length) {
    const character = code[index];
    if (character === "\n") {
      index++;
      lineStart = index;
      continue;
    }
    const firstOnLine = code.slice(lineStart, index).trim() === "";
    // Preprocessor lines and Rust attributes.
    if (lang.meta && character === "#" && firstOnLine) {
      paint(index, lineEnd(index), "keyword");
      index = lineEnd(index);
      continue;
    }
    if (lang.line && !inTag && code.startsWith(lang.line, index)) {
      paint(index, lineEnd(index), "comment");
      index = lineEnd(index);
      continue;
    }
    if (lang.markup) {
      const tag = character === "<" && /^<\/?([A-Za-z][\w-]*)/.exec(code.slice(index, index + 40));
      if (tag) {
        paint(index + tag[0].length - tag[1].length, index + tag[0].length, "tag");
        index += tag[0].length;
        inTag = true;
        continue;
      }
      if (character === ">") inTag = false;
      if (!inTag) {
        index++;
        continue;
      }
    }
    if (character === "\"" || character === "'" || character === "`") {
      // A string runs to its closing quote on the same line; with none (a Rust lifetime, say) it isn't one.
      let end = index + 1;
      while (end < code.length && code[end] !== "\n" && code[end] !== character) end += code[end] === "\\" ? 2 : 1;
      if (code[end] === character) {
        const isKey = lang.props && /^\s*:/.test(code.slice(end + 1, end + 4));
        paint(index, end + 1, isKey ? "prop" : "string");
        index = end + 1;
        continue;
      }
      index++;
      continue;
    }
    if (langId === "css" && character === "#") {
      const color = /^#[\da-f]{3,8}\b/i.exec(code.slice(index, index + 10));
      if (color) {
        paint(index, index + color[0].length, "number");
        index += color[0].length;
        continue;
      }
    }
    if (/\d/.test(character) && !/[\w$]/.test(code[index - 1] ?? "")) {
      const number = /^(0x[\da-f]+|\d[\d_]*(\.\d+)?)[a-z]*/i.exec(code.slice(index, index + 24))[0];
      paint(index, index + number.length, "number");
      index += number.length;
      continue;
    }
    const word = /^[A-Za-z_$][\w$]*/.exec(code.slice(index, index + 64));
    if (word) {
      let end = index + word[0].length;
      // CSS and YAML keys may contain hyphens.
      if (lang.props || lang.markup) while (/[\w-]/.test(code[end] ?? "")) end++;
      const next = /^\s*(\S)/.exec(code.slice(end, end + 8))?.[1];
      const startsLine = firstOnLine || /^\s*-\s*$/.test(code.slice(lineStart, index));
      let name = "";
      if (keywords.has(fold(code.slice(index, end)))) name = "keyword";
      else if (lang.props && next === ":" && startsLine) name = "prop";
      else if (lang.markup && next === "=") name = "prop";
      else if (!lang.markup && !lang.props && (code[end] === "(" || (langId === "rs" && code[end] === "!"))) name = "fn";
      if (name) paint(index, end, name);
      index = end;
      continue;
    }
    index++;
  }
  return classes;
}

const codeSamples = codeSampleText.split(/^@@ /m).slice(1).map((block) => {
  const firstBreak = block.indexOf("\n");
  const [lang, ...title] = block.slice(0, firstBreak).trim().split(" ");
  const code = block.slice(firstBreak + 1).split("\n").map((line) => line.trimEnd()).join("\n").replace(/^\n+|\n+$/g, "");
  return {
    lang, group: codeLanguages[lang]?.group ?? "web", title: title.join(" "), code,
    syntax: highlightCode(code, lang), typed: code.length - indentPositions(code).size
  };
});

// Samples are separated by a blank line, which is typed as two Returns.
function joinCode(samples) {
  const text = samples.map((sample) => sample.code).join("\n\n");
  const syntax = samples.flatMap((sample, index) => index ? ["", "", ...sample.syntax] : sample.syntax);
  return { text, syntax };
}
