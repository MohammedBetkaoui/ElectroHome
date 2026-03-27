import { useState, useMemo } from "react";
import {
  Search, Eye, X, Download, Plus, FileText, Printer, Send, CheckCircle2,
  Clock, AlertCircle, DollarSign, TrendingUp, Filter, MoreVertical, Calendar
} from "lucide-react";

type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled" | "draft";

interface Invoice {
  id: string;
  number: string;
  client: string;
  email: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  items: { name: string; qty: number; price: number }[];
  paymentMethod?: string;
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; icon: any }> = {
  paid: { label: "Payée", color: "#10B981", icon: CheckCircle2 },
  pending: { label: "En attente", color: "#F59E0B", icon: Clock },
  overdue: { label: "En retard", color: "#EF4444", icon: AlertCircle },
  cancelled: { label: "Annulée", color: "#6B7280", icon: X },
  draft: { label: "Brouillon", color: "#9CA3AF", icon: FileText },
};

function formatPrice(p: number) { return p.toLocaleString("fr-DZ") + " DA"; }
function formatDate(d: string) { return new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" }); }

const INVOICES: Invoice[] = [
  { id: "1", number: "FAC-2026-0342", client: "Karim Benali", email: "k.benali@email.dz", date: "2026-03-27", dueDate: "2026-04-10", amount: 125000, tax: 23750, total: 148750, status: "paid", paymentMethod: "CIB", items: [{ name: "Samsung RT38 Réfrigérateur 380L", qty: 1, price: 125000 }] },
  { id: "2", number: "FAC-2026-0341", client: "Amina Zerrouki", email: "a.zerrouki@email.dz", date: "2026-03-26", dueDate: "2026-04-09", amount: 89000, tax: 16910, total: 105910, status: "paid", paymentMethod: "COD", items: [{ name: "LG F4V5 Machine à laver 8kg", qty: 1, price: 89000 }] },
  { id: "3", number: "FAC-2026-0340", client: "Youcef Hadji", email: "y.hadji@email.dz", date: "2026-03-25", dueDate: "2026-04-08", amount: 175000, tax: 33250, total: 208250, status: "pending", items: [{ name: "Condor Alpha Climatiseur 18000 BTU", qty: 1, price: 95000 }, { name: "Brandt BCH6400 Cuisinière", qty: 1, price: 80000 }] },
  { id: "4", number: "FAC-2026-0339", client: "Meriem Bouazza", email: "m.bouazza@email.dz", date: "2026-03-24", dueDate: "2026-04-07", amount: 45000, tax: 8550, total: 53550, status: "paid", paymentMethod: "Edahabia", items: [{ name: "Moulinex CE704 Cookeo", qty: 1, price: 45000 }] },
  { id: "5", number: "FAC-2026-0338", client: "Omar Ferhat", email: "o.ferhat@email.dz", date: "2026-03-22", dueDate: "2026-04-05", amount: 220000, tax: 41800, total: 261800, status: "overdue", items: [{ name: "Samsung RT38 Réfrigérateur 380L", qty: 1, price: 125000 }, { name: "Dyson V15 Aspirateur", qty: 1, price: 95000 }] },
  { id: "6", number: "FAC-2026-0337", client: "Nadia Slimani", email: "n.slimani@email.dz", date: "2026-03-21", dueDate: "2026-04-04", amount: 68000, tax: 12920, total: 80920, status: "paid", paymentMethod: "Virement", items: [{ name: "Bosch WAN28 Machine à laver 7kg", qty: 1, price: 68000 }] },
  { id: "7", number: "FAC-2026-0336", client: "Sofiane Mebarki", email: "s.mebarki@email.dz", date: "2026-03-20", dueDate: "2026-04-03", amount: 310000, tax: 58900, total: 368900, status: "pending", items: [{ name: "LG GSX960 Réfrigérateur américain", qty: 1, price: 310000 }] },
  { id: "8", number: "FAC-2026-0335", client: "Fatima Cherifi", email: "f.cherifi@email.dz", date: "2026-03-19", dueDate: "2026-04-02", amount: 52000, tax: 9880, total: 61880, status: "cancelled", items: [{ name: "Tefal GC712 Grille-viande", qty: 2, price: 26000 }] },
  { id: "9", number: "FAC-2026-0334", client: "Rachid Hammoudi", email: "r.hammoudi@email.dz", date: "2026-03-18", dueDate: "2026-04-01", amount: 142000, tax: 26980, total: 168980, status: "paid", paymentMethod: "CIB", items: [{ name: "Whirlpool WFO3T233 Lave-vaisselle", qty: 1, price: 142000 }] },
  { id: "10", number: "FAC-2026-0333", client: "Lina Kaci", email: "l.kaci@email.dz", date: "2026-03-17", dueDate: "2026-03-31", amount: 35000, tax: 6650, total: 41650, status: "draft", items: [{ name: "Philips HD9280 Airfryer XL", qty: 1, price: 35000 }] },
];

function InvoiceDetail({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-2xl shadow-2xl m-4" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <div>
            <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Facture {invoice.number}</h2>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{formatDate(invoice.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#FF6B35]"><Printer className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#3B82F6]"><Download className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white" onClick={onClose}><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Header info */}
          <div className="grid grid-cols-2 gap-4 text-[12px]">
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-1.5">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Émetteur</p>
              <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>ElectroHome BBA</p>
              <p className="text-[#6B7280]">Rue Mohamed Boudiaf</p>
              <p className="text-[#6B7280]">Bordj Bou Arréridj 34000</p>
              <p className="text-[#6B7280]">NIF: 000234567890123</p>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-4 space-y-1.5">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Client</p>
              <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{invoice.client}</p>
              <p className="text-[#6B7280]">{invoice.email}</p>
              <p className="text-[#6B7280]">Échéance: {formatDate(invoice.dueDate)}</p>
              {invoice.paymentMethod && <p className="text-[#6B7280]">Paiement: {invoice.paymentMethod}</p>}
            </div>
          </div>
          {/* Items table */}
          <div className="border border-[#E5E7EB] dark:border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#F9FAFB] dark:bg-white/5 border-b border-[#E5E7EB] dark:border-white/10">
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase text-[#9CA3AF]" style={{ fontWeight: 500 }}>Article</th>
                  <th className="text-center px-4 py-2.5 text-[11px] uppercase text-[#9CA3AF]" style={{ fontWeight: 500 }}>Qté</th>
                  <th className="text-right px-4 py-2.5 text-[11px] uppercase text-[#9CA3AF]" style={{ fontWeight: 500 }}>Prix unit.</th>
                  <th className="text-right px-4 py-2.5 text-[11px] uppercase text-[#9CA3AF]" style={{ fontWeight: 500 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it, i) => (
                  <tr key={i} className="border-b border-[#E5E7EB]/50 dark:border-white/5">
                    <td className="px-4 py-2.5 text-[#1A2332] dark:text-white">{it.name}</td>
                    <td className="px-4 py-2.5 text-center text-[#6B7280]">{it.qty}</td>
                    <td className="px-4 py-2.5 text-right text-[#6B7280]">{formatPrice(it.price)}</td>
                    <td className="px-4 py-2.5 text-right text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{formatPrice(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span className="text-[#6B7280]">Sous-total HT</span><span className="text-[#1A2332] dark:text-white">{formatPrice(invoice.amount)}</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">TVA (19%)</span><span className="text-[#1A2332] dark:text-white">{formatPrice(invoice.tax)}</span></div>
              <div className="flex justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/10">
                <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Total TTC</span>
                <span className="text-[#FF6B35] text-[16px]" style={{ fontWeight: 700 }}>{formatPrice(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminInvoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    let list = [...INVOICES];
    if (search) { const q = search.toLowerCase(); list = list.filter((i) => i.number.toLowerCase().includes(q) || i.client.toLowerCase().includes(q)); }
    if (statusFilter !== "all") list = list.filter((i) => i.status === statusFilter);
    return list;
  }, [search, statusFilter]);

  const totalPaid = INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = INVOICES.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);
  const totalOverdue = INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total facturé", value: formatPrice(INVOICES.reduce((s, i) => s + i.total, 0)), icon: FileText, color: "#FF6B35" },
          { label: "Payées", value: formatPrice(totalPaid), icon: CheckCircle2, color: "#10B981" },
          { label: "En attente", value: formatPrice(totalPending), icon: Clock, color: "#F59E0B" },
          { label: "En retard", value: formatPrice(totalOverdue), icon: AlertCircle, color: "#EF4444" },
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une facture ou un client..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}>
            <Plus className="w-4 h-4" /> Nouvelle facture
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                {["N° Facture", "Client", "Date", "Échéance", "Montant TTC", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const st = STATUS_CONFIG[inv.status];
                const StIcon = st.icon;
                return (
                  <tr key={inv.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{inv.number}</td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{inv.client}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{inv.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{formatPrice(inv.total)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>
                        <StIcon className="w-3 h-3" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setDetail(inv)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35]"><Eye className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Download className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#10B981]"><Send className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-[#9CA3AF] text-[13px]">Aucune facture trouvée</div>}
      </div>

      {detail && <InvoiceDetail invoice={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
