import { Link } from "react-router";
import { BRANDS, IMAGES } from "../data/store";

export function BrandsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl mb-2" style={{ fontWeight: 700 }}>Nos marques partenaires</h1>
        <p className="text-muted-foreground">Découvrez les plus grandes marques d'électroménager disponibles chez ElectroHome.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {BRANDS.map((b) => (
          <Link
            key={b}
            to={`/recherche?q=${encodeURIComponent(b)}`}
            className="flex items-center justify-center h-32 rounded-xl border border-border bg-card hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <span className="text-xl text-foreground" style={{ fontWeight: 600 }}>{b}</span>
          </Link>
        ))}
      </div>

      {/* Featured Brand */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
        <img src={IMAGES.store} alt="Samsung" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
          <div className="px-8 md:px-12 max-w-md">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Marque à la une</p>
            <h2 className="text-white text-3xl mb-3" style={{ fontWeight: 700 }}>Samsung</h2>
            <p className="text-white/70 text-sm mb-4">Leader mondial de l'innovation, Samsung propose une gamme complète d'appareils intelligents et connectés.</p>
            <Link to="/recherche?q=Samsung" className="inline-flex px-5 py-2.5 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">
              Voir les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
