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
        {/* TITRE */}
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>
          Conditions Générales d’Utilisation
        </h1>

        <p style={{ color: "#64748B", marginBottom: 30 }}>
          Dernière mise à jour : 20 mai 2024
        </p>

        {/* INTRO */}
        <p>
          Bienvenue sur Streamy. En accédant au site et en utilisant nos
          services, vous acceptez pleinement et sans réserve les présentes
          Conditions Générales d’Utilisation (CGU).
        </p>

        {/* 1 */}
        <h3>1. Acceptation des conditions</h3>
        <p>
          L’utilisation du site Streamy implique l’acceptation expresse des
          présentes CGU. Si vous n’acceptez pas tout ou partie de ces
          conditions, vous devez cesser immédiatement l’utilisation du site.
        </p>

        {/* 2 */}
        <h3>2. Description des services</h3>
        <p>
          Streamy est une plateforme de vente de produits et services
          numériques, incluant notamment :
        </p>
        <ul>
          <li>abonnements de streaming et services numériques,</li>
          <li>outils et accès dématérialisés,</li>
          <li>contenus numériques livrés par voie électronique.</li>
        </ul>
        <p>
          Tous les produits sont livrés exclusivement par voie électronique.
          Streamy agit en tant que revendeur indépendant et n’est ni affilié, ni
          partenaire officiel des marques tierces, sauf mention expresse.
        </p>

        {/* 3 */}
        <h3>3. Capacité juridique</h3>
        <p>
          Les services sont accessibles à toute personne disposant de la
          capacité juridique. Les mineurs doivent obtenir l’autorisation de leur
          représentant légal avant toute utilisation.
        </p>

        {/* 4 */}
        <h3>4. Comptes utilisateurs</h3>
        <p>
          Certaines fonctionnalités nécessitent la création d’un compte
          utilisateur. L’utilisateur est seul responsable :
        </p>
        <ul>
          <li>de la confidentialité de ses identifiants,</li>
          <li>de toute activité réalisée depuis son compte.</li>
        </ul>
        <p>
          Streamy décline toute responsabilité en cas d’utilisation frauduleuse
          due à une négligence de l’utilisateur.
        </p>

        {/* 5 */}
        <h3>5. Paiements</h3>
        <p>
          Les paiements sont traités par des prestataires de paiement sécurisés.
          Streamy ne stocke aucune donnée bancaire sensible.
        </p>
        <p>
          Tout achat est ferme et définitif après validation du paiement, sous
          réserve des dispositions prévues dans la politique de remboursement.
        </p>

        {/* 6 */}
        <h3>6. Utilisation acceptable</h3>
        <p>L’utilisateur s’engage à :</p>
        <ul>
          <li>utiliser le site de manière légale et conforme,</li>
          <li>respecter les lois et réglementations en vigueur,</li>
          <li>
            ne pas détourner, revendre ou exploiter abusivement les services.
          </li>
        </ul>
        <p>
          Tout usage abusif pourra entraîner la suspension ou la résiliation du
          compte sans préavis.
        </p>

        {/* 7 */}
        <h3>7. Propriété intellectuelle</h3>
        <p>
          Tous les contenus présents sur le site (textes, images, logos, design)
          sont protégés par les droits de propriété intellectuelle.
        </p>
        <p>
          Toute reproduction ou exploitation non autorisée est strictement
          interdite.
        </p>

        {/* 8 */}
        <h3>8. Limitation de responsabilité</h3>
        <p>
          Streamy ne saurait être tenue responsable des interruptions,
          restrictions ou modifications imposées par des plateformes tierces.
        </p>
        <p>
          L’utilisateur reconnaît utiliser les services à ses propres risques.
        </p>

        {/* 9 */}
        <h3>9. Modifications</h3>
        <p>
          Streamy se réserve le droit de modifier les présentes CGU à tout
          moment. La version en vigueur est celle publiée sur le site.
        </p>

        {/* 10 */}
        <h3>10. Résiliation</h3>
        <p>
          Streamy se réserve le droit de suspendre ou de résilier un compte sans
          préavis en cas de non-respect des CGU ou de comportement abusif.
        </p>

        {/* CONTACT */}
        <h3>11. Contact</h3>
        <p>
          Pour toute question relative aux présentes conditions, vous pouvez
          contacter notre service client :
        </p>
        <p>
          📧 <strong>contactstreamy.sn@gmail.com</strong>
        </p>

        {/* BOUTON RETOUR */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            justifyContent: "center",
          }}
        >
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
