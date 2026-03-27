import { useState, useMemo } from "react";
import {
  Search, Eye, X, Plus, Edit3, Trash2, FileText, Calendar, User,
  Tag, Clock, TrendingUp, MessageSquare, BarChart3, Image,
  ExternalLink, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight
} from "lucide-react";
import { IMAGES } from "../../data/store";

// ─── Types ───
type PostStatus = "published" | "draft" | "scheduled" | "archived";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: PostStatus;
  image: string;
  createdAt: string;
  publishedAt: string;
  views: number;
  comments: number;
  readTime: number;
  featured: boolean;
}

const STATUS_CONFIG: Record<PostStatus, { label: string; color: string }> = {
  published: { label: "Publié", color: "#10B981" },
  draft: { label: "Brouillon", color: "#9CA3AF" },
  scheduled: { label: "Planifié", color: "#3B82F6" },
  archived: { label: "Archivé", color: "#6B7280" },
};

const CATEGORIES = [
  "Guides d'achat", "Conseils entretien", "Nouveautés", "Comparatifs", "Actualités", "Cuisine & Recettes"
];

// ─── Mock Data ───
const MOCK_POSTS: BlogPost[] = [
  {
    id: "ART-001", title: "Comment choisir son réfrigérateur en 2026 : Guide complet",
    slug: "choisir-refrigerateur-2026", category: "Guides d'achat",
    excerpt: "Découvrez tous les critères essentiels pour choisir le réfrigérateur parfait : capacité, classe énergétique, type de froid, dimensions et budget.",
    content: "", tags: ["réfrigérateur", "guide", "2026"], author: "Karim Bensalem",
    status: "published", image: IMAGES.fridge, createdAt: "2026-03-10", publishedAt: "2026-03-12",
    views: 2450, comments: 18, readTime: 8, featured: true,
  },
  {
    id: "ART-002", title: "10 astuces pour réduire la consommation d'énergie de vos appareils",
    slug: "astuces-economie-energie", category: "Conseils entretien",
    excerpt: "Apprenez à réduire votre facture d'électricité avec ces 10 astuces simples pour optimiser la consommation de vos électroménagers.",
    content: "", tags: ["économie", "énergie", "astuces"], author: "Amina Zerhouni",
    status: "published", image: IMAGES.blog3, createdAt: "2026-03-05", publishedAt: "2026-03-06",
    views: 1890, comments: 12, readTime: 6, featured: true,
  },
  {
    id: "ART-003", title: "Comparatif des meilleurs climatiseurs inverter pour l'été 2026",
    slug: "comparatif-climatiseurs-2026", category: "Comparatifs",
    excerpt: "Nous avons testé et comparé les 5 meilleurs climatiseurs inverter disponibles à Bordj Bou Arréridj. Voici notre verdict.",
    content: "", tags: ["climatiseur", "comparatif", "inverter"], author: "Karim Bensalem",
    status: "published", image: IMAGES.ac, createdAt: "2026-02-28", publishedAt: "2026-03-01",
    views: 3200, comments: 25, readTime: 10, featured: false,
  },
  {
    id: "ART-004", title: "Guide d'entretien de votre lave-linge : durée de vie doublée",
    slug: "entretien-lave-linge", category: "Conseils entretien",
    excerpt: "Suivez ces conseils d'entretien professionnels pour prolonger la durée de vie de votre machine à laver et éviter les pannes coûteuses.",
    content: "", tags: ["lave-linge", "entretien", "durée de vie"], author: "Amina Zerhouni",
    status: "published", image: IMAGES.washer, createdAt: "2026-02-20", publishedAt: "2026-02-22",
    views: 1560, comments: 8, readTime: 7, featured: false,
  },
  {
    id: "ART-005", title: "Nouveauté : La gamme Smart Home débarque chez ElectroHome",
    slug: "gamme-smart-home-electrohome", category: "Nouveautés",
    excerpt: "Découvrez notre nouvelle sélection d'appareils connectés : aspirateurs robots, thermostats intelligents et bien plus.",
    content: "", tags: ["smart home", "nouveauté", "connecté"], author: "Karim Bensalem",
    status: "scheduled", image: IMAGES.vacuum, createdAt: "2026-03-24", publishedAt: "2026-04-01",
    views: 0, comments: 0, readTime: 5, featured: false,
  },
  {
    id: "ART-006", title: "Rénovation cuisine 2026 : les tendances électroménager",
    slug: "tendances-cuisine-2026", category: "Cuisine & Recettes",
    excerpt: "Cuisine ouverte, four vapeur, plaque induction... Découvrez les grandes tendances pour aménager votre cuisine cette année.",
    content: "", tags: ["cuisine", "tendances", "2026"], author: "Amina Zerhouni",
    status: "draft", image: IMAGES.blog2, createdAt: "2026-03-22", publishedAt: "",
    views: 0, comments: 0, readTime: 9, featured: false,
  },
  {
    id: "ART-007", title: "ElectroHome ouvre un nouveau showroom à Bordj Bou Arréridj",
    slug: "nouveau-showroom-bba", category: "Actualités",
    excerpt: "Nous sommes fiers d'annoncer l'ouverture de notre nouveau showroom au centre-ville de BBA. Venez découvrir nos produits en personne !",
    content: "", tags: ["showroom", "BBA", "ouverture"], author: "Karim Bensalem",
    status: "draft", image: IMAGES.store, createdAt: "2026-03-20", publishedAt: "",
    views: 0, comments: 0, readTime: 3, featured: false,
  },
  {
    id: "ART-008", title: "Les meilleurs lave-vaisselle pour familles nombreuses",
    slug: "lave-vaisselle-familles", category: "Guides d'achat",
    excerpt: "Retrouvez notre sélection des lave-vaisselle offrant les meilleures capacités et performances pour les grandes familles.",
    content: "", tags: ["lave-vaisselle", "famille", "guide"], author: "Amina Zerhouni",
    status: "archived", image: IMAGES.dishwasher, createdAt: "2025-12-15", publishedAt: "2025-12-18",
    views: 890, comments: 4, readTime: 7, featured: false,
  },
];

function formatDate(date: string) { return date ? new Date(date).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" }) : "—"; }

// ─── Post Form Modal ───
function PostFormModal({ post, onClose, onSave }: { post?: BlogPost | null; onClose: () => void; onSave: (p: BlogPost) => void }) {
  const isEdit = !!post;
  const [form, setForm] = useState({
    title: post?.title || "",
    category: post?.category || CATEGORIES[0],
    excerpt: post?.excerpt || "",
    tags: post?.tags.join(", ") || "",
    status: post?.status || "draft" as PostStatus,
    featured: post?.featured || false,
    readTime: post?.readTime || 5,
  });

  const handleSave = () => {
    onSave({
      id: post?.id || "ART-" + String(Date.now()).slice(-3),
      title: form.title,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
      excerpt: form.excerpt,
      content: post?.content || "",
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      author: post?.author || "Karim Bensalem",
      status: form.status as PostStatus,
      image: post?.image || IMAGES.blog1,
      createdAt: post?.createdAt || new Date().toISOString().split("T")[0],
      publishedAt: form.status === "published" ? new Date().toISOString().split("T")[0] : post?.publishedAt || "",
      views: post?.views || 0,
      comments: post?.comments || 0,
      readTime: form.readTime,
      featured: form.featured,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" style={{ fontFamily: "'Sora', sans-serif" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
          <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Titre de l'article</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" placeholder="Ex: Guide d'achat réfrigérateur 2026" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Extrait</label>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] resize-none" />
          </div>
          <div>
            <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Tags (séparés par des virgules)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" placeholder="Ex: guide, réfrigérateur, 2026" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">Temps de lecture (min)</label>
              <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: +e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]" />
            </div>
            <div className="flex items-end">
              <button onClick={() => setForm({ ...form, featured: !form.featured })} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] w-full hover:border-[#FF6B35] transition-colors">
                {form.featured ? <ToggleRight className="w-5 h-5 text-[#FF6B35]" /> : <ToggleLeft className="w-5 h-5" />}
                <span className={form.featured ? "text-[#FF6B35]" : ""} style={{ fontWeight: form.featured ? 500 : 400 }}>Article vedette</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-[#E5E7EB] dark:border-white/10">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-white/5" style={{ fontWeight: 500 }}>Annuler</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
            {isEdit ? "Enregistrer" : "Créer l'article"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───
export function AdminBlog() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formModal, setFormModal] = useState<BlogPost | null | "new">(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const perPage = 6;

  // KPIs
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const filtered = useMemo(() => {
    let list = [...posts];
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))); }
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [posts, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSavePost = (p: BlogPost) => {
    setPosts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = p; return n; }
      return [p, ...prev];
    });
    setFormModal(null);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Articles publiés", value: publishedCount, icon: FileText, color: "#10B981" },
          { label: "Vues totales", value: totalViews.toLocaleString("fr-DZ"), icon: Eye, color: "#3B82F6" },
          { label: "Commentaires", value: totalComments, icon: MessageSquare, color: "#8B5CF6" },
          { label: "Brouillons", value: draftCount, icon: Edit3, color: "#F59E0B" },
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
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher un article..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] outline-none text-[#1A2332] dark:text-white placeholder:text-[#9CA3AF] focus:border-[#FF6B35]" />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="all">Toutes les catégories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#F3F4F6] dark:bg-white/10 rounded-lg p-0.5">
              {(["grid", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-[12px] transition-colors ${view === v ? "bg-white dark:bg-[#2A2A32] text-[#1A2332] dark:text-white shadow-sm" : "text-[#9CA3AF]"}`} style={{ fontWeight: view === v ? 500 : 400 }}>
                  {v === "grid" ? "Grille" : "Liste"}
                </button>
              ))}
            </div>
            <button onClick={() => setFormModal("new")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
              <Plus className="w-4 h-4" /> Nouvel article
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mt-3">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((p) => {
            const st = STATUS_CONFIG[p.status];
            return (
              <div key={p.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/60 text-white backdrop-blur-sm" style={{ fontWeight: 500 }}>
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FF6B35] text-white" style={{ fontWeight: 500 }}>★ Vedette</span>
                    )}
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] backdrop-blur-sm" style={{ fontWeight: 500, backgroundColor: st.color + "20", color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-[14px] text-[#1A2332] dark:text-white line-clamp-2" style={{ fontWeight: 600 }}>{p.title}</h3>
                  <p className="text-[12px] text-[#9CA3AF] line-clamp-2">{p.excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF] pt-1">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.author.split(" ")[0]}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.createdAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.readTime} min</span>
                  </div>
                  {p.views > 0 && (
                    <div className="flex items-center gap-3 text-[11px] text-[#6B7280] pt-1">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views.toLocaleString("fr-DZ")} vues</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.comments} com.</span>
                    </div>
                  )}
                  <div className="flex gap-1.5 pt-2">
                    <button onClick={() => setFormModal(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors" style={{ fontWeight: 500 }}>
                      <Edit3 className="w-3 h-3" /> Modifier
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-9 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Article</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Catégorie</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Auteur</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Vues</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const st = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F3F4F6]">
                            <img src={p.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#1A2332] dark:text-white truncate max-w-[250px]" style={{ fontWeight: 500 }}>{p.title}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{p.readTime} min · {p.comments} com.</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#6B7280] dark:text-white/50">{p.category}</td>
                      <td className="px-4 py-3 text-[12px] text-[#6B7280] dark:text-white/50">{p.author}</td>
                      <td className="px-4 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{p.views > 0 ? p.views.toLocaleString("fr-DZ") : "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: st.color + "15", color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setFormModal(p)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#9CA3AF]">Page {page} sur {totalPages}</p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] flex items-center justify-center ${page === i + 1 ? "bg-[#FF6B35] text-white" : "text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-white/10"}`} style={{ fontWeight: page === i + 1 ? 600 : 400 }}>{i + 1}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#9CA3AF] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formModal !== null && (
        <PostFormModal
          post={formModal === "new" ? null : formModal}
          onClose={() => setFormModal(null)}
          onSave={handleSavePost}
        />
      )}
    </div>
  );
}
