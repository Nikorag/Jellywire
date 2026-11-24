import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { create, exists, mkdir } from "@tauri-apps/plugin-fs";
import { downloadDir, join } from "@tauri-apps/api/path";
import { useSettingsStore } from "../store/settingsStore";

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "_").trim();
}

export async function getDefaultDownloadsFolder(): Promise<string> {
  const base = await downloadDir();
  return join(base, "Jellywire");
}

export async function getDownloadsFolder(): Promise<string> {
  const custom = useSettingsStore.getState().downloadDirectory;
  const folder = custom ?? (await getDefaultDownloadsFolder());
  if (!(await exists(folder))) {
    await mkdir(folder, { recursive: true });
  }
  return folder;
}

export interface DownloadHandlers {
  onProgress: (downloadedBytes: number, totalBytes: number, speedBytesPerSec: number) => void;
  onComplete: (destinationPath: string) => void;
  onError: (message: string) => void;
}

export async function downloadFile(
  url: string,
  suggestedName: string,
  handlers: DownloadHandlers,
  signal: AbortSignal,
): Promise<void> {
  try {
    const folder = await getDownloadsFolder();
    const filename = sanitizeFilename(suggestedName);
    const destinationPath = await join(folder, filename);

    const response = await tauriFetch(url, { method: "GET", signal });
    if (!response.ok || !response.body) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const totalBytes = Number(response.headers.get("content-length") ?? 0);
    const reader = response.body.getReader();
    const file = await create(destinationPath);

    let downloadedBytes = 0;
    let lastTick = Date.now();
    let bytesSinceLastTick = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        await file.write(value);
        downloadedBytes += value.byteLength;
        bytesSinceLastTick += value.byteLength;

        const now = Date.now();
        const elapsed = now - lastTick;
        if (elapsed >= 400) {
          const speedBytesPerSec = (bytesSinceLastTick / elapsed) * 1000;
          handlers.onProgress(downloadedBytes, totalBytes, speedBytesPerSec);
          lastTick = now;
          bytesSinceLastTick = 0;
        }
      }
    }

    await file.close();
    handlers.onProgress(downloadedBytes, totalBytes || downloadedBytes, 0);
    handlers.onComplete(destinationPath);
  } catch (error) {
    if (signal.aborted) return;
    // Tauri IPC rejections are frequently plain strings rather than Error
    // instances, so fall back to stringifying whatever was thrown instead of
    // silently discarding it behind a generic message.
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
    console.error("[Jellywire] download failed:", url, error);
    handlers.onError(message || "Download failed");
  }
}
