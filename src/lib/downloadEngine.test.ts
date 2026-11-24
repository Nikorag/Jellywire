import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const httpFetchMock = vi.hoisted(() => vi.fn());
const fsCreateMock = vi.hoisted(() => vi.fn());
const fsExistsMock = vi.hoisted(() => vi.fn());
const fsMkdirMock = vi.hoisted(() => vi.fn());
const pathDownloadDirMock = vi.hoisted(() => vi.fn());
const pathJoinMock = vi.hoisted(() => vi.fn());
const settingsState = vi.hoisted(() => ({ downloadDirectory: null as string | null }));

vi.mock("@tauri-apps/plugin-http", () => ({ fetch: httpFetchMock }));
vi.mock("@tauri-apps/plugin-fs", () => ({
  create: fsCreateMock,
  exists: fsExistsMock,
  mkdir: fsMkdirMock,
}));
vi.mock("@tauri-apps/api/path", () => ({
  downloadDir: pathDownloadDirMock,
  join: pathJoinMock,
}));
vi.mock("../store/settingsStore", () => ({
  useSettingsStore: { getState: () => settingsState },
}));

import { downloadFile, getDefaultDownloadsFolder, getDownloadsFolder } from "./downloadEngine";

interface FakeResponseOptions {
  ok?: boolean;
  status?: number;
  chunks?: Uint8Array[];
  contentLength?: number;
}

function fakeResponse({ ok = true, status = 200, chunks = [], contentLength }: FakeResponseOptions) {
  let index = 0;
  return {
    ok,
    status,
    headers: { get: (name: string) => (name.toLowerCase() === "content-length" ? String(contentLength ?? "") : null) },
    body: ok
      ? {
          getReader: () => ({
            read: async () => {
              if (index < chunks.length) {
                return { done: false, value: chunks[index++] };
              }
              return { done: true, value: undefined };
            },
          }),
        }
      : null,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  settingsState.downloadDirectory = null;
  pathDownloadDirMock.mockResolvedValue("/Users/jamie/Downloads");
  pathJoinMock.mockImplementation(async (...parts: string[]) => parts.join("/"));
  fsExistsMock.mockResolvedValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getDefaultDownloadsFolder / getDownloadsFolder", () => {
  it("resolves the default Jellywire subfolder under the OS Downloads directory", async () => {
    await expect(getDefaultDownloadsFolder()).resolves.toBe("/Users/jamie/Downloads/Jellywire");
  });

  it("creates the folder when it does not already exist", async () => {
    fsExistsMock.mockResolvedValue(false);
    await getDownloadsFolder();
    expect(fsMkdirMock).toHaveBeenCalledWith("/Users/jamie/Downloads/Jellywire", { recursive: true });
  });

  it("does not try to create the folder when it already exists", async () => {
    fsExistsMock.mockResolvedValue(true);
    await getDownloadsFolder();
    expect(fsMkdirMock).not.toHaveBeenCalled();
  });

  it("prefers a custom download directory configured in settings", async () => {
    settingsState.downloadDirectory = "/Volumes/Media Drive/Jellywire";
    await expect(getDownloadsFolder()).resolves.toBe("/Volumes/Media Drive/Jellywire");
  });
});

describe("downloadFile", () => {
  it("streams the response to disk, reports final progress, and completes", async () => {
    httpFetchMock.mockResolvedValue(
      fakeResponse({ chunks: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5])], contentLength: 5 }),
    );
    const fileHandle = { write: vi.fn().mockResolvedValue(undefined), close: vi.fn().mockResolvedValue(undefined) };
    fsCreateMock.mockResolvedValue(fileHandle);

    const onProgress = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await downloadFile(
      "http://server/Items/1/Download",
      "My Movie.mkv",
      { onProgress, onComplete, onError },
      new AbortController().signal,
    );

    expect(fsCreateMock).toHaveBeenCalledWith("/Users/jamie/Downloads/Jellywire/My Movie.mkv");
    expect(fileHandle.write).toHaveBeenCalledTimes(2);
    expect(fileHandle.close).toHaveBeenCalled();
    expect(onProgress).toHaveBeenLastCalledWith(5, 5, 0);
    expect(onComplete).toHaveBeenCalledWith("/Users/jamie/Downloads/Jellywire/My Movie.mkv");
    expect(onError).not.toHaveBeenCalled();
  });

  it("sanitizes illegal filename characters before writing to disk", async () => {
    httpFetchMock.mockResolvedValue(fakeResponse({ chunks: [], contentLength: 0 }));
    fsCreateMock.mockResolvedValue({ write: vi.fn(), close: vi.fn() });

    await downloadFile(
      "http://server/Items/1/Download",
      'Question? / Slash: "Quote".mkv',
      { onProgress: vi.fn(), onComplete: vi.fn(), onError: vi.fn() },
      new AbortController().signal,
    );

    expect(fsCreateMock).toHaveBeenCalledWith("/Users/jamie/Downloads/Jellywire/Question_ _ Slash_ _Quote_.mkv");
  });

  it("reports an error when the server responds with a non-ok status", async () => {
    httpFetchMock.mockResolvedValue(fakeResponse({ ok: false, status: 403 }));
    const onError = vi.fn();

    await downloadFile(
      "http://server/Items/1/Download",
      "name.mkv",
      { onProgress: vi.fn(), onComplete: vi.fn(), onError },
      new AbortController().signal,
    );

    expect(onError).toHaveBeenCalledWith("Server responded with 403");
  });

  it("surfaces a plain-string IPC rejection instead of a generic message", async () => {
    // Tauri command rejections are frequently plain strings, not Error
    // instances — a regression test for the bug where these were silently
    // swallowed into a useless "Download failed" message.
    httpFetchMock.mockResolvedValue(fakeResponse({ chunks: [], contentLength: 0 }));
    fsCreateMock.mockRejectedValue("forbidden path: /Users/jamie/Downloads/Jellywire is not allowed by scope");

    const onError = vi.fn();
    await downloadFile(
      "http://server/Items/1/Download",
      "name.mkv",
      { onProgress: vi.fn(), onComplete: vi.fn(), onError },
      new AbortController().signal,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining("forbidden path: /Users/jamie/Downloads/Jellywire is not allowed by scope"),
    );
    expect(onError).not.toHaveBeenCalledWith("Download failed");
  });

  it("does not report an error when the download was aborted", async () => {
    const controller = new AbortController();
    httpFetchMock.mockImplementation(() => {
      controller.abort();
      return Promise.reject(new Error("aborted"));
    });

    const onError = vi.fn();
    await downloadFile(
      "http://server/Items/1/Download",
      "name.mkv",
      { onProgress: vi.fn(), onComplete: vi.fn(), onError },
      controller.signal,
    );

    expect(onError).not.toHaveBeenCalled();
  });
});
