import { create } from "zustand";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
  LeaveDoc,
} from "../services/leave.service";

export type LeaveFilter = "all" | "pending" | "approved" | "rejected";

type State = {
  loading: boolean;
  leaves: LeaveDoc[];
  filter: LeaveFilter;
  loadLeaves: () => Promise<void>;
  setFilter: (filter: LeaveFilter) => void;
  approve: (leaveId: string, adminId: string) => Promise<void>;
  reject: (leaveId: string, adminId: string, reason: string) => Promise<void>;
};

export const useAdminLeavesStore = create<State>((set) => ({
  loading: false,
  leaves: [],
  filter: "pending",

  loadLeaves: async () => {
    set({ loading: true });
    const leaves = await getAllLeaves();
    set({ leaves, loading: false });
  },

  setFilter: (filter) => set({ filter }),

  approve: async (leaveId, adminId) => {
    await approveLeave(leaveId, adminId);
  },

  reject: async (leaveId, adminId, reason) => {
    await rejectLeave(leaveId, adminId, reason);
  },
}));
