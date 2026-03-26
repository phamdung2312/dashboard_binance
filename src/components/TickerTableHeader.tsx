import React from "react";
import { useTranslation } from "react-i18next";
import { getSettingsStore } from "../stores/settings";
import { observer } from "mobx-react-lite";

const TickerTableHeader: React.FC = observer(() => {
  const { t } = useTranslation();
  const isDark = getSettingsStore().theme === "dark";
  const thClass = `px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider select-none
    ${isDark ? "text-[#848e9c]" : "text-gray-500"}`;

  return (
    <thead>
      <tr
        className={`border-b ${isDark ? "border-[#2b2f36] bg-[#1e2026]" : "border-gray-100 bg-gray-50"}`}
      >
        <th className={`${thClass} w-10`} />
        <th className={thClass}>{t("market.symbol")}</th>
        <th className={thClass}>{t("market.price")}</th>
        <th className={thClass}>{t("market.change24h")}</th>
        <th className={`${thClass} hidden md:table-cell`}>
          {t("market.high24h")}
        </th>
        <th className={`${thClass} hidden md:table-cell`}>
          {t("market.low24h")}
        </th>
        <th className={`${thClass} hidden lg:table-cell text-right`}>
          {t("market.volume")} (USDT)
        </th>
      </tr>
    </thead>
  );
});

TickerTableHeader.displayName = "TickerTableHeader";

export default TickerTableHeader;
