import { useState } from "react";
import { Search, Plus, Edit3, Trash2, Grid3X3, ChevronRight, Eye, Package, ToggleRight, ToggleLeft, X } from "lucide-react";

interface Category {
  id: string; name: string; slug: string; description: string; parent: string | null;
  productCount: number; enabled: boolean; order: number; icon: string;
}

const CATEGORIES: Category[] = [
  { id: "1", name: "Réfrigérateurs", slug: "refrigerateurs", description: "Réfrigérateurs, congélateurs et combinés", parent: null, productCount: 48, enabled: true, order: 1, icon: "🧊" },
  { id: "2", name: "Machines à laver", slug: "machines-a-laver", description: "Lave-linge, sèche-linge et lave-linge séchant", parent: null, productCount: 36, enabled: true, order: 2, icon: "🫧" },
  { id: "3", name: "Climatiseurs", slug: "climatiseurs", description: "Climatiseurs split, mobiles et centralisés", parent: null, productCount: 28, enabled: true, order: 3, icon: "❄️" },
  { id: "4", name: "Fours & Cuisinières", slug: "fours-cuisinieres", description: "Cuisinières, fours encastrables et plaques", parent: null, productCount: 32, enabled: true, order: 4, icon: "🍳" },
  { id: "5", name: "Petit électroménager", slug: "petit-electromenager", description: "Robots, blenders, cafetières et plus", parent: null, productCount: 85, enabled: true, order: 5, icon: "🔌" },
  { id: "6", name: "Aspirateurs", slug: "aspirateurs", description: "Aspirateurs traîneaux, balais et robots", parent: null, productCount: 22, enabled: true, order: 6, icon: "🧹" },
  { id: "7", name: "Lave-vaisselle", slug: "lave-vaisselle", description: "Lave-vaisselle encastrables et pose libre", parent: null, productCount: 15, enabled: true, order: 7, icon: "🍽️" },
  { id: "8", name: "Chauffage", slug: "chauffage", description: "Radiateurs, chauffe-eau et poêles", parent: null, productCount: 18, enabled: false, order: 8, icon: "🔥" },
  { id: "9", name: "Réfrigérateurs américains", slug: "refrigerateurs-americains", description: "Side-by-side et French Door", parent: "1", productCount: 12, enabled: true, order: 1, icon: "🧊" },
  { id: "10", name: "Congélateurs coffre", slug: "congelateurs-coffre", description: "Congélateurs horizontaux", parent: "1", productCount: 8, enabled: true, order: 2, icon: "🧊" },
];

export function AdminCategories() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const parents = CATEGORIES.filter((c) => !c.parent);
  const filtered = search ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : CATEGORIES;
  const rootCats = filtered.filter((c) => !c.parent);
  const getChildren = (parentId: string) => filtered.filter((c) => c.parent === parentId);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Catégories", value: parents.length, icon: Grid3X3, color: "#FF6B35" },
          { label: "Sous-catégories", value: CATEGORIES.filter((c) => c.parent).length, icon: ChevronRight, color: "#3B82F6" },
          { label: "Total produits", value: CATEGORIES.reduce((s, c) => s + c.productCount, 0), icon: Package, color: "#10B981" },
          { label: "Actives", value: CATEGORIES.filter((c) => c.enabled).length, icon: Eye, color: "#8B5CF6" },
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une catégorie..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#1E1E24] border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
        </div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}><Plus className="w-4 h-4" /> Nouvelle catégorie</button>
      </div>

      <div className="space-y-3">
        {rootCats.map((cat) => {
          const children = getChildren(cat.id);
          return (
            <div key={cat.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-[24px]">{cat.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{cat.name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-[10px]" style={{ fontWeight: 600 }}>{cat.productCount} produits</span>
                    </div>
                    <p className="text-[12px] text-[#9CA3AF]">{cat.description}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cat.enabled ? <ToggleRight className="w-7 h-5 text-[#10B981]" /> : <ToggleLeft className="w-7 h-5 text-[#9CA3AF]" />}
                  <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-4 h-4" /></button>
                  <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {children.length > 0 && (
                <div className="border-t border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                  {children.map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between px-4 py-3 pl-14 border-b last:border-b-0 border-[#E5E7EB]/50 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
                        <span className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{ch.name}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{ch.productCount} produits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={() => setFormOpen(false)}>
          <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
              <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>Nouvelle catégorie</h2>
              <button onClick={() => setFormOpen(false)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] text-[#6B7280] mb-1.5">Nom</label><input className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none focus:border-[#FF6B35]" placeholder="Ex: Robots cuiseurs" /></div>
              <div><label className="block text-[12px] text-[#6B7280] mb-1.5">Slug (URL)</label><input className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none focus:border-[#FF6B35]" placeholder="robots-cuiseurs" /></div>
              <div><label className="block text-[12px] text-[#6B7280] mb-1.5">Catégorie parente</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none focus:border-[#FF6B35]">
                  <option value="">Aucune (catégorie principale)</option>
                  {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label className="block text-[12px] text-[#6B7280] mb-1.5">Description</label><textarea rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none focus:border-[#FF6B35] resize-none" /></div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t border-[#E5E7EB] dark:border-white/10">
              <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#6B7280]">Annuler</button>
              <button className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
