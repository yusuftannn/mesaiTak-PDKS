import { create } from "zustand";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
  LeaveDoc,
} from "../services/leave.service";

type State = {
  loading: boolean;
  leaves: LeaveDoc[];

  loadLeaves: () => Promise<void>;
  approve: (leaveId: string, adminId: string) => Promise<void>;
  reject: (
    leaveId: string,
    adminId: string,
    reason: string
  ) => Promise<void>;
};

export const useAdminLeavesStore = create<State>((set) => ({
  loading: false,
  leaves: [],

  loadLeaves: async () => {
    set({ loading: true });
    const leaves = await getAllLeaves();
    set({ leaves, loading: false });
  },

  approve: async (leaveId, adminId) => {
    await approveLeave(leaveId, adminId);
  },

  reject: async (leaveId, adminId, reason) => {
    await rejectLeave(leaveId, adminId, reason);
  },
}));
