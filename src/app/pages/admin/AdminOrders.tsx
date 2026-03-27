import { useState, useMemo } from "react";
import {
  Search, Eye, X, ChevronLeft, ChevronRight, ArrowUpDown,
  ShoppingCart, Clock, Truck, CheckCircle2, XCircle, RotateCcw,
  MapPin, Phone, Mail, Download, Printer, Package, Calendar,
  Filter, MoreVertical
} from "lucide-react";
import { IMAGES } from "../../data/store";

// ─── Types ───
type OrderStatus = "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled" | "returned";

interface OrderItem {
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  id: string;
  client: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "En attente", color: "#F59E0B", icon: Clock },
  confirmed: { label: "Confirmée", color: "#3B82F6", icon: CheckCircle2 },
  preparing: { label: "En préparation", color: "#8B5CF6", icon: Package },
  shipped: { label: "Expédiée", color: "#06B6D4", icon: Truck },
  delivered: { label: "Livrée", color: "#10B981", icon: CheckCircle2 },
  cancelled: { label: "Annulée", color: "#EF4444", icon: XCircle },
  returned: { label: "Retournée", color: "#6B7280", icon: RotateCcw },
};

// ─── Mock Data ───
const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "CMD-2841", client: "Mohamed Benali", email: "m.benali@email.com", phone: "0555 12 34 56",
    address: "Cité 500 logements, Bloc B3, Apt 12", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Réfrigérateur Multi-Portes RF23", sku: "SAM-RF23-001", image: IMAGES.fridge, price: 189000, quantity: 1 },
    ],
    subtotal: 189000, shipping: 0, total: 189000, status: "delivered",
    paymentMethod: "Paiement à la livraison", createdAt: "2026-03-26T09:15:00", updatedAt: "2026-03-26T14:30:00",
    trackingNumber: "BBA-26032026-001"
  },
  {
    id: "CMD-2840", client: "Amira Khelifi", email: "a.khelifi@email.com", phone: "0661 98 76 54",
    address: "Rue des Frères Bouaoud, N°45", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "TV OLED 55\" C3", sku: "LG-OLED55-008", image: IMAGES.tv, price: 203000, quantity: 1 },
      { name: "Lave-linge EcoSilence 9kg", sku: "BOS-ECO9-002", image: IMAGES.washer, price: 109000, quantity: 1 },
    ],
    subtotal: 312000, shipping: 0, total: 312000, status: "shipped",
    paymentMethod: "CIB / Edahabia", createdAt: "2026-03-26T08:42:00", updatedAt: "2026-03-26T11:00:00",
    trackingNumber: "BBA-26032026-002"
  },
  {
    id: "CMD-2839", client: "Youcef Hamidi", email: "y.hamidi@email.com", phone: "0770 11 22 33",
    address: "Cité El Bachir El Ibrahimi, Villa 7", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Climatiseur Mural Inverter", sku: "LG-INV12-004", image: IMAGES.ac, price: 94000, quantity: 1 },
    ],
    subtotal: 94000, shipping: 2500, total: 96500, status: "preparing",
    paymentMethod: "Paiement à la livraison", createdAt: "2026-03-25T17:30:00", updatedAt: "2026-03-26T08:00:00",
  },
  {
    id: "CMD-2838", client: "Fatima Zahra Boukhari", email: "fz.boukhari@email.com", phone: "0550 44 55 66",
    address: "Boulevard Ben Boulaid, Immeuble C", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Lave-vaisselle Silence Plus", sku: "MIE-SIL14-005", image: IMAGES.dishwasher, price: 174000, quantity: 1 },
    ],
    subtotal: 174000, shipping: 0, total: 174000, status: "delivered",
    paymentMethod: "Virement bancaire", createdAt: "2026-03-25T14:20:00", updatedAt: "2026-03-26T10:45:00",
    trackingNumber: "BBA-25032026-001"
  },
  {
    id: "CMD-2837", client: "Karim Djaballah", email: "k.djaballah@email.com", phone: "0660 77 88 99",
    address: "Hai El Nasr, Rue 12, N°3", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Machine à Expresso Automatique", sku: "DEL-EXP-007", image: IMAGES.coffee, price: 69000, quantity: 1 },
    ],
    subtotal: 69000, shipping: 1500, total: 70500, status: "cancelled",
    paymentMethod: "Paiement à la livraison", createdAt: "2026-03-25T10:05:00", updatedAt: "2026-03-25T16:30:00",
    notes: "Client injoignable après 3 tentatives d'appel."
  },
  {
    id: "CMD-2836", client: "Nour El Houda Saidi", email: "neh.saidi@email.com", phone: "0555 33 22 11",
    address: "Cité 1000 logements, Bloc F1, Apt 5", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "TV OLED 55\" C3", sku: "LG-OLED55-008", image: IMAGES.tv, price: 203000, quantity: 1 },
    ],
    subtotal: 203000, shipping: 0, total: 203000, status: "confirmed",
    paymentMethod: "CIB / Edahabia", createdAt: "2026-03-24T19:45:00", updatedAt: "2026-03-25T08:15:00",
  },
  {
    id: "CMD-2835", client: "Abdelkader Mansouri", email: "a.mansouri@email.com", phone: "0770 55 44 33",
    address: "Rue Larbi Ben M'hidi, N°22", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Aspirateur Robot S7 MaxV", sku: "ROB-S7MV-006", image: IMAGES.vacuum, price: 80000, quantity: 1 },
      { name: "Machine à Expresso Automatique", sku: "DEL-EXP-007", image: IMAGES.coffee, price: 69000, quantity: 1 },
    ],
    subtotal: 149000, shipping: 0, total: 149000, status: "pending",
    paymentMethod: "Paiement à la livraison", createdAt: "2026-03-24T15:30:00", updatedAt: "2026-03-24T15:30:00",
  },
  {
    id: "CMD-2834", client: "Sara Boudiaf", email: "s.boudiaf@email.com", phone: "0661 22 33 44",
    address: "Cité Zhun, Bloc A2, Apt 8", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Four Multifonction Pyrolyse", sku: "SIE-PYR-003", image: IMAGES.oven, price: 130000, quantity: 1 },
    ],
    subtotal: 130000, shipping: 2500, total: 132500, status: "shipped",
    paymentMethod: "Virement bancaire", createdAt: "2026-03-24T11:20:00", updatedAt: "2026-03-25T09:00:00",
    trackingNumber: "BBA-24032026-001"
  },
  {
    id: "CMD-2833", client: "Rachid Tounsi", email: "r.tounsi@email.com", phone: "0550 66 77 88",
    address: "Hai 20 Août, Rue 5, Villa 14", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Lave-linge EcoSilence 9kg", sku: "BOS-ECO9-002", image: IMAGES.washer, price: 109000, quantity: 2 },
    ],
    subtotal: 218000, shipping: 0, total: 218000, status: "delivered",
    paymentMethod: "CIB / Edahabia", createdAt: "2026-03-23T16:00:00", updatedAt: "2026-03-25T14:00:00",
    trackingNumber: "BBA-23032026-002"
  },
  {
    id: "CMD-2832", client: "Imane Cherif", email: "i.cherif@email.com", phone: "0660 99 88 77",
    address: "Boulevard Emir Abdelkader, N°18", wilaya: "Bordj Bou Arréridj",
    items: [
      { name: "Réfrigérateur Multi-Portes RF23", sku: "SAM-RF23-001", image: IMAGES.fridge, price: 189000, quantity: 1 },
      { name: "Climatiseur Mural Inverter", sku: "LG-INV12-004", image: IMAGES.ac, price: 94000, quantity: 2 },
    ],
    subtotal: 377000, shipping: 0, total: 377000, status: "returned",
    paymentMethod: "Paiement à la livraison", createdAt: "2026-03-22T09:30:00", updatedAt: "2026-03-24T11:00:00",
    notes: "Retour demandé : produit défectueux (réfrigérateur)."
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("fr-DZ") + " DA";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Order Detail Modal ───
function OrderDetailModal({ order, onClose, onStatusChange }: { order: AdminOrder; onClose: () => void; onStatusChange: (id: string, status: OrderStatus) => void }) {
  const st = STATUS_CONFIG[order.status];
  const StatusIcon = st.icon;

  const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["shipped", "cancelled"],
    shipped: ["delivered", "returned"],
    delivered: ["returned"],
  };

  const nextStatuses = NEXT_STATUS[order.status] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-6 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-3xl shadow-2xl m-4 mb-10"
        style={{ fontFamily: "'Sora', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
              Commande {order.id}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
              <StatusIcon className="w-3 h-3" />
              {st.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white">
              <Printer className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Timeline + Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Info */}
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Informations client</h4>
              <div className="space-y-2">
                <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{order.client}</p>
                <div className="flex items-center gap-2 text-[12px] text-[#6B7280] dark:text-white/50">
                  <Mail className="w-3.5 h-3.5" /> {order.email}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#6B7280] dark:text-white/50">
                  <Phone className="w-3.5 h-3.5" /> {order.phone}
                </div>
                <div className="flex items-start gap-2 text-[12px] text-[#6B7280] dark:text-white/50">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{order.address}, {order.wilaya}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Détails commande</h4>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280] dark:text-white/50">Date de commande</span>
                  <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] dark:text-white/50">Dernière mise à jour</span>
                  <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(order.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] dark:text-white/50">Moyen de paiement</span>
                  <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{order.paymentMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] dark:text-white/50">N° de suivi</span>
                    <span className="text-[#FF6B35]" style={{ fontWeight: 500 }}>{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="text-[13px] text-[#1A2332] dark:text-white mb-3" style={{ fontWeight: 600 }}>Articles ({order.items.length})</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.sku} className="flex items-center gap-3 bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-white/10 overflow-hidden shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 500 }}>{item.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{item.sku} · Qté: {item.quantity}</p>
                  </div>
                  <p className="text-[13px] text-[#1A2332] dark:text-white shrink-0" style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#6B7280] dark:text-white/50">Sous-total</span>
              <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#6B7280] dark:text-white/50">Livraison</span>
              <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{order.shipping === 0 ? "Gratuite" : formatPrice(order.shipping)}</span>
            </div>
            <div className="border-t border-[#E5E7EB] dark:border-white/10 pt-2 flex justify-between text-[15px]">
              <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Total</span>
              <span className="text-[#FF6B35]" style={{ fontWeight: 700 }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-[#FEF3C7] dark:bg-[#F59E0B]/10 rounded-xl p-4">
              <p className="text-[12px] text-[#92400E] dark:text-[#F59E0B]" style={{ fontWeight: 500 }}>Note interne</p>
              <p className="text-[13px] text-[#78350F] dark:text-[#FCD34D] mt-1">{order.notes}</p>
            </div>
          )}

          {/* Status Actions */}
          {nextStatuses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-[12px] text-[#9CA3AF] self-center mr-2">Changer le statut :</span>
              {nextStatuses.map((ns) => {
                const nsc = STATUS_CONFIG[ns];
                return (
                  <button
                    key={ns}
                    onClick={() => onStatusChange(order.id, ns)}
                    className="px-4 py-2 rounded-lg text-[12px] border transition-colors"
                    style={{
                      fontWeight: 500,
                      borderColor: nsc.color + "40",
                      color: nsc.color,
                      backgroundColor: nsc.color + "08",
                    }}
                  >
                    {nsc.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"createdAt" | "total">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) list = list.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.client.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search));
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    list.sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sortField === "total") return (a.total - b.total) * m;
      return a.createdAt.localeCompare(b.createdAt) * m;
    });
    return list;
  }, [orders, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    setDetailOrder((prev) => prev && prev.id === id ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : prev);
  };

  // Stats
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total", value: orders.length, icon: ShoppingCart, color: "#3B82F6" },
          { label: "En attente", value: statusCounts.pending || 0, icon: Clock, color: "#F59E0B" },
          { label: "En cours", value: (statusCounts.confirmed || 0) + (statusCounts.preparing || 0) + (statusCounts.shipped || 0), icon: Truck, color: "#8B5CF6" },
          { label: "Livrées", value: statusCounts.delivered || 0, icon: CheckCircle2, color: "#10B981" },
          { label: "CA livré", value: formatPrice(totalRevenue), icon: ShoppingCart, color: "#FF6B35", isRevenue: true },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1E1E24] rounded-xl p-4 border border-[#E5E7EB] dark:border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#9CA3AF] truncate">{s.label}</p>
              <p className={`text-[#1A2332] dark:text-white truncate ${"isRevenue" in s ? "text-[14px]" : "text-[18px]"}`} style={{ fontWeight: 700 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Toutes", count: orders.length },
          ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
            key, label: cfg.label, count: statusCounts[key] || 0,
          })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
              statusFilter === f.key
                ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                : "border-[#E5E7EB] dark:border-white/10 text-[#6B7280] dark:text-white/50 hover:border-[#FF6B35]/50"
            }`}
            style={{ fontWeight: 500 }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher par ID, client, téléphone..." className="pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] w-full outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" /> Exporter
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-3">{filtered.length} commande{filtered.length > 1 ? "s" : ""}</p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Commande</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Client</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Articles</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("total")}>
                  <span className="inline-flex items-center gap-1">Total <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Paiement</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("createdAt")}>
                  <span className="inline-flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => {
                const st = STATUS_CONFIG[o.status];
                const StatusIcon = st.icon;
                return (
                  <tr key={o.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{o.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{o.client}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-lg border-2 border-white dark:border-[#1E1E24] bg-[#F3F4F6] dark:bg-white/10 overflow-hidden">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {o.items.length > 3 && (
                          <div className="w-8 h-8 rounded-lg border-2 border-white dark:border-[#1E1E24] bg-[#E5E7EB] dark:bg-white/20 flex items-center justify-center text-[10px] text-[#6B7280]" style={{ fontWeight: 600 }}>
                            +{o.items.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{o.items.reduce((s, i) => s + i.quantity, 0)} article{o.items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{formatPrice(o.total)}</p>
                      {o.shipping === 0 && <p className="text-[10px] text-[#10B981]">Livraison gratuite</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                        <StatusIcon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280] dark:text-white/60">{o.paymentMethod}</td>
                    <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{formatShortDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDetailOrder(o)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
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

      {/* Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onStatusChange={(id, status) => handleStatusChange(id, status)}
        />
      )}
    </div>
  );
}
