import { create } from "zustand";
import {
  Announcement,
  getAnnouncements,
} from "../services/announcement.service";

type State = {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  fetchAnnouncements: () => Promise<void>;
};

export const useAnnouncementStore = create<State>((set) => ({
  announcements: [],
  loading: false,
  error: null,

  fetchAnnouncements: async () => {
    set({ loading: true, error: null });

    try {
      const announcements = await getAnnouncements();
      set({ announcements, loading: false });
    } catch (error) {
      console.error("fetchAnnouncements error:", error);
      set({
        loading: false,
        error: "Duyurular yuklenirken bir hata olustu.",
      });
    }
  },
}));
