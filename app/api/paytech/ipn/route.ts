import { NextResponse } from "next/server";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

function normalizePhone(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");

  if (digits.startsWith("221")) return `+${digits}`;
  if (digits.startsWith("0")) return `+221${digits.slice(1)}`;
  return `+221${digits}`;
}

function formatFCFA(amount: number) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { ref_command, payment_status } = data;

    if (payment_status !== "completed") {
      return NextResponse.json({ message: "Payment not completed" });
    }

    const q = query(
      collection(db, "orders"),
      where("orderNumber", "==", ref_command)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const orderDoc = snapshot.docs[0];
    const order = orderDoc.data() as any;

    if (order.status === "paid") {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    await updateDoc(orderDoc.ref, {
      status: "paid",
      paidAt: new Date(),
    });

    const instance = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;

    if (instance && token && order.whatsappNumber) {
      const phone = normalizePhone(order.whatsappNumber);

      const itemsText =
        order.items && Array.isArray(order.items)
          ? order.items
              .map((item: any) => {
                const product = item.productName || "Produit";
                const duration = item.duration ? ` - ${item.duration}` : "";
                return `• ${product}${duration}`;
              })
              .join("\n")
          : "• Produit commandé";

      const clientName =
        order.firstName || order.customerName || "cher client";

      const message = `🎉 *Merci pour votre commande !*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bonjour *${clientName}*,

✅ Votre commande a été reçue avec succès.
Voici les informations de votre achat :

*Numéro de commande :* ${order.orderNumber || ref_command}
*Produit(s) :*
${itemsText}
*Prix total :* ${formatFCFA(order.total || 0)}

Le produit que vous avez commandé vous sera bientôt envoyé.
Merci de bien vouloir patienter ⏳

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Besoin d'assistance ?*
- Mail : contactstreamy.sn@gmail.com

Merci pour votre confiance 🙏
*Equipe Streamy*`;

      const response = await fetch(
        `https://api.ultramsg.com/${instance}/messages/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token,
            to: phone,
            body: message,
          }),
        }
      );

      const result = await response.text();
      console.log("UltraMsg response:", result);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IPN error:", error);
    return NextResponse.json({ error: "IPN error" }, { status: 500 });
  }
}
