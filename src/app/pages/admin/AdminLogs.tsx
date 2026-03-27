import { useState, useMemo } from "react";
import { Search, Clock, User, Edit3, Trash2, LogIn, LogOut, Plus, Settings, ShoppingCart, Package, Filter, Download } from "lucide-react";

type LogType = "login" | "logout" | "create" | "update" | "delete" | "settings" | "order" | "export";
interface LogEntry {
  id: string; user: string; avatar: string; action: string; type: LogType;
  target: string; date: string; ip: string;
}

const TYPE_CFG: Record<LogType, { label: string; color: string; icon: any }> = {
  login: { label: "Connexion", color: "#10B981", icon: LogIn },
  logout: { label: "Déconnexion", color: "#6B7280", icon: LogOut },
  create: { label: "Création", color: "#3B82F6", icon: Plus },
  update: { label: "Modification", color: "#F59E0B", icon: Edit3 },
  delete: { label: "Suppression", color: "#EF4444", icon: Trash2 },
  settings: { label: "Paramètres", color: "#8B5CF6", icon: Settings },
  order: { label: "Commande", color: "#FF6B35", icon: ShoppingCart },
  export: { label: "Export", color: "#06B6D4", icon: Download },
};

const LOGS: LogEntry[] = [
  { id: "1", user: "Ahmed Karim", avatar: "AK", action: "S'est connecté au tableau de bord", type: "login", target: "Dashboard", date: "2026-03-27T09:15:00", ip: "41.111.23.45" },
  { id: "2", user: "Ahmed Karim", avatar: "AK", action: "A modifié le prix du produit", type: "update", target: "Samsung RT38 Réfrigérateur", date: "2026-03-27T09:22:00", ip: "41.111.23.45" },
  { id: "3", user: "Yacine Meziane", avatar: "YM", action: "A validé la commande", type: "order", target: "CMD-0342", date: "2026-03-27T09:18:00", ip: "41.111.23.46" },
  { id: "4", user: "Sara Khelifi", avatar: "SK", action: "A répondu au ticket support", type: "update", target: "TIC-007", date: "2026-03-27T08:55:00", ip: "105.235.12.78" },
  { id: "5", user: "Nadia Boussaad", avatar: "NB", action: "A créé une nouvelle campagne marketing", type: "create", target: "Soldes Ramadan 2026", date: "2026-03-26T17:30:00", ip: "41.111.23.47" },
  { id: "6", user: "Ahmed Karim", avatar: "AK", action: "A modifié les paramètres de livraison", type: "settings", target: "Zones de livraison", date: "2026-03-26T16:45:00", ip: "41.111.23.45" },
  { id: "7", user: "Yacine Meziane", avatar: "YM", action: "A supprimé un produit du catalogue", type: "delete", target: "Ancien modèle XY-200", date: "2026-03-26T15:20:00", ip: "41.111.23.46" },
  { id: "8", user: "Lina Amrani", avatar: "LA", action: "A exporté le rapport de ventes", type: "export", target: "Rapport Mars 2026", date: "2026-03-26T14:00:00", ip: "105.235.12.80" },
  { id: "9", user: "Sara Khelifi", avatar: "SK", action: "S'est connectée au tableau de bord", type: "login", target: "Dashboard", date: "2026-03-26T13:00:00", ip: "105.235.12.78" },
  { id: "10", user: "Ahmed Karim", avatar: "AK", action: "A ajouté un nouveau produit", type: "create", target: "Condor Climatiseur 24K BTU", date: "2026-03-26T11:30:00", ip: "41.111.23.45" },
  { id: "11", user: "Nadia Boussaad", avatar: "NB", action: "A publié un article de blog", type: "create", target: "Guide entretien climatiseur", date: "2026-03-26T10:15:00", ip: "41.111.23.47" },
  { id: "12", user: "Reda Bouzid", avatar: "RB", action: "S'est déconnecté", type: "logout", target: "Dashboard", date: "2026-03-25T18:00:00", ip: "41.111.23.48" },
  { id: "13", user: "Yacine Meziane", avatar: "YM", action: "A mis à jour le stock", type: "update", target: "12 produits", date: "2026-03-25T16:30:00", ip: "41.111.23.46" },
  { id: "14", user: "Ahmed Karim", avatar: "AK", action: "A modifié les rôles utilisateur", type: "settings", target: "Rôle Support", date: "2026-03-25T14:10:00", ip: "41.111.23.45" },
  { id: "15", user: "Sara Khelifi", avatar: "SK", action: "A fermé le ticket support", type: "update", target: "TIC-005", date: "2026-03-25T12:00:00", ip: "105.235.12.78" },
];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Il y a ${days}j`;
}

export function AdminLogs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const users = [...new Set(LOGS.map((l) => l.user))];
  const filtered = useMemo(() => {
    let list = [...LOGS];
    if (search) { const q = search.toLowerCase(); list = list.filter((l) => l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q)); }
    if (typeFilter !== "all") list = list.filter((l) => l.type === typeFilter);
    if (userFilter !== "all") list = list.filter((l) => l.user === userFilter);
    return list;
  }, [search, typeFilter, userFilter]);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher dans le journal..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white">
            <option value="all">Tous les types</option>
            {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white">
            <option value="all">Tous les utilisateurs</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 divide-y divide-[#E5E7EB]/50 dark:divide-white/5">
        {filtered.map((log) => {
          const cfg = TYPE_CFG[log.type];
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="flex items-center gap-3 p-4 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.color + "15" }}>
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A2332] dark:text-white">
                  <span style={{ fontWeight: 600 }}>{log.user}</span>{" "}
                  <span className="text-[#6B7280] dark:text-white/60">{log.action}</span>{" "}
                  <span className="text-[#FF6B35]" style={{ fontWeight: 500 }}>{log.target}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#9CA3AF]">
                  <span>{new Date(log.date).toLocaleString("fr-DZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>
              <span className="text-[11px] text-[#9CA3AF] shrink-0 hidden sm:block">{timeAgo(log.date)}</span>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucune entrée trouvée</div>}
      </div>
    </div>
  );
}
