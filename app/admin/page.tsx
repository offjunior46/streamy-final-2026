"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const ADMIN_EMAIL = "contactstreamy.sn@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(list);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // 🔥 Validation commande + création abonnement
  const validateOrder = async (order: any) => {
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (order.serviceName === "Snapchat+") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await updateDoc(doc(db, "orders", order.id), {
      status: "paid",
    });

    await updateDoc(doc(db, "users", order.userId), {
      subscriptions: arrayUnion({
        serviceName: order.serviceName,
        price: order.price,
        startDate,
        endDate,
        status: "active",
      }),
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o))
    );
  };

  const removeOrder = async (orderId: string) => {
    await deleteDoc(doc(db, "orders", orderId));
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div style={{ padding: 40 }}>
      <h1>Espace Administrateur</h1>

      {/* Filtres */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setFilter("all")}>Tous</button>
        <button onClick={() => setFilter("pending")}>En attente</button>
        <button onClick={() => setFilter("paid")}>Payées</button>
      </div>

      <h2 style={{ marginTop: 30 }}>Commandes</h2>

      {filteredOrders.length === 0 && <p>Aucune commande</p>}

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <p>
            <strong>Service :</strong> {order.serviceName}
          </p>
          <p>
            <strong>Prix :</strong> {order.price} FCFA
          </p>
          <p>
            <strong>Email :</strong> {order.email}
          </p>
          <p>
            <strong>Status :</strong>{" "}
            <span
              style={{
                color: order.status === "paid" ? "green" : "orange",
              }}
            >
              {order.status}
            </span>
          </p>

          {order.status !== "paid" && (
            <button
              onClick={() => validateOrder(order)}
              style={{ marginRight: 10 }}
            >
              ✔ Valider
            </button>
          )}

          <button onClick={() => removeOrder(order.id)}>🗑 Supprimer</button>
        </div>
      ))}
    </div>
  );
}
