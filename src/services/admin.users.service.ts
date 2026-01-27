import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export type AdminUser = {
  uid: string;
  email: string;
  name?: string | null;
  role: "employee" | "manager" | "admin";
  companyId?: string | null;
  branchId?: string | null;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const q = query(
    collection(db, "users"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    uid: doc.id,
    ...(doc.data() as Omit<AdminUser, "uid">),
  }));
}
