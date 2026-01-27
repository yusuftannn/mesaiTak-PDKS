import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type LeaveDoc = {
  id: string;
  userId: string;
  type: "yillik" | "mazeret" | "ucretsiz";
  startDate: string;
  endDate: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
};

const leaveRef = collection(db, "leaves");

export async function getUserLeaves(userId: string) {
  const q = query(
    leaveRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LeaveDoc, "id">),
  }));
}

export async function createLeave(
  userId: string,
  data: Omit<LeaveDoc, "id" | "userId" | "status">
) {
  return addDoc(leaveRef, {
    userId,
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
