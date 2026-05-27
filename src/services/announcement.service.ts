import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { getCompanyId } from "../utils/company";

export type Announcement = {
  id: string;
  companyId: string;
  title: string;
  message: string;
  createdByUid: string | null;
  createdByName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

const ref = collection(db, "announcements");

export async function getAnnouncements(): Promise<Announcement[]> {
  const companyId = getCompanyId();

  if (!companyId) {
    return [];
  }

  const q = query(
    ref,
    where("companyId", "==", companyId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      companyId: data.companyId,
      title: data.title,
      message: data.message,
      createdByUid: data.createdByUid ?? null,
      createdByName: data.createdByName ?? null,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
    };
  });
}
