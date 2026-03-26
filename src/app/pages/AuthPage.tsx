import { useState } from "react";
import { Link } from "react-router";
import { IMAGES } from "../data/store";

export function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Visual */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={IMAGES.kitchen} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/90 to-[#1A1A2E]/40 flex items-center">
          <div className="px-12 max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#E8400C] flex items-center justify-center">
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>EH</span>
              </div>
              <span className="text-white text-lg" style={{ fontWeight: 600 }}>ElectroHome</span>
            </div>
            <h2 className="text-white text-3xl mb-3" style={{ fontWeight: 700 }}>Bienvenue chez ElectroHome</h2>
            <p className="text-white/70">Créez votre compte pour profiter de nos offres exclusives, suivre vos commandes et gérer vos favoris.</p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex mb-8 bg-muted rounded-xl p-1">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-colors ${tab === "login" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              style={{ fontWeight: tab === "login" ? 600 : 400 }}
            >
              Connexion
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-colors ${tab === "register" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              style={{ fontWeight: tab === "register" ? 600 : 400 }}
            >
              Créer un compte
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {tab === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">Prénom</label>
                  <input placeholder="Jean" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Nom</label>
                  <input placeholder="Dupont" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input type="email" placeholder="jean@email.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
            </div>
            <div>
              <label className="text-sm mb-1 block">Mot de passe</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
            </div>
            {tab === "login" && (
              <div className="flex justify-end">
                <button className="text-xs text-[#E8400C] hover:underline">Mot de passe oublié ?</button>
              </div>
            )}
            <button className="w-full px-6 py-3 rounded-lg bg-[#E8400C] text-white hover:opacity-90 transition-opacity">
              {tab === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-background text-xs text-muted-foreground">ou continuer avec</span></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
