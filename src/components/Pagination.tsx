import React from "react";
import { useTranslation } from "react-i18next";
import { getSettingsStore } from "../stores/settings";
import { observer } from "mobx-react-lite";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const PAGE_SIZE_OPTIONS = [20, 50, 100];

const Pagination: React.FC<PaginationProps> = observer(
  ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = PAGE_SIZE_OPTIONS,
  }) => {
    const { t } = useTranslation();
    const isDark = getSettingsStore().theme === "dark";
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = (): number[] => {
      const delta = 2;
      const range: number[] = [];
      const start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, currentPage + delta);
      for (let i = start; i <= end; i++) range.push(i);
      return range;
    };

    const pageNumbers = getPageNumbers();

    const btnBase =
      "min-w-[34px] h-9 px-2 rounded text-sm font-medium transition-colors focus:outline-none";
    const btnActive = "bg-[#f0b90b] text-[#1e2026] font-bold";
    const btnInactive = isDark
      ? "text-[#848e9c] hover:bg-[#2b2f36] hover:text-[#eaecef]"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800";
    const btnDisabled = isDark
      ? "text-[#2b2f36] cursor-not-allowed"
      : "text-gray-300 cursor-not-allowed";
    const textMuted = isDark ? "text-[#848e9c]" : "text-gray-500";
    const selectClass = isDark
      ? "bg-[#2b2f36] border border-[#474d57] text-[#eaecef] focus:border-[#f0b90b]"
      : "bg-white border border-gray-200 text-gray-700 focus:border-[#f0b90b]";

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
        {/* Left: rows per page + info */}
        <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
          <span>{t("pagination.rowsPerPage")}:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className={`rounded px-2 py-1 text-sm focus:outline-none transition-colors ${selectClass}`}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="font-medium">
            {from}–{to}{" "}
            <span className={textMuted}>
              {t("pagination.of")} {totalItems.toLocaleString()}{" "}
              {t("pagination.tokens")}
            </span>
          </span>
        </div>

        {/* Right: page buttons */}
        <div className="flex items-center gap-0.5">
          <button
            className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title={t("pagination.first")}
          >
            «
          </button>
          <button
            className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button
                className={`${btnBase} ${btnInactive}`}
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className={`px-1 text-sm ${textMuted}`}>…</span>
              )}
            </>
          )}

          {pageNumbers.map((p) => (
            <button
              key={p}
              className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className={`px-1 text-sm ${textMuted}`}>…</span>
              )}
              <button
                className={`${btnBase} ${btnInactive}`}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title={t("pagination.last")}
          >
            »
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
