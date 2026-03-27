import { useState } from "react";
import {
  Zap, Clock, Package, Tag, Plus, Edit3, Eye, Trash2, TrendingUp,
  AlertTriangle, CheckCircle2, X, Timer, Flame
} from "lucide-react";

interface Promotion {
  id: string; name: string; type: "flash" | "seasonal" | "clearance" | "bundle" | "loyalty";
  products: number; discount: string; startDate: string; endDate: string; active: boolean;
  sold: number; stock: number; revenue: number;
}

const TYPE_CFG: Record<string, { label: string; color: string; icon: any }> = {
  flash: { label: "Vente Flash", color: "#EF4444", icon: Zap },
  seasonal: { label: "Saisonnière", color: "#3B82F6", icon: Clock },
  clearance: { label: "Déstockage", color: "#F59E0B", icon: Package },
  bundle: { label: "Pack", color: "#10B981", icon: Tag },
  loyalty: { label: "Fidélité", color: "#8B5CF6", icon: TrendingUp },
};

function formatPrice(p: number) { return p.toLocaleString("fr-DZ") + " DA"; }

const PROMOS: Promotion[] = [
  { id: "PRO-001", name: "Flash Climatiseurs -30%", type: "flash", products: 8, discount: "-30%", startDate: "2026-03-25", endDate: "2026-03-28", active: true, sold: 32, stock: 18, revenue: 1890000 },
  { id: "PRO-002", name: "Pack Cuisine Complète", type: "bundle", products: 3, discount: "-15% sur le lot", startDate: "2026-03-15", endDate: "2026-04-15", active: true, sold: 12, stock: 8, revenue: 2880000 },
  { id: "PRO-003", name: "Déstockage Chauffages", type: "clearance", products: 12, discount: "-40%", startDate: "2026-03-01", endDate: "2026-03-31", active: true, sold: 45, stock: 22, revenue: 1350000 },
  { id: "PRO-004", name: "Fidélité -10% supplémentaire", type: "loyalty", products: 0, discount: "-10% pour clients fidèles", startDate: "2026-01-01", endDate: "2026-12-31", active: true, sold: 89, stock: 0, revenue: 890000 },
  { id: "PRO-005", name: "Soldes Été Réfrigérateurs", type: "seasonal", products: 15, discount: "-20%", startDate: "2026-06-01", endDate: "2026-08-31", active: false, sold: 0, stock: 42, revenue: 0 },
  { id: "PRO-006", name: "Flash Aspirateurs 48h", type: "flash", products: 5, discount: "-25%", startDate: "2026-04-05", endDate: "2026-04-07", active: false, sold: 0, stock: 15, revenue: 0 },
];

function getRemainingTime(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Terminée";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}j ${hours}h restant`;
  return `${hours}h restant`;
}

export function AdminPromotions() {
  const [promos] = useState(PROMOS);
  const [detail, setDetail] = useState<Promotion | null>(null);

  const activeCount = promos.filter((p) => p.active).length;
  const totalRevenue = promos.reduce((s, p) => s + p.revenue, 0);
  const totalSold = promos.reduce((s, p) => s + p.sold, 0);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Promos actives", value: activeCount, icon: Flame, color: "#FF6B35" },
          { label: "Articles vendus", value: totalSold, icon: Package, color: "#3B82F6" },
          { label: "CA promotionnel", value: formatPrice(totalRevenue), icon: TrendingUp, color: "#10B981" },
          { label: "Total promos", value: promos.length, icon: Tag, color: "#8B5CF6" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#9CA3AF]">{k.label}</p>
              <p className="text-[17px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 700 }}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}>
          <Plus className="w-4 h-4" /> Nouvelle promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((p) => {
          const cfg = TYPE_CFG[p.type];
          const Icon = cfg.icon;
          const remaining = getRemainingTime(p.endDate);
          const soldPct = p.stock > 0 ? (p.sold / (p.sold + p.stock)) * 100 : 100;
          return (
            <div key={p.id} className={`bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5 ${!p.active ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg.color + "15" }}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <h3 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{p.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + "15", color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
                  </div>
                </div>
                <span className="text-[22px] text-[#FF6B35]" style={{ fontWeight: 700 }}>{p.discount}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-lg p-2">
                  <p className="text-[15px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{p.sold}</p>
                  <p className="text-[10px] text-[#9CA3AF]">Vendus</p>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-lg p-2">
                  <p className="text-[15px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{p.stock}</p>
                  <p className="text-[10px] text-[#9CA3AF]">Restant</p>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-lg p-2">
                  <p className="text-[15px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{p.revenue > 0 ? (p.revenue / 1000000).toFixed(1) + "M" : "—"}</p>
                  <p className="text-[10px] text-[#9CA3AF]">CA (DA)</p>
                </div>
              </div>

              {p.active && p.stock > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9CA3AF]">Progression</span>
                    <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{soldPct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F3F4F6] dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${soldPct}%`, backgroundColor: soldPct > 80 ? "#EF4444" : "#FF6B35" }} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]/50 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                  <Timer className="w-3 h-3" />
                  {p.active ? <span className={remaining.includes("h restant") && !remaining.includes("j") ? "text-[#EF4444]" : ""}>{remaining}</span> : <span>Planifiée</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setDetail(p)} className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35]"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={() => setDetail(null)}>
          <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
              <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{detail.name}</h2>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-[#9CA3AF]">Réduction</p>
                  <p className="text-[18px] text-[#FF6B35]" style={{ fontWeight: 700 }}>{detail.discount}</p>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-[#9CA3AF]">Revenus générés</p>
                  <p className="text-[18px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{detail.revenue > 0 ? formatPrice(detail.revenue) : "—"}</p>
                </div>
              </div>
              <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-[#6B7280]">Début</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{new Date(detail.startDate).toLocaleDateString("fr-DZ")}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Fin</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{new Date(detail.endDate).toLocaleDateString("fr-DZ")}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Produits concernés</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{detail.products || "Tous"}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Vendus / Restants</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{detail.sold} / {detail.stock}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
