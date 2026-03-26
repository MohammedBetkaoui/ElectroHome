import { useSearchParams, Link } from "react-router";
import { Search } from "lucide-react";
import { PRODUCTS, CATEGORIES, useStore } from "../data/store";
import { ProductCard } from "../components/ProductCard";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { searchQuery, setSearchQuery } = useStore();
  const results = q ? PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
  ) : PRODUCTS;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      {q && (
        <p className="text-lg mb-6">
          <span className="text-muted-foreground">{results.length} résultats pour </span>
          <span style={{ fontWeight: 600 }}>"{q}"</span>
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl mb-2" style={{ fontWeight: 600 }}>Aucun résultat trouvé</h2>
          <p className="text-muted-foreground mb-8">Essayez avec d'autres mots-clés ou explorez nos catégories.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.slice(0, 4).map((c) => (
              <Link key={c.slug} to={`/categorie/${c.slug}`} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
