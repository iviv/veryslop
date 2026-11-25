"use strict";

// ---- Theme and layout ------------------------------------------------------

const darkScheme = matchMedia("(prefers-color-scheme: dark)");
const activeTheme = () => settings.theme ?? (darkScheme.matches ? "dark" : "light");

function applyTheme() {
  const theme = activeTheme();
  document.documentElement.dataset.theme = theme;
  themeColor.content = theme === "dark" ? "#15141c" : "#ffffff";
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}

function applyFestiveTheme() {
  const { dataset } = document.documentElement;
  if (settings.festive) dataset.festive = settings.festive;
  else delete dataset.festive;
  // The block world theme uses a pixel font for headings; it falls back to monospace when offline.
  if (settings.festive === "pixel" && !document.getElementById("pixel-font")) { const link = document.createElement("link"); link.id = "pixel-font"; link.rel = "stylesheet"; link.href = "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"; document.head.append(link); }
  for (const [button, theme, name] of festiveToggles) {
    const on = settings.festive === theme;
    button.setAttribute("aria-pressed", String(on));
    button.title = `Turn ${on ? "off" : "on"} the ${name} theme`;
  }
}

let settingsOpen = false;

// The settings popover only exists in the focus layout; elsewhere the sidebar is always shown.
function setSettingsOpen(open) {
  settingsOpen = open && settings.layout === "focus";
  sidebar.classList.toggle("open", settingsOpen);
  settingsButton.setAttribute("aria-expanded", String(settingsOpen));
}

// Each layout reuses the same controls: the heading moves into the sidebar for layout A.
function applyLayout() {
  document.documentElement.dataset.layout = settings.layout;
  setPressed(layoutButtons, (button) => button.dataset.layoutOption === settings.layout);
  if (settings.layout === "sidebar") get("now-card").append(practiceHeading);
  else mainColumn.prepend(practiceHeading);
  setSettingsOpen(false);
  // The prompt's height changes with the layout; keep the cursor in view (it matters most for long code).
  requestAnimationFrame(() => typingArea.querySelector(".character.current")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
}
