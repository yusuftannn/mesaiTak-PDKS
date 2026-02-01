import { create } from "zustand";
import { collection, getDocs, FirestoreError } from "firebase/firestore";
import { db } from "../services/firebase";

export type Employee = {
  uid: string;
  email: string;
  name?: string | null;
  role: "employee" | "manager" | "admin";
};

type State = {
  loading: boolean;
  error: string | null;
  employees: Employee[];

  loadEmployees: () => Promise<void>;
};

export const useAdminEmployeesStore = create<State>((set) => ({
  loading: false,
  error: null,
  employees: [],

  loadEmployees: async () => {
    set({ loading: true, error: null });

    try {
      const snap = await getDocs(collection(db, "users"));

      const list: Employee[] = snap.docs.map((doc) => {
        const d = doc.data();

        return {
          uid: doc.id,
          email: d.email,
          name: d.name ?? null,
          role: d.role ?? "employee",
        };
      });

      set({ employees: list });
    } catch (err) {
      const error = err as FirestoreError;

      console.error("loadEmployees error:", error);

      if (error.code === "permission-denied") {
        set({ error: "Çalışanları görüntüleme yetkiniz yok." });
      } else if (error.code?.startsWith("auth/")) {
        set({ error: "Oturum süreniz dolmuş olabilir." });
      } else {
        set({ error: "Çalışan listesi yüklenemedi." });
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
