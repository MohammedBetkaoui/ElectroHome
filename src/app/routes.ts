import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AccountPage } from "./pages/AccountPage";
import { SearchPage } from "./pages/SearchPage";
import { BrandsPage } from "./pages/BrandsPage";
import { PromotionsPage } from "./pages/PromotionsPage";
import { BlogPage } from "./pages/BlogPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "categorie/:slug", Component: CategoryPage },
      { path: "produit/:slug", Component: ProductPage },
      { path: "panier", Component: CartPage },
      { path: "commande", Component: CheckoutPage },
      { path: "compte", Component: AccountPage },
      { path: "recherche", Component: SearchPage },
      { path: "marques", Component: BrandsPage },
      { path: "promotions", Component: PromotionsPage },
      { path: "blog", Component: BlogPage },
      { path: "blog/:slug", Component: BlogPage },
      { path: "a-propos", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "faq", Component: FaqPage },
      { path: "auth", Component: AuthPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
