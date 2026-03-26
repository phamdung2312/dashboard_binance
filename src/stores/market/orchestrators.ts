import { orchestrator } from "satcheljs";
import {
  loadExchangeInfo,
  loadExchangeInfoSuccess,
  loadExchangeInfoError,
  setLoading,
  loadKlines,
  loadKlinesSuccess,
  loadKlinesError,
  updateTickers,
  updateKlineFromWs,
  connectWebSocket,
  disconnectWebSocket,
  connectKlineWebSocket,
  disconnectKlineWebSocket,
  setWsConnected,
} from "./actions";
import { fetchExchangeInfo, fetchKlines } from "../../services/api";
import {
  createMiniTickerStream,
  createKlineStream,
  WebSocketManager,
} from "../../services/websocket";
import { MiniTickerPayload, KlineWSPayload, Kline } from "../../types";

let miniTickerWs: WebSocketManager | null = null;
let klineWs: WebSocketManager | null = null;

// Throttle ticker updates
let tickerBatch: MiniTickerPayload[] = [];
let tickerFlushTimer: ReturnType<typeof setTimeout> | null = null;
const TICKER_THROTTLE_MS = 300;

function flushTickerBatch(): void {
  if (tickerBatch.length > 0) {
    updateTickers(tickerBatch);
    tickerBatch = [];
  }
}

function isMiniTickerArray(data: unknown): data is MiniTickerPayload[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof (data[0] as MiniTickerPayload).s === "string"
  );
}

function isKlineEvent(data: unknown): data is KlineWSPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    "e" in data &&
    (data as KlineWSPayload).e === "kline"
  );
}

orchestrator(loadExchangeInfo, async () => {
  setLoading(true);
  try {
    const info = await fetchExchangeInfo();

    const usdtSymbols = info.symbols.filter(
      (s) => s.quoteAsset === "USDT" && s.status === "TRADING",
    );
    console.log("usdtSymbols", usdtSymbols);
    loadExchangeInfoSuccess(usdtSymbols);
  } catch (err) {
    loadExchangeInfoError(
      err instanceof Error ? err.message : "Failed to load exchange info",
    );
  }
});

orchestrator(loadKlines, async ({ symbol, interval }) => {
  setLoading(true);
  try {
    const klines = await fetchKlines(symbol, interval);
    console.log("Fetched klines", klines);
    loadKlinesSuccess(klines);
  } catch (err) {
    loadKlinesError(
      err instanceof Error ? err.message : "Failed to load klines",
    );
  }
});

orchestrator(connectWebSocket, () => {
  if (miniTickerWs) {
    miniTickerWs.disconnect();
  }

  miniTickerWs = createMiniTickerStream(
    (data: unknown) => {
      if (isMiniTickerArray(data)) {
        console.log("Received mini ticker data:", data);
        // Only keep USDT pairs for performance
        const usdt = data.filter((t) => t.s.endsWith("USDT"));
        tickerBatch = usdt;

        if (!tickerFlushTimer) {
          tickerFlushTimer = setTimeout(() => {
            flushTickerBatch();
            tickerFlushTimer = null;
          }, TICKER_THROTTLE_MS);
        }
      }
    },
    () => setWsConnected(true),
    () => setWsConnected(false),
  );

  miniTickerWs.connect();
});

orchestrator(disconnectWebSocket, () => {
  if (miniTickerWs) {
    miniTickerWs.disconnect();
    miniTickerWs = null;
  }
  if (tickerFlushTimer) {
    clearTimeout(tickerFlushTimer);
    tickerFlushTimer = null;
  }
});

orchestrator(connectKlineWebSocket, ({ symbol, interval }) => {
  if (klineWs) {
    klineWs.disconnect();
  }

  klineWs = createKlineStream(symbol, interval, (data: unknown) => {
    if (isKlineEvent(data)) {
      const k = data.k;
      const kline: Kline = {
        openTime: k.t,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v),
        closeTime: k.T,
      };
      updateKlineFromWs(kline);
    }
  });

  klineWs.connect();
});

orchestrator(disconnectKlineWebSocket, () => {
  if (klineWs) {
    klineWs.disconnect();
    klineWs = null;
  }
});
