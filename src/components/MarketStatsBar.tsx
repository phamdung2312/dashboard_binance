import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { getMarketStore } from "../stores/market";
import { getSettingsStore } from "../stores/settings";
import ConnectionStatus from "./ConnectionStatus";

const MarketStatsBar: React.FC = observer(() => {
  const { t } = useTranslation();
  const store = getMarketStore();
  const isDark = getSettingsStore().theme === "dark";

  const cardBg = isDark ? "bg-[#1e2026]" : "bg-white";
  const borderColor = isDark ? "border-[#2b2f36]" : "border-gray-200";
  const textPrimary = isDark ? "text-[#eaecef]" : "text-gray-900";
  const textSecondary = isDark ? "text-[#848e9c]" : "text-gray-500";
  const divider = isDark ? "border-[#2b2f36]" : "border-gray-100";

  const gainers = useMemo(() => {
    let count = 0;
    store.tickers.forEach((t) => {
      if (t.change24h > 0) count++;
    });
    return count;
  }, [store.tickers, store.tickers.size]);

  const losers = useMemo(() => {
    let count = 0;
    store.tickers.forEach((t) => {
      if (t.change24h < 0) count++;
    });
    return count;
  }, [store.tickers, store.tickers.size]);

  return (
    <div
      className={`${cardBg} border ${borderColor} rounded-xl px-4 sm:px-5 py-4 mb-5`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-0 divide-x divide-[#2b2f36]">
          {/* Total tokens */}
          <div className="px-0 pr-4 sm:pr-6">
            <p
              className={`text-sm font-medium ${textSecondary} mb-1 uppercase tracking-wide`}
            >
              {t("market.marketDashboard")}
            </p>
            <div className="flex items-baseline gap-4">
              <span className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
                {store.tickers.size.toLocaleString()}
              </span>
              <span className={`text-sm ${textSecondary} hidden sm:inline`}>
                {t("market.totalTokens")}
              </span>
            </div>
            <p className={`text-sm ${textSecondary} mt-0.5 leading-tight`}>
              {t("market.realTimeUpdates")}
            </p>
          </div>

          {/* Gainers */}
          {store.tickers.size > 0 && (
            <>
              <div className="px-4 sm:px-6">
                <p className="text-[11px] font-medium text-[#848e9c] mb-1 uppercase tracking-wide">
                  {t("market.gainers")}
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-sm font-medium sm:text-2xl font-bold text-[#0ecb81]">
                    {gainers.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#0ecb81]/70 hidden sm:inline">
                    ▲
                    {store.tickers.size > 0
                      ? ((gainers / store.tickers.size) * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              {/* Losers */}
              <div className="pl-4 sm:pl-6">
                <p className="text-[11px] font-medium text-[#848e9c] mb-1 uppercase tracking-wide">
                  {t("market.losers")}
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-sm font-medium sm:text-2xl font-bold text-[#f6465d]">
                    {losers.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#f6465d]/70 hidden sm:inline">
                    ▼
                    {store.tickers.size > 0
                      ? ((losers / store.tickers.size) * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Connection status */}
        <div className="self-start sm:self-auto">
          <ConnectionStatus connected={store.wsConnected} />
        </div>
      </div>
    </div>
  );
});

MarketStatsBar.displayName = "MarketStatsBar";

export default MarketStatsBar;
