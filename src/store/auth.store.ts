import { create } from "zustand";

export type UserRole = "employee" | "manager" | "admin";

export type AuthUser = {
  uid: string;
  email: string;
  name?: string | null;
  role: UserRole;

  companyId?: string | null;
  branchId?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;

  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,

  setUser: (user) =>
    set({
      user,
      initializing: false,
    }),

  logout: () =>
    set({
      user: null,
      initializing: false,
    }),
}));
