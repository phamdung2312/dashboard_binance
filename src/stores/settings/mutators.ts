import { mutator } from "satcheljs";
import { setTheme, setLanguage, toggleTheme } from "./actions";
import getSettingsStore from "./store";

mutator(setTheme, ({ theme }) => {
  getSettingsStore().theme = theme;
  localStorage.setItem("theme", theme);
});

mutator(setLanguage, ({ language }) => {
  getSettingsStore().language = language;
  localStorage.setItem("language", language);
});

mutator(toggleTheme, () => {
  const store = getSettingsStore();
  const newTheme = store.theme === "dark" ? "light" : "dark";
  store.theme = newTheme;
  localStorage.setItem("theme", newTheme);
});
