# Crypto Market Dashboard

A real-time cryptocurrency market dashboard inspired by Binance, built with React 19, TypeScript, MobX, and WebSocket streaming from the Binance public API.

---

## Features

- **Live prices** — WebSocket stream (`miniTicker@arr`) updates all token prices in real time
- **Market stats bar** — Total tokens, gainers count, losers count with live connection status
- **Favorites** — Star/unstar tokens, persisted in MobX store
- **Search & filter** — Debounced search across all tokens, tab filter (All / Favorites)
- **Pagination** — Configurable rows per page (20 / 50 / 100)
- **Token detail page** — Candlestick chart with interval selector (1m, 5m, 15m, 1h, 4h, 1d, 1w), live kline WebSocket stream
- **Internationalization** — English and Vietnamese (i18next)
- **Dark / Light theme** — Toggle via header
- **Responsive design** — Mobile-first layout, Binance-style color palette

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript 5 |
| State management | MobX 6 + SatchelJS 4 |
| Styling | TailwindCSS 4 |
| Chart | lightweight-charts (TradingView) |
| Routing | React Router v6 |
| i18n | react-i18next |
| Build | Vite 8 |

---

## Installation & Running

### Prerequisites
- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd CryptoMarketDashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx           # App header with theme & language toggle
│   ├── MarketStatsBar.tsx   # Stats bar (total, gainers, losers)
│   ├── MarketTable.tsx      # Table with tabs, search, rows, pagination
│   ├── TickerRow.tsx        # Single token row
│   ├── TickerTableHeader.tsx
│   ├── SearchInput.tsx
│   ├── Pagination.tsx
│   ├── ConnectionStatus.tsx
│   ├── LoadingSkeleton.tsx
│   ├── CandlestickChart.tsx # TradingView lightweight chart wrapper
│   ├── TokenHeader.tsx      # Token breadcrumb + price display
│   ├── TokenStats.tsx       # High / Low / Volume stats grid
│   └── ChartCard.tsx        # Interval selector + chart
├── pages/
│   ├── MarketDashboard.tsx  # Main dashboard page
│   └── TokenDetail.tsx      # Token candlestick chart page
├── stores/
│   ├── market/              # Market store (tickers, klines, favorites)
│   │   ├── store.ts
│   │   ├── actions.ts
│   │   ├── mutators.ts
│   │   └── orchestrators.ts
│   └── settings/            # Settings store (theme, language)
├── services/
│   ├── api.ts               # REST API (Binance REST v3)
│   └── websocket.ts         # WebSocket manager with auto-reconnect
├── hooks/
│   └── useDebounce.ts
├── i18n/
│   └── locales/
│       ├── en.json
│       └── vi.json
├── types/
└── utils/
    └── format.ts            # Price, percent, volume formatters
```

---

## Architectural Decisions

### 1. SatchelJS action/mutator/orchestrator pattern

State mutations follow a strict unidirectional flow:

- **Action** — Dispatched by UI (e.g., `selectSymbol("BTCUSDT")`)
- **Mutator** — Only place that writes to the MobX store, reacts to an action
- **Orchestrator** — Handles async side effects (API calls, WebSocket lifecycle), also reacts to an action

This separation keeps async logic out of components and mutations pure and predictable.

### 2. WebSocket manager with exponential backoff

`WebSocketManager` in `services/websocket.ts` implements automatic reconnection with exponential backoff (1s → 2s → 4s … capped at 30s). Two separate WebSocket connections are managed:
- Global mini-ticker stream (`!miniTicker@arr`) for the full market list
- Per-symbol kline stream for the detail page — connected/disconnected on route enter/leave

### 3. `observer()` only — no `React.memo()` wrapper

`mobx-react-lite`'s `observer()` already applies memoization internally. Wrapping an observer component in `React.memo()` causes a runtime error. All reactive components use `observer()` exclusively.

### 4. Component decomposition

Pages are thin orchestrators. Heavy UI sections are extracted into focused components (`MarketStatsBar`, `MarketTable`, `TokenHeader`, `TokenStats`, `ChartCard`) that own their own data access via `getMarketStore()`, keeping pages under ~100 lines.

---

## Data Sources

| Data | Source |
|---|---|
| Token metadata (symbol, baseAsset, quoteAsset) | `GET /api/v3/exchangeInfo` (REST, loaded once on app start) |
| Live prices (lastPrice, change24h, high, low, volume) | `wss://stream.binance.com:9443/ws/!miniTicker@arr` |
| Historical candlestick data | `GET /api/v3/klines` (REST, loaded on symbol select) |
| Live candlestick updates | `wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}` |
