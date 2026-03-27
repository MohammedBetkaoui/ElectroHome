import { useState } from "react";
import { Download, FileText, Calendar, BarChart3, TrendingUp, DollarSign, Package, Users, Truck, Clock } from "lucide-react";

interface Report {
  id: string; name: string; description: string; category: string; lastGenerated: string;
  format: string; icon: any; color: string;
}

const REPORTS: Report[] = [
  { id: "1", name: "Rapport de ventes mensuel", description: "Vue d'ensemble des ventes, revenus et tendances du mois en cours.", category: "Ventes", lastGenerated: "2026-03-27", format: "PDF / Excel", icon: DollarSign, color: "#FF6B35" },
  { id: "2", name: "Rapport de stock", description: "État du stock par catégorie, alertes de rupture et surstockage.", category: "Inventaire", lastGenerated: "2026-03-27", format: "Excel", icon: Package, color: "#3B82F6" },
  { id: "3", name: "Performance des produits", description: "Top produits, produits en déclin, taux de retour par référence.", category: "Produits", lastGenerated: "2026-03-25", format: "PDF", icon: BarChart3, color: "#10B981" },
  { id: "4", name: "Analyse des clients", description: "Segmentation client, taux de rétention, panier moyen et LTV.", category: "Clients", lastGenerated: "2026-03-24", format: "PDF / Excel", icon: Users, color: "#8B5CF6" },
  { id: "5", name: "Rapport de livraisons", description: "Délais moyens, taux de livraison réussite, performances par transporteur.", category: "Logistique", lastGenerated: "2026-03-26", format: "PDF", icon: Truck, color: "#F59E0B" },
  { id: "6", name: "Rapport marketing", description: "ROI des campagnes, taux de conversion, performances des coupons.", category: "Marketing", lastGenerated: "2026-03-23", format: "PDF / Excel", icon: TrendingUp, color: "#EF4444" },
  { id: "7", name: "Rapport comptable", description: "Facturation, TVA collectée, soldes et rapprochements bancaires.", category: "Finance", lastGenerated: "2026-03-27", format: "Excel", icon: FileText, color: "#06B6D4" },
  { id: "8", name: "Journal d'activité admin", description: "Actions des administrateurs, connexions et modifications récentes.", category: "Système", lastGenerated: "2026-03-27", format: "CSV", icon: Clock, color: "#9CA3AF" },
];

const CATEGORIES = [...new Set(REPORTS.map((r) => r.category))];

export function AdminReports() {
  const [catFilter, setCatFilter] = useState("all");
  const filtered = catFilter === "all" ? REPORTS : REPORTS.filter((r) => r.category === catFilter);

  const [dateRange, setDateRange] = useState({ from: "2026-03-01", to: "2026-03-27" });

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Date range & filters */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
            <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white" />
            <span className="text-[13px] text-[#9CA3AF]">—</span>
            <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setCatFilter("all")} className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${catFilter === "all" ? "bg-[#FF6B35] text-white" : "bg-[#F3F4F6] dark:bg-white/5 text-[#6B7280]"}`} style={{ fontWeight: catFilter === "all" ? 600 : 400 }}>Tous</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${catFilter === c ? "bg-[#FF6B35] text-white" : "bg-[#F3F4F6] dark:bg-white/5 text-[#6B7280]"}`} style={{ fontWeight: catFilter === c ? 600 : 400 }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: r.color + "15" }}>
                <r.icon className="w-5 h-5" style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{r.name}</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{r.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E5E7EB]/50 dark:border-white/5">
              <div className="text-[11px] text-[#9CA3AF] space-y-0.5">
                <p>Dernière génération: {new Date(r.lastGenerated).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" })}</p>
                <p>Format: {r.format}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] text-[12px] hover:bg-[#FF6B35] hover:text-white transition-colors" style={{ fontWeight: 600 }}>
                <Download className="w-3.5 h-3.5" /> Générer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled reports */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
        <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Rapports programmés</h3>
        <div className="space-y-2">
          {[
            { report: "Rapport de ventes mensuel", freq: "Chaque 1er du mois", email: "admin@electrohome-bba.dz", active: true },
            { report: "Rapport de stock", freq: "Chaque lundi à 08h00", email: "stock@electrohome-bba.dz", active: true },
            { report: "Rapport comptable", freq: "Chaque trimestre", email: "compta@electrohome-bba.dz", active: false },
          ].map((s) => (
            <div key={s.report} className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] dark:bg-white/5">
              <div>
                <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{s.report}</p>
                <p className="text-[11px] text-[#9CA3AF]">{s.freq} → {s.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${s.active ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#6B7280]/15 text-[#6B7280]"}`} style={{ fontWeight: 500 }}>{s.active ? "Actif" : "Inactif"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
