import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Company = {
  id: string;
  name: string;
  country?: string;
};

const ref = collection(db, "companies");

export async function getCompanies(): Promise<Company[]> {
  const snap = await getDocs(ref);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Company, "id">),
  }));
}

export async function createCompany(name: string, country?: string) {
  return addDoc(ref, {
    name,
    country: country ?? null,
    createdAt: new Date(),
  });
}
