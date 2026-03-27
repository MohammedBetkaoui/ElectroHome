import { useState, useMemo } from "react";
import {
  Search, Package, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp,
  ArrowUpDown, Filter, Download, RefreshCw, BarChart3, Archive, Truck
} from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reserved: number;
  minStock: number;
  price: number;
  supplier: string;
  lastRestocked: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstocked";
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  in_stock: { label: "En stock", color: "#10B981" },
  low_stock: { label: "Stock bas", color: "#F59E0B" },
  out_of_stock: { label: "Rupture", color: "#EF4444" },
  overstocked: { label: "Surstock", color: "#3B82F6" },
};

function formatPrice(p: number) { return p.toLocaleString("fr-DZ") + " DA"; }

const ITEMS: StockItem[] = [
  { id: "1", name: "Samsung RT38 Réfrigérateur 380L", sku: "REF-SAM-38", category: "Réfrigérateurs", stock: 24, reserved: 3, minStock: 10, price: 125000, supplier: "Samsung Algérie", lastRestocked: "2026-03-15", status: "in_stock" },
  { id: "2", name: "LG F4V5 Machine à laver 8kg", sku: "LAV-LG-F4V5", category: "Machines à laver", stock: 18, reserved: 5, minStock: 8, price: 89000, supplier: "LG Algérie", lastRestocked: "2026-03-10", status: "in_stock" },
  { id: "3", name: "Condor Alpha Climatiseur 12000 BTU", sku: "CLI-CON-12K", category: "Climatiseurs", stock: 6, reserved: 4, minStock: 10, price: 65000, supplier: "Condor Electronics", lastRestocked: "2026-02-28", status: "low_stock" },
  { id: "4", name: "Brandt BCH6400 Cuisinière", sku: "CUI-BRA-640", category: "Fours & Cuisinières", stock: 12, reserved: 1, minStock: 5, price: 80000, supplier: "Brandt Algérie", lastRestocked: "2026-03-20", status: "in_stock" },
  { id: "5", name: "Moulinex CE704 Cookeo", sku: "PEL-MOU-704", category: "Petit électroménager", stock: 0, reserved: 0, minStock: 15, price: 45000, supplier: "SEB Group", lastRestocked: "2026-01-15", status: "out_of_stock" },
  { id: "6", name: "Dyson V15 Aspirateur sans fil", sku: "ASP-DYS-V15", category: "Aspirateurs", stock: 3, reserved: 2, minStock: 5, price: 95000, supplier: "Dyson Import", lastRestocked: "2026-02-20", status: "low_stock" },
  { id: "7", name: "Bosch WAN28 Machine à laver 7kg", sku: "LAV-BOS-W28", category: "Machines à laver", stock: 42, reserved: 0, minStock: 10, price: 68000, supplier: "Bosch Algérie", lastRestocked: "2026-03-22", status: "overstocked" },
  { id: "8", name: "Whirlpool WFO3T233 Lave-vaisselle", sku: "LVA-WHI-3T2", category: "Lave-vaisselle", stock: 8, reserved: 1, minStock: 5, price: 142000, supplier: "Whirlpool Import", lastRestocked: "2026-03-18", status: "in_stock" },
  { id: "9", name: "Condor Alpha Climatiseur 18000 BTU", sku: "CLI-CON-18K", category: "Climatiseurs", stock: 0, reserved: 0, minStock: 8, price: 95000, supplier: "Condor Electronics", lastRestocked: "2026-02-10", status: "out_of_stock" },
  { id: "10", name: "Philips HD9280 Airfryer XL", sku: "PEL-PHI-928", category: "Petit électroménager", stock: 35, reserved: 3, minStock: 10, price: 35000, supplier: "Philips Algérie", lastRestocked: "2026-03-25", status: "overstocked" },
  { id: "11", name: "LG GSX960 Réfrigérateur américain", sku: "REF-LG-960", category: "Réfrigérateurs", stock: 4, reserved: 1, minStock: 5, price: 310000, supplier: "LG Algérie", lastRestocked: "2026-03-05", status: "low_stock" },
  { id: "12", name: "Tefal GC712 Grille-viande", sku: "PEL-TEF-712", category: "Petit électroménager", stock: 22, reserved: 0, minStock: 10, price: 26000, supplier: "SEB Group", lastRestocked: "2026-03-12", status: "in_stock" },
];

export function AdminInventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(ITEMS.map((i) => i.category))];
  const filtered = useMemo(() => {
    let list = [...ITEMS];
    if (search) { const q = search.toLowerCase(); list = list.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)); }
    if (statusFilter !== "all") list = list.filter((i) => i.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter((i) => i.category === categoryFilter);
    return list;
  }, [search, statusFilter, categoryFilter]);

  const totalValue = ITEMS.reduce((s, i) => s + i.stock * i.price, 0);
  const totalItems = ITEMS.reduce((s, i) => s + i.stock, 0);
  const lowStockCount = ITEMS.filter((i) => i.status === "low_stock" || i.status === "out_of_stock").length;

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Valeur totale du stock", value: formatPrice(totalValue), icon: Package, color: "#FF6B35" },
          { label: "Articles en stock", value: totalItems.toLocaleString(), icon: Archive, color: "#3B82F6" },
          { label: "Alertes stock", value: lowStockCount, icon: AlertTriangle, color: "#EF4444" },
          { label: "Références", value: ITEMS.length, icon: BarChart3, color: "#10B981" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#9CA3AF] truncate">{k.label}</p>
              <p className="text-[17px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 700 }}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou SKU..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Toutes catégories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35]" style={{ fontWeight: 500 }}>
            <Download className="w-3.5 h-3.5" /> Exporter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                {["Produit", "SKU", "Catégorie", "Stock", "Réservé", "Disponible", "Seuil", "Fournisseur", "Statut"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const st = STATUS_MAP[item.status];
                const avail = item.stock - item.reserved;
                return (
                  <tr key={item.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{item.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{formatPrice(item.price)}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] font-mono text-[11px]">{item.sku}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{item.category}</td>
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{item.stock}</td>
                    <td className="px-4 py-3 text-[#F59E0B]" style={{ fontWeight: 500 }}>{item.reserved}</td>
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{avail}</td>
                    <td className="px-4 py-3 text-[#9CA3AF]">{item.minStock}</td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280]">{item.supplier}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucun article trouvé</div>}
      </div>
    </div>
  );
}
