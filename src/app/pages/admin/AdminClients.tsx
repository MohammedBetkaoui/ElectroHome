import { useState, useMemo } from "react";
import {
  Search, Eye, X, ChevronLeft, ChevronRight, ArrowUpDown,
  Users, UserCheck, UserX, ShieldAlert, Mail, Phone, MapPin,
  Calendar, ShoppingCart, Star, Ban, CheckCircle2, MoreVertical,
  Download, TrendingUp, CreditCard, Package
} from "lucide-react";
import { IMAGES } from "../../data/store";

// ─── Types ───
type ClientStatus = "active" | "inactive" | "blocked";

interface ClientOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  statusColor: string;
  items: number;
}

interface AdminClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  status: ClientStatus;
  createdAt: string;
  lastOrderAt: string;
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  favoriteCategory: string;
  orders: ClientOrder[];
  notes?: string;
}

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string }> = {
  active: { label: "Actif", color: "#10B981" },
  inactive: { label: "Inactif", color: "#F59E0B" },
  blocked: { label: "Bloqué", color: "#EF4444" },
};

// ─── Mock Data ───
const MOCK_CLIENTS: AdminClient[] = [
  {
    id: "CLT-001", firstName: "Mohamed", lastName: "Benali", email: "m.benali@email.com", phone: "0555 12 34 56",
    address: "Cité 500 logements, Bloc B3, Apt 12", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-06-15", lastOrderAt: "2026-03-26",
    totalOrders: 12, totalSpent: 1845000, averageOrder: 153750, favoriteCategory: "Réfrigérateurs",
    orders: [
      { id: "CMD-2841", date: "2026-03-26", total: 189000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2789", date: "2026-02-18", total: 109000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2701", date: "2026-01-05", total: 312000, status: "Livrée", statusColor: "#10B981", items: 2 },
      { id: "CMD-2650", date: "2025-12-15", total: 94000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2580", date: "2025-11-02", total: 174000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-002", firstName: "Amira", lastName: "Khelifi", email: "a.khelifi@email.com", phone: "0661 98 76 54",
    address: "Rue des Frères Bouaoud, N°45", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-09-20", lastOrderAt: "2026-03-26",
    totalOrders: 8, totalSpent: 1267000, averageOrder: 158375, favoriteCategory: "TV & Son",
    orders: [
      { id: "CMD-2840", date: "2026-03-26", total: 312000, status: "Expédiée", statusColor: "#06B6D4", items: 2 },
      { id: "CMD-2756", date: "2026-02-10", total: 203000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2688", date: "2025-12-28", total: 130000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-003", firstName: "Youcef", lastName: "Hamidi", email: "y.hamidi@email.com", phone: "0770 11 22 33",
    address: "Cité El Bachir El Ibrahimi, Villa 7", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-11-05", lastOrderAt: "2026-03-25",
    totalOrders: 5, totalSpent: 520000, averageOrder: 104000, favoriteCategory: "Climatiseurs",
    orders: [
      { id: "CMD-2839", date: "2026-03-25", total: 94000, status: "En préparation", statusColor: "#8B5CF6", items: 1 },
      { id: "CMD-2710", date: "2026-01-12", total: 94000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-004", firstName: "Fatima Zahra", lastName: "Boukhari", email: "fz.boukhari@email.com", phone: "0550 44 55 66",
    address: "Boulevard Ben Boulaid, Immeuble C", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-07-10", lastOrderAt: "2026-03-25",
    totalOrders: 10, totalSpent: 1590000, averageOrder: 159000, favoriteCategory: "Lave-vaisselle",
    orders: [
      { id: "CMD-2838", date: "2026-03-25", total: 174000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2795", date: "2026-02-20", total: 80000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-005", firstName: "Karim", lastName: "Djaballah", email: "k.djaballah@email.com", phone: "0660 77 88 99",
    address: "Hai El Nasr, Rue 12, N°3", wilaya: "Bordj Bou Arréridj",
    status: "inactive", createdAt: "2025-04-22", lastOrderAt: "2026-03-25",
    totalOrders: 3, totalSpent: 238000, averageOrder: 79333, favoriteCategory: "Petit électroménager",
    orders: [
      { id: "CMD-2837", date: "2026-03-25", total: 69000, status: "Annulée", statusColor: "#EF4444", items: 1 },
      { id: "CMD-2600", date: "2025-11-15", total: 52000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
    notes: "Client difficile à joindre, plusieurs commandes annulées.",
  },
  {
    id: "CLT-006", firstName: "Nour El Houda", lastName: "Saidi", email: "neh.saidi@email.com", phone: "0555 33 22 11",
    address: "Cité 1000 logements, Bloc F1, Apt 5", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-08-18", lastOrderAt: "2026-03-24",
    totalOrders: 7, totalSpent: 987000, averageOrder: 141000, favoriteCategory: "TV & Son",
    orders: [
      { id: "CMD-2836", date: "2026-03-24", total: 203000, status: "Confirmée", statusColor: "#3B82F6", items: 1 },
      { id: "CMD-2740", date: "2026-01-28", total: 109000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-007", firstName: "Abdelkader", lastName: "Mansouri", email: "a.mansouri@email.com", phone: "0770 55 44 33",
    address: "Rue Larbi Ben M'hidi, N°22", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2026-01-10", lastOrderAt: "2026-03-24",
    totalOrders: 4, totalSpent: 417000, averageOrder: 104250, favoriteCategory: "Aspirateurs",
    orders: [
      { id: "CMD-2835", date: "2026-03-24", total: 149000, status: "En attente", statusColor: "#F59E0B", items: 2 },
      { id: "CMD-2770", date: "2026-02-14", total: 80000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-008", firstName: "Sara", lastName: "Boudiaf", email: "s.boudiaf@email.com", phone: "0661 22 33 44",
    address: "Cité Zhun, Bloc A2, Apt 8", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-10-02", lastOrderAt: "2026-03-24",
    totalOrders: 6, totalSpent: 748000, averageOrder: 124667, favoriteCategory: "Fours",
    orders: [
      { id: "CMD-2834", date: "2026-03-24", total: 132500, status: "Expédiée", statusColor: "#06B6D4", items: 1 },
      { id: "CMD-2722", date: "2026-01-18", total: 189000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-009", firstName: "Rachid", lastName: "Tounsi", email: "r.tounsi@email.com", phone: "0550 66 77 88",
    address: "Hai 20 Août, Rue 5, Villa 14", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2025-05-30", lastOrderAt: "2026-03-23",
    totalOrders: 9, totalSpent: 1362000, averageOrder: 151333, favoriteCategory: "Machines à laver",
    orders: [
      { id: "CMD-2833", date: "2026-03-23", total: 218000, status: "Livrée", statusColor: "#10B981", items: 2 },
      { id: "CMD-2780", date: "2026-02-15", total: 130000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-010", firstName: "Imane", lastName: "Cherif", email: "i.cherif@email.com", phone: "0660 99 88 77",
    address: "Boulevard Emir Abdelkader, N°18", wilaya: "Bordj Bou Arréridj",
    status: "blocked", createdAt: "2025-03-12", lastOrderAt: "2026-03-22",
    totalOrders: 4, totalSpent: 377000, averageOrder: 94250, favoriteCategory: "Réfrigérateurs",
    orders: [
      { id: "CMD-2832", date: "2026-03-22", total: 377000, status: "Retournée", statusColor: "#6B7280", items: 3 },
    ],
    notes: "Retour fréquent de produits. Compte bloqué après abus.",
  },
  {
    id: "CLT-011", firstName: "Anis", lastName: "Bouzid", email: "a.bouzid@email.com", phone: "0555 44 33 22",
    address: "Cité 200 logements, Bloc D, Apt 3", wilaya: "Bordj Bou Arréridj",
    status: "active", createdAt: "2026-02-01", lastOrderAt: "2026-03-20",
    totalOrders: 2, totalSpent: 283000, averageOrder: 141500, favoriteCategory: "Climatiseurs",
    orders: [
      { id: "CMD-2815", date: "2026-03-20", total: 189000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2790", date: "2026-02-17", total: 94000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
  {
    id: "CLT-012", firstName: "Lina", lastName: "Mebarki", email: "l.mebarki@email.com", phone: "0770 88 77 66",
    address: "Rue Didouche Mourad, N°9", wilaya: "Bordj Bou Arréridj",
    status: "inactive", createdAt: "2025-08-25", lastOrderAt: "2025-12-10",
    totalOrders: 2, totalSpent: 149000, averageOrder: 74500, favoriteCategory: "Aspirateurs",
    orders: [
      { id: "CMD-2640", date: "2025-12-10", total: 80000, status: "Livrée", statusColor: "#10B981", items: 1 },
      { id: "CMD-2590", date: "2025-10-05", total: 69000, status: "Livrée", statusColor: "#10B981", items: 1 },
    ],
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("fr-DZ") + " DA";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(first: string, last: string) {
  return (first[0] + last[0]).toUpperCase();
}

const AVATAR_COLORS = ["#FF6B35", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899", "#EF4444"];
function avatarColor(id: string) {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

// ─── Client Detail Modal ───
function ClientDetailModal({
  client,
  onClose,
  onStatusChange,
}: {
  client: AdminClient;
  onClose: () => void;
  onStatusChange: (id: string, status: ClientStatus) => void;
}) {
  const st = STATUS_CONFIG[client.status];
  const [tab, setTab] = useState<"overview" | "orders">("overview");

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-6 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-3xl shadow-2xl m-4 mb-10"
        style={{ fontFamily: "'Sora', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-[18px] shrink-0"
              style={{ fontWeight: 600, backgroundColor: avatarColor(client.id) }}
            >
              {getInitials(client.firstName, client.lastName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                  {client.firstName} {client.lastName}
                </h2>
                <span
                  className="inline-flex px-2 py-0.5 rounded-full text-[10px]"
                  style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}
                >
                  {st.label}
                </span>
              </div>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">{client.id} · Client depuis {formatDate(client.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] dark:border-white/10 px-6">
          {(["overview", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-[13px] border-b-2 transition-colors ${
                tab === t
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
              }`}
              style={{ fontWeight: 500 }}
            >
              {t === "overview" ? "Aperçu" : `Commandes (${client.orders.length})`}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {tab === "overview" ? (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total dépensé", value: formatPrice(client.totalSpent), icon: CreditCard, color: "#FF6B35" },
                  { label: "Commandes", value: client.totalOrders, icon: ShoppingCart, color: "#3B82F6" },
                  { label: "Panier moyen", value: formatPrice(client.averageOrder), icon: TrendingUp, color: "#10B981" },
                  { label: "Catégorie favorite", value: client.favoriteCategory, icon: Package, color: "#8B5CF6", small: true },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                      <span className="text-[11px] text-[#9CA3AF]">{kpi.label}</span>
                    </div>
                    <p className={`text-[#1A2332] dark:text-white ${"small" in kpi ? "text-[12px]" : "text-[15px]"}`} style={{ fontWeight: 600 }}>
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-3">
                <h4 className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[12px] text-[#6B7280] dark:text-white/50">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#6B7280] dark:text-white/50">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> {client.phone}
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-[#6B7280] dark:text-white/50 md:col-span-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{client.address}, {client.wilaya}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-[11px] text-[#9CA3AF]">Inscrit le</span>
                  </div>
                  <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(client.createdAt)}</p>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-[11px] text-[#9CA3AF]">Dernière commande</span>
                  </div>
                  <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatDate(client.lastOrderAt)}</p>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="bg-[#FEF3C7] dark:bg-[#F59E0B]/10 rounded-xl p-4">
                  <p className="text-[12px] text-[#92400E] dark:text-[#F59E0B]" style={{ fontWeight: 500 }}>Note interne</p>
                  <p className="text-[13px] text-[#78350F] dark:text-[#FCD34D] mt-1">{client.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {client.status !== "blocked" && (
                  <button
                    onClick={() => onStatusChange(client.id, "blocked")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EF4444]/30 text-[#EF4444] text-[12px] hover:bg-[#EF4444]/5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Ban className="w-3.5 h-3.5" /> Bloquer le client
                  </button>
                )}
                {client.status === "blocked" && (
                  <button
                    onClick={() => onStatusChange(client.id, "active")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#10B981]/30 text-[#10B981] text-[12px] hover:bg-[#10B981]/5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Débloquer le client
                  </button>
                )}
                {client.status === "inactive" && (
                  <button
                    onClick={() => onStatusChange(client.id, "active")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#10B981]/30 text-[#10B981] text-[12px] hover:bg-[#10B981]/5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Réactiver le client
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-2">
              {client.orders.length === 0 ? (
                <p className="text-[13px] text-[#9CA3AF] text-center py-8">Aucune commande</p>
              ) : (
                client.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-[#9CA3AF]" />
                      </div>
                      <div>
                        <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{order.id}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{formatDate(order.date)} · {order.items} article{order.items > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{formatPrice(order.total)}</p>
                      <span
                        className="inline-flex px-2 py-0.5 rounded-full text-[10px] mt-0.5"
                        style={{ fontWeight: 500, backgroundColor: order.statusColor + "15", color: order.statusColor }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export function AdminClients() {
  const [clients, setClients] = useState<AdminClient[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "totalSpent" | "totalOrders" | "createdAt">("totalSpent");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [detailClient, setDetailClient] = useState<AdminClient | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = [...clients];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.firstName + " " + c.lastName).toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(search) ||
        c.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter);
    list.sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName) * m;
      if (sortField === "totalSpent") return (a.totalSpent - b.totalSpent) * m;
      if (sortField === "totalOrders") return (a.totalOrders - b.totalOrders) * m;
      return a.createdAt.localeCompare(b.createdAt) * m;
    });
    return list;
  }, [clients, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleStatusChange = (id: string, newStatus: ClientStatus) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    setDetailClient((prev) => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const activeCount = clients.filter((c) => c.status === "active").length;
  const inactiveCount = clients.filter((c) => c.status === "inactive").length;
  const blockedCount = clients.filter((c) => c.status === "blocked").length;
  const totalRevenue = clients.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total clients", value: clients.length, icon: Users, color: "#3B82F6" },
          { label: "Clients actifs", value: activeCount, icon: UserCheck, color: "#10B981" },
          { label: "Inactifs", value: inactiveCount, icon: UserX, color: "#F59E0B" },
          { label: "Bloqués", value: blockedCount, icon: ShieldAlert, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1E1E24] rounded-xl p-4 border border-[#E5E7EB] dark:border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
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
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher par nom, email, tél..." className="pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] w-72 outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35] transition-colors" />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] transition-colors">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="blocked">Bloqué</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-3">{filtered.length} client{filtered.length > 1 ? "s" : ""}</p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Client</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Contact</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("totalOrders")}>
                  <span className="inline-flex items-center gap-1">Commandes <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF] cursor-pointer select-none" style={{ fontWeight: 500 }} onClick={() => toggleSort("totalSpent")}>
                  <span className="inline-flex items-center gap-1">Total dépensé <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Dernière cmd</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => {
                const st = STATUS_CONFIG[c.status];
                return (
                  <tr key={c.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[12px] shrink-0"
                          style={{ fontWeight: 600, backgroundColor: avatarColor(c.id) }}
                        >
                          {getInitials(c.firstName, c.lastName)}
                        </div>
                        <div>
                          <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF]">{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-[#6B7280] dark:text-white/60">{c.email}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                      {c.totalOrders}
                    </td>
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]"
                        style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{formatDate(c.lastOrderAt)}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === c.id ? null : c.id)}
                          className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {actionMenu === c.id && (
                          <div className="absolute right-0 top-9 bg-white dark:bg-[#25252B] rounded-xl shadow-xl border border-[#E5E7EB] dark:border-white/10 py-1 z-50 min-w-[160px]">
                            <button onClick={() => { setDetailClient(c); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#6B7280] hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                              <Eye className="w-3.5 h-3.5" /> Voir la fiche
                            </button>
                            {c.status !== "blocked" ? (
                              <button onClick={() => { handleStatusChange(c.id, "blocked"); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors">
                                <Ban className="w-3.5 h-3.5" /> Bloquer
                              </button>
                            ) : (
                              <button onClick={() => { handleStatusChange(c.id, "active"); setActionMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#10B981] hover:bg-[#10B981]/5 transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Débloquer
                              </button>
                            )}
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
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] flex items-center justify-center ${page === i + 1 ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-white/10"}`} style={{ fontWeight: page === i + 1 ? 600 : 400 }}>
                  {i + 1}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailClient && (
        <ClientDetailModal
          client={detailClient}
          onClose={() => setDetailClient(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
