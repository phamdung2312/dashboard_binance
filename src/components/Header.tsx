import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { getSettingsStore, toggleTheme, setLanguage } from "../stores/settings";
import { Language } from "../types";
import logo from "../images/app_dashboard_binance.png";

const Header: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const settings = getSettingsStore();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <header
      className={`border-b px-3 sm:px-4 lg:px-6 py-3 ${
        settings.theme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <h1
          className={`text-xl font-bold flex items-center gap-2 ${
            settings.theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
          />
          {t("app.title")}
        </h1>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div
            className={`flex items-center gap-1 rounded-lg p-1 ${
              settings.theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <button
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                settings.language === "en"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              EN
            </button>
            <button
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                settings.language === "vi"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleLanguageChange("vi")}
            >
              VI
            </button>
          </div>

          {/* Theme toggle */}
          <button
            className={`p-2 rounded-lg transition-colors text-xl ${
              settings.theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => toggleTheme()}
            title={t("settings.theme")}
          >
            {settings.theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
