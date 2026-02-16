"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const MAIN_ADMIN_EMAIL = "contactstreamy.sn@gmail.com";

  // 🔐 Vérification admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        const isMainAdmin = user.email === MAIN_ADMIN_EMAIL;
        const isRoleAdmin =
          userSnap.exists() && userSnap.data().role === "admin";

        if (!isMainAdmin && !isRoleAdmin) {
          router.push("/");
          return;
        }

        setIsAdmin(true);

        // Charger utilisateurs
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsers(
          usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        // Charger commandes
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        setOrders(
          ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error(error);
        router.push("/");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;
  if (!isAdmin) return null;

  // 🔥 Valider commande
  const validateOrder = async (order: any) => {
    try {
      const startDate = new Date();
      const endDate = new Date(startDate);

      if (order.serviceName === "Snapchat+") {
        endDate.setMonth(endDate.getMonth() + 3);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Mettre commande paid
      await updateDoc(doc(db, "orders", order.id), {
        status: "paid",
        validatedAt: new Date(),
      });

      // Ajouter abonnement au user
      await updateDoc(doc(db, "users", order.userId), {
        subscriptions: arrayUnion({
          serviceName: order.serviceName,
          price: order.price,
          startDate,
          endDate,
          status: "active",
        }),
      });

      alert("Commande validée ✅");

      // Refresh local
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o))
      );
    } catch (error) {
      console.error(error);
      alert("Erreur validation");
    }
  };

  // 🗑 Supprimer commande
  const removeOrder = async (id: string) => {
    await deleteDoc(doc(db, "orders", id));
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // 📊 Stats
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const paidOrders = orders.filter((o) => o.status === "paid").length;

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div style={{ padding: 40 }}>
      <h1>Espace Administrateur</h1>

      {/* STATS */}
      <div style={{ marginTop: 20, marginBottom: 30 }}>
        <p>Total utilisateurs : {totalUsers}</p>
        <p>Total commandes : {totalOrders}</p>
        <p>En attente : {pendingOrders}</p>
        <p>Payées : {paidOrders}</p>
      </div>

      {/* FILTRE */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFilter("all")}>Tous</button>
        <button onClick={() => setFilter("pending")}>En attente</button>
        <button onClick={() => setFilter("paid")}>Payées</button>
      </div>

      {/* COMMANDES */}
      <h2>Commandes</h2>

      {filteredOrders.length === 0 && <p>Aucune commande</p>}

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
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
                ✔ Valider
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
