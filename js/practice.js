"use strict";

// ---- Practice and text generation ------------------------------------------

function practiceItem(area, typeId) {
  const units = area.units.filter((unit) => !unit.review);
  const unit = typeId === "mixed" ? pick(units) : units.find((option) => option.id === typeId);
  if (unit.generate && Math.random() < 0.5) return unit.generate();
  return pick(unit.items);
}

function weakKeysFor(area) {
  return Object.entries(settings.keyStats)
    .map(([key, [hits, misses]]) => ({ key, attempts: hits + misses, rate: misses / Math.max(1, hits + misses) }))
    .filter(({ key, attempts, rate }) => attempts >= 5 && rate > 0 && key !== " " && area.characters.has(key))
    .sort((a, b) => b.rate - a.rate || b.attempts - a.attempts)
    .slice(0, 6)
    .map(({ key }) => key);
}

// Weak-key rounds favour real course material that contains the key, then fall back to simple repeats.
function weakItem(area, keys, pool = area.pool) {
  const key = pick(keys);
  const matches = pool.filter((item) => item.includes(key));
  if (matches.length > 0 && Math.random() < 0.7) return pick(matches);
  const home = homeOf[key];
  return home ? `${home}${key}${home}` : `${key}${key}${key}`;
}

// Code practice: whole samples, never cut mid-way, until the round reaches about its length in typed keys.
// `missed` (keys from one attempt) stands in for the long-term weak keys.
function buildCodePractice(area, type, length, missed = null) {
  const keys = type === "weak" ? missed ?? weakKeysFor(area) : [];
  const mode = type === "weak" && keys.length < (missed ? 1 : 2) ? "mixed" : type;
  let pool = mode === "mixed" ? codeSamples : codeSamples.filter((sample) => sample.group === mode);
  if (mode === "weak") {
    const share = (sample) => [...sample.code].filter((character) => keys.includes(character)).length / sample.typed;
    pool = [...codeSamples].sort((a, b) => share(b) - share(a)).slice(0, Math.ceil(codeSamples.length * .4));
  }
  const chosen = [];
  let size = 0;
  for (const sample of shuffle(pool)) {
    if (size >= length) break;
    if (chosen.length > 0 && size + sample.typed > length * 1.4) continue;
    chosen.push(sample);
    size += sample.typed + 2;
  }
  return { type, mode, keys, missed: !!missed, code: true, ...joinCode(chosen) };
}

// A practice round. Weak keys come from long-term stats, or from `missed`: the keys missed in one attempt,
// when a result offers to practice them. `pool` limits the material, so a lesson's missed keys are practiced
// with what the course has taught so far.
function buildPractice(area, typeId, length, missed = null, pool = null) {
  const type = area.practiceTypes.some((option) => option.id === typeId) ? typeId : "mixed";
  if (area.code) return buildCodePractice(area, type, length, missed);
  const keys = type === "weak" ? missed ?? weakKeysFor(area) : [];
  const mode = type === "weak" && keys.length < (missed ? 1 : 2) ? "mixed" : type;
  const parts = [];
  let size = 0;
  while (size < length) {
    const item = mode === "weak"
      ? (Math.random() < 0.75 ? weakItem(area, keys, pool ?? area.pool) : pool ? pick(pool) : practiceItem(area, "mixed"))
      : practiceItem(area, mode);
    if (item === parts.at(-1)) continue;
    parts.push(item);
    size += item.length + 1;
  }
  return { type, mode, keys, missed: !!missed, text: parts.join(" ") };
}

// Code text: one, two or three samples in a single language, so the passage reads like one file.
const codeTextSamples = { short: 1, medium: 2, long: 3 };

function codePassage(area, lengthKey) {
  const count = codeTextSamples[lengthKey];
  const groups = shuffle(codeGroups.map((group) => group.id));
  const group = groups.find((id) => codeSamples.filter((sample) => sample.group === id).length >= count) ?? groups[0];
  const chosen = shuffle(codeSamples.filter((sample) => sample.group === group)).slice(0, count);
  const { text, syntax } = joinCode(chosen);
  const name = codeGroups.find((option) => option.id === group).name;
  return {
    title: chosen.length === 1 ? chosen[0].title : `${name} exercises`, author: name, url: null, generated: true,
    code: true, text, syntax, lines: text.split("\n").length, words: text.split(/\s+/).filter(Boolean).length
  };
}

// Focus text joins shuffled sentences or words until the passage reaches its minimum length.
function focusPassage(area, lengthKey) {
  if (area.code) return codePassage(area, lengthKey);
  const minimum = { short: 60, medium: 120, long: 220 }[lengthKey];
  const parts = [];
  let words = 0;
  while (words < minimum) {
    for (const piece of shuffle(area.text.list)) {
      if (words >= minimum) break;
      if (piece === parts.at(-1)) continue;
      parts.push(piece);
      words += piece.split(" ").length;
    }
  }
  const text = parts.join(" ");
  return { title: area.text.name, author: area.name, url: null, generated: true, text, words: text.split(" ").length };
}

let currentPassage = null;
let currentPractice = null;
let currentSprint = null;

function drawPassage() {
  const area = currentArea();
  if (settings.textSource[area.id] !== "books") return focusPassage(area, settings.passageLength);
  const take = bookBags[settings.passageLength];
  const passage = take();
  return passage === currentPassage ? take() : passage;
}

function newPassage() {
  currentPassage = drawPassage();
  startRound();
  typingArea.scrollIntoView({ block: "nearest" });
}

function newPractice() {
  currentPractice = null;
  startRound();
  typingArea.scrollIntoView({ block: "nearest" });
}

// Lesson and library drills: the pattern repeated whole, to about `length` keys, with no Space after the last one.
function repeatPattern(pattern, length) {
  const needsSpaces = pattern.includes(" ");
  const cycle = needsSpaces ? pattern + " " : pattern;
  const text = cycle.repeat(Math.max(1, Math.round(length / cycle.length))).trimEnd();
  if (needsSpaces) return text.match(/\S+ ?/g);

  // Wrap at pattern boundaries without adding any extra keystrokes.
  const chunks = [];
  for (let index = 0; index < text.length; index += cycle.length) {
    chunks.push(text.slice(index, index + cycle.length));
  }
  return chunks;
}

// A checkpoint: a fresh shuffle of its lesson's items, whole items only, to about `length` keys. Each attempt
// gets a new mix, so a pass shows the skill rather than a memorized line.
function checkpointText(drill, length) {
  const take = shuffledBag(drill.pool);
  const parts = [];
  let size = 0;
  while (size < length) {
    let item = take();
    if (item === parts.at(-1) && drill.pool.length > 1) item = take();
    parts.push(item);
    size += item.length + 1;
  }
  return parts.join(" ");
}

// A code checkpoint: one of its samples, never the same one twice in a row.
let lastCheckpointSample = null;
function checkpointSample(drill) {
  const options = drill.samples.filter((sample) => sample !== lastCheckpointSample);
  lastCheckpointSample = pick(options.length ? options : drill.samples);
  return lastCheckpointSample;
}
