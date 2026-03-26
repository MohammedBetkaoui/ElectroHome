import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export function ContactPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      <h1 className="text-3xl text-center mb-2" style={{ fontWeight: 700 }}>Contactez-nous</h1>
      <p className="text-center text-muted-foreground mb-10">Nous sommes là pour vous aider. N'hésitez pas à nous écrire.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg mb-6" style={{ fontWeight: 600 }}>Envoyez-nous un message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Nom</label>
                <input placeholder="Jean Dupont" className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent text-sm" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Email</label>
                <input type="email" placeholder="jean@email.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">Sujet</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm">
                <option>Commande en cours</option>
                <option>Service après-vente</option>
                <option>Réclamation</option>
                <option>Information produit</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Message</label>
              <textarea rows={5} placeholder="Votre message..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-transparent text-sm resize-none" />
            </div>
            <button className="w-full px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90 transition-opacity">
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Phone, title: "Téléphone", info: "01 23 45 67 89" },
              { icon: Mail, title: "Email", info: "contact@electrohome.fr" },
              { icon: MapPin, title: "Adresse", info: "Rue des Martyrs, 34000 Bordj Bou Arréridj" },
              { icon: Clock, title: "Horaires", info: "Lun-Sam : 9h - 19h" },
            ].map((c) => (
              <div key={c.title} className="p-5 rounded-xl bg-card border border-border">
                <c.icon className="w-5 h-5 text-[#E8400C] mb-3" />
                <p className="text-sm" style={{ fontWeight: 500 }}>{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.info}</p>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="h-64 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm">
            <MapPin className="w-5 h-5 mr-2" /> Carte interactive — Rue des Martyrs, Bordj Bou Arréridj
          </div>

          {/* FAQ teaser */}
          <div className="p-5 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-sm mb-3" style={{ fontWeight: 600 }}>Questions fréquentes</h3>
            {[
              "Quels sont les délais de livraison ?",
              "Comment suivre ma commande ?",
              "Quelle est votre politique de retour ?",
            ].map((q) => (
              <p key={q} className="text-sm text-muted-foreground py-1.5 border-b border-border last:border-0">{q}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <button className="fixed bottom-20 lg:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#E8400C] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}