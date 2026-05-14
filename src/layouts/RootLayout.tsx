import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../components/Header";
import { Fab } from "../components/Fab";
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
      <ScrollRestoration />
    </div>
  );
}
