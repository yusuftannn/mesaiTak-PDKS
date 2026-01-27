import { create } from "zustand";
import dayjs from "dayjs";
import { getUserShifts, ShiftDoc } from "../services/shift.service";

type ShiftState = {
  loading: boolean;
  shifts: ShiftDoc[];
  todayShift: ShiftDoc | null;

  loadShifts: (userId: string) => Promise<void>;
};

export const useShiftStore = create<ShiftState>((set) => ({
  loading: true,
  shifts: [],
  todayShift: null,

  loadShifts: async (userId) => {
    set({ loading: true });

    try {
      const data = await getUserShifts(userId);
      const today = dayjs().format("YYYY-MM-DD");

      set({
        shifts: data,
        todayShift:
          data.find((s) => s.date === today) ?? null,
      });
    } catch (err) {
      console.error("loadShifts error:", err);
      set({ shifts: [], todayShift: null });
    } finally {
      set({ loading: false });
    }
  },
}));
