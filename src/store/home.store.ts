import { create } from "zustand";
import dayjs from "dayjs";
import {
  getTodayAttendance,
  startWork as fsStartWork,
  endWork as fsEndWork,
  startBreak as fsStartBreak,
  endBreak as fsEndBreak,
} from "../services/attendance.service";
import { diffMinutes } from "../utils/time";

type BreakItem = {
  type: string;
  start: any;
  end: any | null;
};

type WorkStatus = "boşta" | "çalışıyor" | "mola" | "tamamlandı";

type HomeState = {
  loading: boolean;
  lastLoadedKey: string | null;

  attendanceDocId: string | null;
  status: WorkStatus;
  checkInAt: Date | null;
  breaks: BreakItem[];

  totalBreakMinutes: number;
  totalWorkMinutes: number;

  selectedBreakType: string;

  loadToday: (uid: string) => Promise<void>;
  startWork: (uid: string) => Promise<void>;
  endWork: () => Promise<void>;

  startBreak: () => Promise<void>;
  endBreak: () => Promise<void>;
  setBreakType: (t: string) => void;
};

const recalculateTotals = (state: HomeState) => {
  const now = new Date();

  const breakMinutes = state.breaks.reduce((sum, b) => {
    if (!b.start) return sum;
    const s = b.start instanceof Date ? b.start : b.start.toDate();
    const e = b.end ? (b.end instanceof Date ? b.end : b.end.toDate()) : now;

    return sum + diffMinutes(s, e);
  }, 0);

  let workMinutes = 0;

  if (state.checkInAt) {
    const start = state.checkInAt;
    const end = new Date();

    workMinutes = diffMinutes(start, end) - breakMinutes;
  }

  return {
    totalBreakMinutes: breakMinutes,
    totalWorkMinutes: Math.max(0, workMinutes),
  };
};

export const useHomeStore = create<HomeState>((set, get) => ({
  loading: false,
  lastLoadedKey: null,

  attendanceDocId: null,
  status: "boşta",
  checkInAt: null,
  breaks: [],

  totalBreakMinutes: 0,
  totalWorkMinutes: 0,

  selectedBreakType: "yemek",

  loadToday: async (uid) => {
    const today = dayjs().format("YYYY-MM-DD");
    const cacheKey = `${uid}_${today}`;
    if (get().lastLoadedKey === cacheKey) return;

    set({ loading: true });

    const snap = await getTodayAttendance(uid, today);

    if (!snap) {
      set({
        attendanceDocId: null,
        status: "boşta",
        breaks: [],
        totalBreakMinutes: 0,
        totalWorkMinutes: 0,
        lastLoadedKey: cacheKey,
        loading: false,
      });
      return;
    }

    const data = snap.data();
    const now = new Date();

    const breakMinutes = (data.breaks ?? []).reduce(
      (sum: number, b: BreakItem) => {
        if (!b.start) return sum;
        const s = b.start.toDate();
        const e = b.end ? b.end.toDate() : now;
        return sum + diffMinutes(s, e);
      },
      0,
    );

    const workMinutes = data.checkInAt
      ? diffMinutes(
          data.checkInAt.toDate(),
          data.checkOutAt ? data.checkOutAt.toDate() : now,
        ) - breakMinutes
      : 0;

    set({
      attendanceDocId: snap.id,
      status: data.status,
      breaks: data.breaks ?? [],
      checkInAt: data.checkInAt ? data.checkInAt.toDate() : null,
      totalBreakMinutes: breakMinutes,
      totalWorkMinutes: Math.max(0, workMinutes),
      lastLoadedKey: cacheKey,
      loading: false,
    });
  },

  startWork: async (uid) => {
    set({ loading: true });
    const today = dayjs().format("YYYY-MM-DD");
    const ref = await fsStartWork(uid, today);

    set({
      attendanceDocId: ref.id,
      status: "çalışıyor",
      breaks: [],
      checkInAt: new Date(),
      totalBreakMinutes: 0,
      totalWorkMinutes: 0,
      lastLoadedKey: `${uid}_${today}`,
      loading: false,
    });
  },

  endWork: async () => {
    const { attendanceDocId } = get();
    if (!attendanceDocId) return;

    set({ loading: true });
    await fsEndWork(attendanceDocId);
    set((state) => ({
      status: "tamamlandı",
      ...recalculateTotals(state),
      loading: false,
    }));
  },

  startBreak: async () => {
    const { attendanceDocId, breaks, selectedBreakType } = get();
    if (!attendanceDocId) return;

    set({ loading: true });
    await fsStartBreak(attendanceDocId, breaks, selectedBreakType);

    set((state) => ({
      status: "mola",
      breaks: [
        ...state.breaks,
        { type: state.selectedBreakType, start: new Date(), end: null },
      ],
      ...recalculateTotals(state),
      loading: false,
    }));
  },

  endBreak: async () => {
    const { attendanceDocId, breaks } = get();
    if (!attendanceDocId) return;

    set({ loading: true });
    await fsEndBreak(attendanceDocId, breaks);

    const updated = [...breaks];
    updated[updated.length - 1].end = new Date();

    set((state) => {
      const updated = [...state.breaks];
      updated[updated.length - 1].end = new Date();

      return {
        status: "çalışıyor",
        breaks: updated,
        ...recalculateTotals({ ...state, breaks: updated }),
        loading: false,
      };
    });
  },

  setBreakType: (t) => set({ selectedBreakType: t }),
}));
