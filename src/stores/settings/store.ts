import { createStore } from "satcheljs";
import { SettingsStoreState, ThemeMode, Language } from "../../types";

function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return "dark";
}

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "vi") return saved;
  } catch {
    // ignore
  }
  return "en";
}

const getSettingsStore = createStore<SettingsStoreState>("settingsStore", {
  theme: getInitialTheme(),
  language: getInitialLanguage(),
});

export default getSettingsStore;
