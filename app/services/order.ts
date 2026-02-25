import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export type OrderItem = {
  productId: string;
  productName: string;
  type: "solo" | "co";
  duration: string;
  price: number;
};

export const createOrder = async (
  userId: string,
  items: OrderItem[],
  total: number,
  whatsappNumber: string,
  paymentMethod: "wave" | "orange",
  orderNumber: string
) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      orderNumber,
      userId,
      items,
      total,
      whatsappNumber,
      paymentMethod,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return docRef;
  } catch (error) {
    console.error("Erreur création commande :", error);
    throw error;
  }
};
