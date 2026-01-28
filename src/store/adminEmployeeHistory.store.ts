import { create } from "zustand";
import {
  getUserLeaves,
  getUserShifts,
} from "../services/adminUserHistory.service";

type State = {
  loading: boolean;
  leaves: any[];
  shifts: any[];

  loadHistory: (userId: string) => Promise<void>;
};

export const useAdminEmployeeHistoryStore = create<State>((set) => ({
  loading: true,
  leaves: [],
  shifts: [],

  loadHistory: async (userId) => {
    try {
      set({ loading: true });

      const [leaves, shifts] = await Promise.all([
        getUserLeaves(userId),
        getUserShifts(userId),
      ]);

      set({ leaves, shifts });
    } catch (e) {
      console.error("history load error:", e);
    } finally {
      set({ loading: false });
    }
  },
}));
