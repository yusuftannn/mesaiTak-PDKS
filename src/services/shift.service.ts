import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type ShiftDoc = {
  id: string;
  userId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  type: "normal" | "gece" | "mesai";
};

function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const shiftRef = collection(db, "shifts");

export async function getUserShifts(userId: string): Promise<ShiftDoc[]> {
  const q = query(
    shiftRef,
    where("userId", "==", userId),
    orderBy("date", "asc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ShiftDoc, "id">),
  }));
}

export async function getUserTodayShift(
  userId: string,
): Promise<ShiftDoc | null> {
  const q = query(shiftRef, where("userId", "==", userId));

  const snap = await getDocs(q);
  const todayYMD = toYMD(new Date());

  const shift =
    snap.docs
      .map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ShiftDoc, "id">),
      }))
      .find((s) => toYMD(s.date.toDate()) === todayYMD) ?? null;

  return shift;
}
