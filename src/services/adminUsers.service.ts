import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type AdminUser = {
  uid: string;
  email: string;
  name?: string | null;
  role: "employee" | "manager" | "admin";
  companyId?: string | null;
  branchId?: string | null;
  createdAt?: any;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => ({
    uid: docSnap.id,
    ...(docSnap.data() as Omit<AdminUser, "uid">),
  }));
}

export async function getUserById(uid: string): Promise<AdminUser> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("User not found");
  }

  return {
    uid: snap.id,
    ...(snap.data() as Omit<AdminUser, "uid">),
  };
}

export async function updateUserRole(uid: string, role: AdminUser["role"]) {
  const ref = doc(db, "users", uid);
  return updateDoc(ref, { role });
}
