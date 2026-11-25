"use strict";

// ---- Course progress, next steps and the course map ------------------------------------
// Each focus has a guided course (lessons, each ending in a checkpoint) and a practice library (every drill,
// grouped in units). The map shows both; the course is what progress and "what next" are about.

function progressOf(list) {
  const done = list.filter(isDone).length;
  return { done, total: list.length, complete: done === list.length };
}

function progressBar(fraction) {
  const bar = element("div", "bar");
  bar.setAttribute("aria-hidden", "true");
  const fill = element("div", "bar-fill");
  fill.style.width = `${Math.round(fraction * 100)}%`;
  bar.append(fill);
  return bar;
}

// The list a drill is stepped through with Previous and Next: the whole course path for lesson drills and
// checkpoints, its own unit for library drills.
const drillSequence = (drill) => (drill.lesson ? drill.area.path : drill.unit.list);

function neighbourDrill(drill, offset) {
  const sequence = drillSequence(drill);
  return sequence[sequence.indexOf(drill) + offset] ?? null;
}

// How a drill is named in buttons and sentences: "lesson 2, drill 3", "lesson 2 checkpoint", "Finger paths, drill 5".
function drillLabel(drill) {
  if (drill.checkpoint) return `lesson ${drill.lesson.number} checkpoint`;
  if (drill.lesson) return `lesson ${drill.lesson.number}, drill ${drill.step}`;
  return `${drill.unit.name}, drill ${drill.index}`;
}

// The one next step that the map and the results both suggest: the first unfinished course drill from where
// you are on the path, so skipping ahead carries on from there; failing that, the first unfinished one at all.
function recommendedDrill(area) {
  const current = drillById.get(settings.drills[area.id]);
  const from = current?.lesson ? area.path.indexOf(current) : 0;
  return area.path.slice(from).find((drill) => !isDone(drill)) ?? area.path.find((drill) => !isDone(drill)) ?? null;
}

// After a finished basics course, the next focus in the basics.
function nextBasics(area) {
  const index = basicsPath.indexOf(area.id);
  return index >= 0 && index < basicsPath.length - 1 ? areaById.get(basicsPath[index + 1]) : null;
}

function chooseDrill(id) {
  const drill = drillById.get(id);
  if (!drill) return;
  settings.focus = drill.area.id;
  settings.drills[drill.area.id] = drill.id;
  settings.view = "course";
  settings.welcomed = true;
  // A missed-keys round belongs to the attempt it came from; the Practice tab goes back to your usual type.
  if (currentPractice?.from) currentPractice = null;
  saveSettings();
  startRound();
  typingArea.scrollIntoView({ block: "nearest" });
}

// Opens a focus's course where it left off.
function startCourse(area) {
  chooseDrill((recommendedDrill(area) ?? area.path[0]).id);
}

function closeLibrary() {
  setLibraryOpen(false);
  typingArea.focus({ preventScroll: true });
}

function renderProgressCard() {
  const area = currentArea();
  const course = progressOf(area.path);
  get("progress-total").textContent = `${course.done} / ${course.total}`;
  get("section-progress").replaceChildren(...area.lessons.map((lesson) => {
    const { done, total, complete } = progressOf(lesson.list);
    const item = element("li", complete ? "complete" : "");
    const row = element("div", "section-progress-row");
    row.append(element("span", "", `${lesson.number}. ${lesson.name}`), element("span", "mono", `${done} / ${total}`));
    item.append(row, progressBar(done / total));
    return item;
  }));
}

let libraryOpen = false;
// Lessons and library units shown open on the map. Opening the map opens the lesson you're in and the one it
// suggests next; every other group shows its goal, progress and a button until you open it.
const openGroups = new Set();
const groupKey = (drill) => (drill.lesson ? `lesson-${drill.lesson.id}` : `unit-${drill.unit.id}`);

function drillTile(drill, number, current) {
  const finished = isDone(drill);
  const button = element("button", ["drill-tile", finished && "done", drill.checkpoint && "checkpoint"].filter(Boolean).join(" "));
  button.type = "button";
  const label = drillLabel(drill);
  button.setAttribute("aria-label", `${label[0].toUpperCase()}${label.slice(1)}: ${drill.title}${finished ? ", complete" : ""}`);
  if (drill === current) button.setAttribute("aria-current", "step");
  button.addEventListener("click", () => chooseDrill(drill.id));
  if (number) button.append(element("span", "drill-tile-number", number));
  if (drill.checkpoint) {
    button.title = `${drill.title}: a fresh mix of this lesson. Pass with ${passMark}% accuracy.`;
    button.style.gridColumn = "span 2";
    button.append(element("span", "drill-tile-prompt", "Checkpoint"), element("small", "drill-tile-note", `${passMark}% to pass`));
  } else {
    button.title = `${drill.title}: ${drill.prompt}`;
    // Long prompts span extra columns so they show in full.
    const length = drill.prompt.length;
    if (length > 9) button.style.gridColumn = length > 48 ? "1 / -1" : `span ${length > 36 ? 4 : length > 24 ? 3 : 2}`;
    button.append(element("samp", "drill-tile-prompt", drill.prompt));
  }
  if (finished) button.append(icon("check"));
  return button;
}

// One lesson or library unit: a heading that opens and closes it, its progress, an optional button that
// starts it, and its drills when open.
function groupCard({ key, title, meta, description, list, numberOf, action, current }) {
  const { done, total, complete } = progressOf(list);
  const open = openGroups.has(key);
  const card = element("section", `card library-section${complete ? " complete" : ""}`);
  const headingId = `map-${key}`;
  const gridId = `map-${key}-drills`;
  card.setAttribute("aria-labelledby", headingId);
  const toggle = element("button", "group-toggle");
  toggle.type = "button";
  toggle.id = headingId;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-controls", gridId);
  toggle.append(icon("chevron-right"), element("span", "", title));
  const heading = element("h2");
  heading.append(toggle, element("span", "range", meta));
  const intro = element("div", "library-section-intro");
  intro.append(heading);
  if (description) intro.append(element("p", "library-section-description", description));
  const meter = element("div", complete ? "section-meter complete" : "section-meter");
  meter.append(progressBar(done / total), element("span", "mono", `${done} / ${total}`));
  const side = element("div", "library-section-side");
  side.append(meter);
  if (action) {
    const start = element("button", "button small", action.label);
    start.type = "button";
    start.addEventListener("click", () => chooseDrill(action.drill.id));
    side.append(start);
  }
  const header = element("div", "library-section-header");
  header.append(intro, side);
  const grid = element("div", "drill-grid");
  grid.id = gridId;
  grid.hidden = !open;
  if (open) grid.append(...list.map((drill) => drillTile(drill, numberOf(drill), current)));
  toggle.addEventListener("click", () => {
    if (openGroups.has(key)) openGroups.delete(key);
    else openGroups.add(key);
    card.replaceWith(groupCard({ key, title, meta, description, list, numberOf, action, current }));
    get(headingId).focus();
  });
  card.append(header, grid);
  return card;
}

function sectionHeading(title, description) {
  const heading = element("div", "map-heading");
  heading.append(element("h2", "map-title", title), element("p", "map-description", description));
  return heading;
}

function renderLibrary() {
  const area = currentArea();
  const course = progressOf(area.path);
  const percent = Math.round(course.done / course.total * 100);
  get("course-title").textContent = `${area.name} course`;
  get("course-summary").textContent = `${plural(area.lessons.length, "short lesson")}, each ending in a checkpoint: a fresh mix you pass with ${passMark}% accuracy.`;
  get("library-progress-label").textContent = `${course.done} of ${course.total} done`;
  get("library-progress-percent").textContent = `${percent}%`;
  get("library-progress-fill").style.width = `${percent}%`;
  get("library-progress-fill").parentElement.parentElement.classList.toggle("complete", course.complete);

  const current = currentDrill();
  const next = recommendedDrill(area);
  const following = next ? null : nextBasics(area);
  const continueButton = get("continue-drill");
  const target = next ?? (following && (recommendedDrill(following) ?? following.path[0]));
  continueButton.hidden = !target;
  continueButton.dataset.drill = target?.id ?? "";
  // "Start" until the lesson has a finished drill, "Resume" where you left off, "Continue with" after a jump.
  const nextVerb = next !== current ? "Continue with" : next.lesson.list.some(isDone) ? "Resume" : "Start";
  if (next) get("continue-drill-label").textContent = `${nextVerb} ${drillLabel(next)}`;
  else if (following) get("continue-drill-label").textContent = `Start the ${following.name} course`;
  get("close-library-label").textContent = settings.view === "course"
    ? `Back to ${drillLabel(current)}`
    : `Back to ${settings.view === "fun" ? "sprints" : settings.view}`;

  const lessons = area.lessons.map((lesson) => {
    const { complete } = progressOf(lesson.list);
    const resume = lesson.list.find((drill) => !isDone(drill));
    return groupCard({
      key: `lesson-${lesson.id}`, title: `${lesson.number}. ${lesson.name}`, meta: `${plural(lesson.list.length - 1, "drill")} + checkpoint`,
      list: lesson.list, current, numberOf: (drill) => (drill.checkpoint ? "" : String(drill.step)),
      action: complete ? { label: "Review", drill: lesson.list[0] } : { label: lesson.list.some(isDone) ? "Resume" : "Start", drill: resume }
    });
  });
  const units = area.units.map((unit) => groupCard({
    key: `unit-${unit.id}`, title: unit.name, meta: plural(unit.list.length, "drill"), description: unit.instruction,
    list: unit.list, current, numberOf: (drill) => String(drill.index)
  }));
  const libraryCount = area.units.reduce((sum, unit) => sum + unit.list.length, 0);
  get("library-sections").replaceChildren(
    sectionHeading("Lessons", "Work through them in order. Lesson drills are short and count as done when you finish them."),
    ...lessons,
    sectionHeading("Practice library", `All ${libraryCount} drills in this focus, grouped by kind, for extra practice. The course only needs its lessons.`),
    ...units
  );
}

function setLibraryOpen(open) {
  if (open && historyOpen) setHistoryOpen(false);
  libraryOpen = open;
  library.hidden = !open;
  workspace.hidden = open;
  if (!open) return;
  setSettingsOpen(false);
  if (timer !== null) pauseRound();
  openGroups.clear();
  for (const drill of [currentDrill(), recommendedDrill(currentArea())]) if (drill) openGroups.add(groupKey(drill));
  renderLibrary();
  window.scrollTo({ top: 0 });
  get("close-library").focus({ preventScroll: true });
}
