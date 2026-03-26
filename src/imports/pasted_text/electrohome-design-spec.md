Design a complete e-commerce platform called "ElectroHome" dedicated to household appliances (électroménager), targeting both individuals and professionals. The brand is positioned as a trusted advisor and premium service provider — not just a product catalog.

---

## BRAND IDENTITY & VISUAL STYLE

**Brand personality**: Trusted, premium, modern, clean, intelligent.
**Tone**: Refined luxury meets approachable expertise — think Apple meets Darty.

**Typography**:
- Display / Headings: "Clash Display" or "Canela" — editorial, confident
- Body: "DM Sans" or "Instrument Sans" — clean, readable
- Accent / Labels: "Geist Mono" — technical precision

**Color System — Light Mode**:
- Background: #F8F7F4 (warm off-white, not pure white)
- Surface: #FFFFFF
- Primary: #1A1A2E (deep navy)
- Accent: #E8400C (electric orange — energy, action)
- Secondary Accent: #0A84FF (electric blue — tech, trust)
- Text Primary: #111111
- Text Secondary: #6B6B6B
- Border: #E5E3DD
- Success: #22C55E
- Badge / Promo: #FFD60A (golden yellow)

**Color System — Dark Mode**:
- Background: #0D0D0F
- Surface: #161618
- Surface Elevated: #1E1E21
- Primary: #FFFFFF
- Accent: #FF5722 (brighter orange)
- Secondary Accent: #2997FF
- Text Primary: #F5F5F5
- Text Secondary: #9A9A9A
- Border: #2A2A2E
- Badge / Promo: #FFD60A

**Design Details**:
- Rounded corners: 12px for cards, 8px for buttons, 20px for modals
- Shadows: soft, layered (not harsh drop shadows)
- Grid: 12-column, 1440px max-width, 80px gutters desktop
- Spacing scale: 4px base unit
- Icons: Phosphor Icons or Lucide — outlined, 1.5px stroke
- Images: full-bleed product photography, white/light backgrounds
- Micro-interactions: hover states with subtle scale (1.02), color transitions 200ms ease

---

## PAGES TO DESIGN

### 1. HOME PAGE (/)
- **Header/Navbar**: Logo left, nav center (Accueil, Catégories, Marques, Promos, Blog, À propos), CTA "Mon compte" + cart icon with badge + dark/light toggle
- **Hero Section**: Full-width banner with headline "L'électroménager qui vous ressemble", subtext, primary CTA "Explorer le catalogue" + secondary CTA "Nos conseils d'experts". Background: large product image or abstract gradient mesh
- **Promo Strip**: Scrolling ticker with current offers (livraison gratuite, -20% réfrigérateurs, etc.)
- **Category Grid**: 6–8 categories as large visual tiles (Réfrigérateurs, Machines à laver, Fours, Climatiseurs, Lave-vaisselle, Aspirateurs, Petit électroménager, TV & Son) — hover reveals CTA
- **Featured Products**: Horizontal scroll "Nos bestsellers" — product cards with image, name, brand, price, rating, add-to-cart button
- **Brand Logos Banner**: Trusted brands row (Samsung, LG, Bosch, Whirlpool, Miele, Siemens)
- **Why ElectroHome Section**: 4 value props with icons — Livraison rapide / Garantie étendue / SAV premium / Conseils experts
- **Flash Sales Countdown**: Timer widget with 2–3 products at promo price
- **Editorial Blog Section**: 3 article cards "Nos conseils" — image, category tag, title, read time
- **Newsletter Banner**: Full-width dark section "Recevez nos meilleures offres" with email input
- **Footer**: Logo, links, social icons, payment methods, certifications, copyright

---

### 2. CATEGORY PAGE (/categorie/[slug])
- Breadcrumb navigation
- Category hero: large image + category title + product count
- **Filter Sidebar** (left, sticky): 
  - Price range slider
  - Brand checkboxes
  - Energy rating (A+++, A++…)
  - Color / finish
  - Availability toggle
  - Rating filter
- **Product Grid** (right, 3 columns desktop / 2 tablet / 1 mobile):
  - Sort bar: "Trier par" dropdown (Prix croissant, Popularité, Nouveautés, Meilleures notes)
  - Product cards with: image, badge (Nouveau / Promo / Bestseller), brand, name, short specs, price, old price if on sale, rating stars, "Ajouter au panier" + "Favoris" icon
- Pagination or infinite scroll
- "Chargement de 24 sur 156 produits"

---

### 3. PRODUCT DETAIL PAGE (/produit/[slug])
- Breadcrumb
- **Left**: Image gallery — main large image + thumbnail strip (5 images), zoom on hover, 360° view badge
- **Right**:
  - Brand logo + product name (H1)
  - Rating + review count (linked)
  - Price block: current price (large), old price strikethrough, % discount badge, VAT note
  - Color/variant selector (if applicable)
  - Quantity selector
  - CTA: "Ajouter au panier" (primary) + "Acheter maintenant" (secondary)
  - Wishlist + Share icons
  - Key specs badges: Classe A+++, 60cm, 1400tr/min (for example)
  - Delivery info: estimated date, free delivery badge
  - Warranty: 2 ans constructeur + extension disponible
  - **Tabs section below**: Description / Caractéristiques techniques (spec table) / Avis clients / Questions/Réponses
- **Product Recommendations**: "Souvent achetés ensemble" + "Vous aimerez aussi" (horizontal scroll)

---

### 4. SEARCH RESULTS PAGE (/recherche?q=...)
- Search bar at top with current query highlighted
- Filters same as category page
- Result count: "48 résultats pour 'lave-linge Samsung'"
- Product grid identical to category
- No results state: illustration + suggestions + popular categories

---

### 5. CART PAGE (/panier)
- Left: Cart items list
  - Product image (small), name, brand, specs summary, unit price, quantity stepper, remove button, save for later
- Right sticky sidebar:
  - Order summary: subtotal, delivery, promo code input, total TTC
  - CTA: "Procéder au paiement" (large primary)
  - Trust badges: Paiement sécurisé, Retour 30 jours, SAV 7j/7
- Empty cart state: illustration + CTA to browse catalog
- Upsell: "Ces produits pourraient vous intéresser"

---

### 6. CHECKOUT PAGE (/commande)
- Step progress bar: Livraison → Paiement → Confirmation
- **Step 1 — Livraison**:
  - Login or guest checkout option
  - Address form: Prénom, Nom, Adresse, Code postal, Ville, Téléphone
  - Delivery method selector: Standard (gratuit), Express (J+1), Point relais — with price and estimated date
- **Step 2 — Paiement**:
  - Payment methods: Carte bancaire (Stripe form), Virement, PayPal, Paiement en 3x sans frais
  - Order summary mini sidebar
- **Step 3 — Confirmation**:
  - Success animation
  - Order number
  - Summary + estimated delivery date
  - CTA: "Suivre ma commande" + "Continuer mes achats"

---

### 7. USER ACCOUNT PAGE (/compte)
- Left sidebar nav: Tableau de bord / Mes commandes / Mes favoris / Mes adresses / Mes avis / Paramètres / Déconnexion
- **Dashboard**: Welcome message, last order status card, loyalty points widget, quick links
- **Orders**: Table with order ID, date, status badge (En cours / Livré / Annulé), total, actions (Détails, Retour, Facture PDF)
- **Favorites**: Grid of saved products
- **Addresses**: Cards with edit/delete
- **Settings**: Profile form, password change, notification preferences, delete account

---

### 8. BRANDS PAGE (/marques)
- Hero: "Nos marques partenaires"
- Grid of brand logos (large, clean, clickable)
- Featured brand: full-width editorial banner for 1 premium brand
- On click: filtered catalog page for that brand

---

### 9. PROMOTIONS PAGE (/promotions)
- Hero with countdown timer "Ventes Flash — Se termine dans 02:14:36"
- Category filter tabs: Tous / Réfrigérateurs / Lavage / Cuisson / etc.
- Product grid (same card design with prominent discount %)
- "Promotion du jour" spotlight: 1 large hero product at top

---

### 10. BLOG / CONSEILS PAGE (/blog)
- Hero: "Nos conseils d'experts"
- Featured article: large card (image + title + excerpt + author + read time)
- Article grid: 3 columns, category tags (Guide d'achat, Entretien, Tendances, Comparatif)
- **Single Article Page (/blog/[slug])**: Full editorial layout — hero image, author bio, table of contents, body text, related products widget ("Produits mentionnés dans cet article"), share buttons

---

### 11. ABOUT PAGE (/a-propos)
- Brand story section: "Qui sommes-nous" — editorial layout with text + image
- Values section: 4 pillars with icons
- Team section: photo grid (optional)
- Timeline: brand milestones
- Certifications & trust badges
- CTA: "Contactez-nous"

---

### 12. CONTACT PAGE (/contact)
- Left: Contact form (Nom, Email, Sujet dropdown, Message, file attach)
- Right: Contact info cards (phone, email, address, hours), embedded map
- Live chat widget icon (bottom right corner, always visible)
- FAQ teaser with top 3 questions

---

### 13. FAQ PAGE (/faq)
- Search bar at top
- Accordion sections by topic: Commandes / Livraison / Retours & Remboursements / Garantie / Paiement / SAV
- Still need help? CTA block at bottom

---

### 14. ERROR & UTILITY PAGES
- **404 Page**: Friendly illustration, "Page introuvable", search bar, popular categories
- **Login / Register (/auth)**: Split layout — left brand visual, right form. Tabs: Connexion / Créer un compte. Social login (Google, Apple)

---

## GLOBAL COMPONENTS (Design System)

**Header**: 
- Desktop: logo + nav + search bar expandable + wishlist + cart + account + theme toggle
- Mobile: hamburger menu, bottom nav bar (Accueil / Catégories / Recherche / Panier / Compte)

**Product Card** (standard): image, badges, brand, name, price, rating, add-to-cart, favorite

**Buttons**: Primary (filled, orange), Secondary (outlined), Ghost, Icon-only, Destructive

**Badges**: Nouveau (blue), Promo (orange), Bestseller (gold), Rupture de stock (gray)

**Toast Notifications**: "Produit ajouté au panier ✓" — slides in bottom right

**Loading States**: Skeleton screens (not spinners) for product grids

**Empty States**: Custom illustrations per context

**Breadcrumbs**: Always present on interior pages

**Dark/Light Mode Toggle**: Sun/Moon icon in header, smooth transition

---

## RESPONSIVE BREAKPOINTS
- Mobile: 375px
- Tablet: 768px  
- Desktop: 1280px
- Wide: 1440px

---

## ACCESSIBILITY
- WCAG AA contrast ratios
- Focus states visible
- ARIA labels on interactive elements
- Alt text placeholders on all images