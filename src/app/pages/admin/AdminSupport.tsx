import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Eye, X, ChevronLeft, ChevronRight, Plus, Send,
  Headphones, Clock, CheckCircle2, AlertCircle, MessageSquare,
  User, Calendar, Tag, Paperclip, MoreVertical, ArrowUpRight,
  Inbox, AlertTriangle, XCircle, Phone, Mail, Package
} from "lucide-react";

// ─── Types ───
type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";
type TicketCategory = "order" | "product" | "delivery" | "refund" | "account" | "other";

interface TicketMessage {
  id: string;
  sender: "client" | "agent";
  senderName: string;
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  client: string;
  email: string;
  phone: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  assignedTo: string;
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; icon: any }> = {
  open: { label: "Ouvert", color: "#3B82F6", icon: Inbox },
  in_progress: { label: "En cours", color: "#8B5CF6", icon: MessageSquare },
  waiting_customer: { label: "Attente client", color: "#F59E0B", icon: Clock },
  resolved: { label: "Résolu", color: "#10B981", icon: CheckCircle2 },
  closed: { label: "Fermé", color: "#6B7280", icon: XCircle },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: "Basse", color: "#6B7280" },
  medium: { label: "Moyenne", color: "#3B82F6" },
  high: { label: "Haute", color: "#F59E0B" },
  urgent: { label: "Urgente", color: "#EF4444" },
};

const CATEGORY_CONFIG: Record<TicketCategory, { label: string; icon: any }> = {
  order: { label: "Commande", icon: Package },
  product: { label: "Produit", icon: Tag },
  delivery: { label: "Livraison", icon: ArrowUpRight },
  refund: { label: "Remboursement", icon: AlertCircle },
  account: { label: "Compte", icon: User },
  other: { label: "Autre", icon: Headphones },
};

// ─── Mock Data ───
const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-1024", subject: "Commande CMD-2841 non reçue après 5 jours", client: "Mohamed Benali",
    email: "m.benali@email.com", phone: "0555 12 34 56", category: "delivery", priority: "high",
    status: "in_progress", orderId: "CMD-2841", createdAt: "2026-03-24T09:15:00", updatedAt: "2026-03-26T10:00:00",
    assignedTo: "Yacine M.",
    messages: [
      { id: "m1", sender: "client", senderName: "Mohamed Benali", text: "Bonjour, j'ai passé la commande CMD-2841 le 21 mars et je n'ai toujours rien reçu. Le suivi indique 'expédiée' depuis 3 jours. Pouvez-vous m'aider ?", timestamp: "2026-03-24T09:15:00" },
      { id: "m2", sender: "agent", senderName: "Yacine M.", text: "Bonjour Mohamed, je vous remercie de nous avoir contacté. Je vais vérifier le statut de votre livraison auprès du transporteur. Pouvez-vous me confirmer l'adresse de livraison ?", timestamp: "2026-03-24T10:30:00" },
      { id: "m3", sender: "client", senderName: "Mohamed Benali", text: "Oui, c'est Cité 500 logements, Bloc B3, Apt 12, Bordj Bou Arréridj.", timestamp: "2026-03-24T11:00:00" },
      { id: "m4", sender: "agent", senderName: "Yacine M.", text: "Merci. J'ai contacté le livreur, il y a eu un retard au dépôt de BBA. Votre colis devrait être livré demain matin. Je vous enverrai le numéro de suivi mis à jour.", timestamp: "2026-03-25T14:00:00" },
    ],
  },
  {
    id: "TKT-1023", subject: "Machine à café ne s'allume plus après 2 semaines", client: "Nawal Bouazza",
    email: "n.bouazza@email.com", phone: "0550 88 99 00", category: "product", priority: "medium",
    status: "waiting_customer", orderId: "CMD-2785", createdAt: "2026-03-23T14:20:00", updatedAt: "2026-03-25T16:30:00",
    assignedTo: "Sara K.",
    messages: [
      { id: "m1", sender: "client", senderName: "Nawal Bouazza", text: "Ma machine à expresso achetée il y a 2 semaines ne s'allume plus du tout. Le voyant ne réagit pas quand j'appuie sur le bouton.", timestamp: "2026-03-23T14:20:00" },
      { id: "m2", sender: "agent", senderName: "Sara K.", text: "Bonjour Nawal, je suis désolée pour ce désagrément. Pouvez-vous essayer de débrancher la machine pendant 30 minutes puis la rebrancher ? Aussi, avez-vous vérifié la prise avec un autre appareil ?", timestamp: "2026-03-23T15:00:00" },
      { id: "m3", sender: "client", senderName: "Nawal Bouazza", text: "Oui j'ai essayé tout ça, la prise fonctionne bien avec d'autres appareils. La machine est morte.", timestamp: "2026-03-24T09:00:00" },
      { id: "m4", sender: "agent", senderName: "Sara K.", text: "Merci pour les vérifications. Votre produit est sous garantie. Je vous propose de faire une demande de retour. Pouvez-vous m'envoyer une photo de la facture et du numéro de série de la machine (sur l'étiquette en dessous) ?", timestamp: "2026-03-25T16:30:00" },
    ],
  },
  {
    id: "TKT-1022", subject: "Demande de remboursement pour TV avec écran fissuré", client: "Samir Belkacem",
    email: "s.belkacem@email.com", phone: "0555 77 66 55", category: "refund", priority: "high",
    status: "resolved", orderId: "CMD-2820", createdAt: "2026-03-20T08:45:00", updatedAt: "2026-03-24T17:00:00",
    assignedTo: "Yacine M.",
    messages: [
      { id: "m1", sender: "client", senderName: "Samir Belkacem", text: "J'ai reçu mon TV OLED 55\" avec l'écran fissuré. L'emballage extérieur semblait intact. Je demande un remboursement complet.", timestamp: "2026-03-20T08:45:00" },
      { id: "m2", sender: "agent", senderName: "Yacine M.", text: "Bonjour Samir, c'est vraiment navrant. Pouvez-vous nous envoyer des photos de l'emballage et de l'écran endommagé ?", timestamp: "2026-03-20T10:00:00" },
      { id: "m3", sender: "client", senderName: "Samir Belkacem", text: "Voici les photos [5 photos envoyées]. La fissure est bien visible en bas à droite de l'écran.", timestamp: "2026-03-20T10:30:00" },
      { id: "m4", sender: "agent", senderName: "Yacine M.", text: "Merci Samir. J'ai créé la demande de retour RET-0086. Le ramassage est prévu pour demain entre 9h et 12h. Le remboursement sera effectué sous 48-72h après réception et vérification.", timestamp: "2026-03-21T09:00:00" },
      { id: "m5", sender: "agent", senderName: "Yacine M.", text: "Bonne nouvelle ! Le remboursement de 203 000 DA a été effectué sur votre compte CIB/Edahabia. Vous devriez le recevoir sous 24-48h. Merci de votre patience.", timestamp: "2026-03-24T17:00:00" },
    ],
  },
  {
    id: "TKT-1021", subject: "Comment modifier l'adresse de livraison ?", client: "Lina Mebarki",
    email: "l.mebarki@email.com", phone: "0770 88 77 66", category: "account", priority: "low",
    status: "closed", createdAt: "2026-03-22T11:30:00", updatedAt: "2026-03-22T12:15:00",
    assignedTo: "Sara K.",
    messages: [
      { id: "m1", sender: "client", senderName: "Lina Mebarki", text: "Bonjour, je viens de déménager. Comment puis-je changer mon adresse de livraison sur mon compte ?", timestamp: "2026-03-22T11:30:00" },
      { id: "m2", sender: "agent", senderName: "Sara K.", text: "Bonjour Lina ! Vous pouvez modifier votre adresse directement dans Compte > Mes adresses > Modifier. Si vous avez une commande en cours, contactez-nous avant l'expédition pour la mettre à jour.", timestamp: "2026-03-22T11:45:00" },
      { id: "m3", sender: "client", senderName: "Lina Mebarki", text: "Parfait, j'ai trouvé. Merci beaucoup !", timestamp: "2026-03-22T12:00:00" },
      { id: "m4", sender: "agent", senderName: "Sara K.", text: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Je ferme le ticket.", timestamp: "2026-03-22T12:15:00" },
    ],
  },
  {
    id: "TKT-1020", subject: "Bruit anormal dans le réfrigérateur livré hier", client: "Anis Bouzid",
    email: "a.bouzid@email.com", phone: "0555 44 33 22", category: "product", priority: "medium",
    status: "open", orderId: "CMD-2815", createdAt: "2026-03-26T08:00:00", updatedAt: "2026-03-26T08:00:00",
    assignedTo: "",
    messages: [
      { id: "m1", sender: "client", senderName: "Anis Bouzid", text: "Bonjour, le réfrigérateur que j'ai reçu hier fait un bruit de vibration très fort, surtout la nuit. Est-ce normal pour ce modèle ou y a-t-il un problème ?", timestamp: "2026-03-26T08:00:00" },
    ],
  },
  {
    id: "TKT-1019", subject: "Climatiseur installé mais ne refroidit pas", client: "Bilal Ferhat",
    email: "b.ferhat@email.com", phone: "0660 11 22 33", category: "product", priority: "urgent",
    status: "in_progress", orderId: "CMD-2775", createdAt: "2026-03-25T07:30:00", updatedAt: "2026-03-26T09:00:00",
    assignedTo: "Yacine M.",
    messages: [
      { id: "m1", sender: "client", senderName: "Bilal Ferhat", text: "J'ai fait installer le climatiseur par un technicien agréé mais il souffle de l'air chaud même en mode froid. La température de la pièce ne descend pas du tout.", timestamp: "2026-03-25T07:30:00" },
      { id: "m2", sender: "agent", senderName: "Yacine M.", text: "Bonjour Bilal, cela pourrait être un problème de gaz réfrigérant ou d'installation. Avez-vous le certificat d'installation du technicien agréé ? Nous allons envoyer notre technicien pour un diagnostic.", timestamp: "2026-03-25T10:00:00" },
      { id: "m3", sender: "client", senderName: "Bilal Ferhat", text: "Oui je l'ai. À quel moment votre technicien peut-il passer ? C'est urgent car il fait très chaud.", timestamp: "2026-03-26T09:00:00" },
    ],
  },
  {
    id: "TKT-1018", subject: "Annulation de commande en préparation", client: "Youcef Hamidi",
    email: "y.hamidi@email.com", phone: "0770 11 22 33", category: "order", priority: "medium",
    status: "resolved", orderId: "CMD-2839", createdAt: "2026-03-25T13:00:00", updatedAt: "2026-03-25T15:30:00",
    assignedTo: "Sara K.",
    messages: [
      { id: "m1", sender: "client", senderName: "Youcef Hamidi", text: "Bonjour, je souhaite annuler ma commande CMD-2839 qui est en préparation. J'ai trouvé le même produit moins cher ailleurs.", timestamp: "2026-03-25T13:00:00" },
      { id: "m2", sender: "agent", senderName: "Sara K.", text: "Bonjour Youcef, votre commande est déjà en préparation mais je peux encore l'annuler. Confirmez-vous l'annulation ? Nous pouvons aussi vous proposer un alignement de prix si vous le souhaitez.", timestamp: "2026-03-25T13:30:00" },
      { id: "m3", sender: "client", senderName: "Youcef Hamidi", text: "Oui, annulez-la s'il vous plaît.", timestamp: "2026-03-25T14:00:00" },
      { id: "m4", sender: "agent", senderName: "Sara K.", text: "C'est fait, la commande CMD-2839 est annulée. Aucun montant n'a été débité. Bonne continuation !", timestamp: "2026-03-25T15:30:00" },
    ],
  },
];

function formatDate(date: string) { return new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" }); }
function formatTime(date: string) { return new Date(date).toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" }); }
function formatDateTime(date: string) { return formatDate(date) + " " + formatTime(date); }
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return `il y a ${Math.floor(hrs / 24)}j`;
}

// ─── Ticket Chat Modal ───
function TicketChatModal({
  ticket,
  onClose,
  onStatusChange,
  onReply,
}: {
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onReply: (id: string, text: string) => void;
}) {
  const st = STATUS_CONFIG[ticket.status];
  const pr = PRIORITY_CONFIG[ticket.priority];
  const cat = CATEGORY_CONFIG[ticket.category];
  const CatIcon = cat.icon;
  const [reply, setReply] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [ticket.messages.length]);

  const handleSend = () => {
    if (!reply.trim()) return;
    onReply(ticket.id, reply.trim());
    setReply("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-3xl shadow-2xl m-4 mb-8 flex flex-col"
        style={{ fontFamily: "'Sora', sans-serif", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] dark:border-white/10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-[#9CA3AF]">{ticket.id}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                  {st.label}
                </span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 500, backgroundColor: pr.color + "15", color: pr.color }}>
                  {pr.label}
                </span>
              </div>
              <h2 className="text-[15px] text-[#1A2332] dark:text-white mt-1.5" style={{ fontWeight: 600 }}>{ticket.subject}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white shrink-0"><X className="w-4 h-4" /></button>
          </div>
          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-[#9CA3AF]">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{ticket.client}</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{ticket.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{ticket.phone}</span>
            <span className="flex items-center gap-1"><CatIcon className="w-3 h-3" />{cat.label}</span>
            {ticket.orderId && <span className="flex items-center gap-1 text-[#FF6B35]"><Package className="w-3 h-3" />{ticket.orderId}</span>}
            {ticket.assignedTo && <span className="flex items-center gap-1"><Headphones className="w-3 h-3" />{ticket.assignedTo}</span>}
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0" style={{ maxHeight: "45vh" }}>
          {ticket.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "agent"
                  ? "bg-[#FF6B35] text-white rounded-br-md"
                  : "bg-[#F3F4F6] dark:bg-white/10 text-[#1A2332] dark:text-white rounded-bl-md"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] ${msg.sender === "agent" ? "text-white/70" : "text-[#9CA3AF]"}`} style={{ fontWeight: 600 }}>{msg.senderName}</span>
                  <span className={`text-[10px] ${msg.sender === "agent" ? "text-white/50" : "text-[#9CA3AF]"}`}>{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-[13px] whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar + Reply */}
        <div className="border-t border-[#E5E7EB] dark:border-white/10 shrink-0">
          {/* Quick Status */}
          <div className="flex flex-wrap gap-1.5 px-5 pt-3">
            <span className="text-[11px] text-[#9CA3AF] self-center mr-1">Statut :</span>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => onStatusChange(ticket.id, key as TicketStatus)}
                className={`px-2.5 py-1 rounded-full text-[10px] border transition-colors ${
                  ticket.status === key
                    ? "border-transparent text-white"
                    : "border-[#E5E7EB] dark:border-white/10 text-[#9CA3AF] hover:text-[#6B7280]"
                }`}
                style={{
                  fontWeight: ticket.status === key ? 600 : 400,
                  backgroundColor: ticket.status === key ? cfg.color : "transparent",
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
          {/* Reply box */}
          {!["closed", "resolved"].includes(ticket.status) && (
            <div className="p-4 flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Écrire une réponse..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none placeholder:text-[#9CA3AF] focus:border-[#FF6B35]"
              />
              <button
                onClick={handleSend}
                disabled={!reply.trim()}
                className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center hover:bg-[#E55A2B] transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ───
export function AdminSupport() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [chatTicket, setChatTicket] = useState<Ticket | null>(null);

  // KPIs
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress" || t.status === "waiting_customer").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
  const urgentCount = tickets.filter((t) => t.priority === "urgent" && !["resolved", "closed"].includes(t.status)).length;

  const filtered = useMemo(() => {
    let list = [...tickets];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.subject.toLowerCase().includes(q) || t.client.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || (t.orderId || "").toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all") list = list.filter((t) => t.priority === priorityFilter);
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tickets, search, statusFilter, priorityFilter]);

  const handleStatusChange = (id: string, status: TicketStatus) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    setChatTicket((prev) => prev && prev.id === id ? { ...prev, status, updatedAt: new Date().toISOString() } : prev);
  };

  const handleReply = (id: string, text: string) => {
    const newMsg: TicketMessage = {
      id: "m" + Date.now(),
      sender: "agent",
      senderName: "Yacine M.",
      text,
      timestamp: new Date().toISOString(),
    };
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, messages: [...t.messages, newMsg], updatedAt: new Date().toISOString() } : t));
    setChatTicket((prev) => prev && prev.id === id ? { ...prev, messages: [...prev.messages, newMsg], updatedAt: new Date().toISOString() } : prev);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Tickets ouverts", value: openCount, icon: Inbox, color: "#3B82F6" },
          { label: "En traitement", value: inProgressCount, icon: MessageSquare, color: "#8B5CF6" },
          { label: "Résolus ce mois", value: resolvedCount, icon: CheckCircle2, color: "#10B981" },
          { label: "Urgents", value: urgentCount, icon: AlertTriangle, color: "#EF4444" },
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

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Tous", count: tickets.length },
          ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
            key, label: cfg.label, count: tickets.filter((t) => t.status === key).length,
          })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
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

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par sujet, client, ID ticket ou commande..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
            <option value="all">Toutes les priorités</option>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-3">{filtered.length} ticket{filtered.length > 1 ? "s" : ""}</p>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filtered.map((t) => {
          const st = STATUS_CONFIG[t.status];
          const pr = PRIORITY_CONFIG[t.priority];
          const cat = CATEGORY_CONFIG[t.category];
          const CatIcon = cat.icon;
          const StIcon = st.icon;
          const lastMsg = t.messages[t.messages.length - 1];
          const unread = t.status === "open";

          return (
            <div
              key={t.id}
              onClick={() => setChatTicket(t)}
              className={`bg-white dark:bg-[#1E1E24] rounded-xl border transition-all cursor-pointer group hover:shadow-md ${
                unread
                  ? "border-[#3B82F6]/30 dark:border-[#3B82F6]/20"
                  : "border-[#E5E7EB] dark:border-white/10"
              } hover:border-[#FF6B35]/40`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Priority Indicator */}
                  <div className="w-1 h-12 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: pr.color }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] text-[#9CA3AF]">{t.id}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                            <StIcon className="w-2.5 h-2.5" /> {st.label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#F3F4F6] dark:bg-white/10 text-[#6B7280]" style={{ fontWeight: 500 }}>
                            <CatIcon className="w-2.5 h-2.5" /> {cat.label}
                          </span>
                          {t.priority === "urgent" && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-[#EF4444]/15 text-[#EF4444] animate-pulse" style={{ fontWeight: 600 }}>URGENT</span>
                          )}
                        </div>
                        <h3 className="text-[14px] text-[#1A2332] dark:text-white mt-1 line-clamp-1" style={{ fontWeight: unread ? 600 : 500 }}>
                          {t.subject}
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap shrink-0">{timeAgo(t.updatedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.client}</span>
                        {t.orderId && <span className="text-[#FF6B35]">{t.orderId}</span>}
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{t.messages.length}</span>
                        {t.assignedTo && <span className="flex items-center gap-1"><Headphones className="w-3 h-3" />{t.assignedTo}</span>}
                      </div>
                    </div>

                    {/* Last message preview */}
                    <p className="text-[12px] text-[#9CA3AF] mt-1.5 line-clamp-1">
                      <span style={{ fontWeight: 500 }}>{lastMsg.senderName.split(" ")[0]}:</span>{" "}
                      {lastMsg.text.slice(0, 120)}{lastMsg.text.length > 120 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-12 text-center">
            <Headphones className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[14px] text-[#9CA3AF]">Aucun ticket trouvé</p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatTicket && (
        <TicketChatModal
          ticket={chatTicket}
          onClose={() => setChatTicket(null)}
          onStatusChange={handleStatusChange}
          onReply={handleReply}
        />
      )}
    </div>
  );
}
