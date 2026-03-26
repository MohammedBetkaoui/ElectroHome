import { useState } from "react";
import { Link } from "react-router";
import { Search, ChevronDown, MessageCircle } from "lucide-react";

const faqData = [
  {
    section: "Commandes",
    items: [
      { q: "Comment passer une commande ?", a: "Ajoutez vos produits au panier, puis suivez les étapes de paiement. Vous recevrez une confirmation par email." },
      { q: "Puis-je modifier ma commande après validation ?", a: "Vous pouvez modifier votre commande dans l'heure suivant la validation en contactant notre service client." },
    ],
  },
  {
    section: "Livraison",
    items: [
      { q: "Quels sont les délais de livraison ?", a: "Livraison standard en 3-5 jours ouvrés. Express en 24h (J+1) disponible pour la plupart des produits." },
      { q: "La livraison est-elle gratuite ?", a: "Oui, la livraison est gratuite pour toute commande supérieure à 70 000 DA. En dessous, les frais sont de 4 000 DA." },
    ],
  },
  {
    section: "Retours & Remboursements",
    items: [
      { q: "Quelle est votre politique de retour ?", a: "Vous disposez de 30 jours pour retourner un produit non utilisé dans son emballage d'origine." },
      { q: "Comment demander un remboursement ?", a: "Connectez-vous à votre compte, accédez à votre commande et cliquez sur 'Demander un retour'." },
    ],
  },
  {
    section: "Garantie",
    items: [
      { q: "Quelle garantie pour mes produits ?", a: "Tous nos produits bénéficient d'une garantie constructeur de 2 ans minimum. Des extensions sont disponibles." },
      { q: "Comment faire jouer la garantie ?", a: "Contactez notre SAV avec votre numéro de commande. Nous organiserons la réparation ou le remplacement." },
    ],
  },
  {
    section: "Paiement",
    items: [
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard), PayPal, virement bancaire et paiement en 3x sans frais." },
      { q: "Le paiement est-il sécurisé ?", a: "Oui, toutes les transactions sont sécurisées par cryptage SSL 256 bits via notre partenaire Stripe." },
    ],
  },
];

export function FaqPage() {
  const [searchQ, setSearchQ] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) => setOpenItems((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const filtered = searchQ
    ? faqData.map((s) => ({ ...s, items: s.items.filter((i) => i.q.toLowerCase().includes(searchQ.toLowerCase())) })).filter((s) => s.items.length > 0)
    : faqData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl text-center mb-2" style={{ fontWeight: 700 }}>Foire aux questions</h1>
      <p className="text-center text-muted-foreground mb-8">Trouvez rapidement les réponses à vos questions.</p>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
        <input
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Rechercher une question..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-sm"
        />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {filtered.map((section) => (
          <div key={section.section}>
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>{section.section}</h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.section}-${item.q}`;
                const isOpen = openItems.includes(key);
                return (
                  <div key={key} className="rounded-xl border border-border overflow-hidden">
                    <button onClick={() => toggle(key)} className="w-full flex items-center justify-between p-4 text-left text-sm hover:bg-muted/50 transition-colors" style={{ fontWeight: 500 }}>
                      {item.q}
                      <ChevronDown className={`w-4 h-4 shrink-0 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="mt-12 p-8 rounded-2xl bg-muted/50 border border-border text-center">
        <MessageCircle className="w-8 h-8 text-[#E8400C] mx-auto mb-3" />
        <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>Vous n'avez pas trouvé votre réponse ?</h3>
        <p className="text-sm text-muted-foreground mb-4">Notre équipe est disponible pour vous aider.</p>
        <Link to="/contact" className="inline-flex px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">
          Contactez-nous
        </Link>
      </div>
    </div>
  );
}