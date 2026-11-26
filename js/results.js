"use strict";

// ---- Results -----------------------------------------------------------------

function resultAdvice(accuracy) {
  if (round.mistakes === 0) return ["No typos at all. Try a longer length, or turn key hints off."];
  const advice = [];
  const share = (matches) => [...round.misses].reduce((sum, [key, count]) => sum + (matches(key) ? count : 0), 0) / round.mistakes;
  const [topKey, topCount] = [...round.misses].sort((a, b) => b[1] - a[1])[0];
  const topEntry = keyMap.get(topKey);
  if (topCount >= 2 && topEntry) {
    const keyLabel = topKey === " " ? "Space" : keyName(topKey);
    advice.push(`Watch the ${keyLabel} key: ${topCount} misses. Slow down for it and use your ${fingerText(topEntry).toLowerCase()}.`);
  }
  // In Delete to continue, each pile counts the typo plus every key typed after it before the first delete.
  const piles = round.pileSizes;
  const keysPastTypo = piles.length ? piles.reduce((sum, size) => sum + size - 1, 0) / piles.length : 0;
  if (keysPastTypo >= 1.5) {
    advice.push(`You typed about ${keysPastTypo.toFixed(1)} more keys after each typo before deleting. Stop as soon as a key feels wrong.`);
  }
  if (share((key) => keyMap.get(key)?.shifted) >= 0.5) {
    advice.push("Most typos were shifted characters. Hold Shift with the opposite hand before you press the key.");
  }
  if (share((key) => key === " ") >= 0.5) {
    advice.push("Several typos were on Space. Tap it with a thumb and keep your fingers on the home row.");
  }
  if (round.failed && round.position < round.characters.length * 0.2) {
    advice.push("The typos came early. Start slower and build speed once the rhythm feels steady.");
  }
  if (accuracy < 90) {
    advice.push(`Accuracy was ${accuracy}%. Ease off the pace: clean keystrokes build speed faster than fixing typos.`);
  }
  if (advice.length === 0) {
    advice.push(round.failed || (round.drill?.checkpoint && !round.passed)
      ? "Take a breath and go again. Aim for a clean run over a fast one."
      : "Keep this pace and stay relaxed on the next one.");
  }
  return advice.slice(0, 3);
}

let resultActions = null;
// When the banner appeared; keys in the first moments after it are ignored, so typing momentum can't dismiss it.
let resultShownAt = 0;
const resultGuard = 400;

function recordResult(entry) {
  settings.history.unshift({ at: Date.now(), ...entry });
  if (settings.history.length > historyLimit) settings.history.length = historyLimit;
  saveSettings();
  renderToday();
}

// The banner itself takes focus (not its buttons), so a stray space can't press "Try again".
function presentResults() {
  typingArea.hidden = true;
  resultBanner.hidden = false;
  resultShownAt = performance.now();
  resultBanner.focus({ preventScroll: true });
  noteFinish(!round.failed && round.mistakes === 0);
}

// Clean runs get a next step to stretch for, not a generic reminder.
function cleanRunTip() {
  return pick([
    "No typos at all. Try a longer length next time.",
    "A clean run. Turn key hints off for the next one and type from memory.",
    "Spotless. Nudge the pace up a little on the next one.",
    "Clean and steady. Keep your eyes on the text instead of the keyboard guide.",
    "No typos. Next time, read a few characters ahead as you type."
  ]);
}

// Finished attempts this session, counted separately for drills, practice rounds and passages.
const sessionCounts = { drill: 0, round: 0, passage: 0, sprint: 0 };

// What the result says after comparing a sprint with the run before it, in the voice of the holiday theme if one is on.
const fasterQuips = {
  plain: ["Look at you go.", "The keyboard barely saw you coming.", "Somebody's been practicing. Take a bow.", "That's a personal glow-up.", "Smooth. Very smooth."],
  thanksgiving: ["Look at you go.", "Your fingers clearly skipped second helpings.", "The keyboard barely saw you coming.", "Somebody's been practicing. Take a bow.", "Smooth as gravy.", "That's a personal glow-up."],
  pixel: ["Level up!", "Speedrun material.", "New high score!", "Critical hit on the keyboard.", "Achievement unlocked: fast fingers.", "The dragons are impressed."],
  christmas: ["Look at you go.", "Santa's sleigh has nothing on you.", "Fast enough to make the reindeer jealous.", "Jingle all the way, at speed.", "Somebody's getting extra cookies this year.", "Dashing, truly."]
};
const slowerQuips = {
  plain: ["Were your fingers on a coffee break?", "A leisurely stroll. The keys enjoyed your company.", "Did someone hide the letters on you?", "Warm-up lap, surely?", "The clock got bored and checked its phone."],
  thanksgiving: ["Did you stop for a slice of pie?", "Were you typing in oven mitts?", "Your fingers seem to be in a food coma.", "A leisurely stroll. The keys enjoyed your company.", "Did someone hide the letters on you?", "Even the pumpkins were tapping their stems.", "Too much stuffing, not enough typing."],
  pixel: ["Lag spike?", "Did a lava pool slow you down?", "Mining one key at a time, huh?", "The slime got there first.", "Respawn and try again.", "Low on stamina? Eat some bread.", "Even the chicken rider was faster."],
  christmas: ["Were you typing in mittens?", "Too much eggnog?", "Stuck in a snowdrift?", "The elves type faster, and they're very busy.", "Did the reindeer borrow your keyboard?", "Even the snowman finished first, and it was melting."]
};

// A finished sprint shows just the time; underneath, how it compares with the previous run.
function showSprintResult() {
  const { type } = round.sprint;
  const milliseconds = Math.round(activeTime());
  const best = settings.sprintBest[type.id];
  const last = settings.sprintLast[type.id];
  if (!round.cheated) {
    settings.sprintLast[type.id] = milliseconds;
    if (!best || milliseconds < best) settings.sprintBest[type.id] = milliseconds;
    saveSettings();
  }

  const notes = [];
  if (!last) {
    notes.push("First run on this one. Now beat it.");
  } else {
    const gap = Math.abs(milliseconds - last);
    if (gap < 50) notes.push(`Exactly as fast as last time (${formatSeconds(last)} s). Consistent, at least.`);
    else if (milliseconds < last) notes.push(`${formatSeconds(gap)} s faster than last time (${formatSeconds(last)} s). ${pick(fasterQuips[settings.festive ?? "plain"])}`);
    else notes.push(`${formatSeconds(gap)} s slower than last time (${formatSeconds(last)} s). ${pick(slowerQuips[settings.festive ?? "plain"])}`);
    if (best && milliseconds < best) notes.push("New personal best!");
    else if (best && milliseconds >= last) notes.push(`Best ${formatSeconds(best)} s`);
  }
  if (round.mistakes) notes.push(`${round.mistakes} ${round.mistakes === 1 ? "typo" : "typos"}`);
  const goal = round.cheated ? "" : goalNote(milliseconds);
  if (goal) notes.push(goal);
  if (round.cheated) notes.splice(0, notes.length, "Cheat win. Your real times are untouched.");
  const nextType = sprints[(sprints.indexOf(type) + 1) % sprints.length];
  const retry = { label: "Go again", verb: "go again", run: () => startRound() };
  const next = { label: nextType.title, verb: `try ${nextType.title.toLowerCase()}`, run: () => chooseSprint(nextType.id) };
  const seconds = formatSeconds(milliseconds);

  get("result-title").replaceChildren(seconds, element("span", "result-unit", "seconds"));
  get("result-line").textContent = notes.join(" · ");
  get("result-figures").replaceChildren();
  get("result-tip").replaceChildren();
  get("result-progress").replaceChildren();
  get("result-primary-label").textContent = retry.label;
  get("result-secondary").textContent = next.label;
  get("result-secondary").hidden = false;
  resultActions = { primary: retry, secondary: next };

  resultBanner.classList.add("sprint");
  setStatus(`${seconds} seconds. Press return to go again, or esc to close.`, "complete");
  get("enter-hint").textContent = retry.verb;
  if (!round.cheated) recordResult({
    kind: "sprint", name: type.title, where: "Fun · Sprint", outcome: "done", title: `${seconds} seconds`, line: notes.join(" · "), tip: "",
    wpm: null, accuracy: Math.round(round.correct / (round.correct + round.mistakes) * 100), ms: milliseconds, typos: round.mistakes, keys: round.position, total: round.characters.length
  });
  presentResults();
}

function showResults() {
  resultBanner.classList.remove("sprint");
  if (round.sprint && !round.failed) {
    showSprintResult();
    return;
  }
  const area = currentArea();
  const duration = activeTime();
  const typed = typedSoFar();
  const total = typeableTotal();
  const accuracy = round.correct + round.mistakes ? Math.round(round.correct / (round.correct + round.mistakes) * 100) : 100;
  const wpm = duration >= 1000 ? Math.round(round.correct * 12000 / duration) : null;
  const drill = round.drill;
  const group = drill ? (drill.lesson ? drill.lesson.list : drill.unit.list) : null;
  const groupDone = group ? progressOf(group) : null;

  const retry = { label: "Try again", verb: "try again", run: () => startRound() };
  const map = { label: "Course map", verb: "open the course map", run: () => setLibraryOpen(true) };
  const newText = { label: "New passage", verb: "get a new passage", run: newPassage };
  const another = { label: "New round", verb: "start a new round", run: newPractice };
  // What comes next. On the course it is the same drill the map suggests; after a finished basics course, the
  // next course in the basics; in the library, the next drill in the unit.
  let next = null;
  if (drill?.lesson) {
    const target = recommendedDrill(area);
    const following = target ? null : nextBasics(area);
    if (target) {
      const label = target === neighbourDrill(drill, 1) ? (target.checkpoint ? "Take the checkpoint" : "Next drill") : "Continue";
      next = { label, verb: label === "Continue" ? "continue the course" : label.toLowerCase().replace("next", "go to the next"), run: () => chooseDrill(target.id), drill: target };
    } else if (following) {
      next = { label: `Start ${following.name}`, verb: `start the ${following.name} course`, run: () => startCourse(following), area: following };
    }
  } else if (drill) {
    const target = neighbourDrill(drill, 1);
    if (target) next = { label: "Next drill", verb: "go to the next drill", run: () => chooseDrill(target.id), drill: target };
  }
  // In a warm-up, each step leads to the next, and the last one back to where you were.
  const step = warmupStepOf(round.practice ?? round.passage);
  if (step) {
    warmup.ms += Math.round(duration);
    if (!round.failed && step.review && !step.review.current) settings.reviewed[step.review.lesson.list.at(-1).id] = Date.now();
  }
  const nextStep = step ? warmup.steps[step.number] ?? null : null;
  const onward = !step ? null : nextStep
    ? { label: `Next: ${nextStep.name}`, verb: "go to the next warm-up step", run: advanceWarmup }
    : { label: warmupReturnLabel(), verb: warmupReturnLabel().toLowerCase(), run: finishWarmup };
  // A practice round started from a course result leads back to the course.
  const from = round.practice?.from;
  const back = from ? { label: "Back to the course", verb: "go back to the course", run: () => startCourse(from.area) } : null;
  // After a course attempt with typos, a round built from the keys it missed.
  const missed = [...round.misses].filter(([key]) => key.trim()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key]) => key);
  const practice = drill && missed.length && !round.cheated
    ? { label: "Practice missed keys", run: () => practiceMissedKeys(missed, drill) }
    : null;

  // Personal bests are kept per course drill, per practice type, and per focus for text.
  let bestNote = "";
  if (!round.failed && wpm !== null && !round.cheated) {
    const key = bestKeyFor();
    const previous = settings.best[key];
    if (previous && wpm > previous.wpm) bestNote = `New best: ${wpm - previous.wpm} wpm faster than before.`;
    else if (previous && accuracy > previous.accuracy) bestNote = `Your most accurate run yet, up from ${previous.accuracy}%.`;
    settings.best[key] = { wpm: Math.max(wpm, previous?.wpm ?? 0), accuracy: Math.max(accuracy, previous?.accuracy ?? 0) };
    // The race-your-best marker keeps the pace of your best run at the pass mark or better.
    const pace = accuracy >= passMark ? Math.max(wpm, previous?.pace ?? 0) : previous?.pace;
    if (pace) settings.best[key].pace = pace;
    saveSettings();
  }

  let title;
  let line;
  let primary;
  let secondary;
  let success;
  if (round.failed) {
    success = false;
    title = "Stopped early";
    const reason = {
      pass: `A ${passMark}% pass was out of reach`,
      streak: `${streakLimit + 1} typos landed within ${streakWindow} keys`,
      perfect: "Perfect run ends at the first typo",
      custom: `That was typo ${round.typoPositions.size}, past your limit of ${settings.typoLimit}`,
      pileup: `More than ${maxPending} typos piled up in a row`
    }[round.tripReason];
    line = `${reason}, ${Math.round(typed / total * 100)}% of the way in.`;
    primary = retry;
    secondary = step ? { ...onward, label: nextStep ? "Skip to the next step" : "Finish warm-up" }
      : drill ? map : round.passage ? newText : round.sprint ? null : back ?? another;
  } else if (drill?.checkpoint) {
    success = round.passed;
    if (round.passed) {
      title = round.fluent ? "Checkpoint passed · Fluent" : "Checkpoint passed";
      if (round.newlyDone) {
        line = progressOf(area.path).complete ? `That completes the ${area.name} course.` : `That completes lesson ${drill.lesson.number}: ${drill.lesson.name}.`;
      } else {
        line = bestNote || "Passed again. Repeats like this keep it sharp.";
      }
      if (round.newlyFluent) line += ` Fluent too: ${wpm} wpm clears the ${area.fluentWpm} wpm mark.`;
      primary = next ?? map;
      secondary = retry;
    } else {
      title = "Not quite";
      const gap = passMark - accuracy;
      line = gap <= 5 ? `${gap}% short of a pass. One more go should do it.` : `A pass needs ${passMark}%. Ease off the pace and it will come.`;
      primary = retry;
      secondary = map;
    }
  } else if (drill) {
    // Lesson and library drills count as done once finished; the checkpoint is where accuracy is tested.
    success = true;
    title = "Drill done";
    const left = groupDone.total - groupDone.done;
    if (accuracy < passMark) {
      line = drill.lesson
        ? `${accuracy}% accuracy. That counts, but the checkpoint needs ${passMark}%, so take the next one a little slower.`
        : `${accuracy}% accuracy. Take the next one a little slower and aim for ${passMark}%.`;
    } else if (bestNote) {
      line = bestNote;
    } else if (round.newlyDone) {
      const checkpointLeft = drill.lesson && !isDone(drill.lesson.list.at(-1));
      const drillsLeft = left - (checkpointLeft ? 1 : 0);
      line = drillsLeft === 0 && checkpointLeft ? "Only the checkpoint is left in this lesson."
        : left === 0 ? `That's every drill in ${drill.lesson ? "this lesson" : "this unit"}.`
        : checkpointLeft ? `${plural(drillsLeft, "drill")} and the checkpoint to go in this lesson.`
        : `${plural(drillsLeft, "drill")} to go in this ${drill.lesson ? "lesson" : "unit"}.`;
    } else {
      line = "Already done. Repeats like this keep it sharp.";
    }
    primary = next ?? map;
    secondary = retry;
  } else {
    success = true;
    title = round.passage ? "Passage complete" : "Round complete";
    const kind = round.passage ? "passage" : "round";
    const count = sessionCounts[kind];
    line = bestNote || (count > 1 ? `That's ${count} ${kind}s this session. Keep the rhythm going.` : "Keep the rhythm going with another one.");
    primary = back ?? (round.passage ? newText : another);
    secondary = retry;
    if (step) {
      title = nextStep ? `Warm-up step ${step.number} done` : "Warm-up done";
      line = nextStep ? bestNote || `${plural(warmup.steps.length - step.number, "step")} to go.` : `${formatDuration(warmup.ms)} of typing across ${plural(warmup.steps.length, "step")}.`;
      primary = onward;
    }
  }

  const goal = round.cheated ? "" : goalNote(duration);
  if (goal) line += ` ${goal}`;
  if (round.cheated) line = "Cheat win. Nothing was saved to your progress.";
  get("result-title").textContent = title;
  get("result-line").textContent = line;

  // Accuracy shows green at a pass and red below it on checkpoints; lesson drills only get the green.
  const accuracyTone = !drill ? "" : accuracy >= passMark ? "good" : drill.checkpoint ? "short" : "";
  // On a checkpoint, the speed shows green at Fluent pace.
  const wpmTone = drill?.checkpoint && round.passed && wpm >= area.fluentWpm ? "good" : "";
  const rhythm = rhythmOf(round.gaps);
  const figures = [[`${accuracy}%`, "accuracy", accuracyTone]];
  if (wpm !== null) figures.push([String(wpm), "wpm", wpmTone]);
  if (rhythm !== null) {
    figures.push([`${rhythm}%`, "rhythm", "", `Rhythm: ${rhythm}% of your keystrokes came at an even pace, close to your typical gap between keys.`]);
  }
  figures.push([formatTime(duration), "time", ""]);
  figures.push([String(round.mistakes), round.mistakes === 1 ? "typo" : "typos", ""]);
  if (settings.correction) figures.push([String(round.deleted), "deleted", ""]);
  get("result-figures").replaceChildren(...figures.map(([value, label, tone, title]) => {
    const item = element("div", tone);
    if (title) item.title = title;
    item.append(element("dt", "", label), element("dd", "", value));
    return item;
  }));

  // Typos come first; a clean run gets a word on rhythm or the slowest pair, if either stood out.
  const slowPair = slowestPairOf(round.gaps);
  const tip = round.mistakes > 0 ? resultAdvice(accuracy)[0]
    : rhythm !== null && rhythm < unevenRhythm ? `Your rhythm was uneven: ${rhythm}% of keys came at a steady pace. Slow down to a pace you can keep for every key, the hard ones included.`
    : slowPair ? `${describePair(slowPair.pair)} took about ${slowPair.ratio.toFixed(1)} times your usual gap between keys. Weak keys practice drills slow pairs like this one.`
    : cleanRunTip();
  get("result-tip").replaceChildren(element("strong", "", "Tip: "), tip);

  const progressLine = get("result-progress");
  progressLine.replaceChildren();
  if (step) {
    progressLine.append(`Warm-up · Step ${step.number} of ${warmup.steps.length}`);
    if (nextStep) progressLine.append(" · Up next: ", element("strong", "", nextStep.name));
  } else if (drill) {
    progressLine.append(`${drill.lesson ? `Lesson ${drill.lesson.number}` : drill.unit.name} · ${groupDone.done} of ${groupDone.total} done`);
    if (drill.checkpoint) progressLine.append(isFluent(drill) ? " · Fluent" : ` · Fluent at ${area.fluentWpm} wpm`);
    if (primary === next && next.drill) progressLine.append(" · Up next: ", element("strong", "", next.drill.checkpoint ? `Lesson ${next.drill.lesson.number} checkpoint` : next.drill.title));
    else if (primary === next && next.area) progressLine.append(" · Up next: ", element("strong", "", `${next.area.name} course`));
  } else {
    const kind = round.passage ? round.passage.title : round.sprint ? round.sprint.type.title
      : round.practice.missed ? "Missed keys" : round.practice.review ? "Review"
      : area.practiceTypes.find((option) => option.id === round.practice.type).name;
    progressLine.append(round.sprint ? `Fun · ${kind}` : `${area.name} · ${kind}`);
  }

  get("result-primary-label").textContent = primary.label;
  get("result-secondary").textContent = secondary?.label ?? "";
  get("result-secondary").hidden = !secondary;
  get("result-practice").hidden = !practice;
  resultActions = { primary, secondary, practice };

  setStatus(`${title}. Press return to ${primary.verb}, or esc to close.`, success ? "complete" : "error");
  get("enter-hint").textContent = primary.verb;
  if (primary === next && next.drill === neighbourDrill(drill, 1)) nextDrill.classList.add("primary");
  const name = drill ? drill.title : round.passage ? round.passage.title : round.sprint ? round.sprint.type.title
    : round.practice.review ? `Review: ${round.practice.review.lesson.name}` : area.practiceTypes.find((option) => option.id === round.practice.type).name;
  const place = !drill ? "" : drill.checkpoint ? `Lesson ${drill.lesson.number} checkpoint`
    : drill.lesson ? `Lesson ${drill.lesson.number}, drill ${drill.step}` : `Library · ${drill.unit.name}, drill ${drill.index}`;
  const where = drill ? `${area.name} · ${place}` : step ? `${area.name} · Warm-up` : round.passage ? `${area.name} · Text` : round.sprint ? "Fun · Sprint" : `${area.name} · Practice`;
  if (!round.cheated) recordResult({
    kind: attemptName(), name, where,
    outcome: round.failed ? "stopped" : drill?.checkpoint ? (round.fluent ? "fluent" : round.passed ? "passed" : "short") : "done",
    title, line, tip: get("result-tip").textContent.replace(/^Tip:\s*/, ""), wpm, accuracy, rhythm, ms: Math.round(duration), typos: round.mistakes, keys: typed, total
  });
  presentResults();
}

// From a course result: a practice round built from the keys that attempt missed. Its own result leads back
// to the course. The practice type you usually pick is left as it was.
function practiceMissedKeys(keys, from) {
  const pool = from.lesson ? from.area.lessons.slice(0, from.lesson.number).flatMap((lesson) => lesson.list.at(-1).pool) : from.unit.items;
  settings.focus = from.area.id;
  settings.view = "practice";
  saveSettings();
  currentPractice = { ...buildPractice(from.area, "weak", settings.drillLength, keys, pool), from };
  startRound();
}

function finishRound() {
  round.endedAt = performance.now();
  pauseClock();
  const accuracy = Math.round(round.correct / (round.correct + round.mistakes) * 100);
  round.passed = accuracy >= passMark;
  // A checkpoint passed at its focus's Fluent speed is marked Fluent as well.
  const wpm = round.activeMs >= 1000 ? Math.round(round.correct * 12000 / round.activeMs) : 0;
  if (round.drill?.checkpoint && round.passed && !round.cheated && wpm >= round.drill.area.fluentWpm) {
    round.fluent = true;
    if (!isFluent(round.drill)) {
      settings.fluent.push(round.drill.id);
      round.newlyFluent = true;
    }
  }
  // A checkpoint counts at a pass; lesson and library drills count once finished.
  const counts = round.drill && !round.cheated && (round.passed || !round.drill.checkpoint);
  if (counts && !isDone(round.drill)) {
    settings.done.push(round.drill.id);
    round.newlyDone = true;
  }
  sessionCounts[attemptName()]++;
  saveSettings();
  if (round.drill) renderProgressCard();
  renderStats();
  renderMisses();
  renderKeyboard();
  showResults();
}

// Auto-reset stops the attempt and shows a summary; the next attempt starts on return.
function failRound() {
  round.failed = true;
  round.endedAt = performance.now();
  pauseClock();
  saveSettings();
  renderStats();
  updateTypoHelp();
  renderMisses();
  renderKeyboard();
  showResults();
}
