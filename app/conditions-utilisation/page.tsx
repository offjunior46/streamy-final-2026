"use client";

import Link from "next/link";

export default function Page() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Conditions Générales d’Utilisation</h1>

        <p style={styles.update}>Dernière mise à jour : 20 mai 2024</p>

        <p style={styles.intro}>
          Bienvenue sur Streamy. En accédant au site et en utilisant nos
          services, vous acceptez pleinement et sans réserve les présentes
          Conditions Générales d’Utilisation (CGU).
        </p>

        {/* SECTIONS */}

        <Section number="1" title="Acceptation des conditions">
          L’utilisation du site implique l’acceptation expresse des présentes
          CGU. Si vous n’acceptez pas tout ou partie de ces conditions, vous
          devez cesser immédiatement l’utilisation du site.
        </Section>

        <Section number="2" title="Description des services">
          <ul style={styles.list}>
            <li>Abonnements de streaming et services numériques</li>
            <li>Outils et accès dématérialisés</li>
            <li>Contenus numériques livrés par voie électronique</li>
          </ul>
          <p style={styles.note}>
            Streamy agit en tant que revendeur indépendant et n’est affilié à
            aucune marque tierce sauf mention expresse.
          </p>
        </Section>

        <Section number="3" title="Capacité juridique">
          Les services sont accessibles à toute personne disposant de la
          capacité juridique. Les mineurs doivent obtenir l’autorisation de leur
          représentant légal.
        </Section>

        <Section number="4" title="Comptes utilisateurs">
          <ul style={styles.list}>
            <li>Responsabilité de la confidentialité des identifiants</li>
            <li>Responsabilité des activités effectuées depuis le compte</li>
          </ul>
          <p style={styles.note}>
            Streamy décline toute responsabilité en cas d’usage frauduleux dû à
            une négligence de l’utilisateur.
          </p>
        </Section>

        <Section number="5" title="Paiements">
          Les paiements sont traités par des prestataires sécurisés. Streamy ne
          stocke aucune donnée bancaire sensible.
          <p style={styles.note}>
            Tout achat est ferme et définitif après validation du paiement, sous
            réserve de la politique de remboursement.
          </p>
        </Section>

        <Section number="6" title="Utilisation acceptable">
          <ul style={styles.list}>
            <li>Utilisation légale et conforme</li>
            <li>Respect des lois en vigueur</li>
            <li>Absence de revente ou exploitation abusive</li>
          </ul>
          <p style={styles.note}>
            Tout usage abusif pourra entraîner la suspension ou la résiliation
            du compte sans préavis.
          </p>
        </Section>

        <Section number="7" title="Propriété intellectuelle">
          Tous les contenus (textes, images, logos, design) sont protégés par
          les droits de propriété intellectuelle. Toute reproduction non
          autorisée est strictement interdite.
        </Section>

        <Section number="8" title="Limitation de responsabilité">
          Streamy ne peut être tenue responsable des interruptions imposées par
          des plateformes tierces. L’utilisateur reconnaît utiliser les services
          à ses propres risques.
        </Section>

        <Section number="9" title="Modifications">
          Streamy se réserve le droit de modifier les présentes CGU à tout
          moment. La version en vigueur est celle publiée sur le site.
        </Section>

        <Section number="10" title="Résiliation">
          Streamy peut suspendre ou résilier un compte sans préavis en cas de
          non-respect des CGU.
        </Section>

        <Section number="11" title="Contact">
          Pour toute question :
          <p style={{ marginTop: 8 }}>
            📧 <strong>contactstreamy.sn@gmail.com</strong>
          </p>
        </Section>

        {/* BOUTON RETOUR */}
        <div style={styles.buttonWrap}>
          <Link href="/">
            <button style={styles.button}>Retour à l’accueil</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ---------------- COMPONENT SECTION ---------------- */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span style={styles.number}>{number}.</span> {title}
      </h2>
      <div style={styles.sectionContent}>{children}</div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eaf6ff, #ffffff)",
    padding: 40,
    fontFamily: "system-ui, Arial",
  },
  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "white",
    padding: 40,
    borderRadius: 24,
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 10,
  },
  update: {
    color: "#64748B",
    marginBottom: 30,
  },
  intro: {
    lineHeight: 1.8,
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 15,
  },
  number: {
    color: "#ff9f2d",
    marginRight: 6,
  },
  sectionContent: {
    lineHeight: 1.8,
    color: "#475569",
  },
  list: {
    paddingLeft: 20,
    lineHeight: 1.8,
  },
  note: {
    marginTop: 10,
    fontWeight: 600,
  },
  buttonWrap: {
    marginTop: 50,
    textAlign: "center",
  },
  button: {
    padding: "14px 24px",
    borderRadius: 18,
    border: "none",
    background: "#ff9f2d",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
  },
};
