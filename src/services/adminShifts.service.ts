import {
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getCompanyId } from "../utils/company";

const shiftsRef = collection(db, "shifts");

function normalizeDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function createShift(data: {
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "normal" | "gece" | "mesai";
}) {
  const companyId = getCompanyId();

  return addDoc(shiftsRef, {
    userId: data.userId,
    companyId,
    date: normalizeDate(data.date),
    startTime: data.startTime,
    endTime: data.endTime,
    type: data.type,
    createdAt: serverTimestamp(),
  });
}

export async function getAllShifts() {
  const q = query(shiftsRef, orderBy("date", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function deleteShift(shiftId: string) {
  return deleteDoc(doc(db, "shifts", shiftId));
}

export async function updateShift(
  shiftId: string,
  data: {
    userId: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: "normal" | "gece" | "mesai";
  },
) {
  const ref = doc(db, "shifts", shiftId);
  const companyId = getCompanyId();

  return updateDoc(ref, {
    userId: data.userId,
    companyId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    type: data.type,
  });
}
