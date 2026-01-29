import { create } from "zustand";
import {
  createShift,
  getAllShifts,
  deleteShift,
} from "../services/adminShifts.service";
import { updateShift } from "../services/adminShifts.service";

type ShiftType = "normal" | "gece" | "mesai";

type State = {
  loading: boolean;
  saving: boolean;
  shifts: any[];

  loadShifts: () => Promise<void>;
  addShift: (data: {
    userId: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: ShiftType;
  }) => Promise<void>;
  removeShift: (id: string) => Promise<void>;
  editShift: (
    id: string,
    data: {
      userId: string;
      date: Date;
      startTime: string;
      endTime: string;
      type: "normal" | "gece" | "mesai";
    },
  ) => Promise<void>;
};

export const useAdminShiftsStore = create<State>((set) => ({
  loading: true,
  saving: false,
  shifts: [],

  loadShifts: async () => {
    try {
      set({ loading: true });
      const shifts = await getAllShifts();
      set({ shifts });
    } catch (e) {
      console.error("loadShifts error:", e);
    } finally {
      set({ loading: false });
    }
  },

  addShift: async (data) => {
    try {
      set({ saving: true });
      await createShift(data);
      await getAllShifts().then((shifts) => set({ shifts }));
    } finally {
      set({ saving: false });
    }
  },

  removeShift: async (id) => {
    await deleteShift(id);
    await getAllShifts().then((shifts) => set({ shifts }));
  },

  editShift: async (id, data) => {
    try {
      set({ saving: true });
      await updateShift(id, data);
      const shifts = await getAllShifts();
      set({ shifts });
    } finally {
      set({ saving: false });
    }
  },
}));
