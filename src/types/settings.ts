export type ThemeMode = "dark" | "light";

export type Language = "en" | "vi";

export interface SettingsStoreState {
  theme: ThemeMode;
  language: Language;
}
