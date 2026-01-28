import { create } from "zustand";
import { getUserById, updateUserRole } from "../services/adminUsers.service";
import { useAdminEmployeesStore } from "./adminUsers.store";

type State = {
  loading: boolean;
  saving: boolean;

  user: any | null;

  loadUser: (uid: string) => Promise<void>;
  changeRole: (role: "employee" | "manager" | "admin") => Promise<void>;
};

export const useAdminEmployeeDetailStore = create<State>((set, get) => ({
  loading: true,
  saving: false,
  user: null,

  loadUser: async (uid) => {
    try {
      set({ loading: true });
      const user = await getUserById(uid);
      set({ user });
    } catch (e) {
      console.error("loadUser error:", e);
    } finally {
      set({ loading: false });
    }
  },

  changeRole: async (role) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ saving: true });
      await updateUserRole(user.uid, role);

      set({
        user: { ...user, role },
      });

      await useAdminEmployeesStore.getState().loadEmployees();
    } finally {
      set({ saving: false });
    }
  },
}));
