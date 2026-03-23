import { create } from "zustand";
import {
  LeaveDoc,
  subscribeMyLeaves,
  createLeave,
} from "../services/leave.service";
import { Timestamp } from "firebase/firestore";
import { useAuthStore } from "../store/auth.store";
import { getCompanyId } from "../utils/company";
type SendLeavePayload = {
  userId: string;
  startDate: Date;
  endDate: Date;
  type: "yıllık" | "hasta" | "ücretsiz" | "diğer";
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

    const user = useAuthStore.getState().user;

    if (!user) throw new Error("USER_NOT_FOUND");
    const companyId = getCompanyId();
    await createLeave({
      userId: user.uid,
      companyId: companyId,
      startDate: Timestamp.fromDate(payload.startDate),
      endDate: Timestamp.fromDate(payload.endDate),
      type: payload.type,
      reason: payload.reason,
    });

    set({ loading: false });
  },
}));
