"use strict";

// ---- Typing times: slow keys, slow pairs and rhythm ------------------------------------
// Each correct keystroke that follows another correct one is timed: the gap since that key. Gaps after a typo
// (fixing it takes its own time), the first key of an attempt, and pauses longer than `maxGap` are left out.
// Totals are halved when they reach their cap, so recent typing counts for more than old typing.

const maxGap = 2000;
const timingCaps = { key: 300, pair: 60 };
// With fewer timed presses than these, an average says more about luck than about the typist.
const minTimedKeys = 10;
const minTimedPairs = 6;
// Nothing is called slow until this many keys have been timed.
const minTimedTotal = 100;
// How much slower than your average a key or pair has to be to count as slow.
const slowRatio = { key: 1.3, pair: 1.5 };

function addTiming(store, key, milliseconds, cap) {
  const record = (store[key] ??= [0, 0]);
  record[0] += Math.round(milliseconds);
  record[1]++;
  if (record[1] >= cap) {
    record[0] = Math.round(record[0] / 2);
    record[1] = Math.round(record[1] / 2);
  }
}

// A correct keystroke, `gap` milliseconds after the correct `previous` one. Pairs with Space or Return are left
// out of the pair times: the gap before a word says more about reading than about the reach.
function recordTiming(previous, character, gap) {
  addTiming(settings.keyTimes, character, gap, timingCaps.key);
  const pair = previous + character;
  const counted = !/\s/.test(pair);
  if (counted) addTiming(settings.pairTimes, pair, gap, timingCaps.pair);
  round.gaps.push({ ms: gap, pair: counted ? pair : null });
}

// The average gap between keys, in milliseconds: over every key, or over the keys a focus uses.
function typingPace(area = null) {
  let total = 0;
  let presses = 0;
  for (const [key, [sum, count]] of Object.entries(settings.keyTimes)) {
    if (area && !area.characters.has(key)) continue;
    total += sum;
    presses += count;
  }
  return presses >= minTimedTotal ? total / presses : null;
}

// Keys in a focus that take clearly longer than that focus's average, slowest first.
function slowKeysFor(area) {
  const pace = typingPace(area);
  if (!pace) return [];
  return Object.entries(settings.keyTimes)
    .map(([key, [sum, count]]) => ({ key, count, ratio: sum / count / pace }))
    .filter(({ key, count, ratio }) => count >= minTimedKeys && ratio >= slowRatio.key && !/\s/.test(key) && area.characters.has(key))
    .sort((a, b) => b.ratio - a.ratio)
    .map(({ key }) => key);
}

// Pairs that take clearly longer than the focus's average and that its material has examples of, slowest first.
function slowPairsFor(area, texts) {
  const pace = typingPace(area);
  if (!pace) return [];
  return Object.entries(settings.pairTimes)
    .map(([pair, [sum, count]]) => ({ pair, count, ratio: sum / count / pace }))
    .filter(({ pair, count, ratio }) => count >= minTimedPairs && ratio >= slowRatio.pair
      && [...pair].every((character) => area.characters.has(character)) && texts.some((text) => text.includes(pair)))
    .sort((a, b) => b.ratio - a.ratio)
    .map(({ pair }) => pair);
}

const describePair = (pair) => `${describeKey(pair[0])} → ${describeKey(pair[1])}`;

// Rhythm: the share of timed keystrokes that landed close to the attempt's typical gap, the median: no more
// than half again as long, and no less than two thirds of it. Even typing scores high; bursts and stalls score low.
const rhythmBand = 1.5;
const minRhythmGaps = 20;
// Below this, a clean run's tip is about rhythm.
const unevenRhythm = 55;

function medianGap(gaps) {
  const sorted = gaps.map((gap) => gap.ms).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function rhythmOf(gaps) {
  if (gaps.length < minRhythmGaps) return null;
  const median = medianGap(gaps);
  const steady = gaps.filter(({ ms }) => ms >= median / rhythmBand && ms <= median * rhythmBand).length;
  return Math.round(steady / gaps.length * 100);
}

// The pair that held up this attempt the most: typed at least three times, and on average well over the median.
function slowestPairOf(gaps) {
  if (gaps.length < minRhythmGaps) return null;
  const median = medianGap(gaps);
  const pairs = new Map();
  for (const { ms, pair } of gaps) {
    if (!pair) continue;
    const entry = pairs.get(pair) ?? [0, 0];
    entry[0] += ms;
    entry[1]++;
    pairs.set(pair, entry);
  }
  let slowest = null;
  for (const [pair, [sum, count]] of pairs) {
    const ratio = sum / count / median;
    if (count >= 3 && ratio >= 1.6 && (!slowest || ratio > slowest.ratio)) slowest = { pair, ratio };
  }
  return slowest;
}

// ---- Race your best ----------------------------------------------------------------
// A marker moves through the prompt at your best pace for the exercise: the best wpm of a run at the pass mark
// or better, or a sprint's best time. It sets off with your first key and stops whenever the clock does.

// Where personal bests are kept: per course drill, per practice type, and per focus for text.
function bestKeyFor(target = round) {
  const area = currentArea();
  if (target.drill) return target.drill.id;
  if (target.passage) return `text/${area.id}`;
  if (target.practice) return `practice/${area.id}/${target.practice.type}`;
  return null;
}

// The marker's speed in keys per millisecond, or null when there is no best to race.
function ghostSpeed() {
  if (!settings.ghost || round.cheated) return null;
  if (round.sprint) {
    const best = settings.sprintBest[round.sprint.type.id];
    return best ? typeableTotal() / best : null;
  }
  const pace = settings.best[bestKeyFor()]?.pace;
  return pace ? pace / 12000 : null;
}

function renderGhost() {
  const stat = get("ghost-stat");
  const speed = round.ghost;
  const show = !!speed && welcomePanel.hidden;
  stat.hidden = !show;
  let cell = null;
  if (show) {
    const label = get("ghost-label");
    const value = get("ghost-value");
    const started = round.lastKeyAt !== null || round.activeMs > 0;
    if (!started) {
      label.textContent = round.sprint ? "best time" : "best pace";
      value.textContent = round.sprint ? `${formatSeconds(settings.sprintBest[round.sprint.type.id])}s` : `${Math.round(speed * 12000)} wpm`;
      stat.classList.remove("ahead", "behind");
    } else {
      const total = typeableTotal();
      const ghostKeys = Math.floor(activeTime() * speed);
      const lead = typedSoFar() - ghostKeys;
      label.textContent = lead > 0 ? "keys ahead" : lead < 0 ? "keys behind" : "on best pace";
      value.textContent = String(Math.abs(lead));
      stat.classList.toggle("ahead", lead > 0);
      stat.classList.toggle("behind", lead < 0);
      if (round.endedAt === null && ghostKeys < total) {
        round.typeable ??= [...round.characters].map((_, index) => index).filter((index) => !round.auto.has(index));
        cell = round.cells[round.typeable[ghostKeys]];
      }
    }
  }
  if (cell === round.ghostCell) return;
  round.ghostCell?.classList.remove("ghost");
  cell?.classList.add("ghost");
  round.ghostCell = cell;
}
