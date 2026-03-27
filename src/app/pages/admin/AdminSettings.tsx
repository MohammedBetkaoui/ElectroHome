import { useState } from "react";
import {
  Settings, Store, Truck, CreditCard, Bell, Globe, Shield, Wrench,
  Save, MapPin, Phone, Mail, Clock, Eye, EyeOff, Upload,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Info,
  Palette, Database, Users, FileText, Lock, Wifi, Server, Zap
} from "lucide-react";

// ─── Types ───
type SettingsTab = "general" | "store" | "shipping" | "payment" | "notifications" | "seo" | "security" | "maintenance";

const TABS: { key: SettingsTab; label: string; icon: any }[] = [
  { key: "general", label: "Général", icon: Settings },
  { key: "store", label: "Boutique", icon: Store },
  { key: "shipping", label: "Livraison", icon: Truck },
  { key: "payment", label: "Paiement", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "seo", label: "SEO", icon: Globe },
  { key: "security", label: "Sécurité", icon: Shield },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
];

// ─── Shared Components ───
function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5 space-y-4">
      <div>
        <h3 className="text-[14px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{title}</h3>
        {desc && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[12px] text-[#6B7280] dark:text-white/50 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[#9CA3AF] mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled = false }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!enabled)} className="flex items-center gap-3 w-full">
      {enabled ? <ToggleRight className="w-8 h-5 text-[#FF6B35] shrink-0" /> : <ToggleLeft className="w-8 h-5 text-[#9CA3AF] shrink-0" />}
      <span className="text-[13px] text-[#1A2332] dark:text-white text-left">{label}</span>
    </button>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { onSave(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="flex justify-end">
      <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-[13px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Enregistré !</> : <><Save className="w-4 h-4" /> Enregistrer</>}
      </button>
    </div>
  );
}

// ─── Tab: General ───
function GeneralTab() {
  const [siteName, setSiteName] = useState("ElectroHome");
  const [tagline, setTagline] = useState("Votre expert en électroménager à Bordj Bou Arréridj");
  const [email, setEmail] = useState("contact@electrohome-bba.dz");
  const [phone, setPhone] = useState("+213 35 68 12 34");
  const [address, setAddress] = useState("Rue Mohamed Boudiaf, Centre-ville, Bordj Bou Arréridj 34000");
  const [timezone, setTimezone] = useState("Africa/Algiers");
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("DZD");

  return (
    <div className="space-y-4">
      <Card title="Informations du site" desc="Paramètres généraux de la plateforme ElectroHome.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom du site"><Input value={siteName} onChange={setSiteName} /></Field>
          <Field label="Slogan"><Input value={tagline} onChange={setTagline} /></Field>
          <Field label="Email de contact"><Input value={email} onChange={setEmail} type="email" /></Field>
          <Field label="Téléphone"><Input value={phone} onChange={setPhone} /></Field>
        </div>
        <Field label="Adresse physique"><Input value={address} onChange={setAddress} /></Field>
      </Card>
      <Card title="Localisation" desc="Paramètres régionaux et fuseau horaire.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Fuseau horaire">
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="Africa/Algiers">Alger (UTC+1)</option>
            </select>
          </Field>
          <Field label="Langue par défaut">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="fr">Français</option>
              <option value="ar">Arabe</option>
            </select>
          </Field>
          <Field label="Devise">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="DZD">Dinar Algérien (DA)</option>
            </select>
          </Field>
        </div>
      </Card>
      <Card title="Logo & Branding" desc="Identité visuelle de la boutique.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Logo principal">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#1A2332] flex items-center justify-center">
                <span className="text-white text-[18px]" style={{ fontWeight: 700 }}>EH</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors">
                <Upload className="w-3.5 h-3.5" /> Changer le logo
              </button>
            </div>
          </Field>
          <Field label="Favicon">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[12px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors">
                <Upload className="w-3.5 h-3.5" /> Changer
              </button>
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
          {[
            { label: "Blanc cassé", color: "#FAF9F6" },
            { label: "Bleu marine", color: "#1A2332" },
            { label: "Orange", color: "#FF6B35" },
            { label: "Gris", color: "#6B7280" },
            { label: "Vert", color: "#10B981" },
          ].map((c) => (
            <div key={c.color} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#E5E7EB]" style={{ backgroundColor: c.color }} />
              <div>
                <p className="text-[11px] text-[#6B7280]">{c.label}</p>
                <p className="text-[10px] text-[#9CA3AF]">{c.color}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Store ───
function StoreTab() {
  const [productsPerPage, setProductsPerPage] = useState("24");
  const [stockAlert, setStockAlert] = useState("5");
  const [autoPublish, setAutoPublish] = useState(true);
  const [reviews, setReviews] = useState(true);
  const [wishlist, setWishlist] = useState(true);
  const [compareMode, setCompareMode] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [minOrder, setMinOrder] = useState("5000");
  const [maxOrder, setMaxOrder] = useState("5000000");

  return (
    <div className="space-y-4">
      <Card title="Catalogue" desc="Configuration de l'affichage des produits.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Produits par page" hint="Nombre de produits affichés par page dans le catalogue.">
            <Input value={productsPerPage} onChange={setProductsPerPage} type="number" />
          </Field>
          <Field label="Seuil d'alerte de stock" hint="Notification quand le stock descend sous ce seuil.">
            <Input value={stockAlert} onChange={setStockAlert} type="number" />
          </Field>
        </div>
      </Card>
      <Card title="Fonctionnalités" desc="Activer/désactiver les fonctionnalités de la boutique.">
        <div className="space-y-3">
          <Toggle enabled={autoPublish} onChange={setAutoPublish} label="Publication automatique des nouveaux produits" />
          <Toggle enabled={reviews} onChange={setReviews} label="Avis et notes des clients" />
          <Toggle enabled={wishlist} onChange={setWishlist} label="Liste de souhaits (Wishlist)" />
          <Toggle enabled={compareMode} onChange={setCompareMode} label="Mode comparaison de produits" />
          <Toggle enabled={guestCheckout} onChange={setGuestCheckout} label="Achat sans inscription (Guest checkout)" />
        </div>
      </Card>
      <Card title="Limites de commande" desc="Montants minimum et maximum par commande.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Montant minimum (DA)"><Input value={minOrder} onChange={setMinOrder} type="number" /></Field>
          <Field label="Montant maximum (DA)"><Input value={maxOrder} onChange={setMaxOrder} type="number" /></Field>
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Shipping ───
function ShippingTab() {
  const [zones] = useState([
    { id: 1, name: "Bordj Bou Arréridj (centre-ville)", price: 0, delay: "1-2 jours", enabled: true },
    { id: 2, name: "BBA (communes)", price: 500, delay: "2-3 jours", enabled: true },
    { id: 3, name: "Sétif / M'sila / Béjaïa", price: 800, delay: "3-5 jours", enabled: true },
    { id: 4, name: "Alger / Oran / Constantine", price: 1200, delay: "4-6 jours", enabled: true },
    { id: 5, name: "Sud (Ghardaia, Ouargla...)", price: 2000, delay: "5-8 jours", enabled: true },
    { id: 6, name: "Extrême Sud (Tamanrasset, Illizi...)", price: 3500, delay: "7-12 jours", enabled: false },
  ]);
  const [freeShippingMin, setFreeShippingMin] = useState("50000");
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);

  return (
    <div className="space-y-4">
      <Card title="Zones de livraison" desc="Tarifs et délais par zone géographique (en DA).">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10">
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Zone</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Tarif</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Délai</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Actif</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5">
                  <td className="py-2.5 text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{z.name}</td>
                  <td className="py-2.5">{z.price === 0 ? <span className="text-[#10B981]" style={{ fontWeight: 600 }}>Gratuit</span> : <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{z.price.toLocaleString("fr-DZ")} DA</span>}</td>
                  <td className="py-2.5 text-[#6B7280]">{z.delay}</td>
                  <td className="py-2.5">
                    {z.enabled ? <ToggleRight className="w-6 h-4 text-[#10B981]" /> : <ToggleLeft className="w-6 h-4 text-[#9CA3AF]" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Options de livraison" desc="Paramètres généraux de la livraison.">
        <Field label="Livraison gratuite à partir de (DA)" hint="0 = pas de livraison gratuite.">
          <Input value={freeShippingMin} onChange={setFreeShippingMin} type="number" />
        </Field>
        <div className="space-y-3 mt-3">
          <Toggle enabled={trackingEnabled} onChange={setTrackingEnabled} label="Suivi de colis en temps réel" />
          <Toggle enabled={smsNotif} onChange={setSmsNotif} label="Notification SMS au client lors de l'expédition" />
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Payment ───
function PaymentTab() {
  const [cod, setCod] = useState(true);
  const [cib, setCib] = useState(true);
  const [edahabia, setEdahabia] = useState(true);
  const [virement, setVirement] = useState(true);
  const [installments, setInstallments] = useState(false);
  const [rib, setRib] = useState("00799999 0001234567 89");
  const [bankName, setBankName] = useState("CPA - Agence Bordj Bou Arréridj");

  return (
    <div className="space-y-4">
      <Card title="Moyens de paiement" desc="Activez ou désactivez les méthodes de paiement disponibles.">
        <div className="space-y-3">
          {[
            { label: "Paiement à la livraison (COD)", enabled: cod, onChange: setCod, desc: "Le client paye en espèces à la réception." },
            { label: "Carte CIB/Dahabia (SATIM)", enabled: cib, onChange: setCib, desc: "Paiement par carte interbancaire algérienne." },
            { label: "Edahabia (Algérie Poste)", enabled: edahabia, onChange: setEdahabia, desc: "Paiement via carte Edahabia d'Algérie Poste." },
            { label: "Virement bancaire", enabled: virement, onChange: setVirement, desc: "Paiement par virement bancaire classique." },
            { label: "Paiement en plusieurs fois", enabled: installments, onChange: setInstallments, desc: "Facilités de paiement en 3 ou 4 fois sans intérêts." },
          ].map((m) => (
            <div key={m.label} className="flex items-start gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-white/5">
              <button onClick={() => m.onChange(!m.enabled)} className="mt-0.5 shrink-0">
                {m.enabled ? <ToggleRight className="w-8 h-5 text-[#FF6B35]" /> : <ToggleLeft className="w-8 h-5 text-[#9CA3AF]" />}
              </button>
              <div>
                <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{m.label}</p>
                <p className="text-[11px] text-[#9CA3AF]">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Coordonnées bancaires" desc="Informations affichées pour les virements bancaires.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="RIB"><Input value={rib} onChange={setRib} /></Field>
          <Field label="Banque & Agence"><Input value={bankName} onChange={setBankName} /></Field>
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Notifications ───
function NotificationsTab() {
  const [emailNewOrder, setEmailNewOrder] = useState(true);
  const [emailReturn, setEmailReturn] = useState(true);
  const [emailLowStock, setEmailLowStock] = useState(true);
  const [emailNewClient, setEmailNewClient] = useState(false);
  const [smsOrderShipped, setSmsOrderShipped] = useState(true);
  const [smsDelivered, setSmsDelivered] = useState(true);
  const [pushBrowser, setPushBrowser] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [notifEmail, setNotifEmail] = useState("admin@electrohome-bba.dz");

  return (
    <div className="space-y-4">
      <Card title="Notifications Email (Admin)" desc="Emails envoyés à l'administrateur.">
        <Field label="Email de notification"><Input value={notifEmail} onChange={setNotifEmail} type="email" /></Field>
        <div className="space-y-3 mt-3">
          <Toggle enabled={emailNewOrder} onChange={setEmailNewOrder} label="Nouvelle commande reçue" />
          <Toggle enabled={emailReturn} onChange={setEmailReturn} label="Nouvelle demande de retour" />
          <Toggle enabled={emailLowStock} onChange={setEmailLowStock} label="Alerte stock bas" />
          <Toggle enabled={emailNewClient} onChange={setEmailNewClient} label="Nouvel inscrit" />
          <Toggle enabled={weeklyReport} onChange={setWeeklyReport} label="Rapport hebdomadaire de ventes" />
        </div>
      </Card>
      <Card title="Notifications Client (SMS)" desc="Messages SMS envoyés aux clients.">
        <div className="space-y-3">
          <Toggle enabled={smsOrderShipped} onChange={setSmsOrderShipped} label="Commande expédiée" />
          <Toggle enabled={smsDelivered} onChange={setSmsDelivered} label="Commande livrée" />
        </div>
      </Card>
      <Card title="Notifications navigateur" desc="Notifications push dans le navigateur.">
        <Toggle enabled={pushBrowser} onChange={setPushBrowser} label="Activer les notifications push" />
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: SEO ───
function SeoTab() {
  const [metaTitle, setMetaTitle] = useState("ElectroHome - Électroménager à Bordj Bou Arréridj | Livraison gratuite");
  const [metaDesc, setMetaDesc] = useState("Achetez vos appareils électroménagers en ligne chez ElectroHome BBA. Réfrigérateurs, climatiseurs, machines à laver. Livraison rapide sur toute l'Algérie.");
  const [ogImage, setOgImage] = useState("https://electrohome-bba.dz/og-image.jpg");
  const [robots, setRobots] = useState(true);
  const [sitemap, setSitemap] = useState(true);
  const [analytics, setAnalytics] = useState("UA-XXXXXXXXX-X");
  const [fbPixel, setFbPixel] = useState("");
  const [canonical, setCanonical] = useState("https://electrohome-bba.dz");

  return (
    <div className="space-y-4">
      <Card title="Meta Tags" desc="Balises meta pour le référencement naturel.">
        <Field label="Titre meta (max 70 caractères)" hint={`${metaTitle.length}/70 caractères`}>
          <Input value={metaTitle} onChange={setMetaTitle} />
        </Field>
        <Field label="Description meta (max 160 caractères)" hint={`${metaDesc.length}/160 caractères`}>
          <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35] resize-none" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="URL canonique"><Input value={canonical} onChange={setCanonical} /></Field>
          <Field label="Image Open Graph"><Input value={ogImage} onChange={setOgImage} /></Field>
        </div>
      </Card>
      <Card title="Indexation" desc="Contrôle de l'indexation par les moteurs de recherche.">
        <div className="space-y-3">
          <Toggle enabled={robots} onChange={setRobots} label="Autoriser l'indexation (robots.txt)" />
          <Toggle enabled={sitemap} onChange={setSitemap} label="Sitemap XML automatique" />
        </div>
      </Card>
      <Card title="Tracking & Analytics" desc="Intégrations de suivi et publicité.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Google Analytics ID" hint="Format: UA-XXXXXXXXX-X ou G-XXXXXXXXXX">
            <Input value={analytics} onChange={setAnalytics} placeholder="UA-XXXXXXXXX-X" />
          </Field>
          <Field label="Facebook Pixel ID" hint="Optionnel. Pour le suivi des conversions Facebook Ads.">
            <Input value={fbPixel} onChange={setFbPixel} placeholder="XXXXXXXXXXXXXXXXX" />
          </Field>
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Security ───
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false);
  const [bruteForce, setBruteForce] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordPolicy, setPasswordPolicy] = useState(true);
  const [ssl, setSsl] = useState(true);
  const [captcha, setCaptcha] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [loginAttempts, setLoginAttempts] = useState("5");

  const [admins] = useState([
    { name: "Ahmed Karim", email: "a.karim@electrohome-bba.dz", role: "Super Admin", lastLogin: "27 mars 2026, 09:15", active: true },
    { name: "Yacine Meziane", email: "y.meziane@electrohome-bba.dz", role: "Support", lastLogin: "26 mars 2026, 17:30", active: true },
    { name: "Sara Khelifi", email: "s.khelifi@electrohome-bba.dz", role: "Support", lastLogin: "26 mars 2026, 16:45", active: true },
    { name: "Nadia Boussaad", email: "n.boussaad@electrohome-bba.dz", role: "Marketing", lastLogin: "25 mars 2026, 14:00", active: false },
  ]);

  return (
    <div className="space-y-4">
      <Card title="Authentification" desc="Paramètres de sécurité de connexion admin.">
        <div className="space-y-3">
          <Toggle enabled={twoFA} onChange={setTwoFA} label="Authentification à deux facteurs (2FA)" />
          <Toggle enabled={bruteForce} onChange={setBruteForce} label="Protection anti brute-force" />
          <Toggle enabled={passwordPolicy} onChange={setPasswordPolicy} label="Politique de mot de passe fort (min 8 car., chiffre, majuscule)" />
          <Toggle enabled={captcha} onChange={setCaptcha} label="CAPTCHA sur la page de connexion" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="Tentatives de connexion max"><Input value={loginAttempts} onChange={setLoginAttempts} type="number" /></Field>
          <Field label="Expiration de session (min)"><Input value={sessionTimeout} onChange={setSessionTimeout} type="number" /></Field>
        </div>
      </Card>
      <Card title="SSL & Réseau" desc="Paramètres HTTPS et restrictions réseau.">
        <Toggle enabled={ssl} onChange={setSsl} label="Forcer HTTPS sur tout le site" />
        <Field label="IP whitelist admin (séparées par virgule)" hint="Laissez vide pour autoriser toutes les IP.">
          <Input value={ipWhitelist} onChange={setIpWhitelist} placeholder="Ex: 41.111.xxx.xxx, 105.235.xxx.xxx" />
        </Field>
      </Card>
      <Card title="Utilisateurs admin" desc="Comptes ayant accès au tableau de bord.">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10">
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Utilisateur</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Rôle</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Dernière connexion</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.email} className="border-b border-[#E5E7EB]/50 dark:border-white/5">
                  <td className="py-2.5">
                    <p className="text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{a.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{a.email}</p>
                  </td>
                  <td className="py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${a.role === "Super Admin" ? "bg-[#FF6B35]/15 text-[#FF6B35]" : a.role === "Marketing" ? "bg-[#8B5CF6]/15 text-[#8B5CF6]" : "bg-[#3B82F6]/15 text-[#3B82F6]"}`} style={{ fontWeight: 500 }}>
                      {a.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-[12px] text-[#6B7280]">{a.lastLogin}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${a.active ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#6B7280]/15 text-[#6B7280]"}`} style={{ fontWeight: 500 }}>
                      {a.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab: Maintenance ───
function MaintenanceTab() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("ElectroHome est actuellement en maintenance. Nous serons de retour très bientôt !");
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState("daily");
  const [debugMode, setDebugMode] = useState(false);

  const [backups] = useState([
    { date: "27 mars 2026, 03:00", size: "245 MB", type: "Auto", status: "success" },
    { date: "26 mars 2026, 03:00", size: "242 MB", type: "Auto", status: "success" },
    { date: "25 mars 2026, 15:30", size: "240 MB", type: "Manuel", status: "success" },
    { date: "25 mars 2026, 03:00", size: "238 MB", type: "Auto", status: "failed" },
    { date: "24 mars 2026, 03:00", size: "236 MB", type: "Auto", status: "success" },
  ]);

  return (
    <div className="space-y-4">
      <Card title="Mode maintenance" desc="Activer le mode maintenance pour bloquer l'accès au site.">
        <div className={`p-4 rounded-lg border-2 ${maintenanceMode ? "border-[#EF4444] bg-[#EF4444]/5" : "border-[#E5E7EB] dark:border-white/10"}`}>
          <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} label="Activer le mode maintenance" />
          {maintenanceMode && (
            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-[#EF4444]/10">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#EF4444]">Le site est actuellement en mode maintenance. Les visiteurs ne peuvent pas accéder à la boutique.</p>
            </div>
          )}
        </div>
        <Field label="Message de maintenance"><Input value={maintenanceMsg} onChange={setMaintenanceMsg} /></Field>
      </Card>
      <Card title="Cache & Performance" desc="Optimisation des performances du site.">
        <div className="space-y-3">
          <Toggle enabled={cacheEnabled} onChange={setCacheEnabled} label="Activer le cache des pages" />
          <Toggle enabled={debugMode} onChange={setDebugMode} label="Mode debug (désactiver en production)" />
        </div>
        <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EF4444]/30 text-[12px] text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors" style={{ fontWeight: 500 }}>
          <Database className="w-3.5 h-3.5" /> Vider le cache
        </button>
      </Card>
      <Card title="Sauvegardes" desc="Sauvegardes automatiques et manuelles de la base de données.">
        <div className="flex items-center gap-4 flex-wrap">
          <Toggle enabled={autoBackup} onChange={setAutoBackup} label="Sauvegardes automatiques" />
          <Field label="">
            <select value={backupFreq} onChange={(e) => setBackupFreq(e.target.value)} className="px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#1A2332] dark:text-white outline-none focus:border-[#FF6B35]">
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </Field>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-white/10">
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Date</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Taille</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Type</th>
                <th className="text-left py-2 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b, i) => (
                <tr key={i} className="border-b border-[#E5E7EB]/50 dark:border-white/5">
                  <td className="py-2.5 text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{b.date}</td>
                  <td className="py-2.5 text-[#6B7280]">{b.size}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] ${b.type === "Manuel" ? "bg-[#8B5CF6]/15 text-[#8B5CF6]" : "bg-[#3B82F6]/15 text-[#3B82F6]"}`} style={{ fontWeight: 500 }}>{b.type}</span>
                  </td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${b.status === "success" ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"}`} style={{ fontWeight: 500 }}>
                      {b.status === "success" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                      {b.status === "success" ? "Réussi" : "Échec"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-[12px] hover:bg-[#E55A2B] transition-colors" style={{ fontWeight: 600 }}>
          <Database className="w-3.5 h-3.5" /> Sauvegarde manuelle
        </button>
      </Card>
      <Card title="Informations système" desc="Données techniques de la plateforme.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Version", value: "v2.4.1", icon: Server },
            { label: "Node.js", value: "v20.11.0", icon: Zap },
            { label: "Base de données", value: "PostgreSQL 16", icon: Database },
            { label: "Uptime", value: "99.97%", icon: Wifi },
          ].map((s) => (
            <div key={s.label} className="bg-[#F9FAFB] dark:bg-white/5 rounded-lg p-3 text-center">
              <s.icon className="w-4 h-4 mx-auto mb-1 text-[#9CA3AF]" />
              <p className="text-[11px] text-[#9CA3AF]">{s.label}</p>
              <p className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={() => {}} />
    </div>
  );
}

// ─── Tab Content Map ───
const TAB_COMPONENTS: Record<SettingsTab, () => JSX.Element> = {
  general: GeneralTab,
  store: StoreTab,
  shipping: ShippingTab,
  payment: PaymentTab,
  notifications: NotificationsTab,
  seo: SeoTab,
  security: SecurityTab,
  maintenance: MaintenanceTab,
};

// ─── Main ───
export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-2">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${
                activeTab === t.key
                  ? "bg-[#FF6B35] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-white/5 hover:text-[#1A2332] dark:hover:text-white"
              }`}
              style={{ fontWeight: activeTab === t.key ? 600 : 400 }}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <ActiveComponent />
    </div>
  );
}
