import { beforeEach, describe, expect, it, vi } from "vitest";

const downloadFileMock = vi.hoisted(() => vi.fn());
vi.mock("./downloadEngine", () => ({ downloadFile: downloadFileMock }));

import { startDownload } from "./downloadManager";
import { useDownloadStore } from "../store/downloadStore";
import { useServerStore } from "../store/serverStore";
import { EASTER_EGG_SERVER_ID } from "../easteregg";
import type { SearchResult } from "../types/jellyfin";

function makeResult(overrides: Partial<SearchResult> = {}): SearchResult {
  return {
    id: "srv1:item1",
    serverId: "srv1",
    serverName: "Harbour NAS",
    itemId: "item1",
    title: "Interstellar",
    filename: "Interstellar.2014.mkv",
    kind: "Movie",
    sizeBytes: 1000,
    ...overrides,
  };
}

beforeEach(() => {
  downloadFileMock.mockClear();
  useDownloadStore.setState({ downloads: [] });
  useServerStore.setState({ servers: [] });
});

describe("startDownload", () => {
  it("fails immediately for an easter-egg result without touching the network", () => {
    const result = makeResult({ serverId: EASTER_EGG_SERVER_ID, filename: "free_ipod.exe" });
    const task = useDownloadStore.getState().enqueue(result)!;

    startDownload(task.id, result);

    const updated = useDownloadStore.getState().downloads.find((d) => d.id === task.id);
    expect(updated?.status).toBe("failed");
    expect(updated?.error).toMatch(/no sources found/i);
    expect(downloadFileMock).not.toHaveBeenCalled();
  });

  it("fails with 'server is no longer connected' when the result's server was removed", () => {
    const result = makeResult({ serverId: "gone" });
    const task = useDownloadStore.getState().enqueue(result)!;

    startDownload(task.id, result);

    const updated = useDownloadStore.getState().downloads.find((d) => d.id === task.id);
    expect(updated?.status).toBe("failed");
    expect(updated?.error).toBe("Server is no longer connected");
    expect(downloadFileMock).not.toHaveBeenCalled();
  });

  it("proceeds to download when the server is actually connected", () => {
    useServerStore.setState({
      servers: [
        {
          id: "srv1",
          name: "Harbour NAS",
          baseUrl: "http://10.0.1.14:8096",
          apiKey: "key",
          status: "connected",
          addedAt: 0,
        },
      ],
    });
    downloadFileMock.mockResolvedValue(undefined);
    const result = makeResult();
    const task = useDownloadStore.getState().enqueue(result)!;

    startDownload(task.id, result);

    expect(downloadFileMock).toHaveBeenCalledTimes(1);
    const updated = useDownloadStore.getState().downloads.find((d) => d.id === task.id);
    expect(updated?.status).toBe("downloading");
  });
});
