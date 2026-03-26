import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { getSettingsStore } from "../stores/settings";
import { TickerData } from "../types";
import { formatPrice, formatVolume } from "../utils/format";

interface TokenStatsProps {
  ticker: TickerData;
  baseAsset: string;
}

const StatItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
  isDark: boolean;
}> = ({ label, value, valueClass, isDark }) => (
  <div className="flex flex-col gap-0.5">
    <span
      className={`text-xs font-medium uppercase tracking-wide ${isDark ? "text-[#848e9c]" : "text-gray-500"}`}
    >
      {label}
    </span>
    <span
      className={`text-sm sm:text-base font-semibold font-mono ${valueClass ?? (isDark ? "text-[#eaecef]" : "text-gray-800")}`}
    >
      {value}
    </span>
  </div>
);

const TokenStats: React.FC<TokenStatsProps> = observer(
  ({ ticker, baseAsset }) => {
    const { t } = useTranslation();
    const isDark = getSettingsStore().theme === "dark";

    return (
      <div
        className={`${isDark ? "bg-[#1e2026]" : "bg-white"} border ${isDark ? "border-[#2b2f36]" : "border-gray-200"} rounded-xl p-4 sm:p-5 mb-4`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatItem
            isDark={isDark}
            label={t("market.high24h")}
            value={`$${formatPrice(ticker.high)}`}
            valueClass="text-[#0ecb81]"
          />
          <StatItem
            isDark={isDark}
            label={t("market.low24h")}
            value={`$${formatPrice(ticker.low)}`}
            valueClass="text-[#f6465d]"
          />
          <StatItem
            isDark={isDark}
            label={`${t("market.volume")} (${baseAsset})`}
            value={formatVolume(ticker.volume)}
          />
          <StatItem
            isDark={isDark}
            label={`${t("market.volume")} (USDT)`}
            value={`$${formatVolume(ticker.quoteVolume)}`}
          />
        </div>
      </div>
    );
  },
);

TokenStats.displayName = "TokenStats";

export default TokenStats;
