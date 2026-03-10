import { NextResponse } from "next/server";
import { db } from "@/app/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

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
      return NextResponse.json({ message: "Order not found" });
    }

    const orderDoc = snapshot.docs[0];

    await updateDoc(orderDoc.ref, {
      status: "paid",
      paidAt: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("IPN error:", error);
    return NextResponse.json({ error: "IPN error" });
  }
}
