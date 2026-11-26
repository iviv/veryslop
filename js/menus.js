"use strict";

// ---- Focus menu and setting chips ---------------------------------------------

let focusMenuOpen = false;

function renderFocusMenu() {
  for (const option of focusList.children) {
    const area = areaById.get(option.dataset.focus);
    const { done, total } = progressOf(area.path);
    const basics = basicsPath.indexOf(area.id);
    option.setAttribute("aria-selected", String(area.id === settings.focus));
    option.querySelector(".focus-option-meta").textContent =
      `${basics >= 0 ? `Basics ${basics + 1} of ${basicsPath.length} · ` : ""}${plural(area.lessons.length, "lesson")} · ${done} of ${total} done`;
  }
}

function setFocusMenuOpen(open) {
  focusMenuOpen = open;
  focusList.hidden = !open;
  focusButton.setAttribute("aria-expanded", String(open));
  if (!open) return;
  if (todayMenuOpen) setTodayMenuOpen(false);
  renderFocusMenu();
  (focusList.querySelector('[aria-selected="true"]') ?? focusList.firstElementChild).focus();
}

function chooseFocus(id) {
  setFocusMenuOpen(false);
  // Picking a focus also answers the first-run choice.
  if (!settings.welcomed) {
    settings.welcomed = true;
    settings.focus = id;
    saveSettings();
    startRound();
    return;
  }
  if (id === settings.focus) {
    typingArea.focus({ preventScroll: true });
    return;
  }
  settings.focus = id;
  saveSettings();
  currentPassage = null;
  currentPractice = null;
  startRound();
}

function renderResetModes() {
  get("reset-modes").replaceChildren(...resetModesFor(settings.view).map((mode) => {
    const chip = element("button", "chip", mode.name);
    chip.type = "button";
    chip.setAttribute("aria-pressed", String(mode.id === resetMode()));
    chip.addEventListener("click", () => {
      settings.resetModes[settings.view] = mode.id;
      saveSettings();
      renderResetModes();
      updateTypoHelp();
      // Custom needs a number next, so its field gets the cursor.
      if (mode.id === "custom") typoLimitUp.focus({ preventScroll: true });
      else typingArea.focus({ preventScroll: true });
    });
    return chip;
  }));
}

// ---- Profile menu ----------------------------------------------------------------

const profileMenu = document.querySelector(".profile-menu");
const profileButton = get("profile-button");
const profilePanel = get("profile-panel");
const profileNameInput = get("profile-name");
const profileError = get("profile-error");
let profileMenuOpen = false;
// "new" or "rename" while the name form is showing.
let profileFormMode = null;

function activeProfile() {
  return readProfiles().list.find((profile) => profile.id === activeProfileId) ?? { id: activeProfileId, name: "Main" };
}

const profileInitial = (name) => ([...name.trim()][0] ?? "?").toLocaleUpperCase();

function relativeDay(time) {
  const days = Math.round((startOfDay(Date.now()) - startOfDay(time)) / dayMs);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return days < 30 ? `${days} days ago` : `on ${shortDate(time)}`;
}

// Another profile's results are read straight from its storage; this tab's own are already in memory.
function profileSummary(id) {
  let history = settings.history;
  if (id !== activeProfileId) {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(profileStorageKey(id))); } catch { /* Show it as empty. */ }
    history = Array.isArray(data?.history) ? data.history.filter((entry) => Number.isFinite(entry?.at)) : [];
  }
  if (history.length === 0) return "No results yet";
  return `${plural(history.length, "result")} · last ${relativeDay(Math.max(...history.map((entry) => entry.at)))}`;
}

function renderProfileButton() {
  const { name } = activeProfile();
  get("profile-avatar").textContent = profileInitial(name);
  profileButton.title = `Profile: ${name}`;
  profileButton.setAttribute("aria-label", `Profile: ${name}. Switch or manage profiles`);
}

function renderProfileMenu() {
  const { list } = readProfiles();
  get("profile-list").replaceChildren(...list.map((profile) => {
    const item = element("li");
    const option = element("button", "profile-option");
    option.type = "button";
    if (profile.id === activeProfileId) option.setAttribute("aria-current", "true");
    const avatar = element("span", "avatar", profileInitial(profile.name));
    avatar.setAttribute("aria-hidden", "true");
    const text = element("span", "profile-option-text");
    text.append(element("span", "profile-option-name", profile.name), element("span", "profile-option-meta", profileSummary(profile.id)));
    option.append(avatar, text, icon("check"));
    option.addEventListener("click", () => switchProfile(profile.id));
    item.append(option);
    return item;
  }));
  const { name } = activeProfile();
  get("profile-rename").setAttribute("aria-label", `Rename ${name}`);
  const remove = get("profile-delete");
  remove.hidden = list.length < 2;
  remove.setAttribute("aria-label", `Delete ${name}`);
}

function setProfileMenuOpen(open) {
  profileMenuOpen = open;
  profilePanel.hidden = !open;
  profileButton.setAttribute("aria-expanded", String(open));
  if (!open) {
    setProfileForm(null);
    return;
  }
  setFocusMenuOpen(false);
  setSettingsOpen(false);
  if (todayMenuOpen) setTodayMenuOpen(false);
  renderProfileMenu();
  profilePanel.querySelector('.profile-option[aria-current="true"]')?.focus();
}

function setProfileForm(mode) {
  profileFormMode = mode;
  get("profile-form").hidden = !mode;
  profileError.hidden = true;
  if (!mode) return;
  get("profile-form-label").textContent = mode === "new" ? "New profile name" : "Rename this profile";
  get("profile-save").textContent = mode === "new" ? "Create" : "Save";
  profileNameInput.value = mode === "rename" ? activeProfile().name : "";
  profileNameInput.focus();
  profileNameInput.select();
}

function showProfileError(message) {
  profileError.textContent = message;
  profileError.hidden = false;
  profileNameInput.focus();
}

// Saves the profile list and reloads the page into its active profile.
function reloadIntoProfile(data) {
  if (!writeProfiles(data)) return false;
  leavingProfile = true;
  location.reload();
  return true;
}

function switchProfile(id) {
  if (id === activeProfileId) {
    setProfileMenuOpen(false);
    profileButton.focus({ preventScroll: true });
    return;
  }
  const data = readProfiles();
  if (!data.list.some((profile) => profile.id === id)) {
    renderProfileMenu();
    return;
  }
  data.active = id;
  reloadIntoProfile(data);
}
