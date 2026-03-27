import { useState, useMemo } from "react";
import {
  Search, Eye, X, ChevronLeft, ChevronRight, Plus, Edit3, Trash2,
  Megaphone, Tag, Percent, Gift, Zap, TrendingUp, ShoppingCart,
  Calendar, Clock, Copy, ToggleLeft, ToggleRight, BarChart3,
  DollarSign, MousePointerClick, Users, ArrowUpDown, MoreVertical,
  AlertCircle, CheckCircle2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Types ───
type CampaignStatus = "active" | "scheduled" | "paused" | "ended" | "draft";
type CampaignType = "discount" | "coupon" | "flash_sale" | "free_shipping" | "bundle";
type CouponStatus = "active" | "expired" | "disabled";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  discount: string;
  revenue: number;
  orders: number;
  views: number;
  conversionRate: number;
  description: string;
}

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  status: CouponStatus;
  expiresAt: string;
}

const CAMPAIGN_STATUS: Record<CampaignStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "#10B981" },
  scheduled: { label: "Planifiée", color: "#3B82F6" },
  paused: { label: "En pause", color: "#F59E0B" },
  ended: { label: "Terminée", color: "#6B7280" },
  draft: { label: "Brouillon", color: "#9CA3AF" },
};

const CAMPAIGN_TYPE_CONFIG: Record<CampaignType, { label: string; icon: any; color: string }> = {
  discount: { label: "Remise", icon: Percent, color: "#FF6B35" },
  coupon: { label: "Coupon", icon: Tag, color: "#8B5CF6" },
  flash_sale: { label: "Vente flash", icon: Zap, color: "#EF4444" },
  free_shipping: { label: "Livraison gratuite", icon: Gift, color: "#10B981" },
  bundle: { label: "Bundle", icon: ShoppingCart, color: "#3B82F6" },
};

// ─── Mock Data ───
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "CMP-001", name: "Soldes de Printemps 2026", type: "discount", status: "active",
    startDate: "2026-03-15", endDate: "2026-04-15", discount: "-20% sur tout",
    revenue: 4850000, orders: 87, views: 2340, conversionRate: 3.7,
    description: "Grande promotion de printemps avec 20% de réduction sur tous les produits électroménagers.",
  },
  {
    id: "CMP-002", name: "Flash Sale Climatiseurs", type: "flash_sale", status: "active",
    startDate: "2026-03-25", endDate: "2026-03-28", discount: "-30% Climatiseurs",
    revenue: 1890000, orders: 32, views: 1560, conversionRate: 2.1,
    description: "Vente flash de 72h sur toute la gamme de climatiseurs avant l'été.",
  },
  {
    id: "CMP-003", name: "Livraison Offerte Mars", type: "free_shipping", status: "active",
    startDate: "2026-03-01", endDate: "2026-03-31", discount: "Livraison gratuite >50 000 DA",
    revenue: 3200000, orders: 64, views: 1890, conversionRate: 3.4,
    description: "Livraison gratuite pour toute commande supérieure à 50 000 DA sur Bordj Bou Arréridj.",
  },
  {
    id: "CMP-004", name: "Bundle Cuisine Complète", type: "bundle", status: "scheduled",
    startDate: "2026-04-01", endDate: "2026-04-30", discount: "-15% sur le lot",
    revenue: 0, orders: 0, views: 0, conversionRate: 0,
    description: "Offre spéciale : Réfrigérateur + Four + Lave-vaisselle avec 15% de remise sur le lot.",
  },
  {
    id: "CMP-005", name: "Ramadan Spécial", type: "discount", status: "scheduled",
    startDate: "2026-04-10", endDate: "2026-05-10", discount: "-25% sélection",
    revenue: 0, orders: 0, views: 0, conversionRate: 0,
    description: "Offre Ramadan : réduction de 25% sur une sélection de petits électroménagers.",
  },
  {
    id: "CMP-006", name: "Promo Saint-Valentin", type: "coupon", status: "ended",
    startDate: "2026-02-01", endDate: "2026-02-28", discount: "Code LOVE2026",
    revenue: 2100000, orders: 45, views: 3100, conversionRate: 1.5,
    description: "Code promo LOVE2026 : -10% supplémentaire sur les machines à café et aspirateurs robots.",
  },
  {
    id: "CMP-007", name: "Brouillon Black Friday", type: "discount", status: "draft",
    startDate: "", endDate: "", discount: "-40% sur tout",
    revenue: 0, orders: 0, views: 0, conversionRate: 0,
    description: "Préparation de la campagne Black Friday 2026.",
  },
  {
    id: "CMP-008", name: "Hiver Chaud", type: "discount", status: "paused",
    startDate: "2026-01-10", endDate: "2026-02-10", discount: "-15% Chauffages",
    revenue: 780000, orders: 18, views: 920, conversionRate: 2.0,
    description: "Promo sur les chauffages et radiateurs. Campagne mise en pause.",
  },
];

const MOCK_COUPONS: Coupon[] = [
  { id: "CPN-001", code: "BIENVENUE10", type: "percentage", value: 10, minOrder: 30000, maxUses: 500, usedCount: 312, status: "active", expiresAt: "2026-06-30" },
  { id: "CPN-002", code: "ETE2026", type: "percentage", value: 15, minOrder: 80000, maxUses: 200, usedCount: 45, status: "active", expiresAt: "2026-08-31" },
  { id: "CPN-003", code: "FIDELITE5K", type: "fixed", value: 5000, minOrder: 50000, maxUses: 100, usedCount: 78, status: "active", expiresAt: "2026-12-31" },
  { id: "CPN-004", code: "FLASH20", type: "percentage", value: 20, minOrder: 100000, maxUses: 50, usedCount: 50, status: "expired", expiresAt: "2026-03-20" },
  { id: "CPN-005", code: "LOVE2026", type: "percentage", value: 10, minOrder: 20000, maxUses: 300, usedCount: 189, status: "expired", expiresAt: "2026-02-28" },
  { id: "CPN-006", code: "LIVGRATUITE", type: "fixed", value: 0, minOrder: 50000, maxUses: 1000, usedCount: 0, status: "disabled", expiresAt: "2026-12-31" },
];

function formatPrice(price: number) { return price.toLocaleString("fr-DZ") + " DA"; }
function formatDate(date: string) { return date ? new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" }) : "—"; }

// ─── Campaign Form Modal ───
function CampaignFormModal({ campaign, onClose, onSave }: { campaign?: Campaign | null; onClose: () => void; onSave: (c: Campaign) => void }) {
  const isEdit = !!campaign;
  const [form, setForm] = useState<Partial<Campaign>>(campaign || {
    name: "", type: "discount", status: "draft", startDate: "", endDate: "", discount: "", description: "",
  });

  const handleSave = () => {
    onSave({
      id: campaign?.id || "CMP-" + String(Date.now()).slice(-3),
      name: form.name || "",
      type: form.type as CampaignType || "discount",
      status: form.status as CampaignStatus || "draft",
      startDate: form.startDate || "",
      endDate: form.endDate || "",
      discount: form.discount || "",
      description: form.description || "",
      revenue: campaign?.revenue || 0,
      orders: campaign?.orders || 0,
      views: campaign?.views || 0,
      conversionRate: campaign?.conversionRate || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
            {isEdit ? "Modifier la campagne" : "Nouvelle campagne"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Nom de la campagne</label>
            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" placeholder="Ex: Soldes de Printemps 2026" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Type</label>
              <select value={form.type || "discount"} onChange={(e) => setForm({ ...form, type: e.target.value as CampaignType })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
                {Object.entries(CAMPAIGN_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Statut</label>
              <select value={form.status || "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
                {Object.entries(CAMPAIGN_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Date début</label>
              <input type="date" value={form.startDate || ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Date fin</label>
              <input type="date" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Offre / Réduction</label>
            <input value={form.discount || ""} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" placeholder="Ex: -20% sur tout" />
          </div>
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-[#E5E7EB] dark:border-white/10">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-white/5" style={{ fontWeight: 500 }}>Annuler</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
            {isEdit ? "Enregistrer" : "Créer la campagne"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───
export function AdminMarketing() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [coupons] = useState(MOCK_COUPONS);
  const [tab, setTab] = useState<"campaigns" | "coupons">("campaigns");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formModal, setFormModal] = useState<Campaign | null | "new">(null);
  const [detailModal, setDetailModal] = useState<Campaign | null>(null);

  // KPIs
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalOrders = campaigns.reduce((s, c) => s + c.orders, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const avgConversion = campaigns.filter((c) => c.conversionRate > 0).reduce((s, c, _, a) => s + c.conversionRate / a.length, 0);

  const filteredCampaigns = useMemo(() => {
    let list = [...campaigns];
    if (search) { const q = search.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)); }
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    return list;
  }, [campaigns, search, statusFilter]);

  const filteredCoupons = useMemo(() => {
    if (!search) return coupons;
    const q = search.toLowerCase();
    return coupons.filter((c) => c.code.toLowerCase().includes(q));
  }, [coupons, search]);

  const handleSaveCampaign = (c: Campaign) => {
    setCampaigns((prev) => {
      const idx = prev.findIndex((p) => p.id === c.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = c; return n; }
      return [c, ...prev];
    });
    setFormModal(null);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Revenus campagnes", value: formatPrice(totalRevenue), icon: DollarSign, color: "#10B981" },
          { label: "Commandes générées", value: totalOrders, icon: ShoppingCart, color: "#3B82F6" },
          { label: "Campagnes actives", value: activeCampaigns, icon: Megaphone, color: "#FF6B35" },
          { label: "Taux conversion moy.", value: avgConversion.toFixed(1) + "%", icon: MousePointerClick, color: "#8B5CF6" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1E1E24] rounded-xl p-4 border border-[#E5E7EB] dark:border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#9CA3AF] truncate">{s.label}</p>
              <p className="text-[18px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend by Month */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Revenus marketing mensuels</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: "Oct", revenue: 1200000, orders: 28 },
                { month: "Nov", revenue: 3500000, orders: 72 },
                { month: "Déc", revenue: 2800000, orders: 56 },
                { month: "Jan", revenue: 1900000, orders: 38 },
                { month: "Fév", revenue: 2880000, orders: 63 },
                { month: "Mar", revenue: 4850000, orders: 87 },
              ]}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                  formatter={(value: number) => [formatPrice(value), "Revenus"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Revenue Comparison */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Revenus par campagne</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaigns.filter((c) => c.revenue > 0).sort((a, b) => b.revenue - a.revenue)} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#9CA3AF" }} width={120} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                  formatter={(value: number) => [formatPrice(value), "Revenus"]}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={18}>
                  {campaigns.filter((c) => c.revenue > 0).sort((a, b) => b.revenue - a.revenue).map((c, i) => (
                    <Cell key={c.id} fill={["#FF6B35", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Taux de conversion par campagne</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaigns.filter((c) => c.conversionRate > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => v + "%"} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                  formatter={(value: number) => [value + "%", "Conversion"]}
                />
                <Bar dataKey="conversionRate" radius={[6, 6, 0, 0]} barSize={32}>
                  {campaigns.filter((c) => c.conversionRate > 0).map((c, i) => (
                    <Cell key={c.id} fill={c.conversionRate >= 3 ? "#10B981" : c.conversionRate >= 2 ? "#F59E0B" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Type Distribution */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Répartition par type de campagne</h3>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(
                    campaigns.reduce((acc, c) => {
                      acc[c.type] = (acc[c.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => ({
                    name: CAMPAIGN_TYPE_CONFIG[type as CampaignType]?.label || type,
                    value: count,
                    color: CAMPAIGN_TYPE_CONFIG[type as CampaignType]?.color || "#9CA3AF",
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {Object.entries(
                    campaigns.reduce((acc, c) => {
                      acc[c.type] = (acc[c.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type], i) => (
                    <Cell key={type} fill={CAMPAIGN_TYPE_CONFIG[type as CampaignType]?.color || "#9CA3AF"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                  formatter={(value: number) => [value + " campagne(s)", ""]}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontFamily: "'Sora', sans-serif" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-1">
          {([["campaigns", "Campagnes", Megaphone], ["coupons", "Coupons", Tag]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => { setTab(key as any); setSearch(""); setStatusFilter("all"); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-colors ${
                tab === key ? "bg-[#FF6B35] text-white" : "text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"
              }`}
              style={{ fontWeight: tab === key ? 600 : 400 }}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        {tab === "campaigns" && (
          <button onClick={() => setFormModal("new")} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
            <Plus className="w-4 h-4" /> Nouvelle campagne
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tab === "campaigns" ? "Rechercher une campagne..." : "Rechercher un code..."} className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          {tab === "campaigns" && (
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="all">Tous les statuts</option>
              {Object.entries(CAMPAIGN_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Campaigns Tab */}
      {tab === "campaigns" && (
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Campagne</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Type</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Période</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Revenus</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Cmds</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Conv.</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c) => {
                  const st = CAMPAIGN_STATUS[c.status];
                  const tp = CAMPAIGN_TYPE_CONFIG[c.type];
                  const TpIcon = tp.icon;
                  return (
                    <tr key={c.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{c.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{c.discount}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: tp.color, fontWeight: 500 }}>
                          <TpIcon className="w-3 h-3" /> {tp.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#6B7280] dark:text-white/50">
                        {c.startDate ? <>{formatDate(c.startDate)} — {formatDate(c.endDate)}</> : "Non définie"}
                      </td>
                      <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                        {c.revenue > 0 ? formatPrice(c.revenue) : "—"}
                      </td>
                      <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{c.orders || "—"}</td>
                      <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                        {c.conversionRate > 0 ? c.conversionRate + "%" : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setDetailModal(c)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35]">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setFormModal(c)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucune campagne trouvée</div>
          )}
        </div>
      )}

      {/* Coupons Tab */}
      {tab === "coupons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((c) => {
            const isActive = c.status === "active";
            const isExpired = c.status === "expired";
            const pct = c.maxUses > 0 ? (c.usedCount / c.maxUses) * 100 : 0;
            return (
              <div key={c.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg border-2 border-dashed text-[14px] tracking-wider ${isActive ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/5" : isExpired ? "border-[#9CA3AF] text-[#9CA3AF] bg-[#9CA3AF]/5" : "border-[#E5E7EB] text-[#9CA3AF] bg-[#F3F4F6]"}`} style={{ fontWeight: 700, fontFamily: "monospace" }}>
                      {c.code}
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-[#10B981]/15 text-[#10B981]" : isExpired ? "bg-[#6B7280]/15 text-[#6B7280]" : "bg-[#EF4444]/15 text-[#EF4444]"}`} style={{ fontWeight: 500 }}>
                    {isActive ? "Actif" : isExpired ? "Expiré" : "Désactivé"}
                  </span>
                </div>
                <div className="text-[22px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>
                  {c.type === "percentage" ? `-${c.value}%` : c.value > 0 ? `-${formatPrice(c.value)}` : "Livraison gratuite"}
                </div>
                <div className="space-y-1 text-[12px] text-[#6B7280] dark:text-white/50">
                  <div className="flex justify-between"><span>Min. commande</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatPrice(c.minOrder)}</span></div>
                  <div className="flex justify-between"><span>Expire le</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(c.expiresAt)}</span></div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9CA3AF]">Utilisation</span>
                    <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{c.usedCount}/{c.maxUses}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F3F4F6] dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 90 ? "#EF4444" : pct >= 60 ? "#F59E0B" : "#FF6B35" }} />
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors" style={{ fontWeight: 500 }}>
                  <Copy className="w-3 h-3" /> Copier le code
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={() => setDetailModal(null)}>
          <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
              <div>
                <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{detailModal.name}</h2>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{detailModal.id}</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Revenus", value: detailModal.revenue > 0 ? formatPrice(detailModal.revenue) : "—", icon: DollarSign, color: "#10B981" },
                  { label: "Commandes", value: detailModal.orders || "—", icon: ShoppingCart, color: "#3B82F6" },
                  { label: "Vues", value: detailModal.views || "—", icon: Eye, color: "#8B5CF6" },
                  { label: "Conversion", value: detailModal.conversionRate > 0 ? detailModal.conversionRate + "%" : "—", icon: MousePointerClick, color: "#FF6B35" },
                ].map((k) => (
                  <div key={k.label} className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <k.icon className="w-3.5 h-3.5" style={{ color: k.color }} />
                      <span className="text-[11px] text-[#9CA3AF]">{k.label}</span>
                    </div>
                    <p className="text-[16px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-[#6B7280]">Type</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{CAMPAIGN_TYPE_CONFIG[detailModal.type].label}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Offre</span><span className="text-[#FF6B35]" style={{ fontWeight: 600 }}>{detailModal.discount}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Début</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(detailModal.startDate)}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Fin</span><span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(detailModal.endDate)}</span></div>
              </div>
              <p className="text-[13px] text-[#6B7280] dark:text-white/60">{detailModal.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formModal !== null && (
        <CampaignFormModal
          campaign={formModal === "new" ? null : formModal}
          onClose={() => setFormModal(null)}
          onSave={handleSaveCampaign}
        />
      )}
    </div>
  );
}