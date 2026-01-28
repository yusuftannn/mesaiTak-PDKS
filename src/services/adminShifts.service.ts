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

const shiftsRef = collection(db, "shifts");

export async function createShift(data: {
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "normal" | "night" | "overtime";
}) {
  return addDoc(shiftsRef, {
    userId: data.userId,
    date: data.date,
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
    type: "normal" | "night" | "overtime";
  },
) {
  const ref = doc(db, "shifts", shiftId);

  return updateDoc(ref, {
    userId: data.userId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    type: data.type,
  });
}
