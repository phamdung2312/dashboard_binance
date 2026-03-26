import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { getMarketStore, selectInterval } from "../stores/market";
import { getSettingsStore } from "../stores/settings";
import CandlestickChart from "./CandlestickChart";
import { KlineInterval } from "../types";

const INTERVALS: KlineInterval[] = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

const ChartCard: React.FC = observer(() => {
  const { t } = useTranslation();
  const store = getMarketStore();
  const settings = getSettingsStore();
  const isDark = settings.theme === "dark";

  const textSecondary = isDark ? "text-[#848e9c]" : "text-gray-500";
  const borderColor = isDark ? "border-[#2b2f36]" : "border-gray-200";

  const handleIntervalChange = useCallback((interval: KlineInterval) => {
    selectInterval(interval);
  }, []);

  return (
    <div
      className={`${isDark ? "bg-[#1e2026]" : "bg-white"} border ${borderColor} rounded-xl overflow-hidden`}
    >
      {/* Toolbar */}
      <div
        className={`flex items-center gap-2 px-4 py-3 border-b ${borderColor} overflow-x-auto`}
      >
        <span className={`text-xs font-medium ${textSecondary} shrink-0`}>
          {t("detail.interval")}
        </span>
        <div className="flex gap-1">
          {INTERVALS.map((interval) => (
            <button
              key={interval}
              className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                store.selectedInterval === interval
                  ? "bg-[#f0b90b] text-[#1e2026] font-bold"
                  : `${textSecondary} hover:text-[#f0b90b] ${isDark ? "hover:bg-[#2b2f36]" : "hover:bg-gray-100"}`
              }`}
              onClick={() => handleIntervalChange(interval)}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-3 sm:p-4">
        {store.isLoading && store.klines.length === 0 ? (
          <div className="h-[300px] sm:h-[450px] flex flex-col items-center justify-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-[#f0b90b]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#f0b90b] animate-spin" />
            </div>
            <span className={`text-sm ${textSecondary}`}>
              {t("app.loading")}
            </span>
          </div>
        ) : (
          <div className="h-[300px] sm:h-[450px]">
            <CandlestickChart klines={store.klines} theme={settings.theme} />
          </div>
        )}
      </div>
    </div>
  );
});

ChartCard.displayName = "ChartCard";

export default ChartCard;
