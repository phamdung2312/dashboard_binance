import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "./components/Header";
import { getSettingsStore } from "./stores/settings";

import "./i18n";

const MarketDashboard = lazy(() => import("./pages/MarketDashboard"));
const TokenDetail = lazy(() => import("./pages/TokenDetail"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

const App: React.FC = observer(() => {
  const settings = getSettingsStore();

  return (
    <div className={settings.theme === "dark" ? "dark" : ""}>
      <div
        className={`min-h-screen transition-colors ${
          settings.theme === "dark"
            ? "bg-gray-950 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <BrowserRouter>
          <Header />
          <main>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<MarketDashboard />} />
                <Route path="/detail/:symbol" element={<TokenDetail />} />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </div>
    </div>
  );
});

export default App;
