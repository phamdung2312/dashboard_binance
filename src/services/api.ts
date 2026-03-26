import { ExchangeInfoResponse, Kline, KlineInterval } from "../types";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.binance.com/api/v3";

export async function fetchExchangeInfo(): Promise<ExchangeInfoResponse> {
  const response = await fetch(`${BASE_URL}/exchangeInfo`);
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange info: ${response.status}`);
  }

  return response.json() as Promise<ExchangeInfoResponse>;
}

export async function fetchKlines(
  symbol: string,
  interval: KlineInterval,
  limit: number = 500,
): Promise<Kline[]> {
  const response = await fetch(
    `${BASE_URL}/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch klines: ${response.status}`);
  }

  const raw: number[][] = await response.json();
  console.log("Raw kline data", raw);
  return raw.map((k) => ({
    openTime: k[0] as number,
    open: parseFloat(k[1] as unknown as string),
    high: parseFloat(k[2] as unknown as string),
    low: parseFloat(k[3] as unknown as string),
    close: parseFloat(k[4] as unknown as string),
    volume: parseFloat(k[5] as unknown as string),
    closeTime: k[6] as number,
  }));
}
