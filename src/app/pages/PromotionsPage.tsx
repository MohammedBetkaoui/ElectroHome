import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { PRODUCTS, useStore, formatPrice } from "../data/store";
import { ProductCard } from "../components/ProductCard";

export function PromotionsPage() {
  const [filter, setFilter] = useState("all");
  const promoProducts = PRODUCTS.filter((p) => p.oldPrice);
  const allProducts = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const [time, setTime] = useState({ h: 2, m: 14, s: 36 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        let { h, m, s } = t;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");

  const spotlightProduct = promoProducts[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Timer className="w-5 h-5 text-[#E8400C]" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Ventes Flash</span>
        </div>
        <h1 className="text-3xl mb-4" style={{ fontWeight: 700 }}>Promotions en cours</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Se termine dans</span>
          {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
            <div key={i} className="w-10 h-10 rounded-lg bg-[#E8400C] text-white flex items-center justify-center font-mono" style={{ fontWeight: 700 }}>
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Spotlight */}
      {spotlightProduct && (
        <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-card border border-border mb-10">
          <img src={spotlightProduct.image} alt={spotlightProduct.name} className="w-full md:w-72 h-72 rounded-xl object-cover" />
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-xs px-2 py-0.5 rounded bg-[#E8400C] text-white w-fit mb-2" style={{ fontWeight: 500 }}>Promotion du jour</span>
            <p className="text-sm text-muted-foreground">{spotlightProduct.brand}</p>
            <h2 className="text-xl mb-2" style={{ fontWeight: 600 }}>{spotlightProduct.name}</h2>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl text-[#E8400C]" style={{ fontWeight: 700 }}>{formatPrice(spotlightProduct.price)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(spotlightProduct.oldPrice!)}</span>
              <span className="px-2 py-0.5 rounded bg-[#FFD60A] text-[#111] text-xs" style={{ fontWeight: 600 }}>
                -{Math.round((1 - spotlightProduct.price / spotlightProduct.oldPrice!) * 100)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono mb-4">{spotlightProduct.specs}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${filter === "all" ? "bg-[#E8400C] text-white" : "bg-card border border-border hover:bg-muted"}`}
        >
          Tous
        </button>
        {useStore().categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setFilter(c.slug)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${filter === c.slug ? "bg-[#E8400C] text-white" : "bg-card border border-border hover:bg-muted"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}