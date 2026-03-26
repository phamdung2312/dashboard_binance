const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ?? "wss://stream.binance.com:9443/ws";

interface WebSocketManagerOptions {
  url: string;
  onMessage: (data: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

const MAX_RECONNECT_DELAY = 30000;
const INITIAL_RECONNECT_DELAY = 1000;

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private options: WebSocketManagerOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;

  constructor(options: WebSocketManagerOptions) {
    this.options = options;
  }

  connect(): void {
    this.isManualClose = false;
    this.createConnection();
  }

  disconnect(): void {
    this.isManualClose = true;
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private createConnection(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(this.options.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.options.onConnect?.();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data: unknown = JSON.parse(event.data as string);
        this.options.onMessage(data);
      } catch {
        // Ignore parse errors
      }
    };

    this.ws.onerror = (error: Event) => {
      this.options.onError?.(error);
    };

    this.ws.onclose = () => {
      this.options.onDisconnect?.();
      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts),
      MAX_RECONNECT_DELAY,
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.createConnection();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export function createMiniTickerStream(
  onMessage: (data: unknown) => void,
  onConnect?: () => void,
  onDisconnect?: () => void,
): WebSocketManager {
  return new WebSocketManager({
    url: `${WS_BASE_URL}/!miniTicker@arr`,
    onMessage,
    onConnect,
    onDisconnect,
  });
}

export function createKlineStream(
  symbol: string,
  interval: string,
  onMessage: (data: unknown) => void,
  onConnect?: () => void,
  onDisconnect?: () => void,
): WebSocketManager {
  const lowerSymbol = symbol.toLowerCase();
  return new WebSocketManager({
    url: `${WS_BASE_URL}/${lowerSymbol}@kline_${interval}`,
    onMessage,
    onConnect,
    onDisconnect,
  });
}
