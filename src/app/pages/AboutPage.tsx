import { Link } from "react-router";
import { Heart, Leaf, Award, Users, Shield, Truck } from "lucide-react";
import { IMAGES } from "../data/store";

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs text-[#E8400C] uppercase tracking-widest mb-3 block" style={{ fontWeight: 500 }}>À propos</span>
            <h1 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: 700 }}>Qui sommes-nous ?</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              ElectroHome est né en 2015 d'une conviction simple : l'achat d'électroménager mérite une expérience premium, des conseils experts et un accompagnement sur-mesure.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nous sélectionnons rigoureusement les meilleures marques et proposons un service après-vente d'excellence pour transformer chaque achat en satisfaction durable.
            </p>
          </div>
          <div className="flex-1">
            <img src={IMAGES.store} alt="ElectroHome" className="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <h2 className="text-2xl text-center mb-10" style={{ fontWeight: 600 }}>Nos valeurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Passion", desc: "L'amour du service client est au cœur de tout ce que nous faisons." },
              { icon: Leaf, title: "Responsabilité", desc: "Nous privilégions les produits éco-responsables et les marques engagées." },
              { icon: Award, title: "Excellence", desc: "Nous ne proposons que des produits qui répondent à nos standards de qualité." },
              { icon: Users, title: "Proximité", desc: "Une équipe d'experts disponible pour vous accompagner à chaque étape." },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-[#E8400C]/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-[#E8400C]" />
                </div>
                <h3 className="text-sm mb-1" style={{ fontWeight: 600 }}>{v.title}</h3>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-16">
        <h2 className="text-2xl text-center mb-10" style={{ fontWeight: 600 }}>Notre histoire</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          {[
            { year: "2015", title: "Création d'ElectroHome", desc: "Lancement de la première boutique en ligne." },
            { year: "2018", title: "10 000 clients satisfaits", desc: "Cap symbolique franchi avec une note moyenne de 4.8/5." },
            { year: "2021", title: "Expansion nationale", desc: "Ouverture de 3 showrooms en Algérie." },
            { year: "2024", title: "Label Excellence SAV", desc: "Certification pour notre service après-vente premium." },
            { year: "2026", title: "Nouveau catalogue", desc: "Plus de 5 000 références et 50 marques partenaires." },
          ].map((m, i) => (
            <div key={m.year} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#E8400C] text-white flex items-center justify-center text-xs shrink-0" style={{ fontWeight: 700 }}>{m.year.slice(2)}</div>
                {i < 4 && <div className="w-0.5 flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-6">
                <p className="text-xs text-[#E8400C] mb-1" style={{ fontWeight: 500 }}>{m.year}</p>
                <h3 className="text-sm mb-1" style={{ fontWeight: 600 }}>{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, text: "Paiement sécurisé" },
            { icon: Truck, text: "Livraison en 24-48h" },
            { icon: Award, text: "Certifié Excellence" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <b.icon className="w-5 h-5" />{b.text}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-16 text-center">
        <h2 className="text-2xl mb-3" style={{ fontWeight: 600 }}>Une question ? Contactez-nous</h2>
        <p className="text-muted-foreground mb-6">Notre équipe est disponible du lundi au samedi de 9h à 19h.</p>
        <Link to="/contact" className="inline-flex px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">
          Nous contacter
        </Link>
      </section>
    </div>
  );
}