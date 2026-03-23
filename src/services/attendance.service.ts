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
import { getCompanyId } from "../utils/company";

const attendanceRef = collection(db, "attendance");

type BreakItem = {
  type: string;
  start: Timestamp;
  end: Timestamp | null;
};

export async function getTodayAttendance(uid: string, date: string) {
  const companyId = getCompanyId();
  const q = query(
    attendanceRef,
    where("uid", "==", uid),
    where("date", "==", date),
    where("companyId", "==", companyId),
  );
  const snap = await getDocs(q);
  return snap.docs[0] ?? null;
}

export async function startWork(
  uid: string,
  date: string,
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  } | null,
) {
  const companyId = getCompanyId();
  const shift = await getUserTodayShift(uid);

  return addDoc(attendanceRef, {
    uid,
    companyId,
    date,

    shiftStart: shift?.startTime ?? null,
    shiftEnd: shift?.endTime ?? null,

    checkInAt: serverTimestamp(),
    checkOutAt: null,
    breaks: [],
    status: "çalışıyor",

    checkInLocation: location ?? null,

    createdAt: serverTimestamp(),
  });
}

export const endWork = async (
  docId: string,
  locationData: {
    lat: number;
    lng: number;
    accuracy?: number;
  },
) => {
  if (!locationData?.lat || !locationData?.lng) {
    throw new Error("Location required");
  }

  return updateDoc(doc(db, "attendance", docId), {
    status: "tamamlandı",
    checkOutAt: serverTimestamp(),
    checkOutLocation: locationData,
  });
};

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
