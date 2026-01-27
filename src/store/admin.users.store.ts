import { create } from "zustand";
import { AdminUser, getAllUsers } from "../services/admin.users.service";

type State = {
  users: AdminUser[];
  loading: boolean;
  error: string | null;

  loadUsers: () => Promise<void>;
};

export const useAdminEmployeesStore = create<State>((set) => ({
  users: [],
  loading: false,
  error: null,

  loadUsers: async () => {
    try {
      set({ loading: true, error: null });
      const users = await getAllUsers();
      set({ users });
    } catch (err: any) {
      set({
        error: err?.message || "Çalışanlar yüklenemedi",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
