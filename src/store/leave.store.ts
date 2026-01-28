import { create } from "zustand";
import {
  LeaveDoc,
  subscribeMyLeaves,
  createLeave,
} from "../services/leave.service";
import { Timestamp } from "firebase/firestore";

type SendLeavePayload = {
  userId: string;
  startDate: Date;
  endDate: Date;
  type: "annual" | "sick" | "unpaid" | "other";
  reason: string;
};

type State = {
  loading: boolean;
  leaves: LeaveDoc[];
  unsubscribe?: () => void;

  listenMyLeaves: (userId: string) => void;
  stopListening: () => void;
  sendLeave: (payload: SendLeavePayload) => Promise<void>;
};

export const useLeaveStore = create<State>((set, get) => ({
  loading: false,
  leaves: [],

  listenMyLeaves: (userId) => {
    get().stopListening();

    const unsub = subscribeMyLeaves(userId, (leaves) => {
      set({ leaves });
    });

    set({ unsubscribe: unsub });
  },

  stopListening: () => {
    const unsub = get().unsubscribe;
    if (unsub) unsub();
    set({ unsubscribe: undefined });
  },

  sendLeave: async (payload) => {
    set({ loading: true });

    await createLeave({
      userId: payload.userId,
      startDate: Timestamp.fromDate(payload.startDate),
      endDate: Timestamp.fromDate(payload.endDate),
      type: payload.type,
      reason: payload.reason,
    });

    set({ loading: false });
  },
}));
