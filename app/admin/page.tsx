"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
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

        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);
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
      <h1>Espace Administrateur</h1>

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
    </div>
  );
}
