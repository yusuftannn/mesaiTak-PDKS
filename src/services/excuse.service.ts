import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { CreateExcuseInput, Excuse, ExcuseDoc } from "../types/excuse.types";

const excuseRef = collection(db, "excuses");

function mapExcuse(id: string, data: ExcuseDoc): Excuse {
  return {
    id,
    userId: data.userId,
    type: data.type,
    description: data.description,
    date: data.date.toDate(),
    createdAt: data.createdAt.toDate(),
    status: data.status,
  };
}

export async function createExcuse(data: CreateExcuseInput) {
  await addDoc(excuseRef, {
    userId: data.userId,
    type: data.type,
    description: data.description,
    date: Timestamp.fromDate(new Date()),
    createdAt: serverTimestamp(),
    status: "pending",
  });
}

export async function listExcusesByUser(userId: string): Promise<Excuse[]> {
  const q = query(excuseRef, where("userId", "==", userId));

  const snap = await getDocs(q);

  return snap.docs.map((doc) => mapExcuse(doc.id, doc.data() as ExcuseDoc));
}
