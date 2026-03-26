import { mutator } from "satcheljs";
import {
  loadExchangeInfoSuccess,
  loadExchangeInfoError,
  setLoading,
  updateTickers,
  selectSymbol,
  selectInterval,
  setSearchQuery,
  loadKlinesSuccess,
  loadKlinesError,
  updateKlineFromWs,
  toggleFavorite,
  setWsConnected,
} from "./actions";
import getMarketStore from "./store";
import { TickerData } from "../../types";

mutator(setLoading, ({ isLoading }) => {
  getMarketStore().isLoading = isLoading;
});

mutator(loadExchangeInfoSuccess, ({ symbols }) => {
  getMarketStore().symbols = symbols;
  getMarketStore().isLoading = false;
  getMarketStore().error = null;
});

mutator(loadExchangeInfoError, ({ error }) => {
  getMarketStore().error = error;
  getMarketStore().isLoading = false;
});

mutator(updateTickers, ({ tickers }) => {
  const store = getMarketStore();
  const tickerMap = store.tickers;

  for (const t of tickers) {
    const symbol = t.s;
    const newPrice = parseFloat(t.c);
    const openPrice = parseFloat(t.o);
    const change24h =
      openPrice > 0 ? ((newPrice - openPrice) / openPrice) * 100 : 0;

    const existing = tickerMap.get(symbol);
    const prevPrice = existing ? existing.price : newPrice;

    const tickerData: TickerData = {
      symbol,
      price: newPrice,
      prevPrice,
      change24h,
      high: parseFloat(t.h),
      low: parseFloat(t.l),
      volume: parseFloat(t.v),
      quoteVolume: parseFloat(t.q),
    };

    tickerMap.set(symbol, tickerData);
  }
});

mutator(selectSymbol, ({ symbol }) => {
  getMarketStore().selectedSymbol = symbol;
});

mutator(selectInterval, ({ interval }) => {
  getMarketStore().selectedInterval = interval;
});

mutator(setSearchQuery, ({ query }) => {
  getMarketStore().searchQuery = query;
});

mutator(loadKlinesSuccess, ({ klines }) => {
  getMarketStore().klines = klines;
  getMarketStore().isLoading = false;
  getMarketStore().error = null;
});

mutator(loadKlinesError, ({ error }) => {
  getMarketStore().error = error;
  getMarketStore().isLoading = false;
});

mutator(updateKlineFromWs, ({ kline }) => {
  const store = getMarketStore();
  const klines = store.klines;
  if (klines.length === 0) return;

  const lastKline = klines[klines.length - 1];
  if (lastKline.openTime === kline.openTime) {
    klines[klines.length - 1] = kline;
  } else {
    klines.push(kline);
  }
});

mutator(toggleFavorite, ({ symbol }) => {
  const store = getMarketStore();
  if (store.favorites.has(symbol)) {
    store.favorites.delete(symbol);
  } else {
    store.favorites.add(symbol);
  }
  try {
    localStorage.setItem("favorites", JSON.stringify([...store.favorites]));
  } catch {
    // ignore
  }
});

mutator(setWsConnected, ({ connected }) => {
  getMarketStore().wsConnected = connected;
});
