"use strict";

// ---- The history page: opening and closing it -------------------------------------

let historyOpen = false;

function setHistoryOpen(open) {
  historyOpen = open;
  get("history").hidden = !open;
  get("top-history").setAttribute("aria-pressed", String(open));
  if (open) {
    libraryOpen = false;
    library.hidden = true;
    setSettingsOpen(false);
    if (timer !== null) pauseRound();
    renderHistory();
  }
  workspace.hidden = open;
  if (!open) return;
  window.scrollTo({ top: 0 });
  get("close-history").focus({ preventScroll: true });
}

// Back from history: to the results banner if one is showing, otherwise to typing.
function closeHistory() {
  setHistoryOpen(false);
  if (!resultBanner.hidden) resultBanner.focus({ preventScroll: true });
  else typingArea.focus({ preventScroll: true });
}

const historyOutcomes = {
  passed: ["Passed", "good"], fluent: ["Fluent", "good"], short: ["Not passed", "bad"], stopped: ["Stopped early", "bad"], done: ["Done", "good"]
};

function historyDay(time) {
  const day = new Date(time);
  const today = new Date();
  const startOf = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round((startOf(today) - startOf(day)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return day.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: day.getFullYear() === today.getFullYear() ? undefined : "numeric" });
}

// ---- History: overview, charts and keys ----------------------------------------

const kindLabels = { drill: "Course", round: "Practice", passage: "Text", sprint: "Sprints" };
const kindNouns = { drill: "course", round: "practice", passage: "text", sprint: "sprint" };
const statRanges = [
  { id: "7", name: "7 days", days: 7 }, { id: "30", name: "30 days", days: 30 },
  { id: "90", name: "90 days", days: 90 }, { id: "all", name: "All time", days: null }
];
const statKinds = [{ id: "all", name: "All" }, ...historyKinds.map((id) => ({ id, name: kindLabels[id] }))];
// The overview's filters; they last until the page is reloaded. "chosen" is set once the user picks one.
const historyFilter = { range: "30", kind: "all", chosen: false, keys: "misses" };
const dayMs = 86400000;
// Calendar arithmetic in local time, so days stay whole across daylight-saving changes.
const addDays = (time, days) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days).getTime();
};
const startOfDay = (time) => addDays(time, 0);
const dayKey = (time) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};
const shortDate = (time) => new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const clockTime = (time) => new Date(time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const plural = (count, word) => `${count.toLocaleString()} ${word}${count === 1 ? "" : "s"}`;
const currentRange = () => statRanges.find((range) => range.id === historyFilter.range);
const rangeStart = (range) => range.days ? addDays(Date.now(), -(range.days - 1)) : -Infinity;

function formatDuration(milliseconds) {
  if (milliseconds < 59500) return `${Math.round(milliseconds / 1000)} s`;
  const minutes = Math.round(milliseconds / 60000);
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function filteredHistory(from = rangeStart(currentRange()), to = Infinity) {
  return settings.history.filter((entry) => entry.at >= from && entry.at < to
    && (historyFilter.kind === "all" || entry.kind === historyFilter.kind));
}

function summarize(entries) {
  const speeds = entries.map((entry) => entry.wpm).filter(Number.isFinite);
  const accuracies = entries.map((entry) => entry.accuracy).filter(Number.isFinite);
  const total = (key) => entries.reduce((sum, entry) => sum + (Number.isFinite(entry[key]) ? entry[key] : 0), 0);
  return {
    runs: entries.length, ms: total("ms"), keys: total("keys"), typos: total("typos"),
    days: new Set(entries.map((entry) => dayKey(entry.at))).size,
    wpm: mean(speeds), bestWpm: speeds.length ? Math.max(...speeds) : null, accuracy: mean(accuracies)
  };
}

// Days in a row with at least one result: the current run counts back from today (or from yesterday,
// while today has nothing yet), and the longest is the best run ever.
function practiceStreaks() {
  const days = new Set(settings.history.map((entry) => dayKey(entry.at)));
  let current = 0;
  for (let day = days.has(dayKey(Date.now())) ? Date.now() : addDays(Date.now(), -1); days.has(dayKey(day)); day = addDays(day, -1)) current++;
  let longest = 0;
  let streak = 0;
  let previous = null;
  for (const day of [...new Set(settings.history.map((entry) => startOfDay(entry.at)))].sort((a, b) => a - b)) {
    streak = previous !== null && addDays(previous, 1) === day ? streak + 1 : 1;
    longest = Math.max(longest, streak);
    previous = day;
  }
  return { current, longest };
}

function renderHistorySummary() {
  const count = settings.history.length;
  const parts = [];
  if (readProfiles().list.length > 1) parts.push(activeProfile().name);
  if (count === 0) {
    parts.push("Nothing here yet.");
  } else {
    parts.push(`${plural(count, "result")} saved (the last ${historyLimit} are kept)`);
    const { current, longest } = practiceStreaks();
    if (current > 1) parts.push(`${current} days in a row`);
    if (longest > 1 && longest > current) parts.push(`best streak ${longest} days`);
  }
  get("history-summary").textContent = parts.join(" · ");
}

function tableHead(columns) {
  const head = element("tr");
  for (const [text, numeric] of columns) {
    const cell = element("th", numeric ? "num" : "", text);
    cell.scope = "col";
    head.append(cell);
  }
  const thead = element("thead");
  thead.append(head);
  return thead;
}

function tableRow(cells) {
  const row = element("tr");
  row.append(...cells.map(([text, className = ""]) => element("td", className, text)));
  return row;
}

function statTile(label, value, unit, sub, delta) {
  const tile = element("div", "card stat-tile");
  const figure = element("p", "stat-tile-value", value);
  if (unit) figure.append(element("span", "stat-tile-unit", unit));
  tile.append(element("p", "stat-tile-label", label), figure);
  if (delta) tile.append(delta);
  if (sub) tile.append(element("p", "stat-tile-sub", sub));
  return tile;
}

// The change against the same number of days just before; up is better for both speed and accuracy.
function deltaNote(current, previous, amount, range) {
  if (current === null || previous === null || !range.days) return null;
  const change = Math.round(current - previous);
  const note = element("p", `stat-tile-delta${change > 0 ? " up" : change < 0 ? " down" : ""}`);
  note.textContent = change === 0
    ? `Level with the previous ${range.name}`
    : `${change > 0 ? "▲" : "▼"} ${amount(Math.abs(change))} vs previous ${range.name}`;
  return note;
}

function renderTiles(entries) {
  const range = currentRange();
  const now = summarize(entries);
  const from = rangeStart(range);
  const before = range.days ? summarize(filteredHistory(addDays(from, -range.days), from)) : null;
  const speed = now.wpm === null
    ? statTile("Average speed", "—", "", "Sprints are timed, not scored in wpm")
    : statTile("Average speed", String(Math.round(now.wpm)), "wpm", `Best ${now.bestWpm} wpm`, deltaNote(now.wpm, before?.wpm ?? null, (change) => `${change} wpm`, range));
  const accuracy = now.accuracy === null
    ? statTile("Average accuracy", "—", "", "")
    : statTile("Average accuracy", `${Math.round(now.accuracy)}%`, "", plural(now.typos, "typo"), deltaNote(now.accuracy, before?.accuracy ?? null, (change) => plural(change, "point"), range));
  get("history-tiles").replaceChildren(
    statTile("Runs", now.runs.toLocaleString(), "", `On ${plural(now.days, "day")}`),
    statTile("Time typing", formatDuration(now.ms), "", `${plural(now.keys, "key")} typed`),
    speed,
    accuracy
  );
}

// ---- Chart helpers ----------------------------------------------------------------

function svgElement(tag, className = "", attributes = {}, text) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (className) node.setAttribute("class", className);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}

// Axis steps of 1, 2 or 5 times a power of ten.
function niceScale(min, max, ticks = 4) {
  if (max <= min) max = min + 1;
  const raw = (max - min) / ticks;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].find((unit) => unit * power >= raw) * power;
  return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
}
const tickValues = ({ min, max, step }) => Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
const tickLabel = (value) => Number.isInteger(Math.round(value * 1000) / 1000) ? String(Math.round(value)) : value.toFixed(1);

function drawGrid(svg, scale, y, left, right) {
  for (const tick of tickValues(scale)) {
    const at = Math.round(y(tick)) + .5;
    svg.append(
      svgElement("line", "chart-grid", { x1: left, x2: right, y1: at, y2: at }),
      svgElement("text", "chart-axis", { x: left - 8, y: at + 4, "text-anchor": "end" }, tickLabel(tick))
    );
  }
}

// A chart host starts empty, with no keyboard handling, every time it is drawn.
function resetChart(host) {
  host.replaceChildren();
  host.removeAttribute("tabindex");
  host.removeAttribute("role");
  host.removeAttribute("aria-label");
  host.onfocus = host.onblur = host.onkeydown = null;
}

function chartTip(host) {
  const tip = element("div", "chart-tip");
  tip.setAttribute("aria-hidden", "true");
  tip.hidden = true;
  host.append(tip);
  return tip;
}

function placeTip(host, tip, x, y = 0) {
  tip.hidden = false;
  const left = x + 14 + tip.offsetWidth > host.clientWidth ? x - 14 - tip.offsetWidth : x + 14;
  tip.style.left = `${Math.max(0, left)}px`;
  tip.style.top = `${y}px`;
}

function tipRow(keyClass, value, label) {
  const row = element("div", "chart-tip-row");
  row.append(element("i", keyClass), element("strong", "", value), element("span", "", label));
  return row;
}

// The pointer picks the nearest data position, so readers aim at a date, not a 2px mark. With the chart
// focused, the arrow keys, Home and End step through the same positions.
function scrubChart(host, svg, xs, { show, hide }) {
  const tip = chartTip(host);
  let index = null;
  const select = (next) => {
    index = Math.max(0, Math.min(xs.length - 1, next));
    tip.replaceChildren(...show(index));
    placeTip(host, tip, xs[index]);
  };
  const clear = () => {
    index = null;
    tip.hidden = true;
    hide();
  };
  svg.addEventListener("pointermove", (event) => {
    const box = svg.getBoundingClientRect();
    const x = (event.clientX - box.left) * (svg.viewBox.baseVal.width / box.width);
    let nearest = 0;
    xs.forEach((value, at) => { if (Math.abs(value - x) < Math.abs(xs[nearest] - x)) nearest = at; });
    if (nearest !== index) select(nearest);
  });
  svg.addEventListener("pointerleave", () => { if (document.activeElement !== host) clear(); });
  host.tabIndex = 0;
  host.onfocus = () => select(index ?? xs.length - 1);
  host.onblur = clear;
  host.onkeydown = (event) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    select(event.key === "Home" ? 0 : event.key === "End" ? xs.length - 1 : (index ?? xs.length - 1) + step);
  };
}

// ---- Speed and accuracy: one dot per run, and a rolling average ----------------------

function renderTrendChart(entries) {
  const host = get("trend-chart");
  resetChart(host);
  const runs = entries.filter((entry) => entry.kind !== "sprint" && Number.isFinite(entry.wpm) && Number.isFinite(entry.accuracy)).reverse();
  get("trend-legend").hidden = runs.length < 2;
  if (runs.length < 2) {
    host.append(element("p", "chart-empty", runs.length === 1
      ? "Finish one more scored run to see a trend."
      : "No scored runs here. Sprints are timed, so they have no speed to chart."));
    return;
  }
  const span = runs.length >= 30 ? 10 : 5;
  get("trend-average-label").textContent = `Average of the last ${span}`;
  const width = Math.max(360, Math.round(host.clientWidth));
  const left = 38;
  const right = width - 72;
  const top = 24;
  const panelHeight = 130;
  const between = 44;
  const height = top + panelHeight * 2 + between + 26;
  const xs = runs.map((_, index) => left + index * (right - left) / (runs.length - 1));
  const lowest = Math.min(...runs.map((entry) => entry.accuracy));
  const panels = [
    { title: "Speed (wpm)", key: "wpm", unit: " wpm", top, scale: niceScale(0, Math.max(...runs.map((entry) => entry.wpm))) },
    { title: "Accuracy (%)", key: "accuracy", unit: "%", top: top + panelHeight + between, scale: { ...niceScale(Math.min(90, lowest), 100), max: 100 } }
  ];
  const svg = svgElement("svg", "", { viewBox: `0 0 ${width} ${height}`, width, height });
  const cross = svgElement("line", "chart-cross", { y1: top - 6, y2: top + panelHeight * 2 + between, visibility: "hidden" });
  const radius = runs.length > 80 ? 2 : runs.length > 30 ? 2.75 : 3.5;
  for (const panel of panels) {
    const { min, max } = panel.scale;
    panel.y = (value) => panel.top + panelHeight - (value - min) / (max - min) * panelHeight;
    panel.average = runs.map((_, index) => mean(runs.slice(Math.max(0, index - span + 1), index + 1).map((entry) => entry[panel.key])));
    svg.append(svgElement("text", "chart-panel-title", { x: left, y: panel.top - 12 }, panel.title));
    drawGrid(svg, panel.scale, panel.y, left, right);
    for (const [index, entry] of runs.entries()) {
      svg.append(svgElement("circle", "chart-dot", { cx: xs[index].toFixed(1), cy: panel.y(entry[panel.key]).toFixed(1), r: radius }));
    }
    svg.append(svgElement("path", "chart-line", {
      d: panel.average.map((value, index) => `${index ? "L" : "M"}${xs[index].toFixed(1)} ${panel.y(value).toFixed(1)}`).join("")
    }));
    const last = panel.average.at(-1);
    svg.append(
      svgElement("circle", "chart-end", { cx: right, cy: panel.y(last), r: 4 }),
      svgElement("text", "chart-end-label", { x: right + 10, y: panel.y(last) + 4 }, `${Math.round(last)}${panel.unit}`)
    );
    panel.focusRun = svgElement("circle", "chart-focus run", { r: 4.5, visibility: "hidden" });
    panel.focusAverage = svgElement("circle", "chart-focus avg", { r: 4.5, visibility: "hidden" });
  }
  // Dates along the bottom, at most one label per ~110px and never the same date twice in a row.
  const ticks = Math.max(2, Math.min(runs.length, Math.floor((right - left) / 110)));
  let previousLabel = "";
  for (let tick = 0; tick < ticks; tick++) {
    const index = Math.round(tick * (runs.length - 1) / (ticks - 1));
    const label = shortDate(runs[index].at);
    if (label === previousLabel) continue;
    previousLabel = label;
    const anchor = tick === 0 ? "start" : tick === ticks - 1 ? "end" : "middle";
    svg.append(svgElement("text", "chart-axis", { x: xs[index], y: height - 6, "text-anchor": anchor }, label));
  }
  svg.append(cross, ...panels.flatMap((panel) => [panel.focusRun, panel.focusAverage]));
  host.append(svg);
  const [speed, accuracy] = panels;
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", `Speed and accuracy over ${runs.length} runs. The average speed went from ${Math.round(speed.average[0])} to ${Math.round(speed.average.at(-1))} wpm, and the average accuracy from ${Math.round(accuracy.average[0])}% to ${Math.round(accuracy.average.at(-1))}%. Every run is listed under All results.`);
  scrubChart(host, svg, xs, {
    show(index) {
      for (const attribute of ["x1", "x2"]) cross.setAttribute(attribute, xs[index]);
      cross.setAttribute("visibility", "visible");
      for (const panel of panels) {
        for (const [mark, value] of [[panel.focusRun, runs[index][panel.key]], [panel.focusAverage, panel.average[index]]]) {
          mark.setAttribute("cx", xs[index]);
          mark.setAttribute("cy", panel.y(value));
          mark.setAttribute("visibility", "visible");
        }
      }
      const entry = runs[index];
      return [
        element("div", "chart-tip-title", entry.name),
        element("div", "chart-tip-when", `${shortDate(entry.at)}, ${clockTime(entry.at)}`),
        tipRow("tip-key-dot", `${entry.wpm} wpm · ${entry.accuracy}%`, "this run"),
        tipRow("tip-key-line", `${Math.round(speed.average[index])} wpm · ${Math.round(accuracy.average[index])}%`, `average of last ${Math.min(span, index + 1)}`)
      ];
    },
    hide() {
      cross.setAttribute("visibility", "hidden");
      for (const panel of panels) {
        panel.focusRun.setAttribute("visibility", "hidden");
        panel.focusAverage.setAttribute("visibility", "hidden");
      }
    }
  });
}

// ---- Time typing: minutes per day, or per week over long spans -----------------------

function renderActivityChart(entries) {
  const host = get("activity-chart");
  resetChart(host);
  const range = currentRange();
  const today = startOfDay(Date.now());
  const first = range.days
    ? addDays(today, -(range.days - 1))
    : Math.min(startOfDay(Math.min(...entries.map((entry) => entry.at))), addDays(today, -6));
  const weekly = Math.round((today - first) / dayMs) + 1 > 92;
  const buckets = [];
  // Weeks start on Monday.
  for (let start = weekly ? addDays(first, -((new Date(first).getDay() + 6) % 7)) : first; start <= today;) {
    const end = addDays(start, weekly ? 7 : 1);
    buckets.push({ start, end, ms: 0, runs: 0 });
    start = end;
  }
  for (const entry of entries) {
    const bucket = buckets.find(({ start, end }) => entry.at >= start && entry.at < end);
    if (bucket) {
      bucket.ms += entry.ms;
      bucket.runs++;
    }
  }
  get("activity-meta").textContent = `Minutes per ${weekly ? "week" : "day"}`;
  const width = Math.max(360, Math.round(host.clientWidth));
  const left = 38;
  const right = width - 8;
  const top = 8;
  const plotHeight = 120;
  const base = top + plotHeight;
  const height = base + 26;
  const minutes = buckets.map((bucket) => bucket.ms / 60000);
  const scale = niceScale(0, Math.max(...minutes) || 1);
  const y = (value) => base - value / scale.max * plotHeight;
  const svg = svgElement("svg", "", { viewBox: `0 0 ${width} ${height}`, width, height });
  drawGrid(svg, scale, y, left, right);
  const slot = (right - left) / buckets.length;
  const barWidth = Math.max(1, Math.min(24, slot - 2));
  const xs = buckets.map((_, index) => left + slot * (index + .5));
  // Columns: square at the baseline, 4px rounded at the top; a day with any typing shows at least 2px.
  const bars = buckets.map((bucket, index) => {
    if (bucket.ms === 0) return null;
    const barHeight = Math.max(2, minutes[index] / scale.max * plotHeight);
    const x0 = xs[index] - barWidth / 2;
    const x1 = x0 + barWidth;
    const r = Math.min(4, barWidth / 2, barHeight);
    const peak = base - barHeight;
    const bar = svgElement("path", "chart-bar", {
      d: `M${x0} ${base}V${peak + r}Q${x0} ${peak} ${x0 + r} ${peak}H${x1 - r}Q${x1} ${peak} ${x1} ${peak + r}V${base}Z`
    });
    svg.append(bar);
    return bar;
  });
  // Labels count back from the newest column, so today (or this week) is always labelled.
  const every = Math.max(1, Math.ceil(64 / slot));
  for (let index = buckets.length - 1; index >= 0; index -= every) {
    svg.append(svgElement("text", "chart-axis", { x: xs[index], y: height - 6, "text-anchor": "middle" }, shortDate(buckets[index].start)));
  }
  host.append(svg);
  const total = buckets.reduce((sum, bucket) => sum + bucket.ms, 0);
  const busiest = buckets.reduce((best, bucket) => bucket.ms > best.ms ? bucket : best);
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", `Time typing per ${weekly ? "week" : "day"}: ${formatDuration(total)} in all, most on ${shortDate(busiest.start)} with ${formatDuration(busiest.ms)}.`);
  scrubChart(host, svg, xs, {
    show(index) {
      bars.forEach((bar, at) => bar?.classList.toggle("active", at === index));
      const bucket = buckets[index];
      const when = weekly
        ? `Week of ${shortDate(bucket.start)}`
        : new Date(bucket.start).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      return [
        element("div", "chart-tip-title", when),
        bucket.ms === 0
          ? element("div", "chart-tip-when", "No typing")
          : tipRow("tip-key-bar", formatDuration(bucket.ms), plural(bucket.runs, "run"))
      ];
    },
    hide() {
      for (const bar of bars) bar?.classList.remove("active");
    }
  });
}

// ---- Tables: by exercise type, and sprint times -------------------------------------

function renderBreakdown(entries) {
  const card = get("breakdown-card");
  const kinds = historyKinds.filter((kind) => entries.some((entry) => entry.kind === kind));
  card.hidden = historyFilter.kind !== "all" || kinds.length < 2;
  if (card.hidden) return;
  const tbody = element("tbody");
  for (const kind of kinds) {
    const summary = summarize(entries.filter((entry) => entry.kind === kind));
    tbody.append(tableRow([
      [kindLabels[kind], "history-name"], [summary.runs.toLocaleString(), "num"], [formatDuration(summary.ms), "num"],
      [summary.wpm === null ? "—" : String(Math.round(summary.wpm)), "num"], [summary.bestWpm === null ? "—" : String(summary.bestWpm), "num"],
      [summary.accuracy === null ? "—" : `${Math.round(summary.accuracy)}%`, "num"]
    ]));
  }
  get("breakdown-table").replaceChildren(
    tableHead([["Type"], ["Runs", true], ["Time", true], ["Average wpm", true], ["Best wpm", true], ["Average accuracy", true]]), tbody);
}

function renderSprintTable(entries) {
  const card = get("sprint-card");
  const finished = entries.filter((entry) => entry.kind === "sprint" && entry.outcome !== "stopped");
  card.hidden = finished.length === 0;
  if (card.hidden) return;
  const groups = new Map();
  for (const entry of finished) {
    if (!groups.has(entry.name)) groups.set(entry.name, []);
    groups.get(entry.name).push(entry);
  }
  const order = sprints.map((sprint) => sprint.title);
  const rank = (name) => order.includes(name) ? order.indexOf(name) : order.length;
  const seconds = (milliseconds) => `${formatSeconds(milliseconds)} s`;
  const tbody = element("tbody");
  for (const [name, list] of [...groups].sort(([a], [b]) => rank(a) - rank(b))) {
    const times = list.map((entry) => entry.ms);
    tbody.append(tableRow([
      [name, "history-name"], [times.length.toLocaleString(), "num"], [seconds(Math.min(...times)), "num"],
      [seconds(mean(times)), "num"], [seconds(times[0]), "num"]
    ]));
  }
  get("sprint-table").replaceChildren(tableHead([["Sprint"], ["Runs", true], ["Best", true], ["Average", true], ["Latest", true]]), tbody);
}

// ---- Keys: miss rate per physical key, all time ---------------------------------------

// Shifted characters count toward the key that types them.
const shiftedToBase = {
  "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "_": "-", "+": "=",
  "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/"
};
const keymapRows = [[[..."`1234567890-="], 0], [[..."qwertyuiop[]\\"], 1.5], [[..."asdfghjkl;'", "\n"], 1.75], [[..."zxcvbnm,./"], 2.25], [[" "], 3.5]];
const heatSteps = [
  { below: .01, label: "Under 1%" }, { below: .03, label: "1–3%" }, { below: .06, label: "3–6%" },
  { below: .1, label: "6–10%" }, { below: Infinity, label: "10% or more" }
];
// Fewer tries than this and a key's miss rate says more about luck than about the typist.
const minKeyAttempts = 10;
const formatRate = (rate) => `${(rate * 100).toFixed(rate > 0 && rate < .1 ? 1 : 0)}%`;
const keyLabel = (key) => key === " " ? "space" : key === "\n" ? "return" : key.toUpperCase();

function keyTotals() {
  const totals = new Map();
  for (const [character, [hits, misses]] of Object.entries(settings.keyStats)) {
    const key = shiftedToBase[character] ?? character.toLowerCase();
    const total = totals.get(key) ?? { hits: 0, misses: 0 };
    total.hits += hits;
    total.misses += misses;
    totals.set(key, total);
  }
  for (const total of totals.values()) {
    total.attempts = total.hits + total.misses;
    total.rate = total.attempts ? total.misses / total.attempts : 0;
  }
  return totals;
}

// Speed per physical key: the average gap before it, against your average over every key.
function keyTimeTotals() {
  const totals = new Map();
  for (const [character, [sum, count]] of Object.entries(settings.keyTimes)) {
    const key = shiftedToBase[character] ?? character.toLowerCase();
    const total = totals.get(key) ?? { sum: 0, count: 0 };
    total.sum += sum;
    total.count += count;
    totals.set(key, total);
  }
  for (const total of totals.values()) total.mean = total.sum / total.count;
  return totals;
}

const speedSteps = [
  { below: .9, label: "Faster than average" }, { below: 1.1, label: "About average" }, { below: 1.3, label: "Up to 30% slower" },
  { below: 1.6, label: "30–60% slower" }, { below: Infinity, label: "60% or more slower" }
];
const pairLabel = (pair) => `${pair[0]}→${pair[1]}`;
const comparedWithAverage = (ratio) => {
  const percent = Math.round(Math.abs(ratio - 1) * 100);
  return percent < 5 ? "about your average" : `${percent}% ${ratio > 1 ? "slower" : "faster"} than your average`;
};

function barRow(label, fraction, value, sub) {
  const item = element("li", "weak-row");
  const track = element("div", "weak-track");
  const fill = element("div", "weak-fill");
  fill.style.width = `${fraction * 100}%`;
  track.append(fill);
  const figure = element("p", "weak-figure", value);
  figure.append(element("span", "", sub));
  item.append(element("kbd", "", label), track, figure);
  return item;
}

function renderKeys() {
  setPressed([...get("keys-mode").children], (button) => button.dataset.option === historyFilter.keys);
  const speed = historyFilter.keys === "speed";
  const totals = keyTotals();
  const attempts = [...totals.values()].reduce((sum, total) => sum + total.attempts, 0);
  const misses = [...totals.values()].reduce((sum, total) => sum + total.misses, 0);
  const times = keyTimeTotals();
  const pace = typingPace();
  get("keys-meta").textContent = !attempts ? "No keystrokes recorded yet."
    : !speed ? `${plural(attempts, "keystroke")} · ${formatRate(misses / attempts)} missed`
    : pace ? `About ${Math.round(pace)} ms between keys on average, a pace of ${Math.round(12000 / pace)} wpm`
    : "Timing shows up here after about 100 keystrokes.";
  get("keys-card").hidden = attempts === 0;
  get("keys-mode").hidden = attempts === 0;
  if (attempts === 0) return;
  get("keymap-title").textContent = speed ? "Time per key, in milliseconds" : "Miss rate by key";
  get("weak-title").textContent = speed ? "Slowest pairs" : "Keys to work on";
  get("heat-legend").setAttribute("aria-label", speed ? "Speed scale" : "Miss rate scale");

  const keymap = get("keymap");
  get("keys-card").classList.toggle("speed", speed);
  keymap.replaceChildren();
  const tip = chartTip(keymap);
  const cell = (key, className = "") => {
    const node = element("span", `keymap-key ${className}`.trim());
    const name = describeKey(key) === key ? keyLabel(key) : describeKey(key);
    let detail;
    if (speed) {
      const total = times.get(key);
      if (!total || total.count < minKeyAttempts) {
        node.append(element("span", "", keyLabel(key)), element("small", "", total ? "few" : "–"));
        detail = total ? `Timed ${plural(total.count, "time")}, not enough to tell yet` : "Not timed yet";
      } else {
        if (pace) node.dataset.heat = String(speedSteps.findIndex((step) => total.mean / pace < step.below));
        node.append(element("span", "", keyLabel(key)), element("small", "", String(Math.round(total.mean))));
        detail = `${Math.round(total.mean)} ms on average${pace ? `, ${comparedWithAverage(total.mean / pace)}` : ""}`;
      }
    } else {
      const total = totals.get(key);
      if (!total || total.attempts < minKeyAttempts) {
        node.append(element("span", "", keyLabel(key)), element("small", "", total ? "few" : "–"));
        detail = total ? `Typed ${plural(total.attempts, "time")}, not enough to tell yet` : "Not typed yet";
      } else {
        node.dataset.heat = String(heatSteps.findIndex((step) => total.rate < step.below));
        node.append(element("span", "", keyLabel(key)), element("small", "", formatRate(total.rate)));
        detail = `${formatRate(total.rate)} missed: ${total.misses.toLocaleString()} of ${total.attempts.toLocaleString()}`;
      }
    }
    node.tabIndex = 0;
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", `${name}: ${detail}`);
    const show = () => {
      tip.replaceChildren(element("div", "chart-tip-title", name), element("div", "chart-tip-when", detail));
      placeTip(keymap, tip, node.offsetLeft + node.offsetWidth - 8, node.offsetTop + node.offsetHeight + 6);
    };
    const hide = () => { tip.hidden = true; };
    node.addEventListener("pointerenter", show);
    node.addEventListener("pointerleave", hide);
    node.addEventListener("focus", show);
    node.addEventListener("blur", hide);
    return node;
  };
  for (const [keys, indent] of keymapRows) {
    const row = element("div", "keymap-row");
    row.style.setProperty("--indent", indent);
    row.append(...keys.map((key) => cell(key, key === " " ? "space" : key === "\n" ? "enter" : "")));
    keymap.insertBefore(row, tip);
  }

  const steps = speed ? speedSteps : heatSteps;
  get("heat-legend").replaceChildren(...[...steps.map((step, index) => [step.label, `var(--heat-${index})`]), [`Under ${minKeyAttempts} tries`, ""]]
    .map(([label, color]) => {
      const item = element("li");
      const swatch = element("span", "heat-swatch");
      if (color) swatch.style.background = color;
      item.append(swatch, label);
      return item;
    }));

  const list = get("weak-list");
  if (speed) {
    // Pairs slower than your average key, slowest first.
    const pairs = Object.entries(settings.pairTimes)
      .map(([pair, [sum, count]]) => ({ pair, mean: sum / count, count }))
      .filter(({ mean, count }) => count >= minTimedPairs && (!pace || mean > pace))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, 8);
    if (pairs.length === 0) {
      list.replaceChildren(element("li", "weak-empty", pace
        ? `No slow pairs: every pair of keys timed ${minTimedPairs} or more times is at or under your average.`
        : `No pair of keys timed ${minTimedPairs} or more times yet.`));
      return;
    }
    list.replaceChildren(...pairs.map(({ pair, mean, count }) =>
      barRow(pairLabel(pair), mean / pairs[0].mean, `${Math.round(mean)} ms`, pace ? `${(mean / pace).toFixed(1)}× average` : plural(count, "time"))));
    return;
  }
  const weak = [...totals]
    .filter(([, total]) => total.attempts >= minKeyAttempts && total.misses > 0)
    .sort(([, a], [, b]) => b.rate - a.rate || b.attempts - a.attempts)
    .slice(0, 8);
  if (weak.length === 0) {
    list.replaceChildren(element("li", "weak-empty", `No misses yet on any key typed ${minKeyAttempts} or more times.`));
    return;
  }
  const highest = weak[0][1].rate;
  list.replaceChildren(...weak.map(([key, total]) =>
    barRow(keyLabel(key), total.rate / highest, formatRate(total.rate), `${total.misses.toLocaleString()} of ${total.attempts.toLocaleString()}`)));
}

// ---- The history page --------------------------------------------------------------

function renderHistoryFilters() {
  for (const [hostId, options, key] of [["history-range", statRanges, "range"], ["history-kind", statKinds, "kind"]]) {
    const host = get(hostId);
    if (host.childElementCount === 0) {
      host.append(...options.map((option) => {
        const button = element("button", "segment", option.name);
        button.type = "button";
        button.dataset.option = option.id;
        button.addEventListener("click", () => {
          historyFilter[key] = option.id;
          historyFilter.chosen = true;
          renderOverview();
        });
        return button;
      }));
    }
    setPressed([...host.children], (button) => button.dataset.option === historyFilter[key]);
  }
}

function renderOverview() {
  renderHistoryFilters();
  const entries = filteredHistory();
  const empty = entries.length === 0;
  const note = get("overview-empty");
  note.hidden = !empty;
  for (const id of ["history-tiles", "trend-card", "activity-card"]) get(id).hidden = empty;
  if (empty) {
    get("breakdown-card").hidden = true;
    get("sprint-card").hidden = true;
    const range = currentRange();
    const what = historyFilter.kind === "all" ? "results" : `${kindNouns[historyFilter.kind]} results`;
    note.textContent = range.days ? `No ${what} in the last ${range.name}.` : `No ${what} yet.`;
    return;
  }
  renderTiles(entries);
  renderTrendChart(entries);
  renderActivityChart(entries);
  renderBreakdown(entries);
  renderSprintTable(entries);
}

function renderHistory() {
  const empty = settings.history.length === 0;
  get("history-empty").hidden = !empty;
  get("clear-history").hidden = empty;
  get("history-content").hidden = empty;
  renderHistorySummary();
  if (empty) return;
  // Until a range is picked, open on all time when the default range has nothing in it.
  if (!historyFilter.chosen && filteredHistory().length === 0) historyFilter.range = "all";
  renderOverview();
  renderKeys();
  renderResults();
}

// Charts are drawn at the page's real width, so they are redrawn when it changes.
let historyWidth = 0;
new ResizeObserver(([entry]) => {
  const width = Math.round(entry.contentRect.width);
  if (!historyOpen || width === 0 || width === historyWidth) return;
  historyWidth = width;
  const entries = filteredHistory();
  if (entries.length === 0) return;
  renderTrendChart(entries);
  renderActivityChart(entries);
}).observe(get("history-content"));

// Every result, newest first, one card per day.
function renderResults() {
  const groups = new Map();
  for (const entry of settings.history) {
    const label = historyDay(entry.at);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(entry);
  }
  get("history-days").replaceChildren(...[...groups].map(([label, list]) => {
    const card = element("section", "card history-day");
    const table = element("table", "history-table");
    const thead = tableHead([["Time"], ["Exercise"], ["Result"], ["WPM", true], ["Accuracy", true], ["Rhythm", true], ["Duration", true], ["Typos", true]]);
    const tbody = element("tbody");
    for (const entry of list) {
      const row = element("tr");
      const exercise = element("td");
      exercise.append(element("span", "history-name", entry.name), element("span", "history-where", entry.where ?? ""));
      if (entry.line) exercise.append(element("span", "history-line", entry.line));
      if (entry.tip) exercise.title = `Tip: ${entry.tip}`;
      const [outcomeText, tone] = historyOutcomes[entry.outcome] ?? ["Done", "good"];
      const duration = entry.kind === "sprint" ? `${formatSeconds(entry.ms)} s` : formatTime(entry.ms);
      row.append(
        element("td", "history-when", new Date(entry.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })),
        exercise,
        element("td", `history-outcome ${tone}`, outcomeText),
        element("td", "num", entry.wpm == null ? "—" : String(entry.wpm)),
        element("td", "num", entry.accuracy == null ? "—" : `${entry.accuracy}%`),
        element("td", "num", entry.rhythm == null ? "—" : `${entry.rhythm}%`),
        element("td", "num", duration),
        element("td", "num", String(entry.typos ?? 0))
      );
      tbody.append(row);
    }
    table.append(thead, tbody);
    card.append(element("h3", "", label), table);
    return card;
  }));
}
