import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getCompanyId } from "../utils/company";

export type ShiftDoc = {
  id: string;
  userId: string;
  companyId: string;
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
  const companyId = getCompanyId();
  const q = query(
    shiftRef,
    where("userId", "==", userId),
    where("companyId", "==", companyId),
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
  const companyId = getCompanyId();

  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const q = query(
    shiftRef,
    where("userId", "==", userId),
    where("companyId", "==", companyId),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<=", Timestamp.fromDate(end)),
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const d = snap.docs[0];

  return {
    id: d.id,
    ...(d.data() as Omit<ShiftDoc, "id">),
  };
}
