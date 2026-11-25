"use strict";

// Event wiring and start-up. Loaded last.

// ---- Events ------------------------------------------------------------------

profileButton.addEventListener("click", () => setProfileMenuOpen(!profileMenuOpen));
get("profile-new").addEventListener("click", () => setProfileForm(profileFormMode === "new" ? null : "new"));
get("profile-rename").addEventListener("click", () => setProfileForm(profileFormMode === "rename" ? null : "rename"));
get("profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = profileNameInput.value.replace(/\s+/g, " ").trim().slice(0, profileNameLimit);
  if (!name) {
    showProfileError("Type a name first.");
    return;
  }
  const data = readProfiles();
  const renaming = profileFormMode === "rename";
  if (data.list.some((profile) => profile.name.toLocaleLowerCase() === name.toLocaleLowerCase() && !(renaming && profile.id === activeProfileId))) {
    showProfileError("Another profile already has that name.");
    return;
  }
  if (!renaming) {
    const id = `p${Date.now().toString(36)}`;
    data.list.push({ id, name });
    data.active = id;
    if (!reloadIntoProfile(data)) showProfileError("Couldn't save the profile. This browser may be blocking storage.");
    return;
  }
  const profile = data.list.find((option) => option.id === activeProfileId);
  if (!profile) return;
  profile.name = name;
  if (!writeProfiles(data)) {
    showProfileError("Couldn't save the name. This browser may be blocking storage.");
    return;
  }
  setProfileForm(null);
  renderProfileButton();
  renderProfileMenu();
  if (historyOpen) renderHistorySummary();
  profilePanel.querySelector('.profile-option[aria-current="true"]')?.focus();
});
get("profile-delete").addEventListener("click", () => {
  const data = readProfiles();
  if (data.list.length < 2) return;
  const { name } = activeProfile();
  if (!confirm(`Delete the profile "${name}"? Its progress, history and settings will be removed from this browser. This can't be undone.`)) return;
  data.list = data.list.filter((profile) => profile.id !== activeProfileId);
  data.active = data.list[0].id;
  if (!writeProfiles(data)) return;
  leavingProfile = true;
  try { localStorage.removeItem(settingsKey); } catch { /* Nothing more to remove. */ }
  location.reload();
});
// The menu keeps its own keys: Escape closes it, the arrows move between profiles, and nothing reaches the drill.
profileMenu.addEventListener("keydown", (event) => {
  if (!profileMenuOpen) return;
  if (event.key === "Escape") {
    event.preventDefault();
    setProfileMenuOpen(false);
    profileButton.focus({ preventScroll: true });
    return;
  }
  const options = [...profilePanel.querySelectorAll(".profile-option")];
  const index = options.indexOf(document.activeElement);
  if (index === -1 || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
  event.preventDefault();
  options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length].focus();
});
profileMenu.addEventListener("focusout", (event) => {
  if (profileMenuOpen && event.relatedTarget && !profileMenu.contains(event.relatedTarget)) setProfileMenuOpen(false);
});
get("top-history").addEventListener("click", () => {
  if (historyOpen) closeHistory();
  else setHistoryOpen(true);
});

focusButton.addEventListener("click", () => setFocusMenuOpen(!focusMenuOpen));
focusButton.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  setFocusMenuOpen(true);
});
focusList.addEventListener("keydown", (event) => {
  const options = [...focusList.children];
  const index = options.indexOf(document.activeElement);
  const move = (to) => {
    event.preventDefault();
    options[(to + options.length) % options.length].focus();
  };
  if (event.key === "ArrowDown") move(index + 1);
  else if (event.key === "ArrowUp") move(index - 1);
  else if (event.key === "Home") move(0);
  else if (event.key === "End") move(options.length - 1);
  else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (index >= 0) chooseFocus(options[index].dataset.focus);
  } else if (event.key === "Escape") {
    event.preventDefault();
    setFocusMenuOpen(false);
    focusButton.focus({ preventScroll: true });
  } else if (event.key === "Tab") {
    setFocusMenuOpen(false);
  }
});

for (const button of viewButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.view !== settings.view) {
      settings.view = button.dataset.view;
      saveSettings();
      startRound();
    } else if (libraryOpen) {
      closeLibrary();
    } else {
      typingArea.focus({ preventScroll: true });
    }
  });
}

for (const button of textSourceButtons) {
  button.addEventListener("click", () => {
    const area = currentArea();
    if (button.dataset.textSource === (settings.textSource[area.id] ?? "focus")) {
      typingArea.focus({ preventScroll: true });
      return;
    }
    settings.textSource[area.id] = button.dataset.textSource;
    saveSettings();
    newPassage();
  });
}

for (const button of passageLengthButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.passageLength !== settings.passageLength) {
      settings.passageLength = button.dataset.passageLength;
      saveSettings();
      newPassage();
    } else {
      typingArea.focus({ preventScroll: true });
    }
  });
}

drillLengthControl.addEventListener("input", updateLengthLabel);
drillLengthControl.addEventListener("change", () => {
  settings.drillLength = Number(drillLengthControl.value);
  saveSettings();
  currentPractice = null;
  startRound(false);
});
drillLengthControl.addEventListener("click", () => typingArea.focus({ preventScroll: true }));
typoLimitDown.addEventListener("click", () => changeTypoLimit(-1));
typoLimitUp.addEventListener("click", () => changeTypoLimit(1));
newRound.addEventListener("click", () => startRound());
previousDrill.addEventListener("click", () => chooseDrill(neighbourDrill(round.drill, -1)?.id));
nextDrill.addEventListener("click", () => {
  if (round.drill) chooseDrill(neighbourDrill(round.drill, 1)?.id);
  else if (round.passage) newPassage();
  else if (round.sprint) chooseSprint(sprints[(sprints.indexOf(round.sprint.type) + 1) % sprints.length].id);
  else newPractice();
});
courseMapButton.addEventListener("click", () => setLibraryOpen(true));
get("open-library-side").addEventListener("click", () => setLibraryOpen(true));
get("close-library").addEventListener("click", closeLibrary);
get("continue-drill").addEventListener("click", (event) => chooseDrill(event.currentTarget.dataset.drill));
get("result-primary").addEventListener("click", () => resultActions?.primary.run());
get("result-secondary").addEventListener("click", () => resultActions?.secondary?.run());
get("result-practice").addEventListener("click", () => resultActions?.practice?.run());
get("welcome-basics").addEventListener("click", () => startCourse(areaById.get(basicsPath[0])));
get("welcome-focus").addEventListener("click", () => setFocusMenuOpen(true));
get("result-history").addEventListener("click", () => setHistoryOpen(true));
get("open-history").addEventListener("click", () => setHistoryOpen(true));
get("close-history").addEventListener("click", closeHistory);
get("clear-history").addEventListener("click", () => {
  if (!confirm(`Clear all ${settings.history.length} saved results? This can't be undone.`)) return;
  settings.history = [];
  saveSettings();
  renderHistory();
  get("close-history").focus({ preventScroll: true });
});
for (const button of layoutButtons) {
  button.addEventListener("click", () => {
    settings.layout = button.dataset.layoutOption;
    saveSettings();
    applyLayout();
  });
}
settingsButton.addEventListener("click", () => setSettingsOpen(!settingsOpen));
document.addEventListener("click", (event) => {
  if (settingsOpen && !event.target.closest("#sidebar, #toggle-settings")) setSettingsOpen(false);
  // The welcome's "Choose a focus" button opens the menu, so its own click mustn't close it again.
  if (focusMenuOpen && !event.target.closest(".focus-menu, #welcome-focus")) setFocusMenuOpen(false);
  if (profileMenuOpen && !event.target.closest(".profile-menu")) setProfileMenuOpen(false);
});
// The docked layout sizes the page around the keyboard panel's real height.
new ResizeObserver(() => {
  document.documentElement.style.setProperty("--dock-h", `${keyboardCard.offsetHeight}px`);
}).observe(keyboardCard);
typingArea.addEventListener("click", () => typingArea.focus({ preventScroll: true }));
for (const button of typoHandlingButtons) {
  button.addEventListener("click", () => {
    settings.correction = button.dataset.typoHandling === "delete";
    saveSettings();
    if (!settings.correction && round.pending.length > 0) {
      round.pending.length = 0;
      round.lastWrong = null;
      renderPending();
      updateProgress();
    }
    renderTypoHandling();
    renderKeyboard();
    typingArea.focus({ preventScroll: true });
  });
}
fingerColorButton.addEventListener("click", () => {
  settings.fingerColors = !settings.fingerColors;
  saveSettings();
  renderKeyboard();
  typingArea.focus({ preventScroll: true });
});
hintButton.addEventListener("click", () => {
  settings.hints = !settings.hints;
  saveSettings();
  renderKeyboard();
  typingArea.focus({ preventScroll: true });
});
keyboardButton.addEventListener("click", () => {
  settings.keyboard = !settings.keyboard;
  saveSettings();
  renderKeyboard();
  typingArea.focus({ preventScroll: true });
});
themeButton.addEventListener("click", () => {
  settings.theme = activeTheme() === "dark" ? "light" : "dark";
  saveSettings();
  applyTheme();
});
// One holiday theme at a time: turning one on turns the other off.
for (const [button, theme] of festiveToggles) {
  button.addEventListener("click", () => {
    settings.festive = settings.festive === theme ? null : theme;
    saveSettings();
    applyFestiveTheme();
  });
}
darkScheme.addEventListener("change", () => {
  if (settings.theme === null) applyTheme();
});

document.addEventListener("keydown", (event) => {
  noteSecretKey(event);
  noteCheatKey(event);
  noteFunWord(event);
  // Option-delete and command-delete clear every waiting typo at once.
  if (event.key === "Backspace" && (event.altKey || event.metaKey) && !event.ctrlKey && !event.defaultPrevented && !libraryOpen
    && round.endedAt === null && round.pending.length > 0 && !event.target.closest("input, select, textarea, [contenteditable]")) {
    event.preventDefault();
    handleDelete(true);
    return;
  }
  if (event.defaultPrevented || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
  // The focus and profile menus handle their own keys while they are open.
  if (focusMenuOpen || profileMenuOpen) return;
  if (settingsOpen && event.key === "Escape") {
    event.preventDefault();
    setSettingsOpen(false);
    settingsButton.focus({ preventScroll: true });
    return;
  }
  if (event.target.closest("input, select, textarea, [contenteditable]")) return;
  if (libraryOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (!event.repeat) closeLibrary();
    }
    return;
  }
  if (historyOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (!event.repeat) closeHistory();
    }
    return;
  }
  // The first-run choice: return starts the basics; its buttons work as usual.
  if (!welcomePanel.hidden) {
    if (event.target.closest("button, a") && (event.key === " " || event.key === "Enter")) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) startCourse(areaById.get(basicsPath[0]));
    } else if (event.key.length === 1) {
      event.preventDefault();
    }
    return;
  }
  // While the results banner is up, only return (go on) and esc (close) act on it. Anything else typed
  // out of momentum is ignored, and so is everything in the first moments after the banner appears.
  // A button you tabbed to still works with space or return.
  if (!resultBanner.hidden) {
    const early = performance.now() - resultShownAt < resultGuard;
    if ((event.key === " " || event.key === "Enter") && event.target.closest("button, a")) {
      if (early) event.preventDefault();
      return;
    }
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      if (event.repeat || early) return;
      if (event.key === "Enter") resultActions?.primary.run();
      else startRound();
      return;
    }
    if (event.key === " ") event.preventDefault();
    return;
  }
  // Space and Enter still activate a focused button, link, or summary; every other key goes to the drill.
  if (event.target.closest("button, a, summary") && (event.key === " " || event.key === "Enter")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    if (!event.repeat) startRound();
    return;
  }
  if (round.endedAt !== null) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) resultActions?.primary.run();
    }
    return;
  }
  if (event.key === "Backspace") {
    if (round.pending.length > 0) {
      event.preventDefault();
      handleDelete(false);
    }
    return;
  }
  // In code, Return types the line break; the cursor only moves to the next line this way.
  if (event.key === "Enter" && round.code) {
    event.preventDefault();
    if (settingsOpen) setSettingsOpen(false);
    if (document.activeElement !== typingArea) typingArea.focus({ preventScroll: true });
    if (!event.repeat) handleAttempt("\n");
    return;
  }
  if (event.key.length !== 1) return;
  event.preventDefault();
  if (settingsOpen) setSettingsOpen(false);
  if (document.activeElement !== typingArea) typingArea.focus({ preventScroll: true });
  if (!event.repeat) handleAttempt(event.key);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && timer !== null) pauseRound();
});

applyTheme();
applyFestiveTheme();
applyLayout();
renderProfileButton();
startRound(false);
showPracticeTip();
setInterval(() => {
  if (!document.hidden) showPracticeTip();
}, 20000);
