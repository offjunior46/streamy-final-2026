"use client";

import Link from "next/link";

export default function Page() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>
          Politique de remplacement et de remboursement
        </h1>

        <p style={styles.update}>
          Dernière mise à jour : 28 janvier 2026
        </p>

        <p style={styles.intro}>
          Nous vous remercions pour la confiance que vous accordez à Streamy.
          Cette politique définit de manière claire et transparente les
          conditions de remplacement et de remboursement applicables aux
          abonnements et services numériques proposés sur notre plateforme.
        </p>

        {/* SECTION 1 */}
        <Section
          number="1"
          title="Champ d’application"
        >
          La présente politique s’applique exclusivement aux produits et
          abonnements numériques vendus par Streamy, notamment les services de
          streaming, abonnements musicaux, outils numériques et autres services
          dématérialisés.
        </Section>

        {/* SECTION 2 */}
        <Section
          number="2"
          title="Conditions d’éligibilité"
        >
          <ul style={styles.list}>
            <li>Dysfonctionnement avéré non imputable au client.</li>
            <li>Réclamation effectuée dans un délai raisonnable.</li>
            <li>Informations nécessaires à la vérification fournies.</li>
          </ul>
        </Section>

        {/* SECTION 3 */}
        <Section
          number="3"
          title="Abonnements numériques"
        >
          <ul style={styles.list}>
            <li>Aucun remboursement pour un abonnement activé et fonctionnel.</li>
            <li>En cas de problème confirmé, remplacement prioritaire.</li>
            <li>Si remplacement impossible, étude de remboursement après vérification.</li>
          </ul>
        </Section>

        {/* SECTION 4 */}
        <Section
          number="4"
          title="Cas de remplacement"
        >
          <ul style={styles.list}>
            <li>Accès non fonctionnel à la livraison.</li>
            <li>Identifiants incorrects.</li>
            <li>Interruption prématurée non causée par le client.</li>
          </ul>
          <p style={styles.note}>
            Le remplacement est effectué sans frais supplémentaires.
          </p>
        </Section>

        {/* SECTION 5 */}
        <Section
          number="5"
          title="Délais de traitement"
        >
          Les demandes sont généralement traitées sous 24 à 72 heures.
        </Section>

        {/* SECTION 6 */}
        <Section
          number="6"
          title="Délais de remboursement"
        >
          <ul style={styles.list}>
            <li>Traitement entre 48 heures et 15 jours ouvrables.</li>
            <li>Dépend du moyen de paiement utilisé.</li>
          </ul>
          <p style={styles.note}>
            Streamy ne peut être tenue responsable des délais des prestataires.
          </p>
        </Section>

        {/* SECTION 7 */}
        <Section
          number="7"
          title="Exclusions"
        >
          <ul style={styles.list}>
            <li>Abonnement fonctionnel.</li>
            <li>Utilisation abusive.</li>
            <li>Partage non autorisé.</li>
            <li>Tentative de fraude.</li>
          </ul>
        </Section>

        {/* SECTION 8 */}
        <Section
          number="8"
          title="Assistance et support"
        >
          Notre équipe reste disponible pour vous assister et proposer une
          solution adaptée en cas de difficulté.
        </Section>

        {/* BOUTON RETOUR */}
        <div style={styles.buttonWrap}>
          <Link href="/">
            <button style={styles.button}>
              Retour à l’accueil
            </button>
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