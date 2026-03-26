import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import {
  getMarketStore,
  loadKlines,
  selectSymbol,
  connectKlineWebSocket,
  disconnectKlineWebSocket,
} from "../stores/market";
import { getSettingsStore } from "../stores/settings";
import TokenHeader from "../components/TokenHeader";
import TokenStats from "../components/TokenStats";
import ChartCard from "../components/ChartCard";

const TokenDetail: React.FC = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const store = getMarketStore();
  const isDark = getSettingsStore().theme === "dark";

  const currentSymbol = symbol || store.selectedSymbol;
  const ticker = store.tickers.get(currentSymbol);
  const baseAsset = currentSymbol.replace("USDT", "");

  const bg = isDark ? "bg-[#0b0e11]" : "bg-gray-50";

  useEffect(() => {
    if (currentSymbol) {
      selectSymbol(currentSymbol);
      loadKlines(currentSymbol, store.selectedInterval);
      connectKlineWebSocket(currentSymbol, store.selectedInterval);
    }
    return () => {
      disconnectKlineWebSocket();
    };
  }, [currentSymbol, store.selectedInterval]);

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-200`}>
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <TokenHeader symbol={currentSymbol} ticker={ticker} />
        {ticker && <TokenStats ticker={ticker} baseAsset={baseAsset} />}
        <ChartCard />
        {store.error && (
          <div className="mt-4 bg-[#f6465d]/10 border border-[#f6465d]/30 rounded-xl p-4 text-[#f6465d] text-sm">
            {store.error}
          </div>
        )}
      </div>
    </div>
  );
});

export default TokenDetail;
