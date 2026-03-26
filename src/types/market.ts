// ===== REST API Types =====

export interface ExchangeInfoSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetPrecision: number;
  quoteAssetPrecision: number;
}

export interface ExchangeInfoResponse {
  timezone: string;
  serverTime: number;
  symbols: ExchangeInfoSymbol[];
}

export interface KlineRaw {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

// ===== WebSocket Types =====

export interface MiniTickerPayload {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  c: string; // Close price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
}

export interface KlineWSPayload {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
  };
}

// ===== Store Types =====

export interface TickerData {
  symbol: string;
  price: number;
  prevPrice: number;
  change24h: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
}

export interface MarketStoreState {
  tickers: Map<string, TickerData>;
  symbols: ExchangeInfoSymbol[];
  klines: Kline[];
  selectedSymbol: string;
  selectedInterval: KlineInterval;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  favorites: Set<string>;
  wsConnected: boolean;
}

// ===== Component Props =====

export interface TickerRowProps {
  ticker: TickerData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
  onSelect: (symbol: string) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export type KlineInterval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

export type PriceDirection = "up" | "down" | "neutral";
