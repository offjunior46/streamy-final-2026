"use client";

import { auth } from "@/app/firebase";
import React, { useMemo, useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";
type PlanType = "solo" | "co";
type Duration = "1 mois" | "3 mois";
type Offer = {
  type: PlanType;
  duration: Duration;
  price: number; // FCFA
  description: string;
};
type Product = {
  id: string;
  name: string;
  category:
    | "Streaming vidéo"
    | "TV & Sport"
    | "Musique"
    | "Création & Design"
    | "VPN & Sécurité"
    | "IA & Outils"
    | "Réseaux sociaux";
  img: string; // in /public/brands
  popular?: boolean;
  offers: Offer[]; // always 2 offers (solo & co)
};
function formatFCFA(amount: number) {
  // 10000 -> "10 000 FCFA"
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}
export default function Page() {
  const products: Product[] = [
    // =========================
    // STREAMING VIDÉO
    // =========================
    {
      id: "netflix",
      name: "Netflix",
      category: "Streaming vidéo",
      img: "/brands/netflix.png",
      popular: true,
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Accès personnel Netflix en HD/4K. Compte dédié, fluide et sans partage.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description:
            "Netflix en co-abonnement : même catalogue premium à prix réduit.",
        },
      ],
    },
    {
      id: "prime-video",
      name: "Prime Video",
      category: "Streaming vidéo",
      img: "/brands/prime-video.png",
      popular: true,
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Compte Prime Video personnel avec films, séries et Amazon Originals.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description: "Prime Video en co-abonnement, économique et fiable.",
        },
      ],
    },
    {
      id: "disney-plus",
      name: "Disney+",
      category: "Streaming vidéo",
      img: "/brands/disney-plus.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3200,
          description:
            "Compte Disney+ personnel : Marvel, Star Wars, Pixar et Disney en illimité.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1600,
          description:
            "Disney+ en co-abonnement : profitez du catalogue à petit prix.",
        },
      ],
    },
    {
      id: "crunchyroll",
      name: "Crunchyroll",
      category: "Streaming vidéo",
      img: "/brands/crunchyroll.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3200,
          description:
            "Crunchyroll premium solo : animé en HD, sans pubs, sorties rapides.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1600,
          description:
            "Crunchyroll en co-abonnement : animé premium à prix réduit.",
        },
      ],
    },
    {
      id: "paramount-plus",
      name: "Paramount+",
      category: "Streaming vidéo",
      img: "/brands/paramount-plus.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3200,
          description:
            "Paramount+ solo : séries, films et exclusivités, accès immédiat.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1600,
          description:
            "Paramount+ en co-abonnement : même contenu, plus économique.",
        },
      ],
    },
    {
      id: "hulu",
      name: "Hulu",
      category: "Streaming vidéo",
      img: "/brands/hulu.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 5000,
          description:
            "Hulu solo : séries et contenus US, expérience premium et stable.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2500,
          description:
            "Hulu en co-abonnement : accès Hulu à tarif réduit, simple et rapide.",
        },
      ],
    },
    {
      id: "adn",
      name: "ADN (Animation Digital Network)",
      category: "Streaming vidéo",
      img: "/brands/adn.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 4000,
          description:
            "ADN solo : le meilleur de l’animé en direct du Japon, streaming premium.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2000,
          description:
            "ADN en co-abonnement : animé premium, même qualité à prix réduit.",
        },
      ],
    },
    // =========================
    // TV & SPORT
    // =========================
    {
      id: "iptv",
      name: "IPTV",
      category: "TV & Sport",
      img: "/brands/iptv.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 5000,
          description:
            "IPTV solo : chaînes & sports, accès stable et rapide (selon disponibilité).",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2500,
          description:
            "IPTV en co-abonnement : même accès à tarif réduit, pratique.",
        },
      ],
    },
    {
      id: "dazn",
      name: "DAZN",
      category: "TV & Sport",
      img: "/brands/dazn.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 5000,
          description:
            "DAZN solo : sport en streaming, combats & événements, accès premium.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2500,
          description:
            "DAZN en co-abonnement : sport premium à prix réduit, simple et rapide.",
        },
      ],
    },
    // =========================
    // MUSIQUE
    // =========================
    {
      id: "spotify",
      name: "Spotify",
      category: "Musique",
      img: "/brands/spotify-1Mois.png",
      popular: true,
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Spotify Premium individuel : musique sans pub et hors connexion.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description:
            "Spotify Premium en co-abonnement : mêmes avantages à prix réduit.",
        },
      ],
    },
    {
      id: "deezer",
      name: "Deezer",
      category: "Musique",
      img: "/brands/deezer.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Deezer Premium solo : écoute sans pub, téléchargements et qualité audio.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description:
            "Deezer en co-abonnement : premium à prix réduit, facile à activer.",
        },
      ],
    },
    // =========================
    // CRÉATION & DESIGN
    // =========================
    {
      id: "canva",
      name: "Canva Pro",
      category: "Création & Design",
      img: "/brands/canva.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Canva Pro solo : modèles premium, kit marque, exports HD et plus.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description:
            "Canva Pro en co-abonnement : accès Pro à prix réduit, rapide.",
        },
      ],
    },
    {
      id: "picsart",
      name: "PicsArt",
      category: "Création & Design",
      img: "/brands/picsart.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 4000,
          description:
            "PicsArt solo : édition photo/vidéo premium, effets, outils IA et exports.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2000,
          description:
            "PicsArt en co-abonnement : premium à tarif réduit, simple.",
        },
      ],
    },
    {
      id: "adobe",
      name: "Pack Formule Adobe",
      category: "Création & Design",
      img: "/brands/adobe.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 10000,
          description:
            "Adobe solo : pack créatif pour design/retouche (selon formule), activation rapide.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2000,
          description:
            "Adobe en co-abonnement : accès pack à prix réduit (conditions selon offre).",
        },
      ],
    },
    {
      id: "capcut",
      name: "CapCut",
      category: "Création & Design",
      img: "/brands/capcut.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 6000,
          description:
            "CapCut solo : montage vidéo premium, effets, templates et exports HD.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 3000,
          description:
            "CapCut en co-abonnement : premium à prix réduit, idéal créateurs.",
        },
      ],
    },
    // =========================
    // VPN & SÉCURITÉ
    // =========================
    {
      id: "nordvpn",
      name: "NordVPN",
      category: "VPN & Sécurité",
      img: "/brands/nordvpn.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 4000,
          description:
            "NordVPN solo : navigation sécurisée, serveurs rapides et protection renforcée.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2000,
          description:
            "NordVPN en co-abonnement : même sécurité à prix réduit.",
        },
      ],
    },
    {
      id: "surfshark",
      name: "Surfshark VPN",
      category: "VPN & Sécurité",
      img: "/brands/surfshark.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 3000,
          description:
            "Surfshark solo : VPN rapide, confidentialité et accès aux contenus géo-restreints.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 1500,
          description:
            "Surfshark en co-abonnement : sécurité premium à petit prix.",
        },
      ],
    },
    {
      id: "expressvpn",
      name: "ExpressVPN",
      category: "VPN & Sécurité",
      img: "/brands/expressvpn.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 4000,
          description:
            "ExpressVPN solo : VPN haut débit, protection avancée et stabilité.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 2000,
          description:
            "ExpressVPN en co-abonnement : même performance à prix réduit.",
        },
      ],
    },
    // =========================
    // IA & OUTILS
    // =========================
    {
      id: "chatgpt",
      name: "ChatGPT",
      category: "IA & Outils",
      img: "/brands/chatgpt.png",
      offers: [
        {
          type: "solo",
          duration: "1 mois",
          price: 20000,
          description:
            "ChatGPT solo : accès premium, plus rapide et plus puissant pour travailler/étudier.",
        },
        {
          type: "co",
          duration: "1 mois",
          price: 5000,
          description:
            "ChatGPT en co-abonnement : accès premium à prix réduit, pratique.",
        },
      ],
    },
    // =========================
    // RÉSEAUX SOCIAUX
    // =========================
    {
      id: "snapchat",
      name: "Snapchat+",
      category: "Réseaux sociaux",
      img: "/brands/snapchat.png",
      offers: [
        {
          type: "solo",
          duration: "3 mois",
          price: 6000,
          description:
            "Snapchat+ solo (3 mois) : options exclusives, badges et fonctions premium.",
        },
        {
          type: "co",
          duration: "3 mois",
          price: 3000,
          description:
            "Snapchat+ en co-abonnement (3 mois) : premium à tarif réduit.",
        },
      ],
    },
  ];
  // Left filters (categories)
  const categories = useMemo(() => {
    const all = Array.from(new Set(products.map((p) => p.category)));
    return all;
  }, [products]);
  const [query, setQuery] = useState("");

  const [activeCategory, setActiveCategory] =
    useState<string>("Tous les produits");
  const [sort, setSort] = useState<"pop" | "az" | "price_asc" | "price_desc">(
    "pop"
  );
  // 👉 état pour ouvrir une offre (solo/co)
  const [openOffer, setOpenOffer] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<
    {
      productId: string;
      productName: string;
      type: "solo" | "co";
      duration: string;
      price: number;
    }[]
  >([]);

  // Renouvellement
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [renewEmail, setRenewEmail] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  // Paiement

  const [whatsappNumber, setWhatsappNumber] = useState("");
const [customerEmail, setCustomerEmail] = useState("");
  function toggleOffer(key: string) {
    setOpenOffer((prev) => (prev === key ? null : key));
  }
  function addToCart(product: Product, offer: Offer) {
    setCart((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        type: offer.type,
        duration: offer.duration,
        price: offer.price,
      },
    ]);
  }
  const filtered = useMemo(() => {
    let list = [...products];
    // category
    if (activeCategory !== "Tous les produits") {
      list = list.filter((p) => p.category === activeCategory);
    }
    // search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inDesc = p.offers.some((o) =>
          o.description.toLowerCase().includes(q)
        );
        return inName || inCat || inDesc;
      });
    }
    // sorting
    if (sort === "pop") {
      list.sort(
        (a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular))
      );
    } else if (sort === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price_asc") {
      list.sort((a, b) => minPrice(a) - minPrice(b));
    } else if (sort === "price_desc") {
      list.sort((a, b) => minPrice(b) - minPrice(a));
    }
    return list;
  }, [products, activeCategory, query, sort]);
  function minPrice(p: Product) {
    return Math.min(...p.offers.map((o) => o.price));
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main style={styles.page}>
      {/* =========================
          HEADER
         ========================= */}
      <header style={styles.header}>
        <a href="/" style={styles.brand}>
          <img src="/streamy-logo.png" alt="Streamy" style={styles.logo} />
          <span style={styles.brandName}>Streamy</span>
        </a>
        <nav style={styles.nav}>
          <a href="/" style={styles.navBtn}>
            Accueil
          </a>
          <span style={{ ...styles.navBtn, ...styles.navBtnActive }}>
            Abonnements
          </span>
        </nav>
        <div style={styles.actions}>
          <button
            style={styles.cartHeaderBtn}
            onClick={() => setIsCartOpen(true)}
          >
            🛒 Panier ({cart.length})
          </button>
        </div>
      </header>
      {/* =========================
          TOP TITLE + SEARCH + SORT
         ========================= */}
      <section style={styles.topSection}>
        <h1 style={styles.title}>Tous les abonnements</h1>
        <p style={styles.subtitle}>
          Choisissez votre abonnement et profitez immédiatement.
        </p>
        <div style={styles.topControls}>
          <div style={styles.searchWrap}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un abonnement..."
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          <div style={styles.sortWrap}>
            <span style={styles.sortLabel}>Trier par</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              style={styles.sortSelect}
            >
              <option value="pop">Les plus populaires</option>
              <option value="az">A → Z</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </section>
      {/* =========================
          LAYOUT: LEFT FILTERS + GRID
         ========================= */}
      <section style={styles.layout}>
        {/* LEFT FILTERS */}
        <aside style={styles.sidebar}>
          <div style={styles.filterTitle}>Filtres</div>
          <button
            onClick={() => setActiveCategory("Tous les produits")}
            style={{
              ...styles.filterItem,
              ...(activeCategory === "Tous les produits"
                ? styles.filterItemActive
                : {}),
            }}
          >
            Tous les Produits
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                ...styles.filterItem,
                ...(activeCategory === c ? styles.filterItemActive : {}),
              }}
            >
              {c}
            </button>
          ))}
        </aside>
        {/* PRODUCTS GRID */}
        <div style={styles.grid}>
          {filtered.map((p) => (
            <article key={p.id} style={styles.productCard}>
              <div style={styles.productTop}>
                <div style={styles.productLogoBox}>
                  <img src={p.img} alt={p.name} style={styles.productLogo} />
                  {p.popular && <span style={styles.badge}>Populaire</span>}
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{p.name}</h3>
                  <div style={styles.productCategory}>{p.category}</div>
                </div>
              </div>
              {/* OFFERS */}
              <div style={styles.offers}>
                {p.offers
                  .slice()
                  .sort((a, b) => (a.type === "solo" ? -1 : 1)) // solo first
                  .map((o, idx) => (
                    <div key={idx} style={styles.offerCard}>
                      <div style={styles.offerHeader}>
                        <div style={styles.offerLeft}>
                          <span style={styles.offerType}>
                            {o.type === "solo" ? "Solo" : "Co"} —
                          </span>
                          <span style={styles.offerDuration}>{o.duration}</span>
                        </div>
                        <div style={styles.offerPrice}>
                          {formatFCFA(o.price)}
                        </div>
                      </div>
                      {(() => {
                        const key = `${p.id}-${o.type}`;
                        const isOpen = openOffer === key;
                        return !isOpen ? (
                          <button
                            style={styles.subscribeBtn}
                            onClick={() => toggleOffer(key)}
                          >
                            S’abonner
                          </button>
                        ) : (
                          <div style={styles.actionColumn}>
                            <button
                              style={styles.cartBtn}
                              onClick={() => addToCart(p, o)}
                            >
                              Ajouter au panier
                            </button>
                          </div>
                        );
                      })()}
                      <p style={styles.offerDesc}>{o.description}</p>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* =========================
          FOOTER — CONTACT (AJOUTÉ)
         ========================= */}
      <section style={styles.contactSection}>
        <div style={styles.contactCard}>
          <h2 style={styles.contactTitle}>Où nous contacter ?</h2>
          <div style={styles.socialRow}>
            <a
  href="https://www.instagram.com/streamy_sn/"
  target="_blank"
  rel="noopener noreferrer"
>
              <img
                src="/social/instagram.png"
                alt="Instagram"
                style={styles.socialIcon}
              />
            </a>
           <a
  href="https://tiktok.com/@streamy_sn"
  target="_blank"
  rel="noopener noreferrer"
>
              <img
                src="/social/tiktok.png"
                alt="TikTok"
                style={styles.socialIcon}
              />
            </a>
            <a
              href="https://web.facebook.com/people/Streamy-Sn/pfbid0kUpkSsRcURJWZTouimfxBEHfGDCwQSrq5ywF2vVMitqHRGrCCHzrnZCDYr3RWQStl/"
              target="_blank"
            >
              <img
                src="/social/facebook.png"
                alt="Facebook"
                style={styles.socialIcon}
              />
            </a>
            <a href="https://wa.me/221781242647" target="_blank">
              <img
                src="/social/whatsapp.png"
                alt="WhatsApp"
                style={styles.socialIcon}
              />
            </a>
            <a href="mailto:contactstreamy.sn@gmail.com">
              <img
                src="/social/gmail.png"
                alt="Email"
                style={styles.socialIcon}
              />
            </a>
          </div>
          <p style={styles.paymentNote}>
            Les paiements s’effectuent uniquement via Wave et Orange Money.
          </p>
          <div style={styles.footerBtns}>
            <Link href="/politique-remboursement">
              <button style={styles.footerBtnOrange}>
                Politique de remboursement
              </button>
            </Link>
            <Link href="/conditions-utilisation">
              <button style={styles.footerBtnOrange}>
                Conditions d'utilisation
              </button>
            </Link>
          </div>
        </div>
      </section>
      {isCartOpen && (
        <div style={styles.cartOverlay}>
          <div style={styles.cartPopup}>
            <h3 style={{ marginTop: 0 }}>🛒 Mon panier</h3>
            {cart.length === 0 ? (
              <p>Votre panier est vide</p>
            ) : (
              cart.map((item, i) => (
                <div key={i} style={styles.cartItem}>
                  <div>
                    <strong>{item.productName}</strong>
                    <div style={{ fontSize: 13, color: "#475569" }}>
                      {item.type} — {item.duration}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <span>{formatFCFA(item.price)}</span>
                    <button
                      onClick={() =>
                        setCart(cart.filter((_, index) => index !== i))
                      }
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
            <div style={{ marginTop: 12, fontWeight: 900, textAlign: "right" }}>
              Total : {formatFCFA(total)}
            </div>

            {/* =========================
    PARTIE 3 — RENOUVELLEMENT
========================= */}
            <div style={{ marginTop: 22 }}>
              <p style={{ fontWeight: 700 }}>
                Vous avez déjà un compte pour ce service que vous souhaitez
                renouveler ?
              </p>
              <button
                style={{ ...styles.validateBtn, background: "#ff9f2d" }}
                onClick={() => setIsRenewOpen(true)}
              >
                🔁 Compte à conserver
              </button>
            </div>
            <div style={{ marginTop: 20 }}>
              <h4>Numéro WhatsApp *</h4>

              <input
                type="tel"
                placeholder="Ex: 781242647"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />

              <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Indiquez un numéro WhatsApp fonctionnel.
              </p>
            </div>
            <div style={{ marginTop: 16 }}>
  <h4>Email *</h4>

  <input
    type="email"
    placeholder="Ex: contact@gmail.com"
    value={customerEmail}
    onChange={(e) => setCustomerEmail(e.target.value)}
    style={{
      width: "100%",
      padding: 12,
      marginTop: 10,
      borderRadius: 10,
      border: "1px solid #ddd",
    }}
  />

  <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
    Indiquez un compte email fonctionnel.
  </p>
</div>
            {/* =========================
    PARTIE 4 — MÉTHODE DE PAIEMENT
========================= */}
            <div style={{ marginTop: 22 }}>
              <h4>Paiement sécurisé</h4>
              <p style={{ fontSize: 14, color: "#475569", marginTop: 8 }}>
                Après validation, vous serez redirigé vers PayTech pour choisir
                votre moyen de paiement (Wave, Orange Money, Free Money ou carte
                bancaire).
              </p>
            </div>
            <div style={styles.cartActions}>
              <button onClick={() => setIsCartOpen(false)}>Annuler</button>
              <button
                style={styles.validateBtn}
                onClick={async () => {
                  if (cart.length === 0) {
                    alert("Votre panier est vide.");
                    return;
                  }

                  if (!/^[0-9]{8,}$/.test(whatsappNumber)) {
                    alert("Numéro WhatsApp invalide.");
                    return;
                  }

                  try {
                    const user = auth.currentUser;

                    if (!user) {
                      alert("Connecte-toi d'abord");
                      return;
                    }

                    const orderData = {
                      orderNumber: Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase(),
                      items: cart,
                      total: total,
                      date: new Date().toLocaleString(),
                      whatsappNumber: whatsappNumber,
                      paymentMethod: "paytech",
                    };

                    await addDoc(collection(db, "orders"), {
                      orderNumber: orderData.orderNumber,
                      userId: user.uid,
                      items: cart,
                      total: total,
                      whatsappNumber: whatsappNumber,
                      paymentMethod: "paytech",
                      status: "pending_payment",
                      createdAt: serverTimestamp(),
                    });

                    localStorage.setItem(
                      "streamy_order",
                      JSON.stringify(orderData)
                    );

                    const response = await fetch("/api/paytech/init", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        orderNumber: orderData.orderNumber,
                        total: orderData.total,
                        customerPhone: orderData.whatsappNumber,
                        items: orderData.items,
                      }),
                    });

                    const result = await response.json();

                    console.log("Réponse PayTech :", result);

                    const redirectUrl =
                      result?.redirect_url ||
                      result?.redirectUrl ||
                      result?.data?.redirect_url ||
                      result?.data?.redirectUrl;

                    if (!response.ok || !redirectUrl) {
                      console.error("Erreur PayTech :", result);
                      alert("Impossible de lancer le paiement PayTech.");
                      return;
                    }

                    setIsCartOpen(false);
                    window.location.href = redirectUrl;
                  } catch (error) {
                    console.error("Erreur :", error);
                    alert("Erreur lors du lancement du paiement.");
                  }
                }}
              >
                🔵 Payer avec PayTech
              </button>
            </div>
          </div>
        </div>
      )}
      {isRenewOpen && (
        <div style={styles.cartOverlay}>
          <div style={styles.cartPopup}>
            <h3>🔁 Renouveler un compte existant</h3>
            <button
              style={{ ...styles.cartBtn, marginBottom: 12 }}
              onClick={() => setIsRenewOpen(false)}
            >
              Je préfère avoir de nouveaux accès
            </button>
            <div
              style={{
                background: "#111827",
                color: "#facc15",
                padding: 12,
                borderRadius: 12,
                marginBottom: 14,
                fontSize: 14,
              }}
            >
              ⚠️ Si votre abonnement est déjà expiré, nous ne pouvons pas
              garantir la disponibilité de vos accès actuels.
            </div>
            <input
              placeholder="Email du compte existant"
              value={renewEmail}
              onChange={(e) => setRenewEmail(e.target.value)}
              style={styles.searchInput}
            />
            <input
              type="password"
              placeholder="Mot de passe du compte existant"
              value={renewPassword}
              onChange={(e) => setRenewPassword(e.target.value)}
              style={{ ...styles.searchInput, marginTop: 10 }}
            />
            <div style={styles.cartActions}>
              <button onClick={() => setIsRenewOpen(false)}>Annuler</button>
              <button
  style={styles.validateBtn}
  onClick={() => {
    alert("Revenez au panier pour lancer le paiement PayTech.");
    setIsRenewOpen(false);
  }}
>
  Revenir au panier
</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eaf6ff, #ffffff)",
    padding: 24,
    fontFamily: "system-ui, Arial",
  },
  cartOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  cartPopup: {
    background: "white",
    borderRadius: 18,
    padding: 20,
    width: "min(420px, 92vw)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  cartActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },
  removeBtn: {
    border: "none",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    padding: "4px 8px",
    cursor: "pointer",
    fontWeight: 900,
  },
  actionColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cartHeaderBtn: {
    padding: "10px 16px",
    borderRadius: 12,
    background: "#0ea5e9",
    border: "none",
    fontWeight: 800,
    color: "white",
    cursor: "pointer",
  },
  cartBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    background: "#0ea5e9",
    border: "none",
    fontWeight: 900,
    color: "white",
    cursor: "pointer",
  },
  validateBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    background: "#ff9f2d",
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
  },
  /* HEADER */
  header: {
    background: "white",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "inherit",
  },
  logo: { width: 36, height: 36, objectFit: "contain" },
  brandName: { fontSize: 20, fontWeight: 900 },
  nav: { display: "flex", gap: 10, alignItems: "center" },
  navBtn: {
    padding: "8px 14px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    color: "#111827",
    display: "inline-block",
  },
  navBtnActive: {
    background: "#FEEDD6",
    color: "#111827",
    fontWeight: 900,
  },
  actions: { display: "flex", gap: 10 },
  loginBtn: {
    padding: "10px 18px",
    borderRadius: 12,
    background: "#ff9f2d",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },
  /* TOP */
  topSection: {
    textAlign: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 40,
    fontWeight: 900,
    margin: "6px 0 6px 0",
  },
  subtitle: { color: "#64748B", margin: 0 },
  topControls: {
    marginTop: 18,
    display: "flex",
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: 14,
    padding: "10px 12px",
    width: "min(520px, 92vw)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.06)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    padding: "6px 8px",
  },
  searchIcon: { opacity: 0.6, padding: "0 6px" },
  sortWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
    borderRadius: 14,
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.06)",
  },
  sortLabel: { color: "#64748B", fontSize: 14 },
  sortSelect: {
    border: "none",
    outline: "none",
    fontWeight: 700,
    cursor: "pointer",
    background: "transparent",
  },
  /* LAYOUT */
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 18,
    alignItems: "start",
    marginTop: 16,
  },
  /* SIDEBAR */
  sidebar: {
    background: "white",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.05)",
    position: "sticky",
    top: 16,
  },
  filterTitle: {
    fontWeight: 900,
    marginBottom: 12,
    color: "#111827",
  },
  filterItem: {
    width: "100%",
    textAlign: "left",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: 10,
  },
  filterItemActive: {
    background: "#e9f5ff",
    border: "1px solid rgba(30,144,255,0.25)",
    boxShadow: "0 10px 25px rgba(30,144,255,0.12)",
  },
  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 18,
  },
  /* PRODUCT CARD */
  productCard: {
    background: "white",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  productTop: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  productLogoBox: {
    width: 78,
    height: 56,
    borderRadius: 14,
    background: "#f8fafc",
    border: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  productLogo: {
    width: "86%",
    height: "86%",
    objectFit: "contain",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    background: "#ff9f2d",
    color: "#111827",
    fontWeight: 900,
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 999,
  },
  productInfo: { flex: 1 },
  productName: { margin: 0, fontSize: 22, fontWeight: 900 },
  productCategory: { marginTop: 4, color: "#64748B", fontSize: 13 },
  offers: { display: "grid", gap: 14 },
  offerCard: {
    background: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    border: "1px solid rgba(0,0,0,0.05)",
  },
  offerHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  offerLeft: { display: "flex", gap: 6, alignItems: "baseline" },
  offerType: { fontWeight: 900 },
  offerDuration: { fontWeight: 800, color: "#111827" },
  offerPrice: { fontWeight: 900 },
  offerDesc: {
    margin: "6px 0 12px",
    color: "#475569",
    lineHeight: 1.4,
    fontSize: 14,
  },
  subscribeBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    background: "#ff9f2d",
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
  },
  /* =========================
     CONTACT BLOCK (AJOUT)
     ========================= */
  contactSection: {
    marginTop: 40,
    padding: "30px 0 60px",
    background: "#e9f5ff",
    borderRadius: 20,
  },
  contactCard: {
    maxWidth: 950,
    margin: "0 auto",
    background: "rgba(255,255,255,0.55)",
    borderRadius: 26,
    padding: "34px 26px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  contactTitle: {
    fontSize: 34,
    fontWeight: 900,
    margin: "0 0 16px 0",
    color: "#1f2937",
  },
  socialRow: {
    display: "flex",
    gap: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    flexWrap: "wrap",
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    objectFit: "cover",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },
  paymentNote: {
    color: "#475569",
    margin: "10px 0 18px",
    fontSize: 16,
  },
  footerBtns: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerBtnOrange: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "none",
    background: "#ff9f2d",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 25px rgba(0,0,0,0.10)",
  },
};
