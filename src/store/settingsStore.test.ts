import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.resetModules();
});

describe("settingsStore", () => {
  it("defaults to no custom download directory", async () => {
    const { useSettingsStore } = await import("./settingsStore");
    expect(useSettingsStore.getState().downloadDirectory).toBeNull();
  });

  it("persists a chosen download directory across a simulated app restart", async () => {
    const { useSettingsStore } = await import("./settingsStore");
    useSettingsStore.getState().setDownloadDirectory("/Volumes/Media Drive/Jellywire");

    vi.resetModules();
    const { useSettingsStore: reloadedStore } = await import("./settingsStore");

    expect(reloadedStore.getState().downloadDirectory).toBe("/Volumes/Media Drive/Jellywire");
  });

  it("persists resetting back to the default (null) directory", async () => {
    const { useSettingsStore } = await import("./settingsStore");
    useSettingsStore.getState().setDownloadDirectory("/Volumes/Media Drive/Jellywire");
    useSettingsStore.getState().setDownloadDirectory(null);

    vi.resetModules();
    const { useSettingsStore: reloadedStore } = await import("./settingsStore");

    expect(reloadedStore.getState().downloadDirectory).toBeNull();
  });
});
