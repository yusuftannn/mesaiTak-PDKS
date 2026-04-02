import { create } from "zustand";
import { Branch } from "../types/branch.types";
import { getBranchesByCompany } from "../../src/services/branch.service";
import { getCompanyId } from "../../src/utils/company";

type BranchState = {
  branches: Branch[];
  loading: boolean;

  fetchBranches: () => Promise<void>;
};

export const useBranchStore = create<BranchState>((set) => ({
  branches: [],
  loading: false,

  fetchBranches: async () => {
    set({ loading: true });

    try {
      const companyId = getCompanyId();

      const data = await getBranchesByCompany(companyId);

      set({
        branches: data,
        loading: false,
      });
    } catch (error) {
      console.error("fetchBranches error:", error);
      set({ loading: false });
    }
  },
}));
