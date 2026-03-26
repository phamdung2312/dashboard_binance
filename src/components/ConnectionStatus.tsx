import React from "react";
import { useTranslation } from "react-i18next";

interface ConnectionStatusProps {
  connected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = React.memo(
  ({ connected }) => {
    const { t } = useTranslation();

    return (
      <div className="flex items-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-400 animate-pulse" : "bg-red-400"
          }`}
        />
        <span className={connected ? "text-green-400" : "text-red-400"}>
          {connected ? t("app.connected") : t("app.disconnected")}
        </span>
      </div>
    );
  },
);

ConnectionStatus.displayName = "ConnectionStatus";

export default ConnectionStatus;
