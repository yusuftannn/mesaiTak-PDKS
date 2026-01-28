import { create } from "zustand";
import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

type DashboardState = {
  loading: boolean;

  totalEmployees: number;
  workingCount: number;
  breakCount: number;
  activeCount: number;

  loadDashboard: () => Promise<void>;
};

export const useAdminDashboardStore = create<DashboardState>((set) => ({
  loading: true,

  totalEmployees: 0,
  workingCount: 0,
  breakCount: 0,
  activeCount: 0,

  loadDashboard: async () => {
    try {
      set({ loading: true });

      const today = dayjs().format("YYYY-MM-DD");

      const usersSnap = await getDocs(collection(db, "users"));

      const attendanceSnap = await getDocs(
        query(collection(db, "attendance"), where("date", "==", today)),
      );

      const attendances = attendanceSnap.docs.map((d) => d.data());

      const working = attendances.filter((a) => a.status === "working").length;

      const onBreak = attendances.filter((a) => a.status === "break").length;

      set({
        totalEmployees: usersSnap.size,
        workingCount: working,
        breakCount: onBreak,
        activeCount: working + onBreak,
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
