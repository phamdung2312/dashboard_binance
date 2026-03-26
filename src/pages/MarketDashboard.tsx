import React, { useEffect, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import {
  getMarketStore,
  loadExchangeInfo,
  connectWebSocket,
  disconnectWebSocket,
  setSearchQuery,
  toggleFavorite,
} from "../stores/market";
import { getSettingsStore } from "../stores/settings";
import { useDebounce } from "../hooks/useDebounce";
import { TickerData } from "../types";
import MarketStatsBar from "../components/MarketStatsBar";
import MarketTable from "../components/MarketTable";

type TabType = "all" | "favorites";

const MarketDashboard: React.FC = observer(() => {
  const store = getMarketStore();
  const [localSearch, setLocalSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const debouncedSetQuery = useDebounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      debouncedSetQuery(value);
      setCurrentPage(1);
    },
    [debouncedSetQuery],
  );

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    loadExchangeInfo();
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleToggleFavorite = useCallback((symbol: string) => {
    toggleFavorite(symbol);
  }, []);

  const filteredTickers = useMemo(() => {
    const tickers: TickerData[] = [];
    const query = store.searchQuery.toUpperCase();
    store.tickers.forEach((ticker) => {
      if (activeTab === "favorites" && !store.favorites.has(ticker.symbol))
        return;
      if (query && !ticker.symbol.includes(query)) return;
      tickers.push(ticker);
    });
    tickers.sort((a, b) => b.quoteVolume - a.quoteVolume);
    return tickers;
  }, [
    store.tickers,
    store.tickers.size,
    store.searchQuery,
    activeTab,
    store.favorites,
    store.favorites.size,
  ]);

  const prevFilterKey = React.useRef("");
  const filterKey = `${store.searchQuery}|${activeTab}`;
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    if (currentPage !== 1) setCurrentPage(1);
  }

  const pagedTickers = useMemo(
    () =>
      filteredTickers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [filteredTickers, currentPage, pageSize],
  );

  const isDark = getSettingsStore().theme === "dark";
  const bg = isDark ? "bg-[#0b0e11]" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <MarketStatsBar />
        <MarketTable
          filteredTickers={filteredTickers}
          pagedTickers={pagedTickers}
          currentPage={currentPage}
          pageSize={pageSize}
          localSearch={localSearch}
          activeTab={activeTab}
          onSearchChange={handleSearchChange}
          onTabChange={handleTabChange}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
});

export default MarketDashboard;
