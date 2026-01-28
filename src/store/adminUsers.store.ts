import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export type Employee = {
  uid: string;
  email: string;
  name?: string | null;
  role: "employee" | "manager" | "admin";
};

type State = {
  loading: boolean;
  employees: Employee[];

  loadEmployees: () => Promise<void>;
};

export const useAdminEmployeesStore = create<State>((set) => ({
  loading: true,
  employees: [],

  loadEmployees: async () => {
    try {
      set({ loading: true });

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
      console.error("loadEmployees error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
