import { useState } from "react";
import { Link } from "react-router";
import { Check, CreditCard, Truck, Package } from "lucide-react";
import { useStore, formatPrice } from "../data/store";

const steps = [
  { id: 1, label: "Livraison", icon: Truck },
  { id: 2, label: "Paiement", icon: CreditCard },
  { id: 3, label: "Confirmation", icon: Check },
];

export function CheckoutPage() {
  const { cart } = useStore();
  const [step, setStep] = useState(1);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const [delivery, setDelivery] = useState("standard");
  const deliveryCost = delivery === "express" ? 2000 : delivery === "relay" ? 700 : 0;
  const total = subtotal + deliveryCost;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${step >= s.id ? "bg-[#E8400C] text-white" : "bg-muted text-muted-foreground"}`}>
              {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={`text-sm hidden sm:inline ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`} style={{ fontWeight: step === s.id ? 600 : 400 }}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className={`w-12 md:w-24 h-0.5 ${step > s.id ? "bg-[#E8400C]" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl" style={{ fontWeight: 600 }}>Informations de livraison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Prénom", placeholder: "Jean" },
                  { label: "Nom", placeholder: "Dupont" },
                  { label: "Adresse", placeholder: "Rue des Martyrs, Cité 500 logts", full: true },
                  { label: "Code postal", placeholder: "75001" },
                  { label: "Ville", placeholder: "Bordj Bou Arréridj" },
                  { label: "Téléphone", placeholder: "06 12 34 56 78", full: true },
                ].map((f) => (
                  <div key={f.label} className={f.full ? "sm:col-span-2" : ""}>
                    <label className="text-sm mb-1 block">{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                  </div>
                ))}
              </div>

              <h3 className="text-sm mt-6" style={{ fontWeight: 600 }}>Mode de livraison</h3>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard", desc: "Livraison en 3-5 jours ouvrés", price: "Gratuit" },
                  { id: "express", label: "Express (J+1)", desc: "Livraison le lendemain avant 13h", price: "2 000 DA" },
                  { id: "relay", label: "Point relais", desc: "Retrait en 2-4 jours ouvrés", price: "700 DA" },
                ].map((d) => (
                  <label key={d.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${delivery === d.id ? "border-[#E8400C] bg-[#E8400C]/5" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="accent-[#E8400C]" />
                      <div>
                        <p className="text-sm" style={{ fontWeight: 500 }}>{d.label}</p>
                        <p className="text-xs text-muted-foreground">{d.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm" style={{ fontWeight: 500 }}>{d.price}</span>
                  </label>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="w-full px-6 py-3.5 rounded-lg bg-[#E8400C] text-white hover:opacity-90 transition-opacity mt-4">
                Continuer vers le paiement
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl" style={{ fontWeight: 600 }}>Paiement</h2>
              <div className="space-y-3">
                {["Carte bancaire", "PayPal", "Virement bancaire", "Paiement en 3x sans frais"].map((m) => (
                  <label key={m} className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50">
                    <input type="radio" name="payment" defaultChecked={m === "Carte bancaire"} className="accent-[#E8400C]" />
                    <span className="text-sm" style={{ fontWeight: 500 }}>{m}</span>
                  </label>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-border space-y-4">
                <div>
                  <label className="text-sm mb-1 block">Numéro de carte</label>
                  <input placeholder="4242 4242 4242 4242" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1 block">Date d'expiration</label>
                    <input placeholder="MM/AA" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                  </div>
                  <div>
                    <label className="text-sm mb-1 block">CVC</label>
                    <input placeholder="123" className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-lg border border-border hover:bg-muted transition-colors">Retour</button>
                <button onClick={() => setStep(3)} className="flex-1 px-6 py-3.5 rounded-lg bg-[#E8400C] text-white hover:opacity-90 transition-opacity">
                  Confirmer le paiement — {formatPrice(total)}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-[#22C55E]" />
              </div>
              <h2 className="text-2xl mb-2" style={{ fontWeight: 700 }}>Commande confirmée !</h2>
              <p className="text-muted-foreground mb-2">Merci pour votre achat. Votre commande a bien été enregistrée.</p>
              <p className="text-sm mb-1" style={{ fontWeight: 500 }}>N° de commande : <span className="font-mono">#EH-2026-0847</span></p>
              <p className="text-sm text-muted-foreground mb-8">Livraison estimée : 29-31 mars 2026</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/compte" className="px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">Suivre ma commande</Link>
                <Link to="/" className="px-6 py-3 rounded-lg border border-border text-sm hover:bg-muted">Continuer mes achats</Link>
              </div>
            </div>
          )}
        </div>

        {/* Mini Sidebar */}
        {step < 3 && (
          <div className="lg:w-80">
            <div className="sticky top-24 p-5 rounded-xl bg-card border border-border space-y-4">
              <h3 className="text-sm" style={{ fontWeight: 600 }}>Votre commande</h3>
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <span className="text-xs" style={{ fontWeight: 500 }}>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Livraison</span><span>{deliveryCost === 0 ? "Gratuite" : formatPrice(deliveryCost)}</span></div>
                <div className="flex justify-between pt-2 border-t border-border" style={{ fontWeight: 600 }}><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}