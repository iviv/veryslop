"use strict";

// ---- Keyboard ----------------------------------------------------------------

const keyMap = new Map();

function makeKey({ label, character = label, upper, finger, span = 4, classes = "", title = label }) {
  const key = element("span", `key ${classes}`.trim());
  key.style.gridColumn = `span ${span}`;
  if (title) key.title = title;
  if (finger) key.dataset.zone = finger.endsWith("I") ? (finger.startsWith("L") ? "index-left" : "index-right") : zones[finger.at(-1)];
  if (upper) {
    key.classList.add("shifted");
    key.append(element("span", "upper", upper));
    keyMap.set(upper, { key, finger, shifted: true });
  }
  key.append(element("span", "base", label));
  if (finger) keyMap.set(character, { key, finger, shifted: false });
  return key;
}

// Modifier legends follow M2-and-later MacBooks: `bottom` sits in the bottom corner on the key's own side and
// `top` in the opposite top corner. "globe" draws the globe icon and "led" the caps lock indicator.
function makeModifier(title, { side = "left", span = 4, top = "", bottom = "", classes = "" }) {
  const key = element("span", `key modifier ${side} ${classes}`.trim());
  key.style.gridColumn = `span ${span}`;
  key.title = title;
  const legend = (content, className) => {
    const part = element("span", className);
    if (content === "globe") part.append(icon("globe"));
    else if (content === "led") part.append(element("span", "led"));
    else part.textContent = content;
    return part;
  };
  key.append(legend(top, "mod-top"), legend(bottom, "mod-bottom"));
  return key;
}

function makeFunctionKey(label, iconName, action) {
  const key = element("span", "key function");
  key.style.gridColumn = "span 4";
  key.title = `${label} · ${action}`;
  key.append(icon(iconName), element("span", "fn-label", label));
  return key;
}

// The keyboard follows the Apple silicon MacBook layout (US).
function drawKeyboard() {
  const letterKeys = (row, fingering) => [...row].map((letter, index) => {
    const label = letter.toUpperCase();
    const finger = fingering[index];
    const key = makeKey({ label, character: letter, finger, classes: letter === "f" || letter === "j" ? "home" : "" });
    keyMap.set(label, { key, finger, shifted: true });
    return key;
  });
  const punctuation = (label, upper, finger) => makeKey({ label, upper, finger });
  const makeRow = (keys) => {
    const row = element("div", "key-row");
    row.append(...keys);
    keyboard.append(row);
  };
  const functionKeys = [
    ["F1", "sun-min", "Brightness down"], ["F2", "sun-max", "Brightness up"], ["F3", "mission", "Mission Control"],
    ["F4", "search", "Spotlight"], ["F5", "mic", "Dictation"], ["F6", "focus", "Do Not Disturb"],
    ["F7", "rewind", "Previous track"], ["F8", "play-pause", "Play or pause"], ["F9", "forward", "Next track"],
    ["F10", "mute", "Mute"], ["F11", "volume-down", "Volume down"], ["F12", "volume-up", "Volume up"]
  ];

  const deleteKey = makeModifier("Delete", { side: "right", span: 6, bottom: "delete" });
  // Return types the line breaks in code.
  const returnKey = makeModifier("Return", { side: "right", span: 7, bottom: "return" });
  keyMap.set("\n", { key: returnKey, finger: "RP", shifted: false });
  const leftShift = makeModifier("Left Shift", { span: 9, bottom: "shift" });
  const rightShift = makeModifier("Right Shift", { side: "right", span: 9, bottom: "shift" });
  const arrowStack = element("span", "arrow-stack");
  arrowStack.style.gridColumn = "span 4";
  arrowStack.append(
    makeKey({ label: "▲", classes: "arrow", title: "Up Arrow" }),
    makeKey({ label: "▼", classes: "arrow", title: "Down Arrow" })
  );

  makeRow([
    makeModifier("Escape", { span: 6, bottom: "esc" }),
    ...functionKeys.map(([label, iconName, action]) => makeFunctionKey(label, iconName, action)),
    makeKey({ label: "", classes: "touch-id", title: "Touch ID" })
  ]);
  makeRow([
    ...numberRow.map(([label, upper, finger]) => makeKey({ label, upper, finger, classes: "number" })),
    deleteKey
  ]);
  makeRow([
    makeModifier("Tab", { span: 6, bottom: "tab" }),
    ...letterKeys("qwertyuiop", ["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR", "RP"]),
    punctuation("[", "{", "RP"), punctuation("]", "}", "RP"), punctuation("\\", "|", "RP")
  ]);
  makeRow([
    makeModifier("Caps Lock", { span: 7, top: "led", bottom: "caps lock", classes: "caps-lock" }),
    ...letterKeys("asdfghjkl", ["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR"]),
    punctuation(";", ":", "RP"), punctuation("'", '"', "RP"),
    returnKey
  ]);
  makeRow([
    leftShift,
    ...letterKeys("zxcvbnm", ["LP", "LR", "LM", "LI", "LI", "RI", "RI"]),
    punctuation(",", "<", "RM"), punctuation(".", ">", "RR"), punctuation("/", "?", "RP"),
    rightShift
  ]);
  makeRow([
    makeModifier("Fn / Globe", { top: "fn", bottom: "globe" }),
    makeModifier("Control", { top: "⌃", bottom: "control" }),
    makeModifier("Left Option", { top: "⌥", bottom: "option" }),
    makeModifier("Left Command", { span: 5, top: "⌘", bottom: "command" }),
    makeKey({ label: "", character: " ", finger: "T", span: 20, classes: "space-key", title: "Space" }),
    makeModifier("Right Command", { side: "right", span: 5, top: "⌘", bottom: "command" }),
    makeModifier("Right Option", { side: "right", top: "⌥", bottom: "option" }),
    makeKey({ label: "◀", classes: "arrow arrow-side", title: "Left Arrow" }),
    arrowStack,
    makeKey({ label: "▶", classes: "arrow arrow-side", title: "Right Arrow" })
  ]);
  return { leftShift, rightShift, deleteKey };
}

const { leftShift, rightShift, deleteKey } = drawKeyboard();
let highlighted = [];
let round;
let timer = null;
// The clock only counts time spent typing: a gap between keystrokes counts for at most this long.
const idleLimit = 5000;

function activeTime(now = performance.now()) {
  if (round.lastKeyAt === null) return round.activeMs;
  return round.activeMs + Math.min(now - round.lastKeyAt, idleLimit);
}

function stopClock() {
  clearInterval(timer);
  timer = null;
}

function pauseClock() {
  round.activeMs = activeTime();
  round.lastKeyAt = null;
  stopClock();
}

function pauseRound() {
  pauseClock();
  setStatus("Paused · type to continue.");
  renderStats();
}

function tick() {
  if (performance.now() - round.lastKeyAt >= idleLimit) pauseRound();
  else renderStats();
}
