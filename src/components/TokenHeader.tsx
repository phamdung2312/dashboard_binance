import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSettingsStore } from "../stores/settings";
import { TickerData } from "../types";
import { formatPrice, formatPercent } from "../utils/format";

interface TokenHeaderProps {
  symbol: string;
  ticker: TickerData | undefined;
}

const TokenHeader: React.FC<TokenHeaderProps> = observer(
  ({ symbol, ticker }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isDark = getSettingsStore().theme === "dark";

    const baseAsset = symbol.replace("USDT", "");
    const isPositive = (ticker?.change24h ?? 0) >= 0;
    const priceColor = isPositive ? "text-[#0ecb81]" : "text-[#f6465d]";
    const textSecondary = isDark ? "text-[#848e9c]" : "text-gray-500";

    return (
      <div className="mb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`flex items-center gap-1.5 text-sm ${textSecondary} hover:text-[#f0b90b] transition-colors`}
            onClick={() => navigate("/")}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("detail.back")}
          </button>
          <span className={`${textSecondary} text-sm`}>/</span>
          <span
            className={`text-sm font-medium ${isDark ? "text-[#eaecef]" : "text-gray-800"}`}
          >
            {baseAsset}
            <span className={textSecondary}>/USDT</span>
          </span>
        </div>

        {/* Symbol + Price card */}
        <div
          className={`${isDark ? "bg-[#1e2026]" : "bg-white"} border ${isDark ? "border-[#2b2f36]" : "border-gray-200"} rounded-xl p-4 sm:p-5`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
            ${isDark ? "bg-[#2b2f36] text-[#f0b90b]" : "bg-yellow-100 text-yellow-600"}`}
            >
              {baseAsset.slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h1
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-[#eaecef]" : "text-gray-900"}`}
                >
                  {baseAsset}
                </h1>
                <span className={`text-base ${textSecondary}`}>/USDT</span>
              </div>

              {ticker ? (
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <span
                    className={`text-2xl sm:text-3xl font-bold font-mono ${priceColor}`}
                  >
                    ${formatPrice(ticker.price)}
                  </span>
                  <span
                    className={`text-sm font-semibold font-mono px-2 py-0.5 rounded
                  ${isPositive ? "bg-[#0ecb81]/10 text-[#0ecb81]" : "bg-[#f6465d]/10 text-[#f6465d]"}`}
                  >
                    {isPositive ? "▲" : "▼"} {formatPercent(ticker.change24h)}
                  </span>
                </div>
              ) : (
                <div
                  className={`h-8 w-36 rounded mt-0.5 animate-pulse ${isDark ? "bg-[#2b2f36]" : "bg-gray-200"}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TokenHeader.displayName = "TokenHeader";

export default TokenHeader;
