import { create } from "zustand";
import { getUserShifts, ShiftDoc } from "../services/shift.service";

function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

      const todayYMD = toYMD(new Date());

      const todayShift =
        shifts.find((s) => toYMD(s.date.toDate()) === todayYMD) ?? null;


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
