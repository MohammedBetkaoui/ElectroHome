import { useState } from "react";
import { useParams, Link } from "react-router";
import { ChevronRight, Star, Heart, Share2, Truck, Shield, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { PRODUCTS, useStore, formatPrice } from "../data/store";
import { ProductCard } from "../components/ProductCard";

export function ProductPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.id === slug) || PRODUCTS[0];
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const isFav = favorites.includes(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Caractéristiques" },
    { id: "reviews", label: "Avis clients" },
    { id: "qa", label: "Questions/Réponses" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/categorie/${product.category}`} className="hover:text-foreground capitalize">{product.category.replace(/-/g, " ")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-[#E8400C]" : "border-border"}`}
              >
                <img src={product.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#0A84FF] dark:text-[#2997FF] mb-1" style={{ fontWeight: 500 }}>{product.brand}</p>
            <h1 className="text-2xl md:text-3xl mb-3" style={{ fontWeight: 700 }}>{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-[#FFD60A] text-[#FFD60A]" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} avis)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl text-foreground" style={{ fontWeight: 700 }}>{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                <span className="px-2 py-0.5 rounded bg-[#E8400C] text-white text-xs" style={{ fontWeight: 600 }}>-{discount}%</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Prix TTC, livraison non incluse</p>

          {/* Specs Badges */}
          <div className="flex flex-wrap gap-2">
            {product.specs.split(", ").map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg bg-muted text-xs font-mono">{s}</span>
            ))}
          </div>

          {/* Quantity + CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ fontWeight: 500 }}>Quantité</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#E8400C] dark:bg-[#FF5722] text-white hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                Ajouter au panier
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-primary text-foreground hover:bg-muted transition-colors">
                <Zap className="w-4.5 h-4.5" />
                Acheter maintenant
              </button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => toggleFavorite(product.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Heart className={`w-4 h-4 ${isFav ? "fill-[#E8400C] text-[#E8400C]" : ""}`} />
                {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4" /> Partager
              </button>
            </div>
          </div>

          {/* Delivery & Warranty */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#22C55E]" />
              <div>
                <p className="text-sm" style={{ fontWeight: 500 }}>Livraison gratuite</p>
                <p className="text-xs text-muted-foreground">Livraison estimée : 28-30 mars 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#0A84FF]" />
              <div>
                <p className="text-sm" style={{ fontWeight: 500 }}>Garantie 2 ans constructeur</p>
                <p className="text-xs text-muted-foreground">Extension de garantie disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? "border-[#E8400C] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontWeight: activeTab === t.id ? 600 : 400 }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="max-w-3xl">
          {activeTab === "description" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Le {product.name} de {product.brand} combine performance exceptionnelle et design élégant. Conçu pour répondre aux exigences des foyers modernes, cet appareil allie technologie de pointe et efficacité énergétique.</p>
              <p>Doté de fonctionnalités intelligentes et d'une construction premium, il s'intègre parfaitement dans votre intérieur tout en offrant des performances remarquables au quotidien.</p>
            </div>
          )}
          {activeTab === "specs" && (
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Marque", product.brand],
                  ["Modèle", product.name],
                  ["Classe énergétique", product.energy],
                  ["Spécifications", product.specs],
                  ["Garantie", "2 ans constructeur"],
                  ["Couleur", "Inox / Gris"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border">
                    <td className="py-3 text-muted-foreground w-48">{k}</td>
                    <td className="py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[
                { name: "Marie L.", rating: 5, text: "Excellent produit, très satisfaite de mon achat. La livraison était rapide et l'installation facile." },
                { name: "Pierre D.", rating: 4, text: "Très bon rapport qualité-prix. Fonctionne silencieusement et la consommation est faible." },
                { name: "Sophie M.", rating: 5, text: "Je recommande vivement ! Le service client a été très réactif pour répondre à mes questions." },
              ].map((r) => (
                <div key={r.name} className="p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs" style={{ fontWeight: 600 }}>{r.name[0]}</div>
                    <span className="text-sm" style={{ fontWeight: 500 }}>{r.name}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-[#FFD60A] text-[#FFD60A]" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "qa" && (
            <div className="space-y-4">
              {[
                { q: "Ce produit est-il compatible avec une installation encastrée ?", a: "Oui, ce modèle est conçu pour une installation encastrée standard." },
                { q: "Quelle est la consommation annuelle ?", a: "La consommation annuelle estimée est de 265 kWh, ce qui en fait un appareil très économe." },
              ].map((item) => (
                <div key={item.q} className="p-4 rounded-xl border border-border">
                  <p className="text-sm mb-2" style={{ fontWeight: 500 }}>Q: {item.q}</p>
                  <p className="text-sm text-muted-foreground">R: {item.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-xl mb-6" style={{ fontWeight: 600 }}>Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}