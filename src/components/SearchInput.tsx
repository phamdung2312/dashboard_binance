import React from "react";
import { useTranslation } from "react-i18next";
import { getSettingsStore } from "../stores/settings";
import { observer } from "mobx-react-lite";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = observer(
  ({ value, onChange }) => {
    const { t } = useTranslation();
    const isDark = getSettingsStore().theme === "dark";

    return (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("app.search")}
          className={`w-full pl-8 pr-3 py-1.5 rounded text-sm transition-colors focus:outline-none
            ${
              isDark
                ? "bg-[#2b2f36] border border-[#474d57] text-[#eaecef] placeholder-[#474d57] focus:border-[#f0b90b]"
                : "bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#f0b90b]"
            }`}
        />
        <svg
          className={`absolute left-2.5 top-2 w-3.5 h-3.5 ${isDark ? "text-[#474d57]" : "text-gray-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
