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
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUserTodayShift } from "./shift.service";
import { calculateDistanceMeters } from "../utils/distance";
import { getCompanyId } from "../utils/company";

const attendanceRef = collection(db, "attendance");

type BreakItem = {
  type: string;
  start: Timestamp;
  end: Timestamp | null;
};

async function getBranch(branchId: string) {
  const snap = await getDoc(doc(db, "branches", branchId));
  if (!snap.exists()) return null;

  return snap.data() as {
    name?: string;
    lat?: number;
    lng?: number;
    allowedDistance?: number;
  };
}
async function getUser(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  return snap.data() as {
    branchId?: string;
    name?: string;
  };
}
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
  branchId?: string,
) {
  const companyId = getCompanyId();
  const userData = await getUser(uid);

  if (branchId && userData?.branchId && branchId !== userData.branchId) {
    throw new Error("Bu şube için yetkiniz yok");
  }
  const shift = await getUserTodayShift(uid);

  if (location && branchId) {
    if (location && branchId) {
      const branch = await getBranch(branchId);

      if (branch?.lat && branch?.lng) {
        const distance = calculateDistanceMeters(
          location.lat,
          location.lng,
          branch.lat,
          branch.lng,
        );

        const allowedDistance = branch.allowedDistance ?? 200;

        if (distance > allowedDistance) {
          const severity =
            distance > 1000 ? "high" : distance > 500 ? "medium" : "low";

          await addDoc(collection(db, "suspicious_logs"), {
            userId: uid,
            userName: "",
            branchId,
            branchName: branch.name ?? "",
            distance,
            allowedDistance,
            severity,
            userLat: location.lat,
            userLng: location.lng,
            branchLat: branch.lat,
            branchLng: branch.lng,
            createdAt: serverTimestamp(),
          });
        }
      }
    }
  }

  return addDoc(attendanceRef, {
    uid,
    companyId,
    date,
    branchId: branchId ?? null,
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
