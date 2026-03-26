import React from "react";
import { useNavigate } from "react-router-dom";
import { TickerData } from "../types";
import { formatPrice, formatPercent, formatVolume } from "../utils/format";
import { getSettingsStore } from "../stores/settings";
import { observer } from "mobx-react-lite";

interface TickerRowProps {
  ticker: TickerData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
}

const TickerRow: React.FC<TickerRowProps> = observer(
  ({ ticker, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();
    const isDark = getSettingsStore().theme === "dark";
    const isUp = ticker.price >= ticker.prevPrice;
    const isPositive = ticker.change24h >= 0;
    const baseAsset = ticker.symbol.replace("USDT", "");

    return (
      <tr
        className={`group border-b cursor-pointer transition-colors duration-150
          ${
            isDark
              ? "border-[#2b2f36] hover:bg-[#2b2f36]/60"
              : "border-gray-100 hover:bg-gray-50"
          }`}
        onClick={() => navigate(`/detail/${ticker.symbol}`)}
      >
        {/* Favorite */}
        <td className="px-3 sm:px-4 py-3 w-10">
          <button
            className={`transition-all duration-150 hover:scale-125 ${
              isFavorite
                ? "text-[#f0b90b]"
                : isDark
                  ? "text-[#474d57] hover:text-[#f0b90b]"
                  : "text-gray-300 hover:text-[#f0b90b]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(ticker.symbol);
            }}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        </td>

        {/* Symbol */}
        <td className="px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-[10px] font-bold shrink-0
              ${isDark ? "bg-[#2b2f36] text-[#848e9c]" : "bg-gray-100 text-gray-500"}`}
            >
              {baseAsset.slice(0, 2)}
            </div>
            <div>
              <span
                className={`text-sm font-semibold ${isDark ? "text-[#eaecef]" : "text-gray-900"}`}
              >
                {baseAsset}
              </span>
              <span
                className={`text-xs ml-0.5 ${isDark ? "text-[#585f6b]" : "text-gray-400"}`}
              >
                /USDT
              </span>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-3 sm:px-4 py-3 font-mono">
          <span
            className={`text-sm font-semibold transition-colors duration-300 ${
              isUp ? "text-[#0ecb81]" : "text-[#f6465d]"
            }`}
          >
            ${formatPrice(ticker.price)}
          </span>
        </td>

        {/* 24h Change */}
        <td className="px-3 sm:px-4 py-3">
          <span
            className={`inline-block text-xs sm:text-sm font-semibold font-mono px-2 py-0.5 rounded ${
              isPositive
                ? "bg-[#0ecb81]/10 text-[#0ecb81]"
                : "bg-[#f6465d]/10 text-[#f6465d]"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatPercent(ticker.change24h)}
          </span>
        </td>

        {/* High */}
        <td
          className={`px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm hidden md:table-cell ${
            isDark ? "text-[#848e9c]" : "text-gray-500"
          }`}
        >
          ${formatPrice(ticker.high)}
        </td>

        {/* Low */}
        <td
          className={`px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm hidden md:table-cell ${
            isDark ? "text-[#848e9c]" : "text-gray-500"
          }`}
        >
          ${formatPrice(ticker.low)}
        </td>

        {/* Volume */}
        <td
          className={`px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm hidden lg:table-cell text-right ${
            isDark ? "text-[#848e9c]" : "text-gray-500"
          }`}
        >
          ${formatVolume(ticker.quoteVolume)}
        </td>
      </tr>
    );
  },
);

TickerRow.displayName = "TickerRow";

export default TickerRow;
