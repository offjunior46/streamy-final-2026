"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type Subscription = {
  id: string;
  serviceName: string;
  price: number;
  startDate?: Timestamp;
  endDate?: Timestamp;
  status?: string;
};

export default function MonComptePage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const router = useRouter();

  // 🔥 Format date helper
  const formatDate = (ts?: Timestamp) => {
    if (!ts) return "--";
    return ts.toDate().toLocaleString();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const subsRef = collection(db, "users", user.uid, "subscriptions");
        const subsSnap = await getDocs(subsRef);

        const subs = subsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Subscription[];

        setSubscriptions(subs);
      } catch (err) {
        console.error("Erreur récupération abonnements:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p style={{ padding: "40px" }}>Chargement...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: 900 }}>
      <h1 style={{ marginBottom: 30 }}>Mon compte</h1>

      <h2 style={{ marginBottom: 20 }}>Mes abonnements</h2>

      {subscriptions.length === 0 && <p>Aucun abonnement actif.</p>}

      {subscriptions.map((sub) => {
        const expired =
          sub.endDate && sub.endDate.toDate().getTime() < Date.now();

        return (
          <div
            key={sub.id}
            style={{
              border: "1px solid #eee",
              padding: 20,
              borderRadius: 10,
              marginBottom: 20,
              background: "white",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {sub.serviceName}
            </div>

            <div style={{ color: "#666", marginTop: 6 }}>
              Date d’activation : <strong>{formatDate(sub.startDate)}</strong>
            </div>

            <div style={{ color: "#666", marginTop: 4 }}>
              Date d’expiration : <strong>{formatDate(sub.endDate)}</strong>
            </div>

            <div style={{ marginTop: 8 }}>
              Prix : <strong>{sub.price ?? 0} FCFA</strong>
            </div>

            <div style={{ marginTop: 8 }}>
              Statut :{" "}
              <span
                style={{
                  fontWeight: 700,
                  color: expired ? "crimson" : "green",
                }}
              >
                {expired ? "expiré" : "actif"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
