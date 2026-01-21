import { create } from "zustand";

type AppState = {
  activeCompanyId: string | null;
  activeBranchId: string | null;
  setActiveCompanyId: (id: string | null) => void;
  setActiveBranchId: (id: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeCompanyId: null,
  activeBranchId: null,
  setActiveCompanyId: (id) => set({ activeCompanyId: id }),
  setActiveBranchId: (id) => set({ activeBranchId: id }),
}));
