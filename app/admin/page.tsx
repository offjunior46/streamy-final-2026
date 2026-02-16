"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || userSnap.data().role !== "admin") {
        router.push("/");
        return;
      }

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrders(
        ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const validateOrder = async (order: any) => {
    const orderRef = doc(db, "orders", order.id);

    await updateDoc(orderRef, {
      status: "paid",
    });

    window.location.reload();
  };

  const removeOrder = async (id: string) => {
    await deleteDoc(doc(db, "orders", id));
    window.location.reload();
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Espace Administrateur</h1>

      <h2 style={{ marginTop: 30 }}>Commandes</h2>

      {orders.length === 0 && <p>Aucune commande</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginTop: 15,
            borderRadius: 8,
          }}
        >
          <p>
            <strong>Service:</strong> {order.serviceName}
          </p>

          <p>
            <strong>Prix:</strong> {order.price} FCFA
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: order.status === "paid" ? "green" : "orange",
              }}
            >
              {order.status}
            </span>
          </p>

          {order.status === "pending" && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => validateOrder(order)}
                style={{
                  background: "green",
                  color: "white",
                  marginRight: 10,
                }}
              >
                Valider
              </button>

              <button
                onClick={() => removeOrder(order.id)}
                style={{
                  background: "red",
                  color: "white",
                }}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
