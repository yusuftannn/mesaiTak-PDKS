import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type Branch = {
  id: string;
  companyId: string;
  name: string;
};

const ref = collection(db, "branches");

export async function getBranchesByCompany(companyId: string): Promise<Branch[]> {
  const q = query(ref, where("companyId", "==", companyId));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Branch, "id">),
  }));
}

export async function createBranch(companyId: string, name: string) {
  return addDoc(ref, {
    companyId,
    name,
    createdAt: new Date(),
  });
}
