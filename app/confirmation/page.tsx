"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Confirmation() {
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem("streamy_order");

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  if (!order) {
    return <div style={{ padding: 40 }}>Aucune commande trouvée.</div>;
  }

  // ✅ NOUVELLE LOGIQUE : récupérer tous les noms des services
  const serviceNames =
    order.items?.map((item: any) => item.productName).join(", ") ||
    "Non défini";

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Merci pour votre commande 🎉</h1>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 16,
          background: "#f8fafc",
          maxWidth: 600,
        }}
      >
        <p>
          <strong>Numéro :</strong> {order.orderNumber}
        </p>
        <p>
          <strong>Total :</strong> {order.total} FCFA
        </p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Détails de la commande :</h3>

        {/* ✅ SERVICE GLOBAL */}
        <p>
          <strong>Service :</strong> {serviceNames}
        </p>

        {/* On garde le détail individuel en dessous */}
        {order.items &&
          order.items.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                padding: 10,
                marginBottom: 10,
                background: "#ffffff",
                borderRadius: 10,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p>
                <strong>Service :</strong> {item.productName}
              </p>
              <p>
                <strong>Type :</strong> {item.type}
              </p>
              <p>
                <strong>Durée :</strong> {item.duration}
              </p>
              <p>
                <strong>Prix :</strong> {item.price} FCFA
              </p>
            </div>
          ))}

        <p>
          <strong>Date :</strong> {order.date}
        </p>
        <p>
          <strong>Numéro WhatsApp :</strong> {order.whatsappNumber}
        </p>
        <p>
          <strong>Mode de paiement :</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Statut :</strong> En attente de paiement
        </p>

        {/* ✅ BOUTON WHATSAPP */}
        <button
          onClick={() => {
            const message = encodeURIComponent(
              `Bonjour Streamy 👋
Voici la preuve de paiement pour la commande ${order.orderNumber}.

Service(s) : ${serviceNames}

Merci.`
            );

            window.open(`https://wa.me/221781242647?text=${message}`, "_blank");
          }}
          style={{
            marginTop: 20,
            padding: "14px 20px",
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          📲 Envoyer la preuve
        </button>

        {/* ✅ BOUTON RETOUR */}
        <button
          onClick={() => {
            router.push("/abonnements");
          }}
          style={{
            marginTop: 12,
            padding: "14px 20px",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          🔙 Retour aux abonnements
        </button>
      </div>
    </main>
  );
}
