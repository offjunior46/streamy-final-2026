"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export default function Page() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Utilisateur connecté :", result.user);
      alert("Connexion réussie avec Google ✅");
    } catch (error) {
      console.error("Erreur Google Login :", error);
      alert("Erreur de connexion");
    }
  };

  const brands = [
    { name: "Netflix", src: "/brands/netflix.png" },
    { name: "Prime Video", src: "/brands/prime-video.png" },
    { name: "Hulu", src: "/brands/hulu.png" },
    { name: "Disney+", src: "/brands/disney-plus.png" },
    { name: "Paramount+", src: "/brands/paramount-plus.png" },
    { name: "Spotify", src: "/brands/spotify-1Mois.png" },
    { name: "Deezer", src: "/brands/deezer.png" },
  ];

  // Recherche
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [query]);

  const goAbonnements = () => {
    window.location.href = "/abonnements";
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goAbonnements();
  };

  return (
    <main style={styles.page}>
      {/* =========================
          SECTION 1 — HEADER + HERO
         ========================= */}
      <header style={styles.header}>
        {/* Logo cliquable -> Accueil */}
        <a href="/" style={styles.brandLink}>
          <div style={styles.brand}>
            <img src="/streamy-logo.png" alt="Streamy" style={styles.logo} />
            <span style={styles.brandName}>Streamy</span>
          </div>
        </a>

        <nav style={styles.nav}>
          <a href="/" style={{ ...styles.navBtn, ...styles.navBtnActive }}>
            Accueil
          </a>

          <a href="/abonnements" style={styles.navBtn}>
            Abonnements
          </a>
        </nav>

        <div style={styles.actions}>
          <button style={styles.cartBtn}>🛒 Mon panier</button>
          <button style={styles.loginBtn} onClick={() => setIsLoginOpen(true)}>
            Connexion
          </button>
        </div>
      </header>

      <section style={styles.hero}>
        {/* Recherche */}
        <form style={styles.searchWrap} onSubmit={onSearchSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un abonnement..."
            style={styles.searchInput}
          />
          <button
            type="submit"
            style={styles.searchBtn}
            aria-label="Rechercher"
          >
            🔍
          </button>
        </form>

        <h1 style={styles.slogan}>Payez — Recevez — Profitez</h1>
        <p style={styles.subtitle}>
          Profitez d’abonnements et de services de qualité en quelques clics.
        </p>

        {/* SLIDER (filtré par la recherche) */}
        <div style={styles.sliderShell}>
          <div style={styles.sliderTrack}>
            {[...filteredBrands, ...filteredBrands].map((b, i) => (
              <div key={`${b.name}-${i}`} style={styles.card}>
                <div style={styles.cardImageArea}>
                  <img src={b.src} alt={b.name} style={styles.cardImg} />
                </div>
                <div style={styles.cardLabel}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.ctaWrap}>
          {/* ORANGE + redirection abonnements */}
          <button style={styles.ctaBtnOrange} onClick={goAbonnements}>
            Recommandé pour vous
          </button>
        </div>
      </section>

      {/* =========================
          SECTION 2 — COMMENT SOUSCRIRE
         ========================= */}
      <section style={styles.howSection}>
        <h2 style={styles.howTitle}>Souscrivez à un abonnement</h2>
        <p style={styles.howSubtitle}>En seulement 4 étapes</p>

        <div style={styles.stepsGrid}>
          <div style={{ ...styles.stepCard, background: "#EEF2FF" }}>
            <span style={{ ...styles.stepNumber, color: "#6366F1" }}>01</span>
            <h3 style={styles.stepTitle}>Choix</h3>
            <p style={styles.stepText}>
              Choisissez l’abonnement que vous souhaitez (Netflix, Spotify,
              Prime Video…).
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#FEF3C7" }}>
            <span style={{ ...styles.stepNumber, color: "#F59E0B" }}>02</span>
            <h3 style={styles.stepTitle}>Produit</h3>
            <p style={styles.stepText}>
              Sélectionnez la durée, le type d’offre et vérifiez le prix.
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#FCE7F3" }}>
            <span style={{ ...styles.stepNumber, color: "#EC4899" }}>03</span>
            <h3 style={styles.stepTitle}>Infos</h3>
            <p style={styles.stepText}>
              Renseignez vos informations et choisissez votre mode de livraison.
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#ECFEFF" }}>
            <span style={{ ...styles.stepNumber, color: "#06B6D4" }}>04</span>
            <h3 style={styles.stepTitle}>Paiement</h3>
            <p style={styles.stepText}>
              Payez en toute sécurité et recevez vos accès immédiatement.
            </p>
          </div>
        </div>
      </section>
      {/* ================= RENOUVELER ================= */}
      <section style={styles.howSection}>
        <h2 style={styles.howTitle}>Renouveler votre abonnement</h2>
        <p style={styles.howSubtitle}>
          Conservez vos accès sans interruption, en seulement 4 étapes.
        </p>

        <div style={styles.stepsGrid}>
          <div style={{ ...styles.stepCard, background: "#EEF2FF" }}>
            <span style={{ ...styles.stepNumber, color: "#6366F1" }}>01</span>
            <h3 style={styles.stepTitle}>Service</h3>
            <p style={styles.stepText}>
              Choisissez le service à renouveler (Netflix, Spotify, Prime
              Video…).
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#FEF3C7" }}>
            <span style={{ ...styles.stepNumber, color: "#F59E0B" }}>02</span>
            <h3 style={styles.stepTitle}>Compte existant</h3>
            <p style={styles.stepText}>
              Indiquez que vous possédez déjà un compte à conserver.
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#FCE7F3" }}>
            <span style={{ ...styles.stepNumber, color: "#EC4899" }}>03</span>
            <h3 style={styles.stepTitle}>Vérification</h3>
            <p style={styles.stepText}>
              Renseignez l’email ou l’identifiant du compte à renouveler.
            </p>
          </div>

          <div style={{ ...styles.stepCard, background: "#ECFEFF" }}>
            <span style={{ ...styles.stepNumber, color: "#06B6D4" }}>04</span>
            <h3 style={styles.stepTitle}>Paiement</h3>
            <p style={styles.stepText}>
              Payez en toute sécurité et continuez à profiter immédiatement.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          SECTION 3 — STREAMY C’EST QUOI ?
         ========================= */}
      <section style={styles.aboutSection}>
        <div style={styles.aboutInner}>
          <div style={styles.aboutImgWrap}>
            <img
              src="/brands/streamy.png"
              alt="Streamy, c’est quoi ?"
              style={styles.aboutImg}
            />
          </div>

          <div style={styles.aboutText}>
            <h2 style={styles.aboutTitle}>Streamy, c’est quoi ?</h2>
            <div style={styles.aboutUnderline} />

            <p style={styles.aboutPara}>
              Streamy est votre solution conviviale et rapide pour acheter et
              recevoir des abonnements numériques Netflix, Prime Video, Spotify
              et bien plus en quelques clics.
            </p>

            <p style={styles.aboutPara}>
              <strong>Notre mission :</strong> rendre l’achat de vos abonnements
              préférés simple, sûr et instantané avec une livraison rapide et un
              support réactif. Profitez d’un accès rapide à des contenus
              premium, le tout avec une expérience utilisateur fluide et
              sécurisée.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          SECTION 4 — FOOTER CONTACT
         ========================= */}
      <section style={styles.contactSection}>
        <div style={styles.contactCard}>
          <h2 style={styles.contactTitle}>Où nous contacter ?</h2>
          <div style={styles.socialRow}>
            <a href="https://www.instagram.com/streamy.sn/" target="_blank">
              <img
                src="/social/instagram.png"
                alt="Instagram"
                style={styles.socialIcon}
              />
            </a>

            <a href="https://www.tiktok.com/@streamy.sn" target="_blank">
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

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      {isLoginOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={{ textAlign: "center" }}>Connexion</h2>

            <button style={styles.googleBtn} onClick={handleGoogleLogin}>
              Se connecter avec Google
            </button>

            <div style={{ margin: "20px 0", textAlign: "center" }}>— ou —</div>

            <input placeholder="Email" style={styles.input} />

            <input
              type="password"
              placeholder="Mot de passe"
              style={styles.input}
            />

            <button style={styles.loginSubmit}>Se connecter</button>

            <p
              style={{
                textAlign: "center",
                marginTop: 15,
                cursor: "pointer",
                color: "#0ea5e9",
              }}
            >
              Créer un compte
            </p>

            <button
              style={styles.closeBtn}
              onClick={() => setIsLoginOpen(false)}
            >
              ✕
            </button>
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

  header: {
    background: "white",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  brandLink: { textDecoration: "none", color: "inherit" },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36, objectFit: "contain" },
  brandName: { fontSize: 20, fontWeight: 900 },
  renewSection: {
    marginTop: 60,
    marginBottom: 60,
    textAlign: "center",
  },

  renewStep: {
    background: "#E8F2FF",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    textAlign: "left",
  },

  nav: { display: "flex", gap: 10 },
  navBtn: {
    padding: "8px 14px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    color: "#0f172a",
    display: "inline-flex",
    alignItems: "center",
  },
  navBtnActive: { background: "#eef3ff" },

  actions: { display: "flex", gap: 10 },
  cartBtn: { padding: "8px 14px", borderRadius: 12 },
  loginBtn: {
    padding: "8px 16px",
    borderRadius: 12,
    background: "#ff9f2d",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },

  modalBox: {
    background: "#111827",
    padding: 30,
    borderRadius: 18,
    width: "380px",
    color: "white",
    position: "relative",
  },

  googleBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#0ea5e9",
    border: "none",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #374151",
    marginBottom: 12,
    background: "#1f2937",
    color: "white",
  },

  loginSubmit: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#ff9f2d",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: 18,
  },

  hero: {
    background: "#e9f5ff",
    borderRadius: 20,
    padding: 30,
    textAlign: "center",
  },
  searchWrap: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    background: "white",
    borderRadius: 14,
    overflow: "hidden",
  },
  searchInput: { flex: 1, padding: 14, border: "none", outline: "none" },
  searchBtn: {
    width: 70,
    border: "none",
    background: "#1e90ff",
    color: "white",
    cursor: "pointer",
  },

  slogan: { fontSize: 42, fontWeight: 900, marginTop: 20 },
  subtitle: { opacity: 0.75 },

  sliderShell: {
    marginTop: 30,
    overflow: "hidden",
    background: "white",
    borderRadius: 20,
    padding: 20,
  },
  sliderTrack: {
    display: "flex",
    gap: 16,
    width: "max-content",
    animation: "marquee 20s linear infinite",
  },
  card: {
    width: 200,
    background: "#f9fbff",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImageArea: {
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  cardImg: { width: "100%", height: "100%", objectFit: "contain" },
  cardLabel: { padding: 12, fontWeight: 800 },

  ctaWrap: { marginTop: 20 },
  ctaBtnOrange: {
    padding: "12px 20px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    background: "#ff9f2d",
    border: "none",
  },

  howSection: { marginTop: 50, padding: "40px 20px", textAlign: "center" },
  howTitle: { fontSize: 32, fontWeight: 900, marginBottom: 6 },
  howSubtitle: { color: "#64748B", marginBottom: 30 },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    maxWidth: 1000,
    margin: "0 auto",
  },
  stepCard: {
    borderRadius: 18,
    padding: 22,
    textAlign: "left",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  stepNumber: { fontWeight: 900, fontSize: 18 },
  stepTitle: { marginTop: 10, fontWeight: 800, fontSize: 18 },
  stepText: { marginTop: 8, color: "#475569", lineHeight: 1.4 },

  aboutSection: { marginTop: 10, padding: "30px 0 10px" },
  aboutInner: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#f6f7fb",
    borderRadius: 22,
    padding: 26,
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: 24,
    alignItems: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },
  aboutImgWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  aboutImg: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 18,
    objectFit: "cover",
  },
  aboutText: { padding: "6px 10px" },
  aboutTitle: { fontSize: 36, fontWeight: 900, margin: 0, color: "#1f2937" },
  aboutUnderline: {
    width: 170,
    height: 6,
    background: "#f7b84b",
    borderRadius: 999,
    marginTop: 10,
    marginBottom: 16,
  },
  aboutPara: {
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 16,
    margin: "0 0 14px 0",
  },

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
  paymentNote: { color: "#475569", margin: "10px 0 18px", fontSize: 16 },

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
