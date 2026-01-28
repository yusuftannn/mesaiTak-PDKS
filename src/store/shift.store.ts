import { create } from "zustand";
import { getUserShifts, ShiftDoc } from "../services/shift.service";

type State = {
  loading: boolean;
  shifts: ShiftDoc[];
  todayShift: ShiftDoc | null;

  loadShifts: (userId: string) => Promise<void>;
};

export const useShiftStore = create<State>((set) => ({
  loading: true,
  shifts: [],
  todayShift: null,

  loadShifts: async (userId) => {
    try {
      set({ loading: true });

      const shifts = await getUserShifts(userId);

      const todayStr = new Date().toDateString();

      const todayShift =
        shifts.find((s) => {
          const d = s.date.toDate();
          return d.toDateString() === todayStr;
        }) ?? null;

      set({
        shifts,
        todayShift,
      });
    } catch (e) {
      console.error("loadShifts error:", e);
    } finally {
      set({ loading: false });
    }
  },
}));
