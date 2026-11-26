"use strict";

// ---- Today: the daily goal and the warm-up ----------------------------------------------
// The daily goal counts minutes of typing today, from saved results. The warm-up is three short steps in the
// current focus: weak keys, a lesson to review, and a short passage. It isn't saved: a reload, or going
// anywhere else in the app, ends it.

const todayButton = get("today-button");
const todayPanel = get("today-panel");
let todayMenuOpen = false;

function typedToday() {
  const start = startOfDay(Date.now());
  return settings.history.reduce((sum, entry) => sum + (entry.at >= start && Number.isFinite(entry.ms) ? entry.ms : 0), 0);
}

// A sentence for the result that takes today's typing past the goal. Call it before the result is saved.
function goalNote(milliseconds) {
  const goal = settings.dailyGoal * 60000;
  const before = typedToday();
  return goal && before < goal && before + milliseconds >= goal ? `That's your ${settings.dailyGoal}-minute goal for today.` : "";
}

function renderToday() {
  const typed = typedToday();
  const goal = settings.dailyGoal;
  const minutes = Math.floor(typed / 60000);
  const met = goal > 0 && typed >= goal * 60000;
  todayButton.style.setProperty("--today", `${goal ? Math.min(1, typed / (goal * 60000)) * 360 : 0}deg`);
  todayButton.classList.toggle("met", met);
  todayButton.classList.toggle("no-goal", goal === 0);
  const label = goal
    ? `Today: ${minutes} of ${goal} minutes${met ? ", goal met" : ""}. Daily goal and warm-up`
    : "Warm-up and daily goal";
  todayButton.setAttribute("aria-label", label);
  todayButton.title = label;
  if (todayMenuOpen) renderTodayPanel();
}

// ---- The warm-up --------------------------------------------------------------------------

const warmupLength = 120;
// The warm-up in progress: its focus, steps, which step is on, typing time so far, and the view to return to.
let warmup = null;
// The plan the panel shows, so Start runs exactly what was listed.
let plannedWarmup = null;

// The lesson to review: of the lessons whose checkpoint you've passed, the one reviewed longest ago (or never).
// With no checkpoint passed yet, the lesson you're on.
function reviewLesson(area) {
  const finished = area.lessons.filter((lesson) => isDone(lesson.list.at(-1)));
  const reviewedAt = (lesson) => settings.reviewed[lesson.list.at(-1).id] ?? 0;
  if (finished.length) return { lesson: finished.reduce((a, b) => (reviewedAt(b) < reviewedAt(a) ? b : a)), current: false };
  return { lesson: (recommendedDrill(area) ?? area.path[0]).lesson, current: true };
}

// A review round: a fresh mix of the lesson's checkpoint material, or one of its programs for code.
function reviewPractice(review, length) {
  const checkpoint = review.lesson.list.at(-1);
  const base = { type: "review", mode: "review", keys: [], slowKeys: [], pairs: [], review };
  return checkpoint.samples
    ? { ...base, code: true, ...joinCode([pick(checkpoint.samples)]) }
    : { ...base, text: checkpointText(checkpoint, length) };
}

function planWarmup(area) {
  const weak = buildPractice(area, "weak", warmupLength);
  const review = reviewLesson(area);
  const targets = [...weak.keys.map(describeKey), ...weak.pairs.map(pairLabel)];
  return [
    weak.mode === "weak"
      ? { name: "Weak keys", detail: targets.join("  "), view: "practice", item: weak }
      : { name: "Weak keys", detail: "A mix for now: weak keys need a few more rounds", view: "practice", item: weak },
    {
      name: review.current ? "Lesson mix" : "Review", detail: `Lesson ${review.lesson.number}: ${review.lesson.name}`,
      view: "practice", item: reviewPractice(review, warmupLength), review
    },
    { name: "Short passage", detail: area.text.name, view: "text", item: focusPassage(area, "short") }
  ].map((step, index) => ({ ...step, number: index + 1 }));
}

const warmupKeys = (steps) => steps.reduce((sum, step) => sum + step.item.text.length, 0);

// The step being typed, if `item` (a practice round or passage) is it.
function warmupStepOf(item) {
  const step = warmup?.steps[warmup.index];
  return item && step?.item === item ? step : null;
}

function warmupContinues() {
  const { item, view } = warmup.steps[warmup.index];
  return settings.focus === warmup.area.id && settings.view === view && (view === "practice" ? currentPractice : currentPassage) === item;
}

function startWarmup() {
  const area = currentArea();
  const steps = plannedWarmup?.area === area ? plannedWarmup.steps : planWarmup(area);
  plannedWarmup = null;
  if (warmup) endWarmup();
  warmup = { area, steps, index: 0, ms: 0, returnView: settings.view };
  setTodayMenuOpen(false);
  runWarmupStep();
}

function runWarmupStep() {
  const step = warmup.steps[warmup.index];
  settings.view = step.view;
  if (step.view === "practice") currentPractice = step.item;
  else currentPassage = step.item;
  saveSettings();
  startRound();
  typingArea.scrollIntoView({ block: "nearest" });
}

function advanceWarmup() {
  if (!warmup) return;
  if (warmup.index + 1 >= warmup.steps.length) {
    finishWarmup();
    return;
  }
  warmup.index++;
  runWarmupStep();
}

// Ends the warm-up where you are; its rounds don't stay behind in the Practice and Text views.
function endWarmup() {
  for (const { item } of warmup.steps) {
    if (currentPractice === item) currentPractice = null;
    if (currentPassage === item) currentPassage = null;
  }
  warmup = null;
}

const warmupReturnLabel = () => `Back to ${{ course: "the course", practice: "practice", text: "text", fun: "sprints" }[warmup.returnView]}`;

function finishWarmup() {
  const view = warmup.returnView;
  endWarmup();
  settings.view = view;
  saveSettings();
  startRound();
}

// ---- The Today panel ------------------------------------------------------------------------

function renderTodayPanel() {
  const typed = typedToday();
  const goal = settings.dailyGoal;
  const goalMs = goal * 60000;
  get("today-figure").replaceChildren(element("strong", "", formatDuration(typed)), goal ? ` of ${goal} min` : " typed today");
  get("today-fill").style.width = `${goal ? Math.min(1, typed / goalMs) * 100 : 0}%`;
  get("today-progress").classList.toggle("complete", goal > 0 && typed >= goalMs);
  get("today-progress").classList.toggle("no-goal", goal === 0);
  const { current } = practiceStreaks();
  const meta = [goal === 0 ? "No daily goal" : typed >= goalMs ? "Goal met" : `${formatDuration(goalMs - typed)} to go`];
  if (current > 1) meta.push(`${current} days in a row`);
  get("today-meta").textContent = meta.join(" · ");

  const goals = get("today-goals");
  if (goals.childElementCount === 0) {
    goals.append(...dailyGoals.map((minutes) => {
      const button = element("button", "segment", minutes ? String(minutes) : "Off");
      button.type = "button";
      button.dataset.goal = String(minutes);
      button.setAttribute("aria-label", minutes ? `${minutes} minutes a day` : "No daily goal");
      button.addEventListener("click", () => {
        settings.dailyGoal = minutes;
        saveSettings();
        renderToday();
      });
      return button;
    }));
  }
  setPressed([...goals.children], (button) => Number(button.dataset.goal) === goal);

  const area = currentArea();
  if (plannedWarmup?.area !== area) plannedWarmup = { area, steps: planWarmup(area) };
  const { steps } = plannedWarmup;
  // At your own pace when there's enough timing, otherwise about 30 wpm.
  const minutes = Math.max(2, Math.round(warmupKeys(steps) * (typingPace() ?? 400) * 1.15 / 60000));
  get("warmup-estimate").textContent = `About ${minutes} min`;
  get("warmup-note").textContent = `Three short steps in ${area.name}.`;
  get("warmup-steps").replaceChildren(...steps.map((step) => {
    const item = element("li");
    item.append(element("span", "warmup-step-name", step.name), element("span", "warmup-step-detail", step.detail));
    return item;
  }));
  get("start-warmup").textContent = warmup ? "Restart warm-up" : "Start warm-up";
}

function setTodayMenuOpen(open) {
  todayMenuOpen = open;
  todayPanel.hidden = !open;
  todayButton.setAttribute("aria-expanded", String(open));
  if (!open) return;
  setFocusMenuOpen(false);
  setProfileMenuOpen(false);
  setSettingsOpen(false);
  if (timer !== null) pauseRound();
  plannedWarmup = null;
  renderTodayPanel();
  get("start-warmup").focus();
}
