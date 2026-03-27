import { useState, useMemo } from "react";
import {
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, X,
  ChevronLeft, ChevronRight, Upload, Package, AlertTriangle, CheckCircle2,
  ArrowUpDown, Grid3X3, List, Image as ImageIcon
} from "lucide-react";
import { IMAGES } from "../../data/store";

// ─── Types ───
interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  status: "active" | "draft" | "outofstock";
  image: string;
  energy: string;
  specs: string;
  description: string;
  createdAt: string;
}

// ─── Mock Data ───
const MOCK_PRODUCTS: AdminProduct[] = [
  { id: "P001", name: "Réfrigérateur Multi-Portes RF23", sku: "SAM-RF23-001", brand: "Samsung", category: "Réfrigérateurs", price: 189000, oldPrice: 232000, stock: 24, status: "active", image: IMAGES.fridge, energy: "A+++", specs: "634L, No Frost, A+++", description: "Réfrigérateur haut de gamme avec technologie No Frost et compresseur Digital Inverter.", createdAt: "2026-01-15" },
  { id: "P002", name: "Lave-linge EcoSilence 9kg", sku: "BOS-ECO9-002", brand: "Bosch", category: "Machines à laver", price: 109000, stock: 18, status: "active", image: IMAGES.washer, energy: "A+++", specs: "9kg, 1400tr/min, A+++", description: "Machine à laver silencieuse avec moteur EcoSilence Drive sans balais.", createdAt: "2026-01-20" },
  { id: "P003", name: "Four Multifonction Pyrolyse", sku: "SIE-PYR-003", brand: "Siemens", category: "Fours", price: 130000, oldPrice: 160000, stock: 12, status: "active", image: IMAGES.oven, energy: "A+", specs: "71L, Pyrolyse, A+", description: "Four encastrable avec nettoyage par pyrolyse et 12 modes de cuisson.", createdAt: "2026-02-05" },
  { id: "P004", name: "Climatiseur Mural Inverter", sku: "LG-INV12-004", brand: "LG", category: "Climatiseurs", price: 94000, stock: 32, status: "active", image: IMAGES.ac, energy: "A++", specs: "12000 BTU, R32, Wi-Fi", description: "Climatiseur Dual Inverter avec contrôle Wi-Fi et gaz R32 écologique.", createdAt: "2026-02-10" },
  { id: "P005", name: "Lave-vaisselle Silence Plus", sku: "MIE-SIL14-005", brand: "Miele", category: "Lave-vaisselle", price: 174000, stock: 8, status: "active", image: IMAGES.dishwasher, energy: "A+++", specs: "14 couverts, 44dB, A+++", description: "Le lave-vaisselle le plus silencieux de sa catégorie avec AutoDos.", createdAt: "2026-02-18" },
  { id: "P006", name: "Aspirateur Robot S7 MaxV", sku: "ROB-S7MV-006", brand: "Roborock", category: "Aspirateurs", price: 80000, oldPrice: 101000, stock: 0, status: "outofstock", image: IMAGES.vacuum, energy: "A", specs: "5100Pa, LiDAR, Auto-vidage", description: "Robot aspirateur avec reconnaissance d'obstacles par caméra et station de vidage.", createdAt: "2026-03-01" },
  { id: "P007", name: "Machine à Expresso Automatique", sku: "DEL-EXP-007", brand: "De'Longhi", category: "Petit électroménager", price: 69000, stock: 45, status: "active", image: IMAGES.coffee, energy: "A+", specs: "15 bars, Broyeur intégré", description: "Cafetière automatique avec broyeur conique intégré et mousseur de lait.", createdAt: "2026-03-05" },
  { id: "P008", name: "TV OLED 55\" C3", sku: "LG-OLED55-008", brand: "LG", category: "TV & Son", price: 203000, oldPrice: 261000, stock: 6, status: "active", image: IMAGES.tv, energy: "G", specs: "4K, 120Hz, Dolby Vision", description: "Téléviseur OLED avec processeur α9 Gen6 AI, Dolby Vision IQ et Atmos.", createdAt: "2026-03-10" },
  { id: "P009", name: "Réfrigérateur Side-by-Side", sku: "SAM-SBS-009", brand: "Samsung", category: "Réfrigérateurs", price: 215000, stock: 3, status: "active", image: IMAGES.fridge, energy: "A++", specs: "680L, SpaceMax, Twin Cooling", description: "Réfrigérateur américain avec technologie SpaceMax et distributeur d'eau.", createdAt: "2026-03-12" },
  { id: "P010", name: "Sèche-linge Pompe à chaleur 8kg", sku: "BOS-DRY8-010", brand: "Bosch", category: "Machines à laver", price: 125000, stock: 0, status: "draft", image: IMAGES.washer, energy: "A+++", specs: "8kg, Pompe à chaleur, AutoDry", description: "Sèche-linge avec pompe à chaleur et programme AutoDry pour un séchage optimal.", createdAt: "2026-03-18" },
  { id: "P011", name: "Micro-ondes Combiné 32L", sku: "SIE-MCO32-011", brand: "Siemens", category: "Petit électroménager", price: 52000, stock: 28, status: "active", image: IMAGES.oven, energy: "A", specs: "32L, Grill, Convection", description: "Micro-ondes combiné avec fonction grill et convection, 32 litres.", createdAt: "2026-03-20" },
  { id: "P012", name: "Climatiseur Mobile 9000 BTU", sku: "LG-MOB9-012", brand: "LG", category: "Climatiseurs", price: 62000, stock: 15, status: "active", image: IMAGES.ac, energy: "A", specs: "9000 BTU, Portable, Timer", description: "Climatiseur mobile compact pour les petits espaces, avec minuterie programmable.", createdAt: "2026-03-22" },
];

const CATEGORIES_LIST = ["Tous", "Réfrigérateurs", "Machines à laver", "Fours", "Climatiseurs", "Lave-vaisselle", "Aspirateurs", "Petit électroménager", "TV & Son"];
const BRANDS_LIST = ["Samsung", "LG", "Bosch", "Siemens", "Miele", "De'Longhi", "Roborock", "Whirlpool"];
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Actif", color: "#10B981", bg: "#10B981" },
  draft: { label: "Brouillon", color: "#F59E0B", bg: "#F59E0B" },
  outofstock: { label: "Rupture", color: "#EF4444", bg: "#EF4444" },
};

function formatPrice(price: number) {
  return price.toLocaleString("fr-DZ") + " DA";
}

// ─── Product Form Modal ───
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (p: AdminProduct) => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState<AdminProduct>(
    product || {
      id: "P" + String(Date.now()).slice(-4),
      name: "",
      sku: "",
      brand: "Samsung",
      category: "Réfrigérateurs",
      price: 0,
      oldPrice: undefined,
      stock: 0,
      status: "draft",
      image: IMAGES.fridge,
      energy: "A+",
      specs: "",
      description: "",
      createdAt: new Date().toISOString().slice(0, 10),
    }
  );

  const set = (key: keyof AdminProduct, value: any) => setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-10 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-2xl shadow-2xl m-4"
        style={{ fontFamily: "'Sora', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
            {isEdit ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Image Preview */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-[#F3F4F6] dark:bg-white/10 overflow-hidden shrink-0">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1D5DB] dark:border-white/20 text-[13px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors">
                <Upload className="w-4 h-4" />
                Changer l'image
              </button>
              <p className="text-[11px] text-[#9CA3AF] mt-1">PNG, JPG — Max 2MB</p>
            </div>
          </div>

          {/* Name + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Nom du produit *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="Ex: Réfrigérateur Multi-Portes" />
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>SKU *</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="Ex: SAM-RF23-001" />
            </div>
          </div>

          {/* Brand + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Marque</label>
              <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
                {BRANDS_LIST.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Catégorie</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
                {CATEGORIES_LIST.filter((c) => c !== "Tous").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price + OldPrice + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Prix (DA) *</label>
              <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="189000" />
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Ancien prix (DA)</label>
              <input type="number" value={form.oldPrice || ""} onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="232000" />
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="24" />
            </div>
          </div>

          {/* Energy + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Classe énergétique</label>
              <select value={form.energy} onChange={(e) => set("energy", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
                {["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"].map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Statut</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as any)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="outofstock">Rupture de stock</option>
              </select>
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Spécifications</label>
            <input value={form.specs} onChange={(e) => set("specs", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors" placeholder="634L, No Frost, A+++" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5" style={{ fontWeight: 500 }}>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors resize-none" placeholder="Description détaillée du produit..." />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] dark:border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-colors" style={{ fontWeight: 500 }}>
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors"
            style={{ fontWeight: 500 }}
          >
            {isEdit ? "Mettre à jour" : "Ajouter le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ───
function DeleteModal({ product, onClose, onConfirm }: { product: AdminProduct; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-sm p-6 m-4 shadow-2xl" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
        </div>
        <h3 className="text-[15px] text-[#1A2332] dark:text-white text-center mb-2" style={{ fontWeight: 600 }}>Supprimer ce produit ?</h3>
        <p className="text-[13px] text-[#6B7280] dark:text-white/50 text-center mb-6">
          « {product.name} » sera définitivement supprimé. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-[13px] border border-[#E5E7EB] dark:border-white/10 text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-colors" style={{ fontWeight: 500 }}>Annuler</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-[#EF4444] text-white text-[13px] hover:bg-[#DC2626] transition-colors" style={{ fontWeight: 500 }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "price" | "stock" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const [formModal, setFormModal] = useState<{ open: boolean; product: AdminProduct | null }>({ open: false, product: null });
  const [deleteModal, setDeleteModal] = useState<AdminProduct | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== "Tous") list = list.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    list.sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * m;
      if (sortField === "price") return (a.price - b.price) * m;
      if (sortField === "stock") return (a.stock - b.stock) * m;
      return a.createdAt.localeCompare(b.createdAt) * m;
    });
    return list;
  }, [products, search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleSave = (p: AdminProduct) => {
    if (formModal.product) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    } else {
      setProducts((prev) => [p, ...prev]);
    }
    setFormModal({ open: false, product: null });
  };

  const handleDelete = () => {
    if (deleteModal) {
      setProducts((prev) => prev.filter((x) => x.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;
  const oosCount = products.filter((p) => p.status === "outofstock").length;

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total produits", value: products.length, icon: Package, color: "#3B82F6" },
          { label: "Actifs", value: activeCount, icon: CheckCircle2, color: "#10B981" },
          { label: "Brouillons", value: draftCount, icon: Edit2, color: "#F59E0B" },
          { label: "Rupture de stock", value: oosCount, icon: AlertTriangle, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1E1E24] rounded-xl p-4 border border-[#E5E7EB] dark:border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF]">{s.label}</p>
              <p className="text-[18px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher un produit..." className="pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] w-64 outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35] transition-colors" />
            </div>
            {/* Category Filter */}
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
              {CATEGORIES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* Status Filter */}
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="outofstock">Rupture</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
              <button onClick={() => setViewMode("table")} className={`p-2 ${viewMode === "table" ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            {/* Add Product */}
            <button onClick={() => setFormModal({ open: true, product: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 500 }}>
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-[12px] text-[#9CA3AF] mt-3">{filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Produit</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("price")}>
                    <span className="inline-flex items-center gap-1">Prix <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("stock")}>
                    <span className="inline-flex items-center gap-1">Stock <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Catégorie</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const st = STATUS_MAP[p.status];
                  return (
                    <tr key={p.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-white/10 overflow-hidden shrink-0">
                            <img src={p.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[#1A2332] dark:text-white truncate max-w-[220px]" style={{ fontWeight: 500 }}>{p.name}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{p.brand} · {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{formatPrice(p.price)}</p>
                        {p.oldPrice && <p className="text-[11px] text-[#9CA3AF] line-through">{formatPrice(p.oldPrice)}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[13px] ${p.stock === 0 ? "text-[#EF4444]" : p.stock < 10 ? "text-[#F59E0B]" : "text-[#1A2332] dark:text-white"}`} style={{ fontWeight: 500 }}>
                          {p.stock}
                        </span>
                        {p.stock > 0 && p.stock < 10 && <span className="text-[10px] text-[#F59E0B] ml-1">Faible</span>}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] dark:text-white/60">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.bg + "15", color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button onClick={() => setActionMenu(actionMenu === p.id ? null : p.id)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenu === p.id && (
                            <div className="absolute right-0 top-9 bg-white dark:bg-[#25252B] rounded-xl shadow-xl border border-[#E5E7EB] dark:border-white/10 py-1 z-50 min-w-[150px]">
                              <button onClick={() => { setFormModal({ open: true, product: p }); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#6B7280] hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Modifier
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#6B7280] hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                                <Eye className="w-3.5 h-3.5" /> Voir
                              </button>
                              <div className="border-t border-[#E5E7EB] dark:border-white/10 my-1" />
                              <button onClick={() => { setDeleteModal(p); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] dark:border-white/10">
              <p className="text-[12px] text-[#9CA3AF]">Page {page} sur {totalPages}</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] flex items-center justify-center ${page === i + 1 ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-white/10"}`} style={{ fontWeight: page === i + 1 ? 600 : 400 }}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((p) => {
            const st = STATUS_MAP[p.status];
            return (
              <div key={p.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden group">
                <div className="relative h-40 bg-[#F3F4F6] dark:bg-white/5">
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 inline-flex px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 500, backgroundColor: st.bg + "20", color: st.color, backdropFilter: "blur(8px)" }}>
                    {st.label}
                  </span>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setFormModal({ open: true, product: p })} className="w-7 h-7 rounded-lg bg-white/90 dark:bg-black/50 flex items-center justify-center text-[#6B7280] hover:text-[#FF6B35]">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteModal(p)} className="w-7 h-7 rounded-lg bg-white/90 dark:bg-black/50 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444]">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[12px] text-[#9CA3AF]">{p.brand} · {p.sku}</p>
                  <p className="text-[13px] text-[#1A2332] dark:text-white mt-0.5 truncate" style={{ fontWeight: 500 }}>{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[14px] text-[#FF6B35]" style={{ fontWeight: 700 }}>{formatPrice(p.price)}</p>
                    <p className={`text-[12px] ${p.stock === 0 ? "text-[#EF4444]" : "text-[#9CA3AF]"}`}>Stock: {p.stock}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination for grid */}
      {viewMode === "grid" && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] ${page === i + 1 ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-white/10"}`} style={{ fontWeight: page === i + 1 ? 600 : 400 }}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      {formModal.open && <ProductFormModal product={formModal.product} onClose={() => setFormModal({ open: false, product: null })} onSave={handleSave} />}
      {deleteModal && <DeleteModal product={deleteModal} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} />}
    </div>
  );
}
