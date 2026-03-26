import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { getMarketStore, loadExchangeInfo } from "../stores/market";
import { getSettingsStore } from "../stores/settings";
import { TickerData } from "../types";
import SearchInput from "./SearchInput";
import TickerRow from "./TickerRow";
import TickerTableHeader from "./TickerTableHeader";
import LoadingSkeleton from "./LoadingSkeleton";
import Pagination from "./Pagination";

type TabType = "all" | "favorites";

interface MarketTableProps {
  filteredTickers: TickerData[];
  pagedTickers: TickerData[];
  currentPage: number;
  pageSize: number;
  localSearch: string;
  activeTab: TabType;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: TabType) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggleFavorite: (symbol: string) => void;
}

const MarketTable: React.FC<MarketTableProps> = observer(
  ({
    filteredTickers,
    pagedTickers,
    currentPage,
    pageSize,
    localSearch,
    activeTab,
    onSearchChange,
    onTabChange,
    onPageChange,
    onPageSizeChange,
    onToggleFavorite,
  }) => {
    const { t } = useTranslation();
    const store = getMarketStore();
    const isDark = getSettingsStore().theme === "dark";

    const cardBg = isDark ? "bg-[#1e2026]" : "bg-white";
    const borderColor = isDark ? "border-[#2b2f36]" : "border-gray-200";
    const textPrimary = isDark ? "text-[#eaecef]" : "text-gray-900";
    const textSecondary = isDark ? "text-[#848e9c]" : "text-gray-500";
    const showLoading = store.isLoading && store.tickers.size === 0;

    return (
      <div className={`${cardBg} border ${borderColor} rounded-xl`}>
        {/* ── Tab bar ── */}
        <div
          className={`flex items-center gap-0 border-b ${borderColor} px-4 overflow-x-auto`}
        >
          {(["all", "favorites"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`
              relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeTab === tab
                  ? `${textPrimary} after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#f0b90b] after:rounded-t`
                  : `${textSecondary} hover:text-[#f0b90b]`
              }
            `}
            >
              {tab === "favorites" ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {t("app.favorites")}
                </span>
              ) : (
                t("app.all")
              )}
            </button>
          ))}

          {/* Search aligned to right */}
          <div className="ml-auto py-2 w-44 sm:w-60 shrink-0">
            <SearchInput value={localSearch} onChange={onSearchChange} />
          </div>
        </div>

        {/* ── Error ── */}
        {store.error && (
          <div className="mx-4 mt-3 bg-[#f6465d]/10 border border-[#f6465d]/30 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[#f6465d] text-sm">{store.error}</span>
            <button
              className="px-3 py-1 bg-[#f6465d] hover:bg-[#f6465d]/80 rounded text-white text-xs font-medium transition-colors"
              onClick={() => loadExchangeInfo()}
            >
              {t("app.retry")}
            </button>
          </div>
        )}

        {/* ── Table ── */}
        {showLoading ? (
          <div className="p-4">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <TickerTableHeader />
              <tbody>
                {filteredTickers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`text-center py-16 ${textSecondary}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-10 h-10 opacity-30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">
                          {store.tickers.size === 0
                            ? t("app.loading")
                            : t("app.noResults")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedTickers.map((ticker) => (
                    <TickerRow
                      key={ticker.symbol}
                      ticker={ticker}
                      isFavorite={store.favorites.has(ticker.symbol)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!showLoading && filteredTickers.length > 0 && (
          <div className={`border-t ${borderColor}`}>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTickers.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>
    );
  },
);

MarketTable.displayName = "MarketTable";

export default MarketTable;
