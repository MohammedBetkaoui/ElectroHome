import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StoreProvider } from "../data/store";

export function Layout() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col font-[DM_Sans,sans-serif]">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  );
}