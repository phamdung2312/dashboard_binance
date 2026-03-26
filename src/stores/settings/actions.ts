import { action } from "satcheljs";
import { ThemeMode, Language } from "../../types";

export const setTheme = action("SET_THEME", (theme: ThemeMode) => ({ theme }));

export const setLanguage = action("SET_LANGUAGE", (language: Language) => ({
  language,
}));

export const toggleTheme = action("TOGGLE_THEME");
