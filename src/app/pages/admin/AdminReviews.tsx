import { useState, useMemo } from "react";
import { Search, Star, CheckCircle2, X, Eye, Flag, MessageCircle, ThumbsUp, ThumbsDown, Filter } from "lucide-react";

type ReviewStatus = "approved" | "pending" | "rejected" | "flagged";
interface Review {
  id: string; client: string; product: string; rating: number; title: string; comment: string;
  date: string; status: ReviewStatus; helpful: number; reported: number;
}

const STATUS_CFG: Record<ReviewStatus, { label: string; color: string }> = {
  approved: { label: "Approuvé", color: "#10B981" },
  pending: { label: "En attente", color: "#F59E0B" },
  rejected: { label: "Rejeté", color: "#EF4444" },
  flagged: { label: "Signalé", color: "#8B5CF6" },
};

const REVIEWS: Review[] = [
  { id: "1", client: "Karim B.", product: "Samsung RT38 Réfrigérateur", rating: 5, title: "Excellent produit !", comment: "Très satisfait de ce réfrigérateur. Grand espace, silencieux et design moderne. Livraison rapide sur BBA.", date: "2026-03-26", status: "approved", helpful: 12, reported: 0 },
  { id: "2", client: "Amina Z.", product: "LG F4V5 Machine à laver", rating: 4, title: "Bon rapport qualité/prix", comment: "Machine performante, bon essorage. Seul bémol : un peu bruyante en mode essorage rapide.", date: "2026-03-25", status: "approved", helpful: 8, reported: 0 },
  { id: "3", client: "Youcef H.", product: "Condor Alpha Climatiseur", rating: 2, title: "Déçu par la puissance", comment: "Pour un 12000 BTU, il peine à refroidir une pièce de 25m². Installation correcte par contre.", date: "2026-03-24", status: "pending", helpful: 3, reported: 1 },
  { id: "4", client: "Meriem B.", product: "Moulinex Cookeo", rating: 5, title: "Révolution en cuisine !", comment: "Je l'utilise tous les jours. Les recettes intégrées sont parfaites. Meilleur achat chez ElectroHome.", date: "2026-03-23", status: "approved", helpful: 18, reported: 0 },
  { id: "5", client: "Omar F.", product: "Dyson V15 Aspirateur", rating: 1, title: "Batterie faible", comment: "L'aspirateur perd sa charge après 15 min. Retour en cours. Service client réactif cependant.", date: "2026-03-22", status: "flagged", helpful: 2, reported: 3 },
  { id: "6", client: "Nadia S.", product: "Brandt Cuisinière", rating: 4, title: "Solide et bien finie", comment: "Bonne cuisinière, four spacieux. La livraison à Bordj Bou Arréridj était gratuite, un plus.", date: "2026-03-21", status: "approved", helpful: 6, reported: 0 },
  { id: "7", client: "Sofiane M.", product: "Bosch WAN28 Lave-linge", rating: 5, title: "Silencieux et efficace", comment: "Après 2 mois d'utilisation, rien à redire. Très silencieux même à 1200 tr/min.", date: "2026-03-20", status: "pending", helpful: 0, reported: 0 },
  { id: "8", client: "Fatima C.", product: "Philips Airfryer XL", rating: 3, title: "Correct sans plus", comment: "Fait le job pour les frites mais la capacité est juste pour une famille de 5.", date: "2026-03-19", status: "approved", helpful: 4, reported: 0 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="w-3.5 h-3.5" fill={i <= rating ? "#F59E0B" : "none"} stroke={i <= rating ? "#F59E0B" : "#D1D5DB"} />
      ))}
    </div>
  );
}

export function AdminReviews() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;
  const filtered = useMemo(() => {
    let list = [...REVIEWS];
    if (search) { const q = search.toLowerCase(); list = list.filter((r) => r.client.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q)); }
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (ratingFilter !== "all") list = list.filter((r) => r.rating === Number(ratingFilter));
    return list;
  }, [search, statusFilter, ratingFilter]);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total avis", value: REVIEWS.length, icon: MessageCircle, color: "#FF6B35" },
          { label: "Note moyenne", value: avgRating.toFixed(1) + "/5", icon: Star, color: "#F59E0B" },
          { label: "En attente", value: REVIEWS.filter((r) => r.status === "pending").length, icon: Eye, color: "#3B82F6" },
          { label: "Signalés", value: REVIEWS.filter((r) => r.status === "flagged").length, icon: Flag, color: "#EF4444" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div><p className="text-[11px] text-[#9CA3AF]">{k.label}</p><p className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{k.value}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un avis..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Toutes les notes</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>)}
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((r) => {
          const st = STATUS_CFG[r.status];
          return (
            <div key={r.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF6B35]/15 flex items-center justify-center text-[12px] text-[#FF6B35]" style={{ fontWeight: 600 }}>
                    {r.client.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{r.client}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{r.product} • {new Date(r.date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>{st.label}</span>
                </div>
              </div>
              <h4 className="text-[14px] text-[#1A2332] dark:text-white mb-1" style={{ fontWeight: 600 }}>{r.title}</h4>
              <p className="text-[13px] text-[#6B7280] dark:text-white/60 mb-3">{r.comment}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {r.helpful} utile(s)</span>
                  {r.reported > 0 && <span className="flex items-center gap-1 text-[#EF4444]"><Flag className="w-3 h-3" /> {r.reported} signalement(s)</span>}
                </div>
                <div className="flex gap-1">
                  {r.status === "pending" && (
                    <>
                      <button className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[11px] hover:bg-[#10B981]/20" style={{ fontWeight: 500 }}>Approuver</button>
                      <button className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] text-[11px] hover:bg-[#EF4444]/20" style={{ fontWeight: 500 }}>Rejeter</button>
                    </>
                  )}
                  {r.status === "flagged" && (
                    <button className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] hover:bg-[#F59E0B]/20" style={{ fontWeight: 500 }}>Examiner</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucun avis trouvé</div>}
      </div>
    </div>
  );
}
