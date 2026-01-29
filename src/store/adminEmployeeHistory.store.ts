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
  loading: false,
  leaves: [],
  shifts: [],

  loadHistory: async (userId) => {
    set({ loading: true });

    try {
      const [leaves, shifts] = await Promise.all([
        getUserLeaves(userId),
        getUserShifts(userId),
      ]);

      set({
        leaves: leaves ?? [],
        shifts: shifts ?? [],
      });
    } catch (e: any) {
      set({
        leaves: [],
        shifts: [],
      });
    } finally {
      set({ loading: false });
    }
  },
}));
