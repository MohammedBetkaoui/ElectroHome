import { useState } from "react";
import { Shield, Users, Plus, Edit3, Trash2, CheckCircle2, X, Eye, Lock, Settings, Package, ShoppingCart, Megaphone, FileText, Headphones } from "lucide-react";

interface Role {
  id: string; name: string; description: string; color: string; usersCount: number;
  permissions: string[];
}

interface AdminUser {
  id: string; name: string; email: string; role: string; avatar: string; lastLogin: string; active: boolean;
}

const PERMISSIONS = [
  { key: "dashboard.view", label: "Voir le dashboard", group: "Dashboard" },
  { key: "products.view", label: "Voir les produits", group: "Produits" },
  { key: "products.edit", label: "Modifier les produits", group: "Produits" },
  { key: "products.delete", label: "Supprimer les produits", group: "Produits" },
  { key: "orders.view", label: "Voir les commandes", group: "Commandes" },
  { key: "orders.edit", label: "Modifier les commandes", group: "Commandes" },
  { key: "clients.view", label: "Voir les clients", group: "Clients" },
  { key: "clients.edit", label: "Modifier les clients", group: "Clients" },
  { key: "marketing.view", label: "Voir le marketing", group: "Marketing" },
  { key: "marketing.edit", label: "Gérer les campagnes", group: "Marketing" },
  { key: "blog.view", label: "Voir le blog", group: "Blog" },
  { key: "blog.edit", label: "Gérer les articles", group: "Blog" },
  { key: "support.view", label: "Voir le support", group: "Support" },
  { key: "support.respond", label: "Répondre aux tickets", group: "Support" },
  { key: "settings.view", label: "Voir les paramètres", group: "Système" },
  { key: "settings.edit", label: "Modifier les paramètres", group: "Système" },
  { key: "users.manage", label: "Gérer les utilisateurs admin", group: "Système" },
];

const ROLES: Role[] = [
  { id: "1", name: "Super Admin", description: "Accès complet à toutes les fonctionnalités", color: "#FF6B35", usersCount: 1, permissions: PERMISSIONS.map((p) => p.key) },
  { id: "2", name: "Gestionnaire", description: "Gestion des produits, commandes et clients", color: "#3B82F6", usersCount: 2, permissions: ["dashboard.view", "products.view", "products.edit", "orders.view", "orders.edit", "clients.view", "clients.edit", "support.view", "support.respond"] },
  { id: "3", name: "Marketing", description: "Gestion des campagnes, blog et promotions", color: "#8B5CF6", usersCount: 1, permissions: ["dashboard.view", "marketing.view", "marketing.edit", "blog.view", "blog.edit"] },
  { id: "4", name: "Support", description: "Gestion des tickets et consultation des commandes", color: "#10B981", usersCount: 2, permissions: ["dashboard.view", "orders.view", "clients.view", "support.view", "support.respond"] },
  { id: "5", name: "Lecture seule", description: "Consultation uniquement, aucune modification", color: "#9CA3AF", usersCount: 0, permissions: ["dashboard.view", "products.view", "orders.view", "clients.view"] },
];

const USERS: AdminUser[] = [
  { id: "1", name: "Ahmed Karim", email: "a.karim@electrohome-bba.dz", role: "Super Admin", avatar: "AK", lastLogin: "27 mars 2026, 09:15", active: true },
  { id: "2", name: "Yacine Meziane", email: "y.meziane@electrohome-bba.dz", role: "Gestionnaire", avatar: "YM", lastLogin: "26 mars 2026, 17:30", active: true },
  { id: "3", name: "Sara Khelifi", email: "s.khelifi@electrohome-bba.dz", role: "Support", avatar: "SK", lastLogin: "26 mars 2026, 16:45", active: true },
  { id: "4", name: "Nadia Boussaad", email: "n.boussaad@electrohome-bba.dz", role: "Marketing", avatar: "NB", lastLogin: "25 mars 2026, 14:00", active: true },
  { id: "5", name: "Reda Bouzid", email: "r.bouzid@electrohome-bba.dz", role: "Gestionnaire", avatar: "RB", lastLogin: "24 mars 2026, 10:20", active: false },
  { id: "6", name: "Lina Amrani", email: "l.amrani@electrohome-bba.dz", role: "Support", avatar: "LA", lastLogin: "27 mars 2026, 08:50", active: true },
];

export function AdminRoles() {
  const [tab, setTab] = useState<"roles" | "users">("roles");
  const [detailRole, setDetailRole] = useState<Role | null>(null);

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-1">
          {([["roles", "Rôles", Shield], ["users", "Utilisateurs", Users]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-colors ${tab === key ? "bg-[#FF6B35] text-white" : "text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"}`}
              style={{ fontWeight: tab === key ? 600 : 400 }}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B]" style={{ fontWeight: 600 }}>
          <Plus className="w-4 h-4" /> {tab === "roles" ? "Nouveau rôle" : "Nouvel utilisateur"}
        </button>
      </div>

      {tab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <div key={role.id} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color + "15" }}>
                    <Shield className="w-4 h-4" style={{ color: role.color }} />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{role.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{role.usersCount} utilisateur(s)</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setDetailRole(role)} className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B35]"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-[12px] text-[#6B7280] dark:text-white/50">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 5).map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-white/5 text-[10px] text-[#6B7280]">{PERMISSIONS.find((pp) => pp.key === p)?.label}</span>
                ))}
                {role.permissions.length > 5 && <span className="px-2 py-0.5 rounded-full bg-[#FF6B35]/10 text-[10px] text-[#FF6B35]" style={{ fontWeight: 500 }}>+{role.permissions.length - 5}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-white/10 bg-[#F9FAFB] dark:bg-white/5">
                  {["Utilisateur", "Rôle", "Dernière connexion", "Statut", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map((u) => {
                  const role = ROLES.find((r) => r.name === u.role);
                  return (
                    <tr key={u.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] text-white shrink-0" style={{ backgroundColor: role?.color || "#9CA3AF", fontWeight: 600 }}>{u.avatar}</div>
                        <div><p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{u.name}</p><p className="text-[11px] text-[#9CA3AF]">{u.email}</p></div>
                      </td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-[11px]" style={{ fontWeight: 500, backgroundColor: (role?.color || "#9CA3AF") + "15", color: role?.color || "#9CA3AF" }}>{u.role}</span></td>
                      <td className="px-4 py-3 text-[12px] text-[#6B7280]">{u.lastLogin}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${u.active ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#6B7280]/15 text-[#6B7280]"}`} style={{ fontWeight: 500 }}>{u.active ? "Actif" : "Inactif"}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#3B82F6]"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button className="w-7 h-7 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {detailRole && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-8 overflow-y-auto" onClick={() => setDetailRole(null)}>
          <div className="bg-white dark:bg-[#1E1E24] rounded-2xl w-full max-w-lg shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: detailRole.color + "15" }}><Shield className="w-4 h-4" style={{ color: detailRole.color }} /></div>
                <h2 className="text-[17px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{detailRole.name}</h2>
              </div>
              <button onClick={() => setDetailRole(null)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[#6B7280]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-[#6B7280] mb-4">{detailRole.description}</p>
              <h3 className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-3" style={{ fontWeight: 500 }}>Permissions ({detailRole.permissions.length})</h3>
              <div className="space-y-2">
                {[...new Set(PERMISSIONS.filter((p) => detailRole.permissions.includes(p.key)).map((p) => p.group))].map((group) => (
                  <div key={group}>
                    <p className="text-[11px] text-[#6B7280] mb-1" style={{ fontWeight: 600 }}>{group}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                        <span key={p.key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${detailRole.permissions.includes(p.key) ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444] line-through"}`} style={{ fontWeight: 500 }}>
                          {detailRole.permissions.includes(p.key) ? <CheckCircle2 className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
