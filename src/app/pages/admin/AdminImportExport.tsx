import { useState } from "react";
import { Upload, Download, FileText, Package, Users, ShoppingCart, Database, CheckCircle2, AlertTriangle, Clock, FileSpreadsheet, Archive } from "lucide-react";

interface ExportHistory {
  id: string; name: string; type: string; format: string; date: string; size: string; status: "success" | "failed";
}

const EXPORT_OPTIONS = [
  { key: "products", label: "Produits", desc: "Catalogue complet avec prix, stock et descriptions", icon: Package, color: "#FF6B35", count: 856 },
  { key: "orders", label: "Commandes", desc: "Historique des commandes avec détails clients", icon: ShoppingCart, color: "#3B82F6", count: 2430 },
  { key: "clients", label: "Clients", desc: "Base clients avec coordonnées et historique", icon: Users, color: "#10B981", count: 1247 },
  { key: "invoices", label: "Factures", desc: "Toutes les factures émises avec montants TTC", icon: FileText, color: "#8B5CF6", count: 2380 },
  { key: "stock", label: "Inventaire", desc: "État du stock avec SKU, seuils et fournisseurs", icon: Archive, color: "#F59E0B", count: 856 },
  { key: "all", label: "Export complet", desc: "Sauvegarde complète de toutes les données", icon: Database, color: "#EF4444", count: null },
];

const HISTORY: ExportHistory[] = [
  { id: "1", name: "Export Produits", type: "products", format: "Excel", date: "2026-03-27T10:30:00", size: "2.4 MB", status: "success" },
  { id: "2", name: "Export Commandes Mars", type: "orders", format: "CSV", date: "2026-03-26T15:00:00", size: "5.1 MB", status: "success" },
  { id: "3", name: "Export Clients", type: "clients", format: "Excel", date: "2026-03-25T09:00:00", size: "1.8 MB", status: "success" },
  { id: "4", name: "Sauvegarde complète", type: "all", format: "SQL", date: "2026-03-24T03:00:00", size: "245 MB", status: "success" },
  { id: "5", name: "Export Factures", type: "invoices", format: "PDF", date: "2026-03-23T14:30:00", size: "12.3 MB", status: "failed" },
];

export function AdminImportExport() {
  const [tab, setTab] = useState<"export" | "import">("export");
  const [selectedFormat, setSelectedFormat] = useState("excel");
  const [importing, setImporting] = useState(false);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="flex bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-1">
        {([["export", "Exporter", Download], ["import", "Importer", Upload]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-colors ${tab === key ? "bg-[#FF6B35] text-white" : "text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"}`}
            style={{ fontWeight: tab === key ? 600 : 400 }}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "export" && (
        <>
          {/* Format selector */}
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
            <p className="text-[12px] text-[#6B7280] mb-2">Format d'export :</p>
            <div className="flex gap-2">
              {[
                { key: "excel", label: "Excel (.xlsx)", icon: FileSpreadsheet },
                { key: "csv", label: "CSV (.csv)", icon: FileText },
                { key: "pdf", label: "PDF (.pdf)", icon: FileText },
              ].map((f) => (
                <button key={f.key} onClick={() => setSelectedFormat(f.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] border transition-colors ${selectedFormat === f.key ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]" : "border-[#E5E7EB] dark:border-white/10 text-[#6B7280]"}`}
                  style={{ fontWeight: selectedFormat === f.key ? 600 : 400 }}>
                  <f.icon className="w-4 h-4" /> {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPORT_OPTIONS.map((opt) => (
              <div key={opt.key} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: opt.color + "15" }}>
                    <opt.icon className="w-5 h-5" style={{ color: opt.color }} />
                  </div>
                  <div>
                    <h3 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{opt.label}</h3>
                    {opt.count && <p className="text-[11px] text-[#9CA3AF]">{opt.count.toLocaleString()} enregistrements</p>}
                  </div>
                </div>
                <p className="text-[12px] text-[#6B7280] mb-4">{opt.desc}</p>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] text-[12px] hover:bg-[#FF6B35] hover:text-white transition-colors" style={{ fontWeight: 600 }}>
                  <Download className="w-3.5 h-3.5" /> Exporter en {selectedFormat.toUpperCase()}
                </button>
              </div>
            ))}
          </div>

          {/* Export history */}
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
            <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Historique des exports</h3>
            <div className="space-y-2">
              {HISTORY.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    {h.status === "success" ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
                    <div>
                      <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{h.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{new Date(h.date).toLocaleString("fr-DZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} • {h.format} • {h.size}</p>
                    </div>
                  </div>
                  {h.status === "success" && (
                    <button className="px-3 py-1.5 rounded-lg text-[11px] text-[#3B82F6] hover:bg-[#3B82F6]/10" style={{ fontWeight: 500 }}>Télécharger</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "import" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
            <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-2" style={{ fontWeight: 600 }}>Importer des données</h3>
            <p className="text-[12px] text-[#6B7280] mb-4">Importez des produits ou des clients depuis un fichier Excel ou CSV.</p>
            
            <div className="border-2 border-dashed border-[#E5E7EB] dark:border-white/10 rounded-xl p-8 text-center hover:border-[#FF6B35] transition-colors cursor-pointer">
              <Upload className="w-10 h-10 mx-auto mb-3 text-[#9CA3AF]" />
              <p className="text-[14px] text-[#1A2332] dark:text-white mb-1" style={{ fontWeight: 500 }}>Glissez-déposez votre fichier ici</p>
              <p className="text-[12px] text-[#9CA3AF] mb-3">ou cliquez pour parcourir</p>
              <p className="text-[11px] text-[#9CA3AF]">Formats acceptés : .xlsx, .csv (max 10 MB)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
            <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-3" style={{ fontWeight: 600 }}>Modèles de fichiers</h3>
            <p className="text-[12px] text-[#6B7280] mb-4">Téléchargez un modèle pour formater correctement vos données avant l'import.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Modèle Produits", desc: "Colonnes: nom, prix, stock, catégorie, SKU" },
                { label: "Modèle Clients", desc: "Colonnes: nom, email, téléphone, ville" },
                { label: "Modèle Inventaire", desc: "Colonnes: SKU, stock, seuil, fournisseur" },
              ].map((m) => (
                <button key={m.label} className="p-4 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-left hover:border-[#FF6B35] transition-colors group">
                  <div className="flex items-center gap-2 mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                    <p className="text-[13px] text-[#1A2332] dark:text-white group-hover:text-[#FF6B35]" style={{ fontWeight: 500 }}>{m.label}</p>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#92400E] dark:text-[#FCD34D]">
              <p style={{ fontWeight: 600 }}>Attention</p>
              <p>L'import remplacera les données existantes pour les SKU/emails identiques. Faites une sauvegarde avant d'importer.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
