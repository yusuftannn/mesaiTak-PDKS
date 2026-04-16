import { create } from "zustand";
import { Excuse } from "../types/excuse.types";
import { createExcuse, listExcusesByUser } from "../services/excuse.service";

type ExcuseState = {
  excuses: Excuse[];
  loading: boolean;

  fetchExcuses: (userId: string) => Promise<void>;
  addExcuse: (
    userId: string,
    type: "late" | "early",
    description: string,
  ) => Promise<void>;
};

export const useExcuseStore = create<ExcuseState>((set) => ({
  excuses: [],
  loading: false,

  fetchExcuses: async (userId) => {
    set({ loading: true });

    const data = await listExcusesByUser(userId);

    set({
      excuses: data,
      loading: false,
    });
  },

  addExcuse: async (userId, type, description) => {
    await createExcuse({
      userId,
      type,
      description,
    });
  },
}));
