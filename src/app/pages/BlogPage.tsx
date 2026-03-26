import { Link } from "react-router";
import { Clock, User } from "lucide-react";
import { IMAGES } from "../data/store";

const articles = [
  { id: "1", title: "Comment choisir son réfrigérateur en 2026 : le guide complet", excerpt: "Découvrez tous les critères essentiels pour trouver le réfrigérateur parfait pour votre foyer.", image: IMAGES.blog1, tag: "Guide d'achat", author: "Marie Laurent", time: "5 min" },
  { id: "2", title: "10 astuces pour entretenir votre lave-linge", excerpt: "Prolongez la durée de vie de votre machine à laver avec ces conseils simples et efficaces.", image: IMAGES.blog2, tag: "Entretien", author: "Pierre Martin", time: "3 min" },
  { id: "3", title: "Électroménager éco-responsable : le guide complet", excerpt: "Comment réduire votre empreinte carbone tout en équipant votre maison.", image: IMAGES.blog3, tag: "Tendances", author: "Sophie Dubois", time: "7 min" },
  { id: "4", title: "Four à vapeur vs four classique : que choisir ?", excerpt: "Comparatif détaillé pour vous aider à faire le bon choix pour votre cuisine.", image: IMAGES.oven, tag: "Comparatif", author: "Marc Leroy", time: "4 min" },
  { id: "5", title: "Les meilleurs aspirateurs robots de 2026", excerpt: "Notre sélection des aspirateurs robots les plus performants du marché.", image: IMAGES.vacuum, tag: "Guide d'achat", author: "Marie Laurent", time: "6 min" },
  { id: "6", title: "Climatisation : préparez votre été sereinement", excerpt: "Tout ce qu'il faut savoir pour bien choisir et installer votre climatiseur.", image: IMAGES.ac, tag: "Guide d'achat", author: "Pierre Martin", time: "5 min" },
];

const tagColors: Record<string, string> = {
  "Guide d'achat": "text-[#0A84FF]",
  "Entretien": "text-[#22C55E]",
  "Tendances": "text-[#E8400C]",
  "Comparatif": "text-[#FFD60A]",
};

export function BlogPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl mb-2" style={{ fontWeight: 700 }}>Nos conseils d'experts</h1>
        <p className="text-muted-foreground">Guides d'achat, astuces entretien et tendances du monde de l'électroménager.</p>
      </div>

      {/* Featured */}
      <Link to={`/blog/${featured.id}`} className="group flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-card border border-border mb-10 overflow-hidden">
        <div className="md:w-1/2 aspect-[16/10] rounded-xl overflow-hidden">
          <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center py-2">
          <span className={`text-xs mb-2 ${tagColors[featured.tag] || "text-[#0A84FF]"}`} style={{ fontWeight: 500 }}>{featured.tag}</span>
          <h2 className="text-xl md:text-2xl mb-3 group-hover:text-[#E8400C] transition-colors" style={{ fontWeight: 600 }}>{featured.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{featured.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.time} de lecture</span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((a) => (
          <Link key={a.id} to={`/blog/${a.id}`} className="group rounded-xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <span className={`text-xs ${tagColors[a.tag] || "text-[#0A84FF]"}`} style={{ fontWeight: 500 }}>{a.tag}</span>
              <h3 className="text-sm mt-1 mb-2 group-hover:text-[#E8400C] transition-colors" style={{ fontWeight: 500 }}>{a.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{a.author}</span>
                <span>{a.time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
