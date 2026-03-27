import { useState, useMemo } from "react";
import { Search, Plus, Edit3, Phone, Mail, MapPin, Package, Eye, X, Globe, Star, Truck, Building2 } from "lucide-react";

interface Supplier {
  id: string; name: string; contact: string; email: string; phone: string;
  address: string; city: string; products: number; rating: number; active: boolean;
  categories: string[]; paymentTerms: string; deliveryDelay: string;
}

const SUPPLIERS: Supplier[] = [
  { id: "1", name: "Samsung Algérie", contact: "Kamel Bensalem", email: "contact@samsung.dz", phone: "+213 21 45 67 89", address: "Zone industrielle, Oued Smar", city: "Alger", products: 42, rating: 4.8, active: true, categories: ["Réfrigérateurs", "Machines à laver", "Climatiseurs"], paymentTerms: "30 jours", deliveryDelay: "5-7 jours" },
  { id: "2", name: "LG Algérie", contact: "Fatiha Mokrani", email: "b2b@lg-algerie.com", phone: "+213 21 34 56 78", address: "Route de Dar El Beida", city: "Alger", products: 38, rating: 4.6, active: true, categories: ["Réfrigérateurs", "Machines à laver", "Climatiseurs", "Aspirateurs"], paymentTerms: "30 jours", deliveryDelay: "5-8 jours" },
  { id: "3", name: "Condor Electronics", contact: "Nacer Benhamadouche", email: "pro@condor.dz", phone: "+213 35 72 34 56", address: "Zone industrielle", city: "Bordj Bou Arréridj", products: 28, rating: 4.3, active: true, categories: ["Climatiseurs", "Réfrigérateurs", "Petit électroménager"], paymentTerms: "15 jours", deliveryDelay: "1-2 jours" },
  { id: "4", name: "Brandt Algérie", contact: "Hichem Djeffal", email: "partenaires@brandt.dz", phone: "+213 21 67 89 01", address: "Zone Oued Smar", city: "Alger", products: 22, rating: 4.1, active: true, categories: ["Fours & Cuisinières", "Lave-vaisselle"], paymentTerms: "45 jours", deliveryDelay: "6-10 jours" },
  { id: "5", name: "SEB Group (Moulinex/Tefal)", contact: "Rachid Hammoudi", email: "algerie@groupeseb.com", phone: "+213 21 23 45 67", address: "Hydra Business Center", city: "Alger", products: 35, rating: 4.5, active: true, categories: ["Petit électroménager"], paymentTerms: "30 jours", deliveryDelay: "7-12 jours" },
  { id: "6", name: "Bosch Algérie", contact: "Leila Benmansour", email: "info@bosch.dz", phone: "+213 21 56 78 90", address: "Pins Maritimes", city: "Alger", products: 15, rating: 4.4, active: true, categories: ["Machines à laver", "Lave-vaisselle"], paymentTerms: "30 jours", deliveryDelay: "8-12 jours" },
  { id: "7", name: "Dyson Import", contact: "Mohamed Kermiche", email: "m.kermiche@dyson-import.dz", phone: "+213 555 12 34 56", address: "Bordj El Kiffan", city: "Alger", products: 8, rating: 3.8, active: false, categories: ["Aspirateurs"], paymentTerms: "Paiement avance", deliveryDelay: "15-20 jours" },
];

export function AdminSuppliers() {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    if (!search) return SUPPLIERS;
    const q = search.toLowerCase();
    return SUPPLIERS.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Fournisseurs actifs", value: SUPPLIERS.filter((s) => s.active).length, icon: Building2, color: "#FF6B35" },
          { label: "Produits sourcés", value: SUPPLIERS.reduce((s, f) => s + f.products, 0), icon: Package, color: "#3B82F6" },
          { label: "Note moyenne", value: (SUPPLIERS.reduce((s, f) => s + f.rating, 0) / SUPPLIERS.length).toFixed(1), icon: Star, color: "#F59E0B" },
          { label: "Local (BBA)", value: SUPPLIERS.filter((s) => s.city === "Bordj Bou Arréridj").length, icon: MapPin, color: "#10B981" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}><k.icon className="w-4 h-4" style={{ color: k.color }} /></div>
            <div><p className="text-[11px] text-[#9CA3AF]">{k.label}</p><p className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 700 }}>{k.value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un fournisseur..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#1E1E24] border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}><Plus className="w-4 h-4" /> Nouveau fournisseur</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className={`bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5 ${!s.active ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{s.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${s.active ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#6B7280]/15 text-[#6B7280]"}`} style={{ fontWeight: 500 }}>{s.active ? "Actif" : "Inactif"}</span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{s.contact}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F59E0B]" fill="#F59E0B" />
                <span className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{s.rating}</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[12px] text-[#6B7280] mb-3">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" /> {s.city}</p>
              <p className="flex items-center gap-2"><Package className="w-3.5 h-3.5 text-[#9CA3AF]" /> {s.products} produits</p>
              <p className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-[#9CA3AF]" /> Délai: {s.deliveryDelay}</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {s.categories.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-white/5 text-[10px] text-[#6B7280]">{c}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDetail(s)} className="flex-1 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors" style={{ fontWeight: 500 }}>Détails</button>
              <button className="flex-1 py-2 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] text-[12px] hover:bg-[#FF6B35] hover:text-white transition-colors" style={{ fontWeight: 500 }}>Commander</button>
            </div>
          </div>
        ))}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={() => setDetail(null)}>
          <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
              <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{detail.name}</h2>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3 text-[13px]">
              {[
                { icon: Mail, label: "Email", value: detail.email },
                { icon: Phone, label: "Téléphone", value: detail.phone },
                { icon: MapPin, label: "Adresse", value: `${detail.address}, ${detail.city}` },
                { icon: Package, label: "Produits", value: `${detail.products} références` },
                { icon: Truck, label: "Délai livraison", value: detail.deliveryDelay },
                { icon: Building2, label: "Conditions paiement", value: detail.paymentTerms },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-white/5">
                  <f.icon className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  <div><p className="text-[11px] text-[#9CA3AF]">{f.label}</p><p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{f.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
