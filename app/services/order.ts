import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "../../firebase";

export const createOrder = async (
  userId: string,
  email: string | null,
  serviceName: string,
  price: number,
  customerWhatsapp: string
) => {
  return await addDoc(collection(db, "orders"), {
    userId,
    email,
    serviceName,
    price,
    status: "pending",
    customerWhatsapp,
    createdAt: serverTimestamp(),
  });
};
