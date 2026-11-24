import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type { DownloadStatus, DownloadTask, SearchResult } from "../types/jellyfin";

interface DownloadStoreState {
  downloads: DownloadTask[];
  enqueue: (result: SearchResult) => DownloadTask | null;
  updateProgress: (id: string, progress: number, downloadedBytes: number, speedBytesPerSec?: number) => void;
  setStatus: (id: string, status: DownloadStatus, error?: string) => void;
  patch: (id: string, changes: Partial<DownloadTask>) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
  clearInactive: () => void;
}

export const useDownloadStore = create<DownloadStoreState>((set, get) => ({
  downloads: [],
  enqueue: (result) => {
    if (
      get().downloads.some(
        (d) => d.result.id === result.id && d.status !== "canceled" && d.status !== "failed",
      )
    ) {
      return null;
    }
    const task: DownloadTask = {
      id: uuid(),
      result,
      status: "queued",
      progress: 0,
      downloadedBytes: 0,
      totalBytes: result.sizeBytes ?? 0,
    };
    set((state) => ({ downloads: [task, ...state.downloads] }));
    return task;
  },
  updateProgress: (id, progress, downloadedBytes, speedBytesPerSec) =>
    set((state) => ({
      downloads: state.downloads.map((d) =>
        d.id === id
          ? { ...d, progress, downloadedBytes, speedBytesPerSec, status: "downloading" }
          : d,
      ),
    })),
  setStatus: (id, status, error) =>
    set((state) => ({
      downloads: state.downloads.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              error,
              completedAt: status === "completed" ? Date.now() : d.completedAt,
            }
          : d,
      ),
    })),
  patch: (id, changes) =>
    set((state) => ({
      downloads: state.downloads.map((d) => (d.id === id ? { ...d, ...changes } : d)),
    })),
  remove: (id) => set((state) => ({ downloads: state.downloads.filter((d) => d.id !== id) })),
  clearCompleted: () =>
    set((state) => ({ downloads: state.downloads.filter((d) => d.status !== "completed") })),
  clearInactive: () =>
    set((state) => ({
      downloads: state.downloads.filter(
        (d) => d.status === "queued" || d.status === "downloading" || d.status === "paused",
      ),
    })),
}));
