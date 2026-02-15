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
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);

        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } else {
        router.push("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p style={{ padding: "40px" }}>Chargement...</p>;
  if (!isAdmin) return null;

  // 🔥 VALIDER COMMANDE + LIER ABONNEMENT
  const validateOrder = async (order: any) => {
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        status: "paid",
      });

      const userRef = doc(db, "users", order.userId);
      await updateDoc(userRef, {
        subscriptions: arrayUnion({
          serviceName: order.serviceName,
          price: order.price,
          startDate: new Date(),
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

  // 🔥 SUPPRIMER COMMANDE
  const removeOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      alert("Erreur suppression");
    }
  };

  // 🔥 FILTRAGE
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) =>
          filter === "pending" ? o.status === "pending" : o.status === "paid"
        );

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Espace Administrateur</h1>

      {/* 🔢 STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
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

      {/* 🔘 FILTRE */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>Tous</button>
        <button onClick={() => setFilter("pending")}>En attente</button>
        <button onClick={() => setFilter("paid")}>Payées</button>
      </div>

      {/* 📦 COMMANDES */}
      <h2>Commandes</h2>

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>Service :</strong> {order.serviceName}
          </p>
          <p>
            <strong>Prix :</strong> {order.price} FCFA
          </p>
          <p>
            <strong>Email client :</strong> {order.email}
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
                style={{
                  background: "green",
                  color: "white",
                  marginRight: "10px",
                }}
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
