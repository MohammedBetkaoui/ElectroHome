import { useState, useMemo } from "react";
import { Search, Truck, Package, CheckCircle2, Clock, MapPin, Phone, AlertTriangle, Eye, X } from "lucide-react";

type DeliveryStatus = "preparing" | "shipped" | "in_transit" | "out_for_delivery" | "delivered" | "failed";
interface Delivery {
  id: string; orderId: string; client: string; phone: string; address: string; city: string;
  carrier: string; trackingCode: string; status: DeliveryStatus; estimatedDate: string;
  shippedAt: string; deliveredAt?: string; weight: string;
}

const STATUS: Record<DeliveryStatus, { label: string; color: string; step: number }> = {
  preparing: { label: "Préparation", color: "#9CA3AF", step: 1 },
  shipped: { label: "Expédiée", color: "#3B82F6", step: 2 },
  in_transit: { label: "En transit", color: "#8B5CF6", step: 3 },
  out_for_delivery: { label: "En livraison", color: "#F59E0B", step: 4 },
  delivered: { label: "Livrée", color: "#10B981", step: 5 },
  failed: { label: "Échouée", color: "#EF4444", step: 0 },
};

const DELIVERIES: Delivery[] = [
  { id: "LIV-001", orderId: "CMD-0342", client: "Karim Benali", phone: "0555 12 34 56", address: "12 Rue Boudiaf, Centre", city: "Bordj Bou Arréridj", carrier: "Yalidine", trackingCode: "YAL-98765432", status: "out_for_delivery", estimatedDate: "2026-03-27", shippedAt: "2026-03-25", weight: "45 kg" },
  { id: "LIV-002", orderId: "CMD-0341", client: "Amina Zerrouki", phone: "0661 98 76 54", address: "Cité 300 logements", city: "Bordj Bou Arréridj", carrier: "Maystro", trackingCode: "MAY-12345678", status: "delivered", estimatedDate: "2026-03-26", shippedAt: "2026-03-24", deliveredAt: "2026-03-26", weight: "68 kg" },
  { id: "LIV-003", orderId: "CMD-0340", client: "Youcef Hadji", phone: "0770 45 67 89", address: "Lotissement Chaâbani", city: "Sétif", carrier: "Yalidine", trackingCode: "YAL-55566677", status: "in_transit", estimatedDate: "2026-03-29", shippedAt: "2026-03-26", weight: "85 kg" },
  { id: "LIV-004", orderId: "CMD-0339", client: "Meriem Bouazza", phone: "0550 11 22 33", address: "Cité AADL, Bt 12", city: "Bordj Bou Arréridj", carrier: "Maystro", trackingCode: "MAY-88899900", status: "delivered", estimatedDate: "2026-03-25", shippedAt: "2026-03-23", deliveredAt: "2026-03-25", weight: "4 kg" },
  { id: "LIV-005", orderId: "CMD-0338", client: "Omar Ferhat", phone: "0699 44 55 66", address: "Hai El Nasr", city: "M'sila", carrier: "Yalidine", trackingCode: "YAL-22233344", status: "shipped", estimatedDate: "2026-03-30", shippedAt: "2026-03-27", weight: "52 kg" },
  { id: "LIV-006", orderId: "CMD-0337", client: "Nadia Slimani", phone: "0555 77 88 99", address: "23 Bd de l'ALN", city: "Béjaïa", carrier: "Ecotrack", trackingCode: "ECO-44455566", status: "failed", estimatedDate: "2026-03-26", shippedAt: "2026-03-24", weight: "70 kg" },
  { id: "LIV-007", orderId: "CMD-0336", client: "Sofiane Mebarki", phone: "0661 00 11 22", address: "Rue des Frères Menaa", city: "Bordj Bou Arréridj", carrier: "Yalidine", trackingCode: "YAL-77788899", status: "preparing", estimatedDate: "2026-04-01", shippedAt: "", weight: "92 kg" },
  { id: "LIV-008", orderId: "CMD-0335", client: "Fatima Cherifi", phone: "0770 33 44 55", address: "Cité 1000 logements", city: "Alger", carrier: "Maystro", trackingCode: "MAY-11100022", status: "in_transit", estimatedDate: "2026-03-30", shippedAt: "2026-03-26", weight: "6 kg" },
];

function TrackingDetail({ d, onClose }: { d: Delivery; onClose: () => void }) {
  const st = STATUS[d.status];
  const steps = ["Préparation", "Expédiée", "En transit", "En livraison", "Livrée"];
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <div>
            <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Suivi {d.id}</h2>
            <p className="text-[12px] text-[#9CA3AF]">{d.trackingCode}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3 space-y-1">
              <p className="text-[#9CA3AF]">Client</p>
              <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{d.client}</p>
              <p className="text-[#6B7280]">{d.phone}</p>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-white/5 rounded-xl p-3 space-y-1">
              <p className="text-[#9CA3AF]">Destination</p>
              <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{d.city}</p>
              <p className="text-[#6B7280]">{d.address}</p>
            </div>
          </div>
          {/* Timeline */}
          {d.status !== "failed" ? (
            <div className="space-y-0">
              {steps.map((s, i) => {
                const done = i < st.step;
                const current = i === st.step - 1;
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#FF6B35]" : "bg-[#E5E7EB] dark:bg-white/10"}`}>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      {i < steps.length - 1 && <div className={`w-0.5 h-8 ${done && i < st.step - 1 ? "bg-[#FF6B35]" : "bg-[#E5E7EB] dark:bg-white/10"}`} />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-[13px] ${current ? "text-[#FF6B35]" : done ? "text-[#1A2332] dark:text-white" : "text-[#9CA3AF]"}`} style={{ fontWeight: current ? 600 : 400 }}>{s}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-[#EF4444]/10">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <p className="text-[13px] text-[#EF4444]">Livraison échouée — Client absent. Nouvelle tentative planifiée.</p>
            </div>
          )}
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}>Contacter le livreur</button>
            <button className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>Replanifier</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDeliveries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<Delivery | null>(null);

  const filtered = useMemo(() => {
    let list = [...DELIVERIES];
    if (search) { const q = search.toLowerCase(); list = list.filter((d) => d.client.toLowerCase().includes(q) || d.orderId.toLowerCase().includes(q) || d.trackingCode.toLowerCase().includes(q)); }
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    return list;
  }, [search, statusFilter]);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "En cours", value: DELIVERIES.filter((d) => !["delivered", "failed"].includes(d.status)).length, icon: Truck, color: "#3B82F6" },
          { label: "Livrées", value: DELIVERIES.filter((d) => d.status === "delivered").length, icon: CheckCircle2, color: "#10B981" },
          { label: "Échouées", value: DELIVERIES.filter((d) => d.status === "failed").length, icon: AlertTriangle, color: "#EF4444" },
          { label: "En préparation", value: DELIVERIES.filter((d) => d.status === "preparing").length, icon: Package, color: "#F59E0B" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}><k.icon className="w-4 h-4" style={{ color: k.color }} /></div>
            <div><p className="text-[11px] text-[#9CA3AF]">{k.label}</p><p className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{k.value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par client, commande ou tracking..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none">
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                {["Livraison", "Client", "Destination", "Transporteur", "Poids", "Estimation", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const st = STATUS[d.status];
                return (
                  <tr key={d.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{d.id}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{d.orderId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{d.client}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{d.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{d.city}</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate max-w-[150px]">{d.address}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">{d.carrier}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{d.weight}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{new Date(d.estimatedDate).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" })}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDetail(d)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35]"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {detail && <TrackingDetail d={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
