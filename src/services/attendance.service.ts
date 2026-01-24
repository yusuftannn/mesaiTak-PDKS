import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  doc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const attendanceRef = collection(db, "attendance");

export async function getTodayAttendance(uid: string, date: string) {
  const q = query(
    attendanceRef,
    where("uid", "==", uid),
    where("date", "==", date)
  );
  const snap = await getDocs(q);
  return snap.docs[0] ?? null;
}

export async function startWork(uid: string, date: string) {
  return addDoc(attendanceRef, {
    uid,
    date,
    checkInAt: serverTimestamp(),
    checkOutAt: null,
    breaks: [],
    status: "working",
    createdAt: serverTimestamp(),
  });
}

export async function endWork(attendanceId: string) {
  return updateDoc(doc(db, "attendance", attendanceId), {
    checkOutAt: serverTimestamp(),
    status: "completed",
  });
}

// Mola başlat
export async function startBreak(
  attendanceId: string,
  breaks: any[],
  type: string
) {
  return updateDoc(doc(db, "attendance", attendanceId), {
    breaks: [
      ...breaks,
      {
        type,
        start: Timestamp.fromDate(new Date()),
        end: null,
      },
    ],
    status: "break",
  });
}

// Mola bitir
export async function endBreak(
  attendanceId: string,
  breaks: any[]
) {
  const updated = [...breaks];
  updated[updated.length - 1] = {
    ...updated[updated.length - 1],
    end: Timestamp.fromDate(new Date()),
  };

  return updateDoc(doc(db, "attendance", attendanceId), {
    breaks: updated,
    status: "working",
  });
}
