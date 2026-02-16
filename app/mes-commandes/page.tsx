"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  serviceName: string;
  price: number;
  status: string;
  createdAt?: any;
  activationDate?: any;
  expirationDate?: any;
};

export default function MesCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      const list: Order[] = [];

      snap.forEach((doc) => {
        list.push({
          id: doc.id,
          ...(doc.data() as any),
        });
      });

      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return "-";
    return timestamp.toDate().toLocaleString();
  };

  if (loading) return <p style={{ padding: 40 }}>Chargement...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>Mes commandes</h1>

      {orders.length === 0 && <p>Aucune commande trouvée.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            {order.serviceName}
          </div>

          <div style={{ color: "#666", marginTop: 6 }}>
            Date d'achat : <strong>{formatDate(order.createdAt)}</strong>
          </div>

          {order.activationDate && (
            <div style={{ color: "#666", marginTop: 4 }}>
              Date d'activation :{" "}
              <strong>{formatDate(order.activationDate)}</strong>
            </div>
          )}

          {order.expirationDate && (
            <div style={{ color: "#666", marginTop: 4 }}>
              Date d'expiration :{" "}
              <strong>{formatDate(order.expirationDate)}</strong>
            </div>
          )}

          <div style={{ marginTop: 6 }}>
            Prix : <strong>{order.price} FCFA</strong>
          </div>

          <div style={{ marginTop: 4 }}>
            Statut :{" "}
            <strong
              style={{
                color:
                  order.status === "paid"
                    ? "green"
                    : order.status === "pending"
                    ? "orange"
                    : "red",
              }}
            >
              {order.status}
            </strong>
          </div>
        </div>
      ))}

      {/* BOUTON RETOUR À L’ACCUEIL */}
      <div style={{ marginTop: 40 }}>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#f59e0b",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retour à l’accueil
        </button>
      </div>
    </div>
  );
}
