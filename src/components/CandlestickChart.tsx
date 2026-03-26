import React, { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { Kline } from "../types";

interface CandlestickChartProps {
  klines: Kline[];
  theme: "dark" | "light";
}

const CandlestickChart: React.FC<CandlestickChartProps> = React.memo(
  ({ klines, theme }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
      if (!chartContainerRef.current) return;

      const isDark = theme === "dark";

      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: isDark ? "#1a1a2e" : "#ffffff" },
          textColor: isDark ? "#d1d5db" : "#374151",
        },
        grid: {
          vertLines: { color: isDark ? "#2d2d44" : "#e5e7eb" },
          horzLines: { color: isDark ? "#2d2d44" : "#e5e7eb" },
        },
        crosshair: {
          mode: 0,
        },
        timeScale: {
          borderColor: isDark ? "#2d2d44" : "#e5e7eb",
          timeVisible: true,
        },
        rightPriceScale: {
          borderColor: isDark ? "#2d2d44" : "#e5e7eb",
        },
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderDownColor: "#ef4444",
        borderUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        wickUpColor: "#22c55e",
      });

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
        chartRef.current = null;
        seriesRef.current = null;
      };
    }, [theme]);

    useEffect(() => {
      if (!seriesRef.current || klines.length === 0) return;

      const data = klines.map((k) => ({
        time: (k.openTime / 1000) as number,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      }));

      seriesRef.current.setData(
        data as Parameters<typeof seriesRef.current.setData>[0],
      );

      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }, [klines]);

    return (
      <div
        ref={chartContainerRef}
        className="w-full rounded-lg overflow-hidden"
      />
    );
  },
);

CandlestickChart.displayName = "CandlestickChart";

export default CandlestickChart;
