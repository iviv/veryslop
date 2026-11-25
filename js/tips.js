"use strict";

// ---- Tips ----------------------------------------------------------------

const practiceTips = [
  "Find the bumps on F and J with your index fingers.",
  "Rest your left fingers on A, S, D, and F.",
  "Rest your right fingers on J, K, L, and semicolon.",
  "Return your finger to home row after each reach.",
  "Keep your eyes on the prompt and find the keys by touch.",
  "Let one finger reach while the others stay near home row.",
  "Use a thumb to tap Space.",
  "Press Shift with the hand opposite the key you're typing.",
  "Tap each key lightly and release it before the next tap.",
  "If you lose your place, feel for F and J again.",
  "Reach for 1 with your left pinky.",
  "Reach for 2 with your left ring finger.",
  "Reach for 3 with your left middle finger.",
  "Use your left index finger for 4 and 5.",
  "Use your right index finger for 6 and 7.",
  "Reach for 8 with your right middle finger.",
  "Reach for 9 with your right ring finger.",
  "Use your right pinky for 0, hyphen, and equals.",
  "Try a few slow taps when a key feels hard to reach.",
  "Start at a pace you can sustain for the whole round.",
  "Aim for a clean round before you try to go faster.",
  "Try Weak keys practice to drill the keys you miss most.",
  "Pick one goal for this round, such as fewer typos.",
  "Keep an even rhythm through familiar and unfamiliar keys.",
  "Slow down at a tricky transition until it feels familiar.",
  "Try a round with key hints off once you know the pattern.",
  "Glance ahead a few characters while you type.",
  "Spot capitals and punctuation as you read ahead.",
  "A few focused minutes make a good practice session.",
  "Take a short break if you catch yourself tensing up.",
  "Drop your shoulders and let your hands rest lightly.",
  "After a typo, give yourself a moment before trying the key again.",
  "When two keys feel awkward together, practice alternating them.",
  "End a session with a familiar drill you can type comfortably.",
  "A reach that feels awkward today can become familiar.",
  "A slower, steadier round is worth finishing.",
  "Take it one keystroke at a time.",
  "Come back tomorrow and notice which keys feel easier."
];
const takePracticeTip = shuffledBag(practiceTips);

function showPracticeTip() {
  const tip = settings.festive === "pixel" && Math.random() < .35 ? takeDanielTip() : takePracticeTip();
  practiceTipText.textContent = tip === practiceTipText.textContent ? takePracticeTip() : tip;
  get("tip-inline-text").textContent = practiceTipText.textContent;
  get("tip-inline-text").parentElement.title = practiceTipText.textContent;
}
