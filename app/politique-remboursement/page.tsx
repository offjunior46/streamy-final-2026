"use client";

import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui, Arial" }}>
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          lineHeight: 1.8,
          fontSize: 16,
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>
          Politique de remplacement et de remboursement
        </h1>

        <p style={{ color: "#64748B", marginBottom: 30 }}>
          Dernière mise à jour : 28 janvier 2026
        </p>

        <p>
          Nous vous remercions pour la confiance que vous accordez à Streamy. La
          présente politique vise à définir de manière claire et transparente
          les conditions de remplacement et de remboursement applicables aux
          abonnements et services numériques proposés sur notre plateforme.
        </p>

        <h3>1. Champ d’application</h3>
        <p>
          La présente politique s’applique exclusivement aux produits et
          abonnements numériques vendus par Streamy, notamment les services de
          streaming, abonnements musicaux, outils numériques et autres services
          dématérialisés.
        </p>

        <h3>2. Conditions d’éligibilité au remplacement ou remboursement</h3>
        <p>Une demande peut être prise en compte uniquement si :</p>
        <ul>
          <li>
            Le service ou l’abonnement concerné présente un dysfonctionnement
            avéré non imputable à une mauvaise utilisation du client.
          </li>
          <li>
            La réclamation est effectuée dans un délai raisonnable après la
            livraison.
          </li>
          <li>
            Les informations nécessaires à la vérification (captures, messages
            d’erreur, identifiants, etc.) sont fournies.
          </li>
        </ul>

        <h3>3. Politique spécifique aux abonnements numériques</h3>
        <p>Les abonnements numériques étant des produits immatériels :</p>
        <ul>
          <li>
            Aucun remboursement n’est accordé pour un abonnement déjà activé et
            fonctionnel.
          </li>
          <li>
            En cas de problème technique confirmé, un remplacement de l’accès
            est proposé en priorité.
          </li>
          <li>
            Si le remplacement s’avère impossible, une étude de remboursement
            pourra être engagée après vérification par notre équipe technique.
          </li>
        </ul>

        <h3>4. Cas de remplacement</h3>
        <ul>
          <li>Accès non fonctionnel à la livraison.</li>
          <li>Identifiants incorrects ou inexploitables.</li>
          <li>Interruption prématurée du service non causée par le client.</li>
        </ul>
        <p>Le remplacement est effectué sans frais supplémentaires.</p>

        <h3>5. Délais de traitement</h3>
        <p>
          Les demandes sont généralement traitées dans un délai de 24 à 72
          heures. Les délais peuvent varier selon le service concerné et la
          complexité du problème.
        </p>

        <h3>6. Délais de remboursement</h3>
        <p>Lorsqu’un remboursement est validé :</p>
        <ul>
          <li>
            Le traitement s’effectue dans un délai compris entre 48 heures et 15
            jours ouvrables.
          </li>
          <li>
            Le délai dépend du moyen de paiement utilisé (Wave, Orange Money,
            autres services de paiement).
          </li>
        </ul>
        <p>
          Streamy ne saurait être tenue responsable des délais imposés par les
          prestataires de paiement.
        </p>

        <h3>7. Exclusions</h3>
        <ul>
          <li>Abonnement livré et fonctionnant normalement.</li>
          <li>
            Utilisation abusive ou non conforme aux conditions d’utilisation.
          </li>
          <li>Partage non autorisé des accès.</li>
          <li>Tentative de fraude ou fausse déclaration.</li>
          <li>Demande effectuée hors délais raisonnables.</li>
        </ul>

        <h3>8. Assistance et support</h3>
        <p>
          Streamy garantit que tous les accès fournis sont fonctionnels au
          moment de la livraison. En cas de difficulté, notre équipe support
          reste disponible pour vous assister et proposer une solution adaptée.
        </p>

        <p>
          Pour toute question relative à cette politique, veuillez contacter
          notre service client via nos canaux officiels.
        </p>

        {/* BOUTON RETOUR */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/">
            <button
              style={{
                padding: "14px 22px",
                borderRadius: 16,
                border: "none",
                background: "#ff9f2d",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Retour à l’accueil
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
