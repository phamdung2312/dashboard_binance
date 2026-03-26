import { action } from "satcheljs";
import {
  ExchangeInfoSymbol,
  Kline,
  KlineInterval,
  MiniTickerPayload,
} from "../../types";

export const loadExchangeInfo = action("LOAD_EXCHANGE_INFO");

export const loadExchangeInfoSuccess = action(
  "LOAD_EXCHANGE_INFO_SUCCESS",
  (symbols: ExchangeInfoSymbol[]) => ({ symbols }),
);

export const loadExchangeInfoError = action(
  "LOAD_EXCHANGE_INFO_ERROR",
  (error: string) => ({ error }),
);

export const setLoading = action("SET_LOADING", (isLoading: boolean) => ({
  isLoading,
}));

export const updateTickers = action(
  "UPDATE_TICKERS",
  (tickers: MiniTickerPayload[]) => ({ tickers }),
);

export const selectSymbol = action("SELECT_SYMBOL", (symbol: string) => ({
  symbol,
}));

export const selectInterval = action(
  "SELECT_INTERVAL",
  (interval: KlineInterval) => ({ interval }),
);

export const setSearchQuery = action("SET_SEARCH_QUERY", (query: string) => ({
  query,
}));

export const loadKlines = action(
  "LOAD_KLINES",
  (symbol: string, interval: KlineInterval) => ({ symbol, interval }),
);

export const loadKlinesSuccess = action(
  "LOAD_KLINES_SUCCESS",
  (klines: Kline[]) => ({ klines }),
);

export const loadKlinesError = action("LOAD_KLINES_ERROR", (error: string) => ({
  error,
}));

export const updateKlineFromWs = action(
  "UPDATE_KLINE_FROM_WS",
  (kline: Kline) => ({ kline }),
);

export const toggleFavorite = action("TOGGLE_FAVORITE", (symbol: string) => ({
  symbol,
}));

export const setWsConnected = action(
  "SET_WS_CONNECTED",
  (connected: boolean) => ({ connected }),
);

export const connectWebSocket = action("CONNECT_WEBSOCKET");
export const disconnectWebSocket = action("DISCONNECT_WEBSOCKET");
export const connectKlineWebSocket = action(
  "CONNECT_KLINE_WEBSOCKET",
  (symbol: string, interval: KlineInterval) => ({ symbol, interval }),
);
export const disconnectKlineWebSocket = action("DISCONNECT_KLINE_WEBSOCKET");
