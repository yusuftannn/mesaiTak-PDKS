import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getUserLeaves(userId: string) {
  const q = query(
    collection(db, "leaves"),
    where("userId", "==", userId),
    orderBy("startDate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function getUserShifts(userId: string) {
  const q = query(
    collection(db, "shifts"),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
