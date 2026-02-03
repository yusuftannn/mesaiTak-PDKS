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
import { getUserTodayShift } from "./shift.service";

const attendanceRef = collection(db, "attendance");

type BreakItem = {
  type: string;
  start: Timestamp;
  end: Timestamp | null;
};

export async function getTodayAttendance(uid: string, date: string) {
  const q = query(
    attendanceRef,
    where("uid", "==", uid),
    where("date", "==", date),
  );
  const snap = await getDocs(q);
  return snap.docs[0] ?? null;
}

export async function startWork(uid: string, date: string) {
  const shift = await getUserTodayShift(uid);

  return addDoc(attendanceRef, {
    uid,
    date,
    shiftStart: shift?.startTime ?? null,
    shiftEnd: shift?.endTime ?? null,
    checkInAt: serverTimestamp(),
    checkOutAt: null,
    breaks: [],
    status: "çalışıyor",
    createdAt: serverTimestamp(),
  });
}

export async function endWork(attendanceId: string) {
  return updateDoc(doc(db, "attendance", attendanceId), {
    checkOutAt: serverTimestamp(),
    status: "tamamlandı",
  });
}

// Mola başlat
export async function startBreak(
  attendanceId: string,
  breaks: BreakItem[],
  type: string,
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
    status: "mola",
  });
}

// Mola bitir
export async function endBreak(attendanceId: string, breaks: BreakItem[]) {
  const updated = [...breaks];

  updated[updated.length - 1] = {
    ...updated[updated.length - 1],
    end: Timestamp.fromDate(new Date()),
  };

  return updateDoc(doc(db, "attendance", attendanceId), {
    breaks: updated,
    status: "çalışıyor",
  });
}
