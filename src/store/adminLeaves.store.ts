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
  saving: boolean;
  error: string | null;

  leaves: LeaveDoc[];
  filter: LeaveFilter;

  loadLeaves: () => Promise<void>;
  setFilter: (filter: LeaveFilter) => void;

  approve: (leaveId: string, adminId: string) => Promise<void>;
  reject: (leaveId: string, adminId: string, reason: string) => Promise<void>;
};

export const useAdminLeavesStore = create<State>((set) => ({
  loading: false,
  saving: false,
  error: null,

  leaves: [],
  filter: "pending",

  loadLeaves: async () => {
    set({ loading: true, error: null });

    try {
      const leaves = await getAllLeaves();
      set({ leaves });
    } catch (err: any) {
      console.error("loadLeaves error:", err);

      if (err?.code === "permission-denied") {
        set({ error: "İzin kayıtlarını görüntüleme yetkiniz yok." });
      } else if (err?.code?.startsWith("auth/")) {
        set({ error: "Oturum süreniz dolmuş olabilir." });
      } else {
        set({ error: "İzin listesi yüklenemedi." });
      }

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  setFilter: (filter) => set({ filter }),

  approve: async (leaveId, adminId) => {
    set({ saving: true, error: null });

    try {
      await approveLeave(leaveId, adminId);
    } catch (err: any) {
      console.error("approve error:", err);
      set({ error: "İzin onaylanamadı." });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  reject: async (leaveId, adminId, reason) => {
    set({ saving: true, error: null });

    try {
      await rejectLeave(leaveId, adminId, reason);
    } catch (err: any) {
      console.error("reject error:", err);
      set({ error: "İzin reddedilemedi." });
      throw err;
    } finally {
      set({ saving: false });
    }
  },
}));
