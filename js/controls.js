"use strict";

// ---- Settings controls -----------------------------------------------------

function updateLengthLabel() {
  const keys = Number(drillLengthControl.value);
  const minutes = keys / 60;
  const minutesText = Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1);
  drillLengthValue.value = `${keys} keys · ~${minutesText} min`;
  drillLengthControl.setAttribute("aria-valuetext", `${keys} keys, about ${minutesText} minutes at one key per second`);
}

const attemptName = () => (round.drill ? "drill" : round.passage ? "passage" : round.sprint ? "sprint" : "round");

const resetMode = () => settings.resetModes[settings.view];

// The most typos a drill of this length can have and still round to the pass mark.
function allowedForPass(length) {
  let allowed = 0;
  while (Math.round(length / (length + allowed + 1) * 100) >= passMark) allowed++;
  return allowed;
}

// Typo positions within the last few keys; a character counts once however many times it was missed.
const recentTypos = () => [...round.typoPositions].filter((position) => position > round.position - streakWindow).length;

function trippedRule() {
  const mode = resetMode();
  // Pass or reset only stops checkpoints; lesson and library drills always run to the end.
  if (mode === "pass") return round.drill?.checkpoint && round.mistakes > allowedForPass(round.characters.length) ? "pass" : null;
  if (mode === "streak") return recentTypos() > streakLimit ? "streak" : null;
  if (mode === "perfect") return "perfect";
  if (mode === "custom") return round.typoPositions.size > settings.typoLimit ? "custom" : null;
  return null;
}

function updateTypoHelp() {
  const mode = resetMode();
  get("custom-limit-row").hidden = mode !== "custom";
  const limit = settings.typoLimit;
  const help = {
    pass: round.drill?.checkpoint
      ? `Stops when a ${passMark}% pass is out of reach: more than ${allowedForPass(round.characters.length)} typos on this ${round.characters.length}-key checkpoint.`
      : `Lesson drills always run to the end. Checkpoints stop once a ${passMark}% pass is out of reach.`,
    streak: round.passage
      ? `When more than ${streakLimit} typos land within ${streakWindow} keys, you go back to the start of the sentence.`
      : `Stops when more than ${streakLimit} typos land within ${streakWindow} keys.`,
    perfect: `Any typo restarts the ${attemptName()}. Use it on patterns you already know.`,
    custom: limit === 0 ? "The first typo stops it." : `Stops after more than ${limit} ${limit === 1 ? "typo" : "typos"}.`,
    off: "Never resets. Typos still count toward accuracy."
  }[mode];
  const countsOnce = mode === "streak" || (mode === "custom" && settings.typoLimit > 0);
  const note = countsOnce ? " Repeated presses on one character count once." : "";
  typoLimitHelp.textContent = help + note;
  renderBudget();
}

// The typo allowance shown in the stats strip, highlighted when one more typo would trip the rule.
function renderBudget() {
  const mode = resetMode();
  let value = null;
  let label = "";
  let warn = false;
  if (mode === "pass" && round.drill?.checkpoint) {
    const left = Math.max(0, allowedForPass(round.characters.length) - round.mistakes);
    [value, label, warn] = [String(left), left === 1 ? "typo left to pass" : "typos left to pass", left <= 1];
  } else if (mode === "custom") {
    const left = Math.max(0, settings.typoLimit - round.typoPositions.size);
    [value, label, warn] = [String(left), left === 1 ? "typo left" : "typos left", left <= 1];
  } else if (mode === "streak") {
    const recent = recentTypos();
    [value, label, warn] = [`${recent}/${streakLimit}`, `typos in last ${streakWindow} keys`, recent >= streakLimit];
  } else if (mode === "perfect") {
    [value, label] = ["0", "typos allowed"];
  }
  const stat = get("budget-stat");
  stat.hidden = value === null;
  stat.classList.toggle("warn", warn);
  if (value !== null) {
    get("budget-value").textContent = value;
    get("budget-label").textContent = label;
  }
}

// Streak guard in Text sends you back to the start of the current sentence (or line of code) instead of
// ending the passage.
function rewindSentence() {
  const recent = recentTypos();
  const before = round.characters.slice(0, round.position);
  const boundary = [...before.matchAll(/[.!?]["')\]]* /g)].at(-1);
  const start = round.code ? before.lastIndexOf("\n") + 1 : boundary ? boundary.index + boundary[0].length : 0;
  for (let index = start; index < round.position; index++) round.cells[index].classList.remove("done");
  round.position = start;
  skipIndent();
  round.typoPositions.clear();
  round.pending.length = 0;
  round.lastWrong = null;
  renderPending();
  setStatus(`${recent} typos in ${streakWindow} keys. Back to the start of the ${round.code ? "line" : "sentence"}.`, "error");
  updateProgress();
  renderStats();
  updateTypoHelp();
  renderMisses();
  renderKeyboard();
}

function renderTypoLimit() {
  get("typo-limit-value").textContent = settings.typoLimit;
  typoLimitDown.disabled = settings.typoLimit <= typoLimitRange.min;
  typoLimitUp.disabled = settings.typoLimit >= typoLimitRange.max;
}

function changeTypoLimit(step) {
  const limit = Math.min(typoLimitRange.max, Math.max(typoLimitRange.min, settings.typoLimit + step));
  if (limit === settings.typoLimit) return;
  settings.typoLimit = limit;
  saveSettings();
  renderTypoLimit();
  updateTypoHelp();
}

function setPressed(buttons, isPressed) {
  for (const button of buttons) button.setAttribute("aria-pressed", String(isPressed(button)));
}

function buildSprint() {
  const type = sprintById.get(settings.sprint);
  return { type, text: type.text() };
}

function chooseSprint(id) {
  settings.sprint = id;
  saveSettings();
  currentSprint = null;
  startRound();
}

function renderSprintTypes() {
  sprintTypeGrid.replaceChildren(...sprints.map((type) => {
    const chip = element("button", "chip", type.name);
    chip.type = "button";
    chip.title = type.description;
    chip.setAttribute("aria-pressed", String(type.id === settings.sprint));
    chip.addEventListener("click", () => chooseSprint(type.id));
    return chip;
  }));
}

function renderPracticeTypes(area, selected) {
  practiceTypeGrid.replaceChildren(...area.practiceTypes.map((option) => {
    const chip = element("button", "chip", option.name);
    chip.type = "button";
    chip.title = option.description;
    chip.setAttribute("aria-pressed", String(option.id === selected));
    chip.addEventListener("click", () => {
      if (option.id === selected) {
        typingArea.focus({ preventScroll: true });
        return;
      }
      settings.practice[area.id] = option.id;
      saveSettings();
      newPractice();
    });
    return chip;
  }));
}
