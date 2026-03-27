import { useState, useMemo } from "react";
import { Bell, ShoppingCart, Package, AlertTriangle, Users, MessageCircle, Star, Truck, CheckCircle2, X, Clock, Filter } from "lucide-react";

type NotifType = "order" | "stock" | "review" | "support" | "delivery" | "client" | "system";
interface Notification {
  id: string; title: string; message: string; type: NotifType; date: string; read: boolean;
}

const TYPE_CFG: Record<NotifType, { label: string; color: string; icon: any }> = {
  order: { label: "Commande", color: "#FF6B35", icon: ShoppingCart },
  stock: { label: "Stock", color: "#EF4444", icon: AlertTriangle },
  review: { label: "Avis", color: "#F59E0B", icon: Star },
  support: { label: "Support", color: "#3B82F6", icon: MessageCircle },
  delivery: { label: "Livraison", color: "#10B981", icon: Truck },
  client: { label: "Client", color: "#8B5CF6", icon: Users },
  system: { label: "Système", color: "#6B7280", icon: Bell },
};

const NOTIFS: Notification[] = [
  { id: "1", title: "Nouvelle commande CMD-0342", message: "Karim Benali a passé une commande de 148 750 DA. Samsung RT38 Réfrigérateur.", type: "order", date: "2026-03-27T09:15:00", read: false },
  { id: "2", title: "Stock critique : Moulinex Cookeo", message: "Le produit Moulinex CE704 Cookeo est en rupture de stock (0 unités).", type: "stock", date: "2026-03-27T08:30:00", read: false },
  { id: "3", title: "Nouvel avis 1 étoile", message: "Omar F. a laissé un avis négatif sur Dyson V15 Aspirateur. Action requise.", type: "review", date: "2026-03-27T08:00:00", read: false },
  { id: "4", title: "Ticket support #TIC-007", message: "Nouveau ticket urgent de Leila Mansouri concernant une commande endommagée.", type: "support", date: "2026-03-26T17:45:00", read: true },
  { id: "5", title: "Livraison échouée LIV-006", message: "La livraison pour Nadia Slimani à Béjaïa a échoué. Client absent.", type: "delivery", date: "2026-03-26T16:30:00", read: true },
  { id: "6", title: "Nouveau client inscrit", message: "Sofiane Mebarki vient de créer un compte depuis Bordj Bou Arréridj.", type: "client", date: "2026-03-26T15:00:00", read: true },
  { id: "7", title: "Stock bas : Dyson V15", message: "Il ne reste que 3 unités de Dyson V15 Aspirateur (seuil: 5).", type: "stock", date: "2026-03-26T14:00:00", read: true },
  { id: "8", title: "Commande CMD-0341 livrée", message: "La commande d'Amina Zerrouki a été livrée avec succès.", type: "delivery", date: "2026-03-26T12:00:00", read: true },
  { id: "9", title: "Sauvegarde automatique échouée", message: "La sauvegarde du 25 mars 2026 à 03h00 a échoué. Vérifiez l'espace disque.", type: "system", date: "2026-03-25T03:00:00", read: true },
  { id: "10", title: "5 nouvelles commandes", message: "5 nouvelles commandes reçues aujourd'hui pour un total de 532 000 DA.", type: "order", date: "2026-03-25T18:00:00", read: true },
  { id: "11", title: "Campagne marketing activée", message: "La campagne 'Soldes de Printemps 2026' est maintenant active.", type: "system", date: "2026-03-24T10:00:00", read: true },
  { id: "12", title: "Nouvel avis 5 étoiles", message: "Meriem B. a laissé un avis excellent sur Moulinex Cookeo.", type: "review", date: "2026-03-23T16:00:00", read: true },
];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState(NOTIFS);
  const [typeFilter, setTypeFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...notifications];
    if (typeFilter !== "all") list = list.filter((n) => n.type === typeFilter);
    if (showUnreadOnly) list = list.filter((n) => !n.read);
    return list;
  }, [notifications, typeFilter, showUnreadOnly]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
            {unreadCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[10px] mr-2" style={{ fontWeight: 600 }}>{unreadCount}</span>}
            non lu{unreadCount !== 1 ? "es" : "e"}
          </h2>
          <button onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${showUnreadOnly ? "bg-[#FF6B35] text-white" : "bg-[#F3F4F6] dark:bg-white/5 text-[#6B7280]"}`}
            style={{ fontWeight: 500 }}>
            Non lues uniquement
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white">
            <option value="all">Tous les types</option>
            {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35]" style={{ fontWeight: 500 }}>
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 divide-y divide-[#E5E7EB]/50 dark:divide-white/5">
        {filtered.map((n) => {
          const cfg = TYPE_CFG[n.type];
          const Icon = cfg.icon;
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors ${!n.read ? "bg-[#FF6B35]/[0.03]" : ""}`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: cfg.color + "15" }}>
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {!n.read && <div className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />}
                  <p className="text-[13px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                </div>
                <p className="text-[12px] text-[#6B7280] dark:text-white/50">{n.message}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">{timeAgo(n.date)}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color + "15", color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucune notification</div>}
      </div>
    </div>
  );
}
