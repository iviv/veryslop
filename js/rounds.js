"use strict";

// ---- Rounds ------------------------------------------------------------------

function startRound(moveFocus = true) {
  stopClock();
  if (libraryOpen) setLibraryOpen(false);
  if (historyOpen) setHistoryOpen(false);
  // A warm-up lasts while its steps are what's being typed; going anywhere else ends it.
  if (warmup && !warmupContinues()) endWarmup();
  const area = currentArea();
  get("focus-name").textContent = area.name;
  const drill = settings.view === "course" ? currentDrill() : null;
  const passage = settings.view === "text" ? (currentPassage ??= drawPassage()) : null;
  const practice = settings.view === "practice"
    ? (currentPractice ??= buildPractice(area, settings.practice[area.id] ?? "mixed", settings.drillLength))
    : null;
  const sprint = settings.view === "fun" ? (currentSprint ??= buildSprint()) : null;
  // Course code drills are one sample; a code checkpoint draws a sample the lesson didn't use.
  const drillSample = drill?.samples ? checkpointSample(drill) : drill?.code ?? null;
  const code = passage?.code ? passage : practice?.code ? practice : drillSample ? { text: drillSample.code, syntax: drillSample.syntax } : null;
  const drillGroups = drill && !code
    ? (drill.checkpoint ? checkpointText(drill, settings.drillLength).match(/\S+ ?/g) : repeatPattern(drill.prompt, lessonLength))
    : null;
  const groups = code ? null : drill ? drillGroups : (passage?.text ?? practice?.text ?? sprint.text).match(/\S+ ?/g);
  round = {
    drill, passage, practice, sprint, characters: code ? code.text : groups.join(""), cells: [], position: 0, activeMs: 0, lastKeyAt: null, endedAt: null,
    failed: false, passed: false, newlyDone: false, correct: 0, mistakes: 0, typoPositions: new Set(), tripReason: null,
    pending: [], deleted: 0, pileSizes: [],
    misses: new Map(), lastWrong: null,
    // Timing: the gaps between correct keys (timing.js), and the race-your-best marker.
    gaps: [], lastCorrectAt: null, lastTyped: null, ghost: null, ghostCell: null, typeable: null,
    // Code is typed line by line; `auto` holds the indentation positions the cursor skips.
    code: !!code, auto: code ? indentPositions(code.text) : new Set()
  };
  round.ghost = ghostSpeed();
  resultBanner.hidden = true;
  typingArea.hidden = false;

  const prompt = get("prompt");
  prompt.classList.toggle("prose", !!passage && !code);
  prompt.classList.toggle("grouped", !!drill && !drill.checkpoint && !code && !drill.prompt.includes(" "));
  prompt.classList.toggle("long", !passage && !code && round.characters.length > 64);
  prompt.classList.toggle("code", !!code);
  prompt.replaceChildren();
  if (code) {
    // One row per line of code. Spaces are plain spaces (a dot appears only at the cursor), and each line
    // ends in a faint return mark, typed with Return.
    let line = element("div", "code-line");
    prompt.append(line);
    [...round.characters].forEach((character, index) => {
      const classes = ["character"];
      if (character === "\n") classes.push("newline");
      else if (character === " ") classes.push(round.auto.has(index) ? "indent" : "space");
      if (code.syntax[index]) classes.push(`tok-${code.syntax[index]}`);
      const cell = element("span", classes.join(" "), character === "\n" ? "↵" : character);
      round.cells.push(cell);
      line.append(cell);
      if (character === "\n") {
        line = element("div", "code-line");
        prompt.append(line);
      }
    });
    skipIndent();
  } else {
    for (const group of groups) {
      const chunk = element("span", "chunk");
      for (const character of group) {
        const cell = element("span", character === " " ? "character space" : "character", character);
        round.cells.push(cell);
        chunk.append(cell);
      }
      prompt.append(chunk);
    }
  }
  prompt.scrollTop = 0;
  prompt.scrollLeft = 0;

  const attempt = attemptName();
  setPressed(viewButtons, (button) => button.dataset.view === settings.view);
  setPressed(textSourceButtons, (button) => button.dataset.textSource === (settings.textSource[area.id] ?? "focus"));
  setPressed(passageLengthButtons, (button) => button.dataset.passageLength === settings.passageLength);
  get("focus-source-name").textContent = area.text.short;
  // Code text comes in whole samples, so its lengths count samples rather than words.
  const codeText = area.code && settings.textSource[area.id] !== "books";
  for (const button of passageLengthButtons) {
    const length = button.dataset.passageLength;
    const [small, label] = codeText
      ? [plural(codeTextSamples[length], "exercise"), `${button.firstChild.textContent}, ${plural(codeTextSamples[length], "code exercise")}`]
      : passageLengthLabels[length];
    button.querySelector("small").textContent = small;
    button.setAttribute("aria-label", label);
  }

  progress.max = typeableTotal();
  wpmStat.hidden = !passage;
  get("settings-title").textContent = drill ? "Drill settings" : passage ? "Text settings" : sprint ? "Sprint settings" : "Practice settings";
  // Lesson and library drills have a set length; checkpoints and practice follow the slider.
  get("length-settings").hidden = !!passage || !!sprint || (!!drill && !drill.checkpoint);
  get("sprint-settings").hidden = !sprint;
  if (sprint) renderSprintTypes();
  get("practice-settings").hidden = !practice;
  if (practice) renderPracticeTypes(area, practice.type);
  get("text-settings").hidden = !passage;
  get("progress-card").hidden = !drill;
  get("misses-scope").textContent = `This ${attempt}`;
  passageSource.hidden = !passage?.url;
  if (passage?.url) passageSource.href = passage.url;
  renderTypoLimit();
  renderResetModes();
  drillLengthControl.value = settings.drillLength;
  updateLengthLabel();

  let location;
  let title;
  let description;
  if (drill?.checkpoint) {
    location = `Lesson ${drill.lesson.number} · ${drill.lesson.name} · Checkpoint`;
    title = "Checkpoint";
    description = drill.samples
      ? `A short program this lesson didn't use. Pass with ${passMark}% accuracy to finish the lesson. Press Return at the end of each line; indentation fills in for you.`
      : `A fresh mix of this lesson's drills, new every attempt. Pass with ${passMark}% accuracy to finish the lesson.`;
    description += isFluent(drill)
      ? ` You've passed it at Fluent speed, ${area.fluentWpm} wpm or more.`
      : ` A pass at ${area.fluentWpm} wpm or more also counts as Fluent.`;
  } else if (drill) {
    location = drill.lesson
      ? `Lesson ${drill.lesson.number} · ${drill.lesson.name} · Drill ${drill.step} of ${drill.lesson.list.length - 1}`
      : `Library · ${drill.unit.name} · Drill ${drill.index} of ${drill.unit.list.length}`;
    title = drill.title;
    description = drill.unit.instruction;
  } else if (passage) {
    location = passage.code ? `${passage.author} · ${plural(passage.lines, "line")}` : `${passage.author} · ${passage.words} words`;
    title = passage.title;
    description = passage.code
      ? "Type the code as it appears. Press Return at the end of each line; indentation fills in for you."
      : passage.generated
        ? "Generated for this focus. Type it exactly as shown."
        : "Type the passage, including capitalization and punctuation.";
  } else if (sprint) {
    const best = settings.sprintBest[sprint.type.id];
    location = "Fun · Sprint";
    title = sprint.type.title;
    description = `${sprint.type.description} The clock starts on your first key.${best ? ` Your best is ${formatSeconds(best)} seconds.` : ""}`;
  } else if (practice.review) {
    const { lesson } = practice.review;
    location = `${area.name} · Practice`;
    title = practice.review.current ? `Lesson ${lesson.number} mix: ${lesson.name}` : `Review: ${lesson.name}`;
    description = practice.review.current
      ? `A mix of lesson ${lesson.number}, the one you're working on. Once you pass a lesson's checkpoint, warm-ups review that lesson instead.`
      : `A fresh mix of lesson ${lesson.number}, whose checkpoint you passed earlier, to keep it sharp.`;
    if (practice.code) description += " Press Return at the end of each line; indentation fills in for you.";
  } else {
    const type = area.practiceTypes.find((option) => option.id === practice.type);
    location = `${area.name} · Practice`;
    const targets = [...practice.keys.map(describeKey), ...(practice.pairs ?? []).map((pair) => `${pair[0]}→${pair[1]}`)];
    title = practice.mode === "weak" ? `${practice.missed ? "Missed keys" : "Weak keys"}: ${targets.join("  ")}` : type.name;
    description = practice.from
      ? `Built from the keys you missed in ${practice.from.title}. When you're done, go back to the course from the result.`
      : practice.type === "weak" && practice.mode !== "weak"
      ? "There isn't enough typing history for this focus yet, so this round mixes the whole course. Weak keys appear after a few rounds."
      : type.description;
    if (practice.code) description += " Press Return at the end of each line; indentation fills in for you.";
  }
  const step = warmupStepOf(practice ?? passage);
  if (step) location = `Warm-up · Step ${step.number} of ${warmup.steps.length} · ${location}`;
  get("lesson-location").textContent = location;
  get("lesson-title").textContent = title;
  get("mode-description").textContent = description;

  courseMapButton.hidden = !drill;
  previousDrill.hidden = !drill;
  previousDrill.disabled = !!drill && !neighbourDrill(drill, -1);
  nextDrill.disabled = !!drill && !neighbourDrill(drill, 1);
  nextDrill.classList.remove("primary");
  nextDrill.classList.toggle("is-passage", !drill);
  nextDrillLabel.textContent = step ? (step.number < warmup.steps.length ? "Skip step" : "Finish warm-up")
    : drill ? "Next drill" : passage ? "New passage" : sprint ? "Next sprint" : "New round";
  newRound.classList.remove("primary");
  newRoundLabel.textContent = `Reset ${attempt}`;
  newRound.title = `Reset this ${attempt} (esc)`;
  get("escape-hint").textContent = "reset";
  get("enter-hint").textContent = drill ? "results when done" : passage ? "new passage when done" : sprint ? "go again when done" : "new round when done";

  const spaceInstruction = round.code
    ? " Press Return at ↵ for each new line."
    : !passage && round.characters.includes(" ") ? " Type Space at the dot." : "";
  const deleteInstruction = settings.correction ? " Press Delete to remove typos before you continue." : "";
  get("typing-instructions").textContent = `Type each character in order.${spaceInstruction}${deleteInstruction} Escape resets this ${attempt}.`;
  renderTypoHandling();
  setStatus(`Type to start.${spaceInstruction}`);
  updateProgress();
  renderStats();
  updateTypoHelp();
  renderMisses();
  // A new profile first chooses between the basics and a focus. Until then Return starts the basics, there is
  // nothing to reset, and the keyboard shows no next key.
  const welcoming = !!drill && !settings.welcomed;
  welcomePanel.hidden = !welcoming;
  renderGhost();
  newRound.hidden = welcoming;
  document.querySelector(".shortcuts").classList.toggle("welcoming", welcoming);
  renderKeyboard();
  if (drill) renderProgressCard();
  // Block world reminds you where your fingers go (themes/daniel.js).
  showFingerCheck(!welcoming);
  if (welcoming) {
    typingArea.hidden = true;
    get("enter-hint").textContent = "start the basics";
    setStatus("Choose where to start.");
    if (moveFocus) welcomePanel.focus({ preventScroll: true });
    return;
  }
  if (moveFocus) typingArea.focus({ preventScroll: true });
}

function describeKey(character) {
  return character === " " ? "Space" : character === "\n" ? "Return" : character;
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function setStatus(message, state = "") {
  status.className = state ? `status ${state}` : "status";
  status.textContent = message;
}

// Indentation in code is passed over, not typed, so counts of keys leave it out.
const typeableTotal = () => round.characters.length - round.auto.size;
const typedSoFar = () => round.position - [...round.auto].filter((index) => index < round.position).length;

// Moves the cursor past indentation, as an editor would after Return.
function skipIndent() {
  while (round.auto.has(round.position)) {
    round.cells[round.position].classList.add("done");
    round.position++;
  }
}

function updateProgress() {
  const previous = typingArea.querySelector(".current");
  if (previous) previous.classList.remove("current", "wrong");
  const active = round.cells[round.position];
  if (active) {
    active.classList.add("current");
    active.classList.toggle("wrong", round.lastWrong !== null);
    if (previous && previous !== active) active.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  progress.value = typedSoFar();
  get("counter").textContent = `${typedSoFar()} / ${typeableTotal()}`;
  const remaining = round.characters.slice(round.position);
  let promptDescription = "Round complete.";
  if (active) {
    promptDescription = round.passage
      ? `Next key: ${describeKey(remaining[0])}. ${remaining}`
      : `Remaining keys: ${[...remaining].map(describeKey).join(", ")}`;
  }
  get("remaining-prompt").textContent = promptDescription;
}

function renderStats() {
  const duration = activeTime();
  const attempts = round.correct + round.mistakes;
  const keysPerMinute = duration >= 1000 ? round.correct * 60000 / duration : null;
  statFields.accuracy.textContent = attempts ? `${Math.round(round.correct / attempts * 100)}%` : "—";
  statFields.mistakes.textContent = round.mistakes;
  statFields.elapsed.textContent = round.sprint ? `${formatSeconds(duration, 1)}s` : formatTime(duration);
  statFields.speed.textContent = keysPerMinute === null ? "—" : Math.round(keysPerMinute);
  if (round.passage) wpmValue.textContent = keysPerMinute === null ? "—" : Math.round(keysPerMinute / 5);
  renderBudget();
  renderGhost();
}

function renderMisses() {
  const entries = [...round.misses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  emptyMisses.hidden = entries.length > 0;
  emptyMisses.textContent = round.endedAt === null
    ? "Missed keys will show up here during the round."
    : "No keys missed this round.";
  missList.hidden = entries.length === 0;
  const most = entries[0]?.[1] ?? 1;
  missList.replaceChildren(...entries.map(([key, count]) => {
    const bar = element("span", "miss-bar");
    bar.setAttribute("aria-hidden", "true");
    const fill = element("span", "miss-bar-fill");
    fill.style.width = `${count / most * 100}%`;
    bar.append(fill);
    const item = element("li");
    item.append(element("kbd", "", describeKey(key)), bar, element("span", "miss-count", `${count} ${count === 1 ? "miss" : "misses"}`));
    return item;
  }));
  const inlineMisses = get("missed-inline");
  inlineMisses.hidden = entries.length === 0;
  inlineMisses.replaceChildren("Most missed", ...entries.slice(0, 3).map(([key, count]) => {
    const chip = element("kbd", "", describeKey(key));
    chip.append(element("span", "", `×${count}`));
    return chip;
  }));
}

function renderKeyboard() {
  for (const key of highlighted) key.classList.remove("target", "shift-hint", "use-shift", "missed");
  highlighted = [];
  keyboardFigure.hidden = !settings.keyboard;
  fingerGuide.hidden = !settings.keyboard;
  document.documentElement.dataset.keyboard = settings.keyboard ? "on" : "off";
  keyboardButton.setAttribute("aria-checked", String(settings.keyboard));
  hintButton.setAttribute("aria-checked", String(settings.hints));
  hintButton.disabled = !settings.keyboard;
  fingerColorButton.setAttribute("aria-checked", String(settings.fingerColors));
  soundButton.setAttribute("aria-checked", String(settings.sound));
  get("toggle-ghost").setAttribute("aria-checked", String(settings.ghost));
  fingerColorButton.disabled = !settings.keyboard;
  keyboard.classList.toggle("finger-colors", settings.fingerColors);
  if (!settings.keyboard) return;

  // While typos wait to be deleted, the next key to press is delete.
  if (settings.hints && round.pending.length > 0 && round.endedAt === null) {
    deleteKey.classList.add("target");
    highlighted.push(deleteKey);
    const count = round.pending.length;
    fingerGuide.replaceChildren("Press", element("kbd", "guide-key", "delete"), element("strong", "", `Right pinky · ${count} ${count === 1 ? "typo" : "typos"} to remove`));
    return;
  }

  const target = round.characters[round.position];
  const entry = keyMap.get(target);
  if (!settings.hints || !entry || round.endedAt !== null || !welcomePanel.hidden) {
    fingerGuide.textContent = "Find the raised marks on F and J to reset your hands.";
    return;
  }

  entry.key.classList.add("target");
  highlighted.push(entry.key);
  if (entry.shifted) {
    const shift = entry.finger.startsWith("L") ? rightShift : leftShift;
    shift.classList.add("shift-hint");
    entry.key.classList.add("use-shift");
    highlighted.push(shift);
  }
  const wrongKey = keyMap.get(round.lastWrong)?.key;
  if (wrongKey && wrongKey !== entry.key) {
    wrongKey.classList.add("missed");
    highlighted.push(wrongKey);
  }

  const parts = ["Next", element("kbd", "guide-key", describeKey(target)), element("strong", "", fingerText(entry))];
  if (round.lastWrong !== null) {
    const chip = element("span", "wrong-chip", "you hit");
    chip.append(element("kbd", "", describeKey(round.lastWrong)));
    parts.push(chip);
  }
  fingerGuide.replaceChildren(...parts);
}

function fingerText(entry) {
  if (!entry.shifted) return fingers[entry.finger];
  return `${fingers[entry.finger]} + ${entry.finger.startsWith("L") ? "right" : "left"} Shift`;
}
