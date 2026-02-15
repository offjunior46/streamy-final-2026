"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase"; // ⚠️ IMPORTANT
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
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

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setIsAdmin(true);

        // 🔹 Charger utilisateurs
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);

        // 🔹 Charger commandes
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

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Espace Administrateur</h1>

      {/* 🔹 UTILISATEURS */}
      <h2>Utilisateurs inscrits</h2>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>Nom :</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>WhatsApp :</strong> {user.whatsapp}
          </p>
          <p>
            <strong>Rôle :</strong> {user.role || "user"}
          </p>
        </div>
      ))}

      {/* 🔹 COMMANDES */}
      <h2 style={{ marginTop: "40px" }}>Commandes</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #4CAF50",
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
            <strong>Status :</strong> {order.status}
          </p>
        </div>
      ))}
    </div>
  );
}
