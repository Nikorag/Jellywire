import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.resetModules();
});

describe("serverStore", () => {
  it("adds, updates the status of, and removes servers", async () => {
    const { useServerStore } = await import("./serverStore");

    const a = useServerStore.getState().addServer({ name: "A", baseUrl: "http://a:8096", apiKey: "ka" });
    const b = useServerStore.getState().addServer({ name: "B", baseUrl: "http://b:8096", apiKey: "kb" });
    expect(useServerStore.getState().servers).toHaveLength(2);

    useServerStore.getState().setServerStatus(a.id, "error", "timeout");
    expect(useServerStore.getState().servers.find((s) => s.id === a.id)).toMatchObject({
      status: "error",
      lastError: "timeout",
    });

    useServerStore.getState().removeServer(b.id);
    expect(useServerStore.getState().servers.map((s) => s.id)).toEqual([a.id]);
  });

  it("strips a trailing slash from the base URL", async () => {
    const { useServerStore } = await import("./serverStore");
    const server = useServerStore.getState().addServer({ name: "A", baseUrl: "http://a:8096/", apiKey: "ka" });
    expect(server.baseUrl).toBe("http://a:8096");
  });

  it("persists added servers across a simulated app restart", async () => {
    const { useServerStore } = await import("./serverStore");
    useServerStore.getState().addServer({ name: "Harbour NAS", baseUrl: "http://10.0.1.14:8096", apiKey: "key1" });

    // Simulate relaunching the app: reload the module against the same
    // localStorage the first instance wrote to.
    vi.resetModules();
    const { useServerStore: reloadedStore } = await import("./serverStore");

    const persisted = reloadedStore.getState().servers;
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({
      name: "Harbour NAS",
      baseUrl: "http://10.0.1.14:8096",
      apiKey: "key1",
    });
  });

  it("resets a persisted server's status to connecting rather than trusting a stale status", async () => {
    const { useServerStore } = await import("./serverStore");
    const server = useServerStore.getState().addServer({ name: "S", baseUrl: "http://x:8096", apiKey: "k" });
    useServerStore.getState().setServerStatus(server.id, "error", "boom");

    vi.resetModules();
    const { useServerStore: reloadedStore } = await import("./serverStore");

    expect(reloadedStore.getState().servers[0].status).toBe("connecting");
    expect(reloadedStore.getState().servers[0].lastError).toBeUndefined();
  });

  it("does not persist a server removed before restart", async () => {
    const { useServerStore } = await import("./serverStore");
    const keep = useServerStore.getState().addServer({ name: "Keep", baseUrl: "http://keep:8096", apiKey: "k1" });
    const drop = useServerStore.getState().addServer({ name: "Drop", baseUrl: "http://drop:8096", apiKey: "k2" });
    useServerStore.getState().removeServer(drop.id);
    void keep;

    vi.resetModules();
    const { useServerStore: reloadedStore } = await import("./serverStore");

    expect(reloadedStore.getState().servers.map((s) => s.name)).toEqual(["Keep"]);
  });
});
