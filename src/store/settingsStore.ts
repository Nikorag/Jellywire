import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStoreState {
  downloadDirectory: string | null;
  setDownloadDirectory: (path: string | null) => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      downloadDirectory: null,
      setDownloadDirectory: (path) => set({ downloadDirectory: path }),
    }),
    { name: "jellywire-settings" },
  ),
);
