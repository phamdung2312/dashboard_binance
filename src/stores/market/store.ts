import { createStore } from "satcheljs";
import {
  MarketStoreState,
  TickerData,
  ExchangeInfoSymbol,
  Kline,
  KlineInterval,
} from "../../types";

const initialFavorites = (): Set<string> => {
  try {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      return new Set(JSON.parse(saved) as string[]);
    }
  } catch {
    // ignore
  }
  return new Set<string>();
};

const getMarketStore = createStore<MarketStoreState>("marketStore", {
  tickers: new Map<string, TickerData>(),
  symbols: [] as ExchangeInfoSymbol[],
  klines: [] as Kline[],
  selectedSymbol: "BTCUSDT",
  selectedInterval: "1h" as KlineInterval,
  searchQuery: "",
  isLoading: false,
  error: null,
  favorites: initialFavorites(),
  wsConnected: false,
});

export default getMarketStore;
