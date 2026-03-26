import { Link } from "react-router";
import { Search, Home } from "lucide-react";
import { CATEGORIES } from "../data/store";

export function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl mb-4" style={{ fontWeight: 700, color: "var(--border)" }}>404</div>
      <h1 className="text-2xl mb-2" style={{ fontWeight: 600 }}>Page introuvable</h1>
      <p className="text-muted-foreground mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">
          <Home className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Catégories populaires :</p>
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.slice(0, 6).map((c) => (
          <Link key={c.slug} to={`/categorie/${c.slug}`} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
