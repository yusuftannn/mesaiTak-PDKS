import { create } from "zustand";
import { getUserShifts, ShiftDoc } from "../services/shift.service";
import { useAuthStore } from "../store/auth.store";

function toDateAny(value: any): Date {
  if (!value) return new Date(NaN);

  if (typeof value.toDate === "function") return value.toDate();

  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);

  if (value instanceof Date) return value;

  return new Date(value);
}

function ymdInTimeZone(date: Date, timeZone = "Europe/Istanbul") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

type State = {
  loading: boolean;
  shifts: ShiftDoc[];
  todayShift: ShiftDoc | null;

  loadShifts: () => Promise<void>;
};

export const useShiftStore = create<State>((set) => ({
  loading: true,
  shifts: [],
  todayShift: null,

  loadShifts: async () => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("USER_NOT_FOUND");

      const shifts = await getUserShifts(user.uid);

      const tz = "Europe/Istanbul";
      const todayYMD = ymdInTimeZone(new Date(), tz);

      const todayShift =
        shifts.find((s) => {
          const d = toDateAny(s.date);
          const shiftYMD = ymdInTimeZone(d, tz);

          return shiftYMD === todayYMD;
        }) ?? null;

      set({ shifts, todayShift });
    } catch (e) {
      console.error("loadShifts error:", e);
    } finally {
      set({ loading: false });
    }
  },
}));
