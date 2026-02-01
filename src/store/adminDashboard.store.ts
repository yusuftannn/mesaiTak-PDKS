import { create } from "zustand";
import dayjs from "dayjs";
import {
  collection,
  getDocs,
  query,
  where,
  FirestoreError,
} from "firebase/firestore";
import { db } from "../services/firebase";

type DashboardState = {
  loading: boolean;
  error: string | null;

  totalEmployees: number;
  workingCount: number;
  breakCount: number;
  activeCount: number;

  loadDashboard: () => Promise<void>;
};

export const useAdminDashboardStore = create<DashboardState>((set) => ({
  loading: false,
  error: null,

  totalEmployees: 0,
  workingCount: 0,
  breakCount: 0,
  activeCount: 0,

  loadDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const today = dayjs().format("YYYY-MM-DD");

      const usersSnap = await getDocs(collection(db, "users"));

      const attendanceSnap = await getDocs(
        query(collection(db, "attendance"), where("date", "==", today)),
      );

      const attendances = attendanceSnap.docs.map((d) => d.data());

      const working = attendances.filter(
        (a) => a?.status === "çalışıyor",
      ).length;

      const onBreak = attendances.filter((a) => a?.status === "mola").length;

      set({
        totalEmployees: usersSnap.size,
        workingCount: working,
        breakCount: onBreak,
        activeCount: working + onBreak,
      });
    } catch (err) {
      const error = err as FirestoreError;

      console.error("Admin dashboard error:", error);

      if (error.code === "permission-denied") {
        set({
          error: "Bu verileri görüntüleme yetkiniz yok.",
        });
      } else if (error.code?.startsWith("auth/")) {
        set({
          error: "Oturum süreniz dolmuş olabilir.",
        });
      } else {
        set({
          error: "Dashboard verileri yüklenemedi.",
        });
      }

      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
