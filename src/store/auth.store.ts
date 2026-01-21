import { create } from "zustand";

export type UserRole = "employee" | "manager" | "admin";

export type AuthUser = {
  uid: string;
  email: string;
  name?: string;
  role: UserRole;
  companyId?: string;
  branchId?: string;
};

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;
  setUser: (user: AuthUser | null) => void;
  setInitializing: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
  setInitializing: (v) => set({ initializing: v }),
  logout: () => set({ user: null, initializing: false }),
}));
