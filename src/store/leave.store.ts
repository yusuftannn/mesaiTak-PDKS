import { create } from "zustand";
import {
  createLeave,
  getUserLeaves,
  LeaveDoc,
} from "../services/leave.service";

type LeaveState = {
  loading: boolean;
  leaves: LeaveDoc[];

  loadLeaves: (userId: string) => Promise<void>;
  submitLeave: (
    userId: string,
    payload: {
      type: LeaveDoc["type"];
      startDate: string;
      endDate: string;
      note?: string;
    }
  ) => Promise<void>;
};

export const useLeaveStore = create<LeaveState>((set) => ({
  loading: false,
  leaves: [],

  loadLeaves: async (userId) => {
    set({ loading: true });
    try {
      const data = await getUserLeaves(userId);
      set({ leaves: data });
    } catch (err) {
      console.error("loadLeaves error:", err);
      set({ leaves: [] });
    } finally {
      set({ loading: false });
    }
  },

  submitLeave: async (userId, payload) => {
    set({ loading: true });
    try {
      await createLeave(userId, payload);
      const updated = await getUserLeaves(userId);
      set({ leaves: updated });
    } catch (err) {
      console.error("submitLeave error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
