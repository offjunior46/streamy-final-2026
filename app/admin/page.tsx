"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

/**
 * ✅ Admin page (Next.js App Router)
 * - Vérifie admin via users/{uid}.role === "admin"
 * - Liste commandes (orders) + filtres + recherche
 * - Validation commande => status "paid" + création abonnement (dates start/end) + historique
 * - Affiche abonnements actifs/expirés + renouvellement manuel + expiration (sync)
 *
 * 🔧 Dépendances Firestore attendues :
 * - Collection "users" (doc id = uid) avec au minimum: { email, role }
 * - Collection "orders" : { userId, serviceName, price, status, email?, createdAt? }
 * - Sous-collection "users/{uid}/subscriptions" (créée à la validation)
 * - Sous-collection "users/{uid}/subscriptionHistory" (créée à la validation / renouvellement)
 */

type OrderStatus = "pending" | "paid" | string;

type OrderDoc = {
  id: string;
  userId: string;
  serviceName: string;
  price: number;
  status: OrderStatus;
  email?: string;
  createdAt?: any;
};

type UserDoc = {
  id: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  whatsapp?: string;
};

type SubscriptionDoc = {
  id: string;
  serviceName: string;
  price: number;
  startDate: Timestamp;
  endDate: Timestamp;
  status: "active" | "expired" | "cancelled";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  orderId?: string;
};

function formatDate(ts?: Timestamp | null) {
  if (!ts) return "—";
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function isExpired(sub: SubscriptionDoc) {
  return sub.endDate?.toDate?.()
    ? sub.endDate.toDate().getTime() < Date.now()
    : false;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // Ajustement si le mois n'a pas le même nombre de jours
  // ex: 31 -> février
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function durationMonthsForService(serviceName: string) {
  // Snapchat+ = 3 mois, sinon 1 mois (comme ton ancienne logique)
  if ((serviceName || "").toLowerCase().includes("snapchat")) return 3;
  return 1;
}

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminUid, setAdminUid] = useState<string | null>(null);

  const [users, setUsers] = useState<UserDoc[]>([]);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [subsByUser, setSubsByUser] = useState<
    Record<string, SubscriptionDoc[]>
  >({});

  // UI state
  const [tab, setTab] = useState<"orders" | "subs">("orders");
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "paid">(
    "pending"
  );
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");

  // --------- AUTH + ADMIN CHECK ---------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          router.push("/");
          return;
        }

        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists() || snap.data()?.role !== "admin") {
          router.push("/");
          return;
        }

        setAdminUid(u.uid);
        setLoading(false);
      } catch (e) {
        console.error(e);
        router.push("/");
      }
    });

    return () => unsub();
  }, [router]);

  // --------- LOAD DATA ---------
  useEffect(() => {
    if (!adminUid) return;

    const load = async () => {
      setNotice("");
      try {
        // USERS
        const usersSnap = await getDocs(collection(db, "users"));
        const usersList: UserDoc[] = usersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setUsers(usersList);

        // ORDERS
        const ordersSnap = await getDocs(collection(db, "orders"));
        const ordersList: OrderDoc[] = ordersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setOrders(ordersList);

        // SUBS (par user) — on charge les subscriptions de chaque user (admin only)
        const byUser: Record<string, SubscriptionDoc[]> = {};
        // ⚠️ simple & safe : on limite au usersList (souvent petit)
        for (const u of usersList) {
          const subCol = collection(db, "users", u.id, "subscriptions");
          const q = query(subCol, orderBy("endDate", "desc"));
          const subSnap = await getDocs(q);
          byUser[u.id] = subSnap.docs.map((sd) => ({
            id: sd.id,
            ...(sd.data() as any),
          }));
        }
        setSubsByUser(byUser);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, [adminUid]);

  // --------- DERIVED ---------
  const filteredOrders = useMemo(() => {
    const s = search.trim().toLowerCase();

    return orders
      .filter((o) => {
        if (orderFilter === "pending") return o.status === "pending";
        if (orderFilter === "paid") return o.status === "paid";
        return true;
      })
      .filter((o) => {
        if (!s) return true;
        const blob = `${o.serviceName ?? ""} ${o.email ?? ""} ${
          o.userId ?? ""
        } ${o.status ?? ""}`.toLowerCase();
        return blob.includes(s);
      })
      .sort((a, b) =>
        a.status === "pending" && b.status !== "pending" ? -1 : 0
      );
  }, [orders, orderFilter, search]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const paid = orders.filter((o) => o.status === "paid").length;

    let activeSubs = 0;
    let expiredSubs = 0;

    Object.values(subsByUser).forEach((arr) => {
      arr.forEach((s) => {
        const exp = isExpired(s) || s.status === "expired";
        if (exp) expiredSubs += 1;
        else activeSubs += 1;
      });
    });

    return { totalUsers, totalOrders, pending, paid, activeSubs, expiredSubs };
  }, [users, orders, subsByUser]);

  // --------- HELPERS ---------
  const getUserLabel = (uid: string) => {
    const u = users.find((x) => x.id === uid);
    if (!u) return uid;
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    return name ? `${name} (${u.email ?? uid})` : `${u.email ?? uid}`;
  };

  // --------- ACTIONS (ORDERS) ---------
  const validateOrder = async (order: OrderDoc) => {
    if (!order?.id || !order?.userId) return;

    setBusyId(order.id);
    setNotice("");

    try {
      // 1) set order paid
      await updateDoc(doc(db, "orders", order.id), { status: "paid" });

      // 2) create subscription (users/{uid}/subscriptions)
      const start = new Date();
      const months = durationMonthsForService(order.serviceName);
      const end = addMonths(start, months);

      const subPayload = {
        serviceName: order.serviceName,
        price: Number(order.price ?? 0),
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        status: "active" as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        orderId: order.id,
      };

      const subRef = await addDoc(
        collection(db, "users", order.userId, "subscriptions"),
        subPayload
      );

      // 3) history (users/{uid}/subscriptionHistory)
      await addDoc(
        collection(db, "users", order.userId, "subscriptionHistory"),
        {
          type: "activated",
          subscriptionId: subRef.id,
          ...subPayload,
        }
      );

      // 4) optional: store small array history in users doc (safe if you want)
      // (Si tu ne veux pas de champs gros, tu peux enlever)
      await setDoc(
        doc(db, "users", order.userId),
        {
          subscriptions: arrayUnion({
            subscriptionId: subRef.id,
            ...subPayload,
          }),
        },
        { merge: true }
      );

      // UI update
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o))
      );
      setSubsByUser((prev) => ({
        ...prev,
        [order.userId]: [
          { id: subRef.id, ...(subPayload as any) },
          ...(prev[order.userId] ?? []),
        ],
      }));

      setNotice("✅ Commande validée + abonnement activé.");
    } catch (e) {
      console.error(e);
      setNotice("❌ Erreur lors de la validation (règles Firestore ?).");
    } finally {
      setBusyId(null);
    }
  };

  const removeOrder = async (orderId: string) => {
    if (!orderId) return;
    setBusyId(orderId);
    setNotice("");

    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setNotice("🗑️ Commande supprimée.");
    } catch (e) {
      console.error(e);
      setNotice("❌ Erreur suppression commande.");
    } finally {
      setBusyId(null);
    }
  };

  // --------- ACTIONS (SUBSCRIPTIONS) ---------
  const renewSubscription = async (
    userId: string,
    sub: SubscriptionDoc,
    monthsOverride?: number
  ) => {
    setBusyId(sub.id);
    setNotice("");

    try {
      const months =
        monthsOverride ?? durationMonthsForService(sub.serviceName);

      // renewal: if expired, restart from now; else extend from current endDate
      const now = new Date();
      const base = isExpired(sub) ? now : sub.endDate.toDate();
      const newEnd = addMonths(base, months);

      const subRef = doc(db, "users", userId, "subscriptions", sub.id);
      await updateDoc(subRef, {
        endDate: Timestamp.fromDate(newEnd),
        status: "active",
        updatedAt: Timestamp.now(),
      });

      await addDoc(collection(db, "users", userId, "subscriptionHistory"), {
        type: "renewed",
        subscriptionId: sub.id,
        serviceName: sub.serviceName,
        price: sub.price,
        startDate: sub.startDate,
        oldEndDate: sub.endDate,
        newEndDate: Timestamp.fromDate(newEnd),
        createdAt: Timestamp.now(),
      });

      // UI update
      setSubsByUser((prev) => ({
        ...prev,
        [userId]: (prev[userId] ?? []).map((s) =>
          s.id === sub.id
            ? {
                ...s,
                endDate: Timestamp.fromDate(newEnd),
                status: "active",
                updatedAt: Timestamp.now(),
              }
            : s
        ),
      }));

      setNotice("✅ Abonnement renouvelé.");
    } catch (e) {
      console.error(e);
      setNotice("❌ Erreur renouvellement.");
    } finally {
      setBusyId(null);
    }
  };

  const setSubscriptionStatus = async (
    userId: string,
    subId: string,
    status: "expired" | "cancelled"
  ) => {
    setBusyId(subId);
    setNotice("");

    try {
      await updateDoc(doc(db, "users", userId, "subscriptions", subId), {
        status,
        updatedAt: Timestamp.now(),
      });

      await addDoc(collection(db, "users", userId, "subscriptionHistory"), {
        type: status === "expired" ? "expired" : "cancelled",
        subscriptionId: subId,
        createdAt: Timestamp.now(),
      });

      setSubsByUser((prev) => ({
        ...prev,
        [userId]: (prev[userId] ?? []).map((s) =>
          s.id === subId ? { ...s, status } : s
        ),
      }));

      setNotice(
        status === "expired"
          ? "✅ Marqué comme expiré."
          : "✅ Abonnement annulé."
      );
    } catch (e) {
      console.error(e);
      setNotice("❌ Erreur mise à jour abonnement.");
    } finally {
      setBusyId(null);
    }
  };

  // Optionnel : synchroniser les expirations (écritures Firestore)
  const syncExpirations = async () => {
    setNotice("");
    let updates = 0;

    try {
      for (const u of users) {
        const list = subsByUser[u.id] ?? [];
        for (const s of list) {
          const shouldBeExpired = isExpired(s);
          if (shouldBeExpired && s.status === "active") {
            await updateDoc(doc(db, "users", u.id, "subscriptions", s.id), {
              status: "expired",
              updatedAt: Timestamp.now(),
            });
            updates++;
          }
        }
      }

      if (updates > 0) {
        // refresh local
        setSubsByUser((prev) => {
          const next = { ...prev };
          for (const uid of Object.keys(next)) {
            next[uid] = (next[uid] ?? []).map((s) =>
              isExpired(s) && s.status === "active"
                ? { ...s, status: "expired" }
                : s
            );
          }
          return next;
        });
      }

      setNotice(
        updates
          ? `✅ Expirations synchronisées (${updates}).`
          : "✅ Rien à synchroniser."
      );
    } catch (e) {
      console.error(e);
      setNotice("❌ Erreur sync expirations (règles Firestore ?).");
    }
  };

  // --------- RENDER ---------
  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;
  if (!adminUid) return null;

  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 14 }}>Espace Administrateur</h1>

      {/* Notice */}
      {notice && (
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 10,
            background: "#fafafa",
          }}
        >
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => setTab("orders")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: tab === "orders" ? "#111" : "white",
            color: tab === "orders" ? "white" : "#111",
            cursor: "pointer",
          }}
        >
          Commandes
        </button>

        <button
          onClick={() => setTab("subs")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: tab === "subs" ? "#111" : "white",
            color: tab === "subs" ? "white" : "#111",
            cursor: "pointer",
          }}
        >
          Abonnements
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {[
          ["Utilisateurs", stats.totalUsers],
          ["Commandes", stats.totalOrders],
          ["En attente", stats.pending],
          ["Payées", stats.paid],
          ["Abonnements actifs", stats.activeSubs],
          ["Abonnements expirés", stats.expiredSubs],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{String(value)}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {tab === "orders" ? (
        <>
          {/* Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setOrderFilter("all")}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: orderFilter === "all" ? "#f2f2f2" : "white",
                  cursor: "pointer",
                }}
              >
                Tous
              </button>
              <button
                onClick={() => setOrderFilter("pending")}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: orderFilter === "pending" ? "#f2f2f2" : "white",
                  cursor: "pointer",
                }}
              >
                En attente
              </button>
              <button
                onClick={() => setOrderFilter("paid")}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  background: orderFilter === "paid" ? "#f2f2f2" : "white",
                  cursor: "pointer",
                }}
              >
                Payées
              </button>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (service, email, userId, status)..."
              style={{
                flex: "1 1 320px",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
          </div>

          <h2 style={{ marginTop: 8 }}>Commandes</h2>

          {filteredOrders.length === 0 && <p>Aucune commande.</p>}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 14,
                marginTop: 12,
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {order.serviceName}
                  </div>
                  <div style={{ color: "#666", marginTop: 4 }}>
                    Date d'achat :{" "}
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <div style={{ color: "#666", marginTop: 4 }}>
                    Client : <strong>{getUserLabel(order.userId)}</strong>
                  </div>
                  <div style={{ color: "#666", marginTop: 2 }}>
                    Email : {order.email ?? "—"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{order.price} FCFA</div>
                  <div style={{ marginTop: 4 }}>
                    Statut :{" "}
                    <span
                      style={{
                        color: order.status === "paid" ? "green" : "orange",
                        fontWeight: 700,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {order.status === "pending" && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    disabled={busyId === order.id}
                    onClick={() => validateOrder(order)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "green",
                      color: "white",
                      cursor: busyId === order.id ? "not-allowed" : "pointer",
                      opacity: busyId === order.id ? 0.7 : 1,
                    }}
                  >
                    ✔ Valider + Activer abonnement
                  </button>

                  <button
                    disabled={busyId === order.id}
                    onClick={() => removeOrder(order.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "red",
                      color: "white",
                      cursor: busyId === order.id ? "not-allowed" : "pointer",
                      opacity: busyId === order.id ? 0.7 : 1,
                    }}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2>Abonnements (par utilisateur)</h2>
            <button
              onClick={syncExpirations}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Synchroniser expirations
            </button>
          </div>

          {users.length === 0 && <p>Aucun utilisateur.</p>}

          {users.map((u) => {
            const subs = subsByUser[u.id] ?? [];
            if (subs.length === 0) return null;

            return (
              <div
                key={u.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 12,
                  padding: 14,
                  marginTop: 12,
                  background: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>{getUserLabel(u.id)}</div>
                    <div style={{ color: "#666", marginTop: 3 }}>
                      UID : {u.id}
                    </div>
                    {u.whatsapp && (
                      <div style={{ color: "#666", marginTop: 3 }}>
                        WhatsApp : {u.whatsapp}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#666" }}>
                      Rôle : <strong>{u.role ?? "—"}</strong>
                    </div>
                    <div style={{ color: "#666", marginTop: 3 }}>
                      Abonnements : <strong>{subs.length}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  {subs.map((s) => {
                    const expired = isExpired(s) || s.status === "expired";
                    return (
                      <div
                        key={s.id}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: 10,
                          padding: 12,
                          marginTop: 10,
                          background: "#fafafa",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800 }}>
                              {s.serviceName}
                            </div>
                            <div style={{ color: "#666", marginTop: 4 }}>
                              Date d'achat :{" "}
                              <strong>{formatDate(s.createdAt)}</strong>
                            </div>
                            <div style={{ color: "#666", marginTop: 4 }}>
                              Activation :{" "}
                              <strong>{formatDate(s.startDate)}</strong>
                            </div>

                            <div style={{ color: "#666", marginTop: 2 }}>
                              Expiration :{" "}
                              <strong>{formatDate(s.endDate)}</strong>
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800 }}>
                              {s.price} FCFA
                            </div>
                            <div style={{ marginTop: 4 }}>
                              Statut :{" "}
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: expired ? "crimson" : "green",
                                }}
                              >
                                {expired ? "expired" : s.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            disabled={busyId === s.id}
                            onClick={() => renewSubscription(u.id, s)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "none",
                              background: "#111",
                              color: "white",
                              cursor:
                                busyId === s.id ? "not-allowed" : "pointer",
                              opacity: busyId === s.id ? 0.7 : 1,
                            }}
                          >
                            Renouveler (auto)
                          </button>

                          <button
                            disabled={busyId === s.id}
                            onClick={() => renewSubscription(u.id, s, 1)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid #ccc",
                              background: "white",
                              cursor:
                                busyId === s.id ? "not-allowed" : "pointer",
                              opacity: busyId === s.id ? 0.7 : 1,
                            }}
                          >
                            +1 mois
                          </button>

                          <button
                            disabled={busyId === s.id}
                            onClick={() => renewSubscription(u.id, s, 3)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid #ccc",
                              background: "white",
                              cursor:
                                busyId === s.id ? "not-allowed" : "pointer",
                              opacity: busyId === s.id ? 0.7 : 1,
                            }}
                          >
                            +3 mois
                          </button>

                          <button
                            disabled={busyId === s.id}
                            onClick={() =>
                              setSubscriptionStatus(u.id, s.id, "expired")
                            }
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "none",
                              background: "orange",
                              color: "white",
                              cursor:
                                busyId === s.id ? "not-allowed" : "pointer",
                              opacity: busyId === s.id ? 0.7 : 1,
                            }}
                          >
                            Marquer expiré
                          </button>

                          <button
                            disabled={busyId === s.id}
                            onClick={() =>
                              setSubscriptionStatus(u.id, s.id, "cancelled")
                            }
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "none",
                              background: "crimson",
                              color: "white",
                              cursor:
                                busyId === s.id ? "not-allowed" : "pointer",
                              opacity: busyId === s.id ? 0.7 : 1,
                            }}
                          >
                            Annuler
                          </button>
                        </div>

                        <div
                          style={{ marginTop: 8, color: "#777", fontSize: 12 }}
                        >
                          ID abonnement : {s.id}{" "}
                          {s.orderId ? ` • Order: ${s.orderId}` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* note */}
          <div style={{ marginTop: 16, color: "#666", fontSize: 13 }}>
            Astuce : les expirations sont calculées via <strong>endDate</strong>
            . Tu peux cliquer “Synchroniser expirations” pour écrire
            automatiquement “expired” sur les abonnements dépassés.
          </div>
        </>
      )}
    </div>
  );
}
