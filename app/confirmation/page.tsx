"use client";

import { useEffect, useState } from "react";

export default function Confirmation() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("streamy_order");

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  if (!order) {
    return <div style={{ padding: 40 }}>Aucune commande trouvée.</div>;
  }

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
                <strong>Service :</strong> {item.name}
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
          <strong>Mode de réception :</strong> {order.deliveryMethod}
        </p>
        <p>
          <strong>Mode de paiement :</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Statut :</strong> En attente de paiement
        </p>

        <button
          onClick={() => {
            const message = encodeURIComponent(
              `Bonjour Streamy, voici la preuve de paiement pour la commande ${order.orderNumber}`
            );

            window.open(`https://wa.me/221781242647?text=${message}`, "_blank");
          }}
          style={{
            marginTop: 20,
            padding: "14px 20px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          📲 Envoyer la preuve
        </button>
      </div>
    </main>
  );
}
