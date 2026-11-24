import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildDownloadUrl,
  buildStreamUrl,
  categoryForKind,
  matchesCategory,
  searchAllServers,
  searchServer,
} from "./jellyfinClient";
import type { JellyfinServer } from "../types/jellyfin";

function makeServer(overrides: Partial<JellyfinServer> = {}): JellyfinServer {
  return {
    id: "srv1",
    name: "Harbour NAS",
    baseUrl: "http://10.0.1.14:8096",
    apiKey: "test-key",
    status: "connected",
    addedAt: 0,
    ...overrides,
  };
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function itemsResponse(items: unknown[]): Response {
  return jsonResponse({ Items: items, TotalRecordCount: items.length });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("matchesCategory", () => {
  it("matches everything under All Types", () => {
    expect(matchesCategory("Episode", "All Types")).toBe(true);
    expect(matchesCategory("Movie", "All Types")).toBe(true);
  });

  it("only matches Episode kind under Shows, not Series", () => {
    expect(matchesCategory("Episode", "Shows")).toBe(true);
    expect(matchesCategory("Series", "Shows")).toBe(false);
  });

  it("matches Audio and MusicAlbum under Audio", () => {
    expect(matchesCategory("Audio", "Audio")).toBe(true);
    expect(matchesCategory("MusicAlbum", "Audio")).toBe(true);
    expect(matchesCategory("Movie", "Audio")).toBe(false);
  });
});

describe("categoryForKind", () => {
  it("maps kinds to their display category", () => {
    expect(categoryForKind("Movie")).toBe("Movies");
    expect(categoryForKind("Episode")).toBe("Shows");
    expect(categoryForKind("Audio")).toBe("Audio");
    expect(categoryForKind("Other")).toBe("All Types");
  });
});

describe("buildDownloadUrl / buildStreamUrl", () => {
  const server = makeServer();

  it("builds a download URL with the api key", () => {
    expect(buildDownloadUrl(server, "item1")).toBe(
      "http://10.0.1.14:8096/Items/item1/Download?api_key=test-key",
    );
  });

  it("streams audio kinds from the Audio endpoint", () => {
    expect(buildStreamUrl(server, { itemId: "a1", kind: "Audio" })).toContain("/Audio/a1/stream");
  });

  it("streams video-like kinds from the Videos endpoint", () => {
    expect(buildStreamUrl(server, { itemId: "m1", kind: "Movie" })).toContain("/Videos/m1/stream");
    expect(buildStreamUrl(server, { itemId: "e1", kind: "Episode" })).toContain("/Videos/e1/stream");
  });
});

describe("searchServer", () => {
  const server = makeServer();

  it("drops container items (Series/Season/BoxSet) that have no media file", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      itemsResponse([
        { Id: "series1", Name: "Bluey", Type: "Series" },
        { Id: "movie1", Name: "Interstellar", Type: "Movie", MediaSources: [{ Size: 123 }] },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "");

    expect(results.map((r) => r.title)).toEqual(["Interstellar"]);
  });

  it("expands a Series match into its individual Episode files", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("parentId=series1")) {
        return Promise.resolve(
          itemsResponse([
            {
              Id: "ep1",
              Name: "Hospital",
              Type: "Episode",
              SeriesName: "Bluey",
              MediaSources: [{ Size: 500, Container: "mkv" }],
            },
            {
              Id: "ep2",
              Name: "Fruit Bat",
              Type: "Episode",
              SeriesName: "Bluey",
              MediaSources: [{ Size: 600, Container: "mkv" }],
            },
          ]),
        );
      }
      // Top-level search only matches the Series itself, not any episode by name.
      return Promise.resolve(itemsResponse([{ Id: "series1", Name: "Bluey", Type: "Series" }]));
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "Bluey");

    expect(results).toHaveLength(2);
    expect(results.map((r) => r.title).sort()).toEqual(["Fruit Bat", "Hospital"]);
    expect(results.every((r) => r.kind === "Episode")).toBe(true);
    expect(results.every((r) => r.subtitle === "Bluey")).toBe(true);
  });

  it("expands a Season match into its Episode files", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("parentId=season1")) {
        return Promise.resolve(
          itemsResponse([
            { Id: "ep1", Name: "Backyard", Type: "Episode", MediaSources: [{ Size: 700 }] },
          ]),
        );
      }
      return Promise.resolve(itemsResponse([{ Id: "season1", Name: "Season 1", Type: "Season" }]));
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "Season 1");

    expect(results.map((r) => r.title)).toEqual(["Backyard"]);
  });

  it("expands a MusicAlbum match into its Audio tracks", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("parentId=album1")) {
        return Promise.resolve(
          itemsResponse([
            { Id: "track1", Name: "Track One", Type: "Audio", MediaSources: [{ Size: 100 }] },
          ]),
        );
      }
      return Promise.resolve(itemsResponse([{ Id: "album1", Name: "Discovery", Type: "MusicAlbum" }]));
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "Discovery");

    expect(results.map((r) => r.title)).toEqual(["Track One"]);
  });

  it("de-duplicates an item that matches directly and also arrives via expansion", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("parentId=series1")) {
        return Promise.resolve(
          itemsResponse([
            { Id: "ep1", Name: "Hospital", Type: "Episode", MediaSources: [{ Size: 500 }] },
          ]),
        );
      }
      return Promise.resolve(
        itemsResponse([
          { Id: "series1", Name: "Bluey", Type: "Series" },
          // Also matched the top-level search directly by its own name.
          { Id: "ep1", Name: "Hospital", Type: "Episode", MediaSources: [{ Size: 500 }] },
        ]),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "Hospital");

    expect(results).toHaveLength(1);
  });

  it("leaves plain leaf results (Movie/Audio/Video) untouched", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      itemsResponse([
        { Id: "movie1", Name: "Interstellar", Type: "Movie", MediaSources: [{ Size: 42, Bitrate: 8_000_000, Container: "mkv" }] },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchServer(server, "Interstellar");

    expect(results).toEqual([
      expect.objectContaining({
        id: "srv1:movie1",
        title: "Interstellar",
        kind: "Movie",
        sizeBytes: 42,
        bitrateKbps: 8000,
        container: "mkv",
      }),
    ]);
  });

  it("uses the actual file name from the media source path, not the media title", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      itemsResponse([
        {
          Id: "ep1",
          Name: "Hospital",
          Type: "Episode",
          MediaSources: [
            {
              Size: 500,
              Container: "mp4",
              Path: "/mnt/media/bandit/bandit_tv/Bluey/Season 3/Bluey.2018.S03E07.mp4",
            },
          ],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [result] = await searchServer(server, "Hospital");

    expect(result.title).toBe("Hospital");
    expect(result.filename).toBe("Bluey.2018.S03E07.mp4");
  });

  it("falls back to a reconstructed name when the media source has no path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      itemsResponse([{ Id: "m1", Name: "Interstellar", Type: "Movie", MediaSources: [{ Size: 42, Container: "mkv" }] }]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [result] = await searchServer(server, "Interstellar");

    expect(result.filename).toBe("Interstellar.mkv");
  });

  it("throws with the server name and status when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(null, false, 500)));

    await expect(searchServer(server, "anything")).rejects.toThrow(/Harbour NAS.*500/);
  });
});

describe("searchAllServers", () => {
  it("aggregates results across servers and separates failures", async () => {
    const good = makeServer({ id: "good", name: "Good Server" });
    const bad = makeServer({ id: "bad", name: "Bad Server", baseUrl: "http://offline:8096" });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("offline")) return Promise.reject(new Error("network down"));
        return Promise.resolve(
          itemsResponse([{ Id: "m1", Name: "Interstellar", Type: "Movie", MediaSources: [{ Size: 1 }] }]),
        );
      }),
    );

    const { results, errors } = await searchAllServers([good, bad], "Interstellar");

    expect(results).toHaveLength(1);
    expect(results[0].serverId).toBe("good");
    expect(errors).toHaveLength(1);
    expect(errors[0].server.id).toBe("bad");
  });
});
