import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, Shield, RotateCcw, Headphones } from "lucide-react";
import { useStore, formatPrice, PRODUCTS } from "../data/store";
import { ProductCard } from "../components/ProductCard";

export function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = subtotal >= 70000 ? 0 : 4000;
  const total = subtotal + delivery;
  const upsell = PRODUCTS.filter((p) => !cart.find((c) => c.product.id === p.id)).slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-24 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl mb-2" style={{ fontWeight: 600 }}>Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez notre catalogue et trouvez les appareils parfaits pour votre maison.</p>
        <Link to="/categorie/refrigerateurs" className="inline-flex px-6 py-3 rounded-lg bg-[#E8400C] text-white text-sm hover:opacity-90">
          Explorer le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 py-8">
      <h1 className="text-2xl mb-8" style={{ fontWeight: 600 }}>Mon panier ({cart.length} article{cart.length > 1 ? "s" : ""})</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                <h3 className="text-sm truncate" style={{ fontWeight: 500 }}>{item.product.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{item.product.specs}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="sticky top-24 p-6 rounded-xl bg-card border border-border space-y-4">
            <h3 style={{ fontWeight: 600 }}>Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{delivery === 0 ? "Gratuite" : formatPrice(delivery)}</span></div>
            </div>
            <div className="flex gap-2">
              <input placeholder="Code promo" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-transparent" />
              <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">OK</button>
            </div>
            <div className="border-t border-border pt-4 flex justify-between" style={{ fontWeight: 600 }}>
              <span>Total TTC</span><span>{formatPrice(total)}</span>
            </div>
            <Link to="/commande" className="block w-full text-center px-6 py-3.5 rounded-lg bg-[#E8400C] dark:bg-[#FF5722] text-white hover:opacity-90 transition-opacity">
              Procéder au paiement
            </Link>
            <div className="flex items-center justify-center gap-4 pt-2">
              {[
                { icon: Shield, text: "Paiement sécurisé" },
                { icon: RotateCcw, text: "Retour 30j" },
                { icon: Headphones, text: "SAV 7j/7" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <t.icon className="w-3.5 h-3.5" />{t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upsell */}
      {upsell.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl mb-6" style={{ fontWeight: 600 }}>Ces produits pourraient vous intéresser</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upsell.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}