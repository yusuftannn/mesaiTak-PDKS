import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

const attendanceRef = collection(db, "attendance");

// Bugünkü kaydı getir (uid bazlı)
export async function getTodayAttendance(uid: string, date: string) {
  const q = query(
    attendanceRef,
    where("uid", "==", uid),      // 🔴 DÜZELTİLDİ
    where("date", "==", date)
  );

  const snap = await getDocs(q);
  return snap.docs[0] ?? null;
}

// Mesaiye başla
export async function startWork(uid: string, date: string) {
  return addDoc(attendanceRef, {
    uid,                          // 🔴 DÜZELTİLDİ
    date,
    checkInAt: serverTimestamp(),
    checkOutAt: null,
    breaks: [],
    status: "working",
    createdAt: serverTimestamp(),
  });
}

// Mesaiyi bitir
export async function endWork(attendanceId: string) {
  const ref = doc(db, "attendance", attendanceId);

  return updateDoc(ref, {
    checkOutAt: serverTimestamp(),
    status: "completed",
  });
}

// Molaya çık
export async function startBreak(attendanceId: string, breaks: any[]) {
  const ref = doc(db, "attendance", attendanceId);

  return updateDoc(ref, {
    breaks: [...breaks, { start: serverTimestamp(), end: null }],
    status: "break",
  });
}

// Molayı bitir
export async function endBreak(attendanceId: string, breaks: any[]) {
  const ref = doc(db, "attendance", attendanceId);

  const updatedBreaks = [...breaks];
  updatedBreaks[updatedBreaks.length - 1].end = serverTimestamp();

  return updateDoc(ref, {
    breaks: updatedBreaks,
    status: "working",
  });
}
