import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  createdByUid: string | null;
  createdByName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

const ref = collection(db, "announcements");

export async function getAnnouncements(): Promise<Announcement[]> {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      message: data.message,
      createdByUid: data.createdByUid ?? null,
      createdByName: data.createdByName ?? null,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
    };
  });
}
