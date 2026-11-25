"use strict";

// Keystrokes: typing, typos and deleting them.

function markActivity() {
  const now = performance.now();
  round.activeMs = activeTime(now);
  round.lastKeyAt = now;
  timer ??= setInterval(tick, 250);
}

// Typos waiting to be deleted appear at the cursor, just before the character still to type.
function renderPending() {
  for (const node of typingArea.querySelectorAll(".character.extra")) node.remove();
  const anchor = round.cells[round.position];
  if (!anchor || round.pending.length === 0) return;
  for (const typed of round.pending) anchor.before(element("span", "character extra", typed === " " ? "·" : typed === "\n" ? "↵" : typed));
  anchor.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function renderTypoHandling() {
  setPressed(typoHandlingButtons, (button) => (button.dataset.typoHandling === "delete") === settings.correction);
  get("correction-help").textContent = settings.correction
    ? `Typos stay on screen until you press delete; option-delete clears them all. More than ${maxPending} in a row ends the ${attemptName()}.`
    : "The cursor waits on the key until you type it correctly.";
}

function handleDelete(all) {
  if (round.pending.length === 0) return;
  markActivity();
  // The first delete of a run records how many typos had piled up by then.
  if (!round.deletingRun) {
    round.pileSizes.push(round.pending.length);
    round.deletingRun = true;
  }
  const removed = all ? round.pending.length : 1;
  round.pending.length -= removed;
  round.deleted += removed;
  if (round.pending.length === 0) {
    round.lastWrong = null;
    round.deletingRun = false;
    setStatus("Round in progress", "active");
  } else {
    setStatus(`${round.pending.length} more to delete.`, "error");
  }
  renderPending();
  updateProgress();
  renderStats();
  renderKeyboard();
}

function handleAttempt(character) {
  markActivity();
  const target = round.characters[round.position];

  // With Delete to continue, every key typed while typos are waiting is another typo.
  if (round.pending.length > 0) {
    round.mistakes++;
    if (round.pending.length >= maxPending) {
      round.tripReason = "pileup";
      failRound();
      return;
    }
    round.pending.push(character);
    round.deletingRun = false;
    const rule = trippedRule();
    if (rule && !(rule === "streak" && round.passage)) {
      round.tripReason = rule;
      failRound();
      return;
    }
    const count = round.pending.length;
    setStatus(count === maxPending
      ? `${count} typos to delete. One more and the ${attemptName()} stops.`
      : `${count} typos to delete before you continue.`, "error");
    renderPending();
    renderStats();
    renderKeyboard();
    return;
  }

  const record = (settings.keyStats[target] ??= [0, 0]);
  if (character === target) {
    record[0]++;
    round.correct++;
    round.cells[round.position].classList.add("done");
    round.position++;
    skipIndent();
    round.lastWrong = null;
    if (round.position === round.characters.length) {
      updateProgress();
      finishRound();
      return;
    }
    if (status.textContent !== "Round in progress") setStatus("Round in progress", "active");
  } else {
    record[1]++;
    round.mistakes++;
    round.lastWrong = character;
    round.misses.set(target, (round.misses.get(target) ?? 0) + 1);
    round.typoPositions.add(round.position);
    const rule = trippedRule();
    if (rule === "streak" && round.passage) {
      rewindSentence();
      return;
    }
    if (rule) {
      round.tripReason = rule;
      failRound();
      return;
    }
    if (settings.correction) {
      round.pending.push(character);
      setStatus(`Expected ${describeKey(target)} · typed ${describeKey(character)}. Press delete to fix it.`, "error");
    } else {
      setStatus(`Expected ${describeKey(target)} · typed ${describeKey(character)}`, "error");
    }
    updateTypoHelp();
    renderMisses();
    typoDolphin();
  }
  updateProgress();
  renderPending();
  renderStats();
  renderKeyboard();
}
