"use strict";

// ---- Settings --------------------------------------------------------------

const views = ["course", "practice", "text", "fun"];
const festiveThemes = ["thanksgiving", "christmas", "pixel"];
const layouts = ["sidebar", "dock", "focus"];
// Auto-reset rules. "Pass or reset" only applies to course drills, which are the only attempts with a pass mark.
const resetModes = [
  { id: "pass", name: "Pass or reset", views: ["course"] },
  { id: "streak", name: "Streak guard" },
  { id: "perfect", name: "Perfect run" },
  { id: "custom", name: "Custom" },
  { id: "off", name: "Off" }
];
const resetModesFor = (view) => resetModes.filter((mode) => !mode.views || mode.views.includes(view));
const streakWindow = 20;
const streakLimit = 3;
// With delete-to-continue on, this many typos can wait to be deleted; one more ends the attempt.
const maxPending = 10;
// Fun sprints: short texts typed against the clock. The result is just the time.
const sprintPangrams = [
  "the quick brown fox jumps over the lazy dog",
  "sphinx of black quartz judge my vow",
  "the five boxing wizards jump quickly",
  "how vexingly quick daft zebras jump",
  "jackdaws love my big sphinx of quartz",
  "the quick onyx goblin jumps over the lazy dwarf"
];
const sprints = [
  { id: "alphabet", name: "Alphabet", title: "Alphabet sprint", description: "Type a to z as fast as you can.", text: () => "abcdefghijklmnopqrstuvwxyz" },
  { id: "reverse", name: "Reverse", title: "Reverse alphabet", description: "The alphabet backwards, z to a.", text: () => "zyxwvutsrqponmlkjihgfedcba" },
  { id: "pangram", name: "Pangram", title: "Pangram dash", description: "A sentence that uses every letter of the alphabet.", text: () => pick(sprintPangrams) },
  { id: "count", name: "Count to 30", title: "Count to 30", description: "The numbers 1 to 30, a space after each.", text: () => Array.from({ length: 30 }, (_, index) => index + 1).join(" ") }
];
const sprintById = new Map(sprints.map((sprint) => [sprint.id, sprint]));
const formatSeconds = (milliseconds, digits = 2) => (milliseconds / 1000).toFixed(digits);
const settings = {
  version: 5, focus: "home", view: "course", drills: {}, drillLength: 180, done: [], welcomed: false,
  resetModes: { course: "pass", practice: "streak", text: "off", fun: "off" }, typoLimit: 5, sprint: "alphabet", sprintBest: {}, sprintLast: {},
  practice: {}, textSource: {}, passageLength: "medium", hints: true, fingerColors: false, correction: false, keyboard: true, theme: null, festive: null, layout: "sidebar", keyStats: {}, best: {}, history: []
};
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// ---- Profiles --------------------------------------------------------------------
// Each profile keeps its own settings, progress and history under its own storage key. The first profile
// keeps the original key, so everything saved before profiles existed belongs to it. A tab stays on the
// profile it loaded with; switching profiles reloads the page.

const profilesKey = "number-row-practice-profiles";
const firstProfileId = "default";
const profileNameLimit = 24;
const profileStorageKey = (id) => id === firstProfileId ? "number-row-practice-v1" : `number-row-practice-v1:${id}`;

function readProfiles() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(profilesKey)); } catch { /* One default profile. */ }
  const seen = new Set();
  const list = (Array.isArray(data?.list) ? data.list : [])
    .filter((profile) => isPlainObject(profile) && typeof profile.id === "string" && /^[a-z0-9]{1,24}$/.test(profile.id)
      && typeof profile.name === "string" && profile.name.trim() && !seen.has(profile.id) && seen.add(profile.id))
    .map(({ id, name }) => ({ id, name: name.trim().slice(0, profileNameLimit) }));
  if (list.length === 0) list.push({ id: firstProfileId, name: "Main" });
  const active = list.some((profile) => profile.id === data?.active) ? data.active : list[0].id;
  return { active, list };
}

function writeProfiles(data) {
  try {
    localStorage.setItem(profilesKey, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

const activeProfileId = readProfiles().active;
const settingsKey = profileStorageKey(activeProfileId);
// Set while the page reloads into another profile, so nothing is saved back on the way out.
let leavingProfile = false;

function readSettings() {
  try { return JSON.parse(localStorage.getItem(settingsKey)); }
  catch { return null; }
}

const saved = readSettings();
if (areaById.has(saved?.focus)) settings.focus = saved.focus;
const savedView = { lessons: "course", free: "practice" }[saved?.view] ?? saved?.view;
if (views.includes(savedView)) settings.view = savedView;
if (isPlainObject(saved?.drills)) {
  for (const [areaId, id] of Object.entries(saved.drills)) {
    if (drillById.get(id)?.area.id === areaId) settings.drills[areaId] = id;
  }
}
const savedLength = saved?.drillLength ?? saved?.lessonLength;
if (Number.isInteger(savedLength) && savedLength >= lengthRange.min && savedLength <= lengthRange.max) settings.drillLength = savedLength;
// A number saved by the old single auto-reset setting becomes the Custom limit; null means the field was left blank.
if (Number.isInteger(saved?.typoLimit)) settings.typoLimit = Math.min(typoLimitRange.max, Math.max(typoLimitRange.min, saved.typoLimit));
if (isPlainObject(saved?.resetModes)) {
  for (const view of views) {
    if (resetModesFor(view).some((mode) => mode.id === saved.resetModes[view])) settings.resetModes[view] = saved.resetModes[view];
  }
}
// Version 5 turned the second set of Number row cross-hand pairs around (6 to 1 instead of 1 to 6), so
// passes saved by earlier versions for those drills no longer apply.
const changedInVersion5 = new Set(numbered("runs", 6, 10).map((ref) => `number/${ref}`));
const keptDone = (data) => (Array.isArray(data?.done) ? data.done : [])
  .filter((id) => drillById.has(id) && ((data.version ?? 0) >= 5 || !changedInVersion5.has(id)));
if (Array.isArray(saved?.done)) {
  settings.done = [...new Set(keptDone(saved))];
} else if (Array.isArray(saved?.completed)) {
  // The old course numbered its runs 14 to 53.
  const runs = areaById.get("number").units.find((unit) => unit.id === "runs").list;
  settings.done = saved.completed.map((id) => runs.find((drill) => drill.prompt === legacyRuns[id - 14])?.id).filter(Boolean);
}
if (isPlainObject(saved?.practice)) {
  for (const [areaId, type] of Object.entries(saved.practice)) {
    if (areaById.get(areaId)?.practiceTypes.some((option) => option.id === type)) settings.practice[areaId] = type;
  }
}
if (isPlainObject(saved?.textSource)) {
  for (const [areaId, source] of Object.entries(saved.textSource)) {
    if (areaById.has(areaId) && (source === "focus" || source === "books")) settings.textSource[areaId] = source;
  }
}
if (typeof saved?.passageLength === "string" && Object.hasOwn(bookBags, saved.passageLength)) settings.passageLength = saved.passageLength;
if (typeof saved?.hints === "boolean") settings.hints = saved.hints;
if (typeof saved?.fingerColors === "boolean") settings.fingerColors = saved.fingerColors;
if (typeof saved?.correction === "boolean") settings.correction = saved.correction;
if (typeof saved?.keyboard === "boolean") settings.keyboard = saved.keyboard;
if (saved?.theme === "light" || saved?.theme === "dark") settings.theme = saved.theme;
// Older saves stored the Thanksgiving theme as true.
settings.festive = saved?.festive === true ? "thanksgiving" : festiveThemes.includes(saved?.festive) ? saved.festive : null;
if (sprintById.has(saved?.sprint)) settings.sprint = saved.sprint;
// Best sprint times, in milliseconds.
if (isPlainObject(saved?.sprintBest)) {
  for (const [id, value] of Object.entries(saved.sprintBest)) {
    if (sprintById.has(id) && Number.isInteger(value) && value > 0) settings.sprintBest[id] = value;
  }
}
// The previous sprint time, so each result can be compared with the run before it.
if (isPlainObject(saved?.sprintLast)) {
  for (const [id, value] of Object.entries(saved.sprintLast)) {
    if (sprintById.has(id) && Number.isInteger(value) && value > 0) settings.sprintLast[id] = value;
  }
}
if (layouts.includes(saved?.layout)) settings.layout = saved.layout;
// Personal bests: the best wpm and accuracy reached per drill, per practice type, and per focus for text.
if (isPlainObject(saved?.best)) {
  for (const [key, value] of Object.entries(saved.best)) {
    if (isPlainObject(value) && Number.isInteger(value.wpm) && Number.isInteger(value.accuracy)) {
      settings.best[key] = { wpm: value.wpm, accuracy: value.accuracy };
    }
  }
}
// Results history, newest first.
const historyLimit = 300;
const historyKinds = ["drill", "round", "passage", "sprint"];
if (Array.isArray(saved?.history)) {
  settings.history = saved.history.filter((entry) => isPlainObject(entry) && Number.isFinite(entry.at) && historyKinds.includes(entry.kind)
    && typeof entry.name === "string" && Number.isFinite(entry.ms)).slice(0, historyLimit);
}
if (isPlainObject(saved?.keyStats)) {
  for (const [key, value] of Object.entries(saved.keyStats)) {
    if (key.length === 1 && Array.isArray(value) && value.length === 2 && value.every((count) => Number.isInteger(count) && count >= 0)) {
      settings.keyStats[key] = value;
    }
  }
}
// Whether the first-run choice (the basics or a focus) has been made. Earlier saves with finished work count as made.
settings.welcomed = typeof saved?.welcomed === "boolean" ? saved.welcomed : !!(saved?.done?.length || saved?.history?.length);

function saveSettings() {
  // Don't write to a profile that is being left, or that another tab deleted.
  if (leavingProfile || !readProfiles().list.some((profile) => profile.id === activeProfileId)) return;
  const latest = readSettings();
  if (Array.isArray(latest?.done)) {
    settings.done = [...new Set([...settings.done, ...keptDone(latest)])];
  }
  try {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  } catch { /* Keep the current tab's settings in memory. */ }
}

const currentArea = () => areaById.get(settings.focus);
const currentDrill = () => drillById.get(settings.drills[settings.focus]) ?? recommendedDrill(currentArea()) ?? currentArea().path[0];
const isDone = (drill) => settings.done.includes(drill.id);
