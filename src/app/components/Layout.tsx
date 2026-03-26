import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StoreProvider } from "../data/store";

import { useEffect } from "react";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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