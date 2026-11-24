import { downloadFile } from "./downloadEngine";
import { buildDownloadUrl } from "./jellyfinClient";
import { useDownloadStore } from "../store/downloadStore";
import { useServerStore } from "../store/serverStore";
import { EASTER_EGG_SERVER_ID } from "../easteregg";
import type { SearchResult } from "../types/jellyfin";

const controllers = new Map<string, AbortController>();

export function startDownload(taskId: string, result: SearchResult): void {
  const { patch } = useDownloadStore.getState();

  if (result.serverId === EASTER_EGG_SERVER_ID) {
    patch(taskId, { status: "failed", error: "Download failed: no sources found for this file" });
    return;
  }

  const server = useServerStore.getState().servers.find((s) => s.id === result.serverId);

  if (!server) {
    patch(taskId, { status: "failed", error: "Server is no longer connected" });
    return;
  }

  const controller = new AbortController();
  controllers.set(taskId, controller);
  patch(taskId, { status: "downloading", startedAt: Date.now(), error: undefined });

  const url = buildDownloadUrl(server, result.itemId);

  void downloadFile(url, result.filename, {
    onProgress: (downloadedBytes, totalBytes, speedBytesPerSec) => {
      const progress = totalBytes > 0 ? Math.min(100, (downloadedBytes / totalBytes) * 100) : 0;
      useDownloadStore.getState().patch(taskId, {
        downloadedBytes,
        totalBytes: totalBytes || downloadedBytes,
        progress,
        speedBytesPerSec,
      });
    },
    onComplete: (destinationPath) => {
      controllers.delete(taskId);
      useDownloadStore.getState().patch(taskId, {
        status: "completed",
        progress: 100,
        destinationPath,
        completedAt: Date.now(),
      });
    },
    onError: (message) => {
      controllers.delete(taskId);
      useDownloadStore.getState().patch(taskId, { status: "failed", error: message });
    },
  }, controller.signal);
}

export function cancelDownload(taskId: string): void {
  controllers.get(taskId)?.abort();
  controllers.delete(taskId);
  useDownloadStore.getState().setStatus(taskId, "canceled");
}

export function pauseDownload(taskId: string): void {
  controllers.get(taskId)?.abort();
  controllers.delete(taskId);
  useDownloadStore.getState().setStatus(taskId, "paused");
}

export function retryDownload(taskId: string): void {
  const task = useDownloadStore.getState().downloads.find((d) => d.id === taskId);
  if (task) startDownload(taskId, task.result);
}
