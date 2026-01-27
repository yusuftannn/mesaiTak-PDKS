import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export type ShiftDoc = {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "day" | "night";
};

const shiftRef = collection(db, "shifts");

export async function getUserShifts(userId: string) {
  const q = query(
    shiftRef,
    where("userId", "==", userId),
    orderBy("date", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ShiftDoc, "id">),
  }));
}
