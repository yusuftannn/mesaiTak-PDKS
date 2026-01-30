import { create } from "zustand";

export type UserRole = "employee" | "manager" | "admin";

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;

  role: "employee" | "admin";
  status: "active" | "passive";

  companyId: string | null;
  branchId: string | null;

  phone: string | null;
  country: string | null;

  createdAt?: any;
  updatedAt?: any;
}

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
