"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function MonComptePage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setSubscriptions(data.subscriptions || []);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p style={{ padding: "40px" }}>Chargement...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Mon compte</h1>

      <h2>Mes abonnements actifs</h2>

      {subscriptions.length === 0 && <p>Aucun abonnement actif.</p>}

      {subscriptions.map((sub, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #4CAF50",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>Service :</strong> {sub.serviceName}
          </p>
          <p>
            <strong>Prix :</strong> {sub.price} FCFA
          </p>
          <p>
            <strong>Date début :</strong>{" "}
            {sub.startDate?.toDate
              ? sub.startDate.toDate().toLocaleString()
              : ""}
          </p>
          <p>
            <strong>Status :</strong> {sub.status}
          </p>
        </div>
      ))}
    </div>
  );
}
