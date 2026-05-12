import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../components/Header";
import { Fab } from "../components/Fab";
import { DebugPanel } from "../components/DebugPanel";

export function RootLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Fab />
      <DebugPanel />
      <ScrollRestoration />
    </div>
  );
}
