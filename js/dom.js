"use strict";

// Page elements the app works with, and small DOM helpers.

const get = (id) => document.getElementById(id);
const typingArea = get("typing-area");
const workspace = get("workspace");
const library = get("library");
const focusButton = get("focus-button");
const focusList = get("focus-list");
const viewButtons = [...document.querySelectorAll("[data-view]")];
const textSourceButtons = [...document.querySelectorAll("[data-text-source]")];
const passageLengthButtons = [...document.querySelectorAll("[data-passage-length]")];
// The word-count labels from the page, restored when code text (counted in exercises) isn't showing.
const passageLengthLabels = Object.fromEntries(passageLengthButtons.map((button) =>
  [button.dataset.passageLength, [button.querySelector("small").textContent, button.getAttribute("aria-label")]]));
const layoutButtons = [...document.querySelectorAll("[data-layout-option]")];
const practiceTypeGrid = get("practice-types");
const sprintTypeGrid = get("sprint-types");
const drillLengthControl = get("drill-length");
const drillLengthValue = get("drill-length-value");
const typoLimitDown = get("typo-limit-down");
const typoLimitUp = get("typo-limit-up");
// The Custom auto-reset limit can be set from 0 (the first typo resets) to 20.
const typoLimitRange = { min: 0, max: 20 };
const typoLimitHelp = get("typo-limit-help");
const progress = get("progress");
const wpmStat = get("wpm-stat");
const wpmValue = get("wpm-value");
const status = get("status");
const newRound = get("new-round");
const newRoundLabel = get("new-round-label");
const previousDrill = get("previous-drill");
const nextDrill = get("next-drill");
const nextDrillLabel = get("next-drill-label");
const courseMapButton = get("open-course-map");
const passageSource = get("passage-source");
const keyboard = get("keyboard");
const keyboardFigure = get("keyboard-figure");
const hintButton = get("toggle-hints");
const fingerColorButton = get("toggle-finger-colors");
const typoHandlingButtons = [...document.querySelectorAll("[data-typo-handling]")];
const keyboardButton = get("toggle-keyboard");
const soundButton = get("toggle-sound");
const themeButton = get("toggle-theme");
const festiveButton = get("toggle-festive");
const christmasButton = get("toggle-christmas");
const festiveToggles = [[festiveButton, "thanksgiving", "Thanksgiving"], [christmasButton, "christmas", "Christmas"]];
const themeColor = document.querySelector('meta[name="theme-color"]');
const fingerGuide = get("finger-guide");
const emptyMisses = get("empty-misses");
const missList = get("miss-list");
const statFields = { accuracy: get("accuracy"), speed: get("speed"), elapsed: get("elapsed"), mistakes: get("mistakes") };
const practiceTipText = get("practice-tip-text");
const resultBanner = get("result-banner");
const welcomePanel = get("welcome");
const practiceHeading = get("practice-heading");
const mainColumn = document.querySelector(".main-column");
const keyboardCard = document.querySelector(".keyboard-card");
const sidebar = get("sidebar");
const settingsButton = get("toggle-settings");

function element(tag, className = "", text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#i-${name}`);
  svg.append(use);
  return svg;
}
