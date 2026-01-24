import { create } from "zustand";
import dayjs from "dayjs";
import {
  getTodayAttendance,
  startWork as fsStartWork,
  endWork as fsEndWork,
} from "../services/attendance.service";

type WorkStatus = "idle" | "working" | "break" | "completed";

type HomeState = {
  loading: boolean;
  lastLoadedKey: string | null;

  attendanceDocId: string | null;
  status: WorkStatus;
  checkInTime: string | null;

  loadToday: (uid: string) => Promise<void>;
  startWork: (uid: string) => Promise<void>;
  endWork: () => Promise<void>;
  reset: () => void;
};

export const useHomeStore = create<HomeState>((set, get) => ({
  loading: false,
  lastLoadedKey: null,

  attendanceDocId: null,
  status: "idle",
  checkInTime: null,

  loadToday: async (uid) => {
    const today = dayjs().format("YYYY-MM-DD");
    const cacheKey = `${uid}_${today}`;

    if (get().lastLoadedKey === cacheKey) return;

    try {
      set({ loading: true });

      const docSnap = await getTodayAttendance(uid, today);

      if (!docSnap) {
        set({
          attendanceDocId: null,
          status: "idle",
          checkInTime: null,
          lastLoadedKey: cacheKey,
        });
        return;
      }

      const data = docSnap.data();

      set({
        attendanceDocId: docSnap.id,
        status: data.status ?? "idle",
        checkInTime: data.checkInAt
          ? data.checkInAt.toDate().toLocaleTimeString("tr-TR")
          : null,
        lastLoadedKey: cacheKey,
      });
    } catch (err) {
      console.error("loadToday error:", err);
      set({ status: "idle", attendanceDocId: null });
    } finally {
      set({ loading: false });
    }
  },

  startWork: async (uid) => {
    try {
      set({ loading: true });

      const today = dayjs().format("YYYY-MM-DD");
      const ref = await fsStartWork(uid, today);

      set({
        attendanceDocId: ref.id,
        status: "working",
        checkInTime: new Date().toLocaleTimeString("tr-TR"),
        lastLoadedKey: `${uid}_${today}`,
      });
    } catch (err) {
      console.error("startWork error:", err);
    } finally {
      set({ loading: false });
    }
  },

  endWork: async () => {
    const { attendanceDocId } = get();
    if (!attendanceDocId) return;

    try {
      set({ loading: true });

      await fsEndWork(attendanceDocId);

      set({
        status: "completed",
      });
    } catch (err) {
      console.error("endWork error:", err);
    } finally {
      set({ loading: false });
    }
  },

  reset: () =>
    set({
      loading: false,
      lastLoadedKey: null,
      attendanceDocId: null,
      status: "idle",
      checkInTime: null,
    }),
}));
