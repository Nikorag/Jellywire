import { beforeEach, describe, expect, it } from "vitest";
import { useDownloadStore } from "./downloadStore";
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
  useDownloadStore.setState({ downloads: [] });
});

describe("enqueue", () => {
  it("adds a new queued task seeded from the result's size", () => {
    const task = useDownloadStore.getState().enqueue(makeResult());

    expect(task).not.toBeNull();
    expect(task?.status).toBe("queued");
    expect(task?.progress).toBe(0);
    expect(task?.downloadedBytes).toBe(0);
    expect(task?.totalBytes).toBe(1000);
    expect(useDownloadStore.getState().downloads).toHaveLength(1);
  });

  it("refuses to double-queue the same result while it is active", () => {
    const first = useDownloadStore.getState().enqueue(makeResult());
    const second = useDownloadStore.getState().enqueue(makeResult());

    expect(first).not.toBeNull();
    expect(second).toBeNull();
    expect(useDownloadStore.getState().downloads).toHaveLength(1);
  });

  it("allows re-queueing a result whose previous attempt failed or was canceled", () => {
    const first = useDownloadStore.getState().enqueue(makeResult())!;
    useDownloadStore.getState().setStatus(first.id, "failed", "network error");

    const second = useDownloadStore.getState().enqueue(makeResult());

    expect(second).not.toBeNull();
    expect(useDownloadStore.getState().downloads).toHaveLength(2);
  });
});

describe("updateProgress", () => {
  it("updates progress fields and marks the task downloading", () => {
    const task = useDownloadStore.getState().enqueue(makeResult())!;

    useDownloadStore.getState().updateProgress(task.id, 42, 420, 1024);

    const updated = useDownloadStore.getState().downloads.find((d) => d.id === task.id);
    expect(updated).toMatchObject({ progress: 42, downloadedBytes: 420, speedBytesPerSec: 1024, status: "downloading" });
  });
});

describe("setStatus", () => {
  it("records the error message on failure", () => {
    const task = useDownloadStore.getState().enqueue(makeResult())!;

    useDownloadStore.getState().setStatus(task.id, "failed", "forbidden path");

    const updated = useDownloadStore.getState().downloads.find((d) => d.id === task.id);
    expect(updated?.status).toBe("failed");
    expect(updated?.error).toBe("forbidden path");
  });

  it("stamps completedAt only when the status becomes completed", () => {
    const task = useDownloadStore.getState().enqueue(makeResult())!;

    useDownloadStore.getState().setStatus(task.id, "downloading");
    expect(useDownloadStore.getState().downloads[0].completedAt).toBeUndefined();

    useDownloadStore.getState().setStatus(task.id, "completed");
    expect(useDownloadStore.getState().downloads[0].completedAt).toBeTypeOf("number");
  });
});

describe("patch", () => {
  it("merges arbitrary partial changes onto a task", () => {
    const task = useDownloadStore.getState().enqueue(makeResult())!;

    useDownloadStore.getState().patch(task.id, { destinationPath: "/Users/jamie/Downloads/Jellywire/x.mkv" });

    expect(useDownloadStore.getState().downloads[0].destinationPath).toBe(
      "/Users/jamie/Downloads/Jellywire/x.mkv",
    );
  });
});

describe("remove / clearCompleted / clearInactive", () => {
  it("removes a single task by id", () => {
    const task = useDownloadStore.getState().enqueue(makeResult())!;
    useDownloadStore.getState().remove(task.id);
    expect(useDownloadStore.getState().downloads).toHaveLength(0);
  });

  it("clearCompleted only drops completed tasks", () => {
    const done = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:done" }))!;
    const active = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:active" }))!;
    useDownloadStore.getState().setStatus(done.id, "completed");
    useDownloadStore.getState().setStatus(active.id, "downloading");

    useDownloadStore.getState().clearCompleted();

    const remainingIds = useDownloadStore.getState().downloads.map((d) => d.id);
    expect(remainingIds).toEqual([active.id]);
  });

  it("clearInactive keeps only queued/downloading/paused tasks", () => {
    const queued = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:queued" }))!;
    const failed = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:failed" }))!;
    const completed = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:completed" }))!;
    const canceled = useDownloadStore.getState().enqueue(makeResult({ id: "srv1:canceled" }))!;
    useDownloadStore.getState().setStatus(failed.id, "failed");
    useDownloadStore.getState().setStatus(completed.id, "completed");
    useDownloadStore.getState().setStatus(canceled.id, "canceled");

    useDownloadStore.getState().clearInactive();

    const remainingIds = useDownloadStore.getState().downloads.map((d) => d.id);
    expect(remainingIds).toEqual([queued.id]);
  });
});
