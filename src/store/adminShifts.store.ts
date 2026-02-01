import { create } from "zustand";
import {
  createShift,
  getAllShifts,
  deleteShift,
  updateShift,
} from "../services/adminShifts.service";

type ShiftType = "normal" | "gece" | "mesai";

type State = {
  loading: boolean;
  saving: boolean;
  error: string | null;
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
      type: ShiftType;
    },
  ) => Promise<void>;
};

export const useAdminShiftsStore = create<State>((set) => ({
  loading: false,
  saving: false,
  error: null,
  shifts: [],

  loadShifts: async () => {
    set({ loading: true, error: null });

    try {
      const shifts = await getAllShifts();
      set({ shifts });
    } catch (err: any) {
      console.error("loadShifts error:", err);

      if (err?.code === "permission-denied") {
        set({ error: "Vardiyaları görüntüleme yetkiniz yok." });
      } else if (err?.code?.startsWith("auth/")) {
        set({ error: "Oturum süreniz dolmuş olabilir." });
      } else {
        set({ error: "Vardiya listesi yüklenemedi." });
      }

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  addShift: async (data) => {
    set({ saving: true, error: null });

    try {
      await createShift(data);
      const shifts = await getAllShifts();
      set({ shifts });
    } catch (err: any) {
      console.error("addShift error:", err);
      set({ error: "Vardiya eklenemedi." });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  removeShift: async (id) => {
    set({ saving: true, error: null });

    try {
      await deleteShift(id);
      const shifts = await getAllShifts();
      set({ shifts });
    } catch (err: any) {
      console.error("removeShift error:", err);
      set({ error: "Vardiya silinemedi." });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  editShift: async (id, data) => {
    set({ saving: true, error: null });

    try {
      await updateShift(id, data);
      const shifts = await getAllShifts();
      set({ shifts });
    } catch (err: any) {
      console.error("editShift error:", err);
      set({ error: "Vardiya güncellenemedi." });
      throw err;
    } finally {
      set({ saving: false });
    }
  },
}));
