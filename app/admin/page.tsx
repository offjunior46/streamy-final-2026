"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setIsAdmin(true);

        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(
          usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        const ordersSnapshot = await getDocs(collection(db, "orders"));
        setOrders(
          ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } else {
        router.push("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p style={{ padding: 40 }}>Chargement...</p>;
  if (!isAdmin) return null;

  // ===============================
  // 🔥 VALIDER COMMANDE
  // ===============================

  const validateOrder = async (order: any) => {
    try {
      const orderRef = doc(db, "orders", order.id);
      const userRef = doc(db, "users", order.userId);

      const startDate = new Date();
      const endDate = new Date(startDate);

      // Snapchat+ = 3 mois
      if (order.serviceName === "Snapchat+") {
        endDate.setMonth(endDate.getMonth() + 3);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // 1️⃣ Passer commande en paid
      await updateDoc(orderRef, {
        status: "paid",
      });

      // 2️⃣ Ajouter abonnement
      await updateDoc(userRef, {
        subscriptions: arrayUnion({
          serviceName: order.serviceName,
          price: order.price,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          status: "active",
        }),
      });

      alert("Commande validée et abonnement activé ✅");

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o))
      );
    } catch (error) {
      console.error(error);
      alert("Erreur validation");
    }
  };

  // ===============================
  // 🗑 SUPPRIMER COMMANDE
  // ===============================

  const removeOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      alert("Erreur suppression");
    }
  };

  // ===============================
  // 🔄 RENOUVELLEMENT MANUEL
  // ===============================

  const renewSubscription = async (userId: string, subscription: any) => {
    try {
      const userRef = doc(db, "users", userId);

      const newEndDate = new Date(subscription.endDate.toDate());

      if (subscription.serviceName === "Snapchat+") {
        newEndDate.setMonth(newEndDate.getMonth() + 3);
      } else {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      }

      await updateDoc(userRef, {
        subscriptions: arrayUnion({
          serviceName: subscription.serviceName,
          price: subscription.price,
          startDate: Timestamp.now(),
          endDate: Timestamp.fromDate(newEndDate),
          status: "active",
        }),
      });

      alert("Renouvellement effectué ✅");
    } catch (error) {
      alert("Erreur renouvellement");
    }
  };

  // ===============================
  // FILTRE
  // ===============================

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) =>
          filter === "pending" ? o.status === "pending" : o.status === "paid"
        );

  // ===============================
  // RENDER
  // ===============================

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>Espace Administrateur</h1>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div>
          <strong>Total utilisateurs</strong>
          <p>{users.length}</p>
        </div>
        <div>
          <strong>Total commandes</strong>
          <p>{orders.length}</p>
        </div>
        <div>
          <strong>En attente</strong>
          <p>{orders.filter((o) => o.status === "pending").length}</p>
        </div>
      </div>

      {/* FILTRE */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFilter("all")}>Tous</button>
        <button onClick={() => setFilter("pending")}>En attente</button>
        <button onClick={() => setFilter("paid")}>Payées</button>
      </div>

      {/* COMMANDES */}
      <h2>Commandes</h2>

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
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
              style={{ color: order.status === "paid" ? "green" : "orange" }}
            >
              {order.status}
            </span>
          </p>

          {order.status === "pending" && (
            <>
              <button
                style={{ background: "green", color: "white", marginRight: 10 }}
                onClick={() => validateOrder(order)}
              >
                ✔ Valider
              </button>

              <button
                style={{ background: "red", color: "white" }}
                onClick={() => removeOrder(order.id)}
              >
                🗑 Supprimer
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
