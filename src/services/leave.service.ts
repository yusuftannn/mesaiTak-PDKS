import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export type LeaveType = "annual" | "sick" | "unpaid" | "other";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type LeaveDoc = {
  id: string;
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;

  createdAt: Timestamp;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectReason?: string;
};

const leaveRef = collection(db, "leaves");

export async function createLeave(
  payload: Omit<
    LeaveDoc,
    "id" | "status" | "createdAt" | "reviewedBy" | "reviewedAt" | "rejectReason"
  >,
) {
  return addDoc(leaveRef, {
    ...payload,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getMyLeaves(userId: string): Promise<LeaveDoc[]> {
  const q = query(
    leaveRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LeaveDoc, "id">),
  }));
}

export async function getAllLeaves(): Promise<LeaveDoc[]> {
  const q = query(leaveRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LeaveDoc, "id">),
  }));
}

export async function approveLeave(leaveId: string, adminId: string) {
  const ref = doc(db, "leaves", leaveId);
  return updateDoc(ref, {
    status: "approved",
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
  });
}

export async function rejectLeave(
  leaveId: string,
  adminId: string,
  reason: string,
) {
  const ref = doc(db, "leaves", leaveId);
  return updateDoc(ref, {
    status: "rejected",
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
    rejectReason: reason,
  });
}

export function subscribeMyLeaves(
  userId: string,
  cb: (leaves: LeaveDoc[]) => void,
) {
  const q = query(
    leaveRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<LeaveDoc, "id">),
    }));
    cb(data);
  });
}
