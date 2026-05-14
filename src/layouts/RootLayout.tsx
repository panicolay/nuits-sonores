import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../components/Header";
import { Fab } from "../components/Fab";
import { DebugPanel } from "../components/DebugPanel";
import { UpdateBanner } from "../components/UpdateBanner";

export function RootLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
        <UpdateBanner />
      </main>
      <Fab />
      <DebugPanel />
      <ScrollRestoration />
    </div>
  );
}
