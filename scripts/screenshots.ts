/**
 * Regenerates the README screenshots in docs/screenshots.
 *
 * Runs the Vite dev server in a headless browser and mocks the Jellyfin REST
 * API with openly-licensed Blender Foundation titles, so no real server (or
 * credentials) is needed.
 *
 *   npm run screenshots
 */
import { chromium, type Route } from "@playwright/test";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "http://localhost:1420";
const OUT = "docs/screenshots";
const TICKS_PER_MIN = 600_000_000;
const GB = 1024 ** 3;
const MB = 1024 ** 2;

interface MockItem {
  Id: string;
  Name: string;
  Type: string;
  ProductionYear?: number;
  RunTimeTicks?: number;
  CommunityRating?: number;
  SeriesName?: string;
  Genres?: string[];
  MediaSources: { Size: number; Bitrate: number; Container: string; Path: string }[];
}

function item(
  id: string,
  name: string,
  type: string,
  year: number,
  minutes: number,
  sizeBytes: number,
  container: string,
  file: string,
  rating: number,
  genres: string[],
): MockItem {
  return {
    Id: id,
    Name: name,
    Type: type,
    ProductionYear: year,
    RunTimeTicks: minutes * TICKS_PER_MIN,
    CommunityRating: rating,
    Genres: genres,
    MediaSources: [
      {
        Size: sizeBytes,
        Bitrate: Math.round((sizeBytes * 8) / (minutes * 60)),
        Container: container,
        Path: `/media/${file}`,
      },
    ],
  };
}

const HOME: MockItem[] = [
  item("h1", "Big Buck Bunny", "Movie", 2008, 10, 276 * MB, "mp4", "Big.Buck.Bunny.2008.1080p.mp4", 7.6, ["Animation", "Short"]),
  item("h2", "Sintel", "Movie", 2010, 15, 1.2 * GB, "mkv", "Sintel.2010.1080p.BluRay.mkv", 7.4, ["Animation", "Fantasy"]),
  item("h3", "Tears of Steel", "Movie", 2012, 12, 2.4 * GB, "mkv", "Tears.of.Steel.2012.2160p.mkv", 6.9, ["Sci-Fi"]),
  item("h4", "Elephants Dream", "Movie", 2006, 11, 410 * MB, "avi", "Elephants.Dream.2006.avi", 6.2, ["Animation", "Sci-Fi"]),
  item("h5", "Spring", "Movie", 2019, 8, 850 * MB, "mp4", "Spring.2019.1080p.mp4", 7.8, ["Animation", "Fantasy"]),
];

const FRIEND: MockItem[] = [
  item("f1", "Cosmos Laundromat", "Movie", 2015, 12, 1.6 * GB, "mkv", "Cosmos.Laundromat.2015.1080p.mkv", 7.1, ["Animation", "Comedy"]),
  item("f2", "Agent 327: Operation Barbershop", "Movie", 2017, 4, 190 * MB, "mp4", "Agent.327.Operation.Barbershop.2017.mp4", 6.5, ["Animation", "Action"]),
  item("f3", "Caminandes: Llamigos", "Movie", 2016, 3, 120 * MB, "mp4", "Caminandes.3.Llamigos.2016.mp4", 7.0, ["Animation", "Comedy"]),
  item("f4", "Glass Half", "Movie", 2015, 4, 95 * MB, "mp4", "Glass.Half.2015.mp4", 6.0, ["Animation", "Short"]),
  item("f5", "Hero", "Movie", 2018, 4, 140 * MB, "mp4", "Hero.2018.1080p.mp4", 6.4, ["Animation", "Short"]),
  item("f6", "Coffee Run", "Movie", 2020, 3, 110 * MB, "mp4", "Coffee.Run.2020.1080p.mp4", 7.2, ["Animation", "Short"]),
];

const SERVERS = [
  { name: "Home Server", baseUrl: "http://home.jellyfin.local:8096", items: HOME },
  { name: "Friend's Server", baseUrl: "http://friend.jellyfin.local:8096", items: FRIEND },
];

async function mockServer(route: Route, items: MockItem[]) {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith("/System/Info")) {
    return route.fulfill({ json: { ServerName: "Mock", Version: "10.10.0" } });
  }
  if (url.pathname.endsWith("/Items")) {
    const term = url.searchParams.get("searchTerm")?.toLowerCase();
    const matches = term ? items.filter((i) => i.Name.toLowerCase().includes(term)) : items;
    return route.fulfill({ json: { Items: matches, TotalRecordCount: matches.length } });
  }
  return route.fulfill({ status: 404 });
}

async function main() {
  const dev = spawn("npm", ["run", "dev"], { stdio: "ignore" });
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(BASE)).ok) break;
      } catch {
        await sleep(500);
      }
    }

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
      deviceScaleFactor: 2,
    });
    for (const s of SERVERS) {
      await context.route(`${s.baseUrl}/**`, (r) => mockServer(r, s.items));
    }
    const page = await context.newPage();

    // The app has a random easter-egg result on ~29% of searches; keep shots deterministic.
    await page.addInitScript(() => {
      Math.random = () => 0.99;
    });

    // Seed the persisted server store so both servers connect on launch.
    await page.addInitScript((servers) => {
      localStorage.setItem(
        "jellywire-servers",
        JSON.stringify({
          state: {
            servers: servers.map((s, i) => ({
              id: `srv-${i}`,
              name: s.name,
              baseUrl: s.baseUrl,
              apiKey: "demo",
              addedAt: Date.now(),
              status: "connecting",
            })),
          },
          version: 0,
        }),
      );
    }, SERVERS.map(({ name, baseUrl }) => ({ name, baseUrl })));

    await page.goto(BASE);
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.locator(".ff-results-row").first().waitFor();
    await sleep(500);
    await page.screenshot({ path: `${OUT}/search.png` });

    // Fake some in-flight transfers through the app's own store.
    await page.evaluate(async () => {
      const { useDownloadStore } = await import("/src/store/downloadStore.ts");
      const { searchAllServers } = await import("/src/lib/jellyfinClient.ts");
      const { useServerStore } = await import("/src/store/serverStore.ts");
      const { results } = await searchAllServers(useServerStore.getState().servers, "");
      const store = useDownloadStore.getState();
      const plan: [number, "downloading" | "completed" | "queued" | "paused", number][] = [
        [0, "downloading", 64],
        [1, "downloading", 27],
        [2, "queued", 0],
        [5, "completed", 100],
        [6, "paused", 41],
      ];
      for (const [idx, status, progress] of plan) {
        const task = store.enqueue(results[idx]);
        if (!task) continue;
        const total = results[idx].sizeBytes ?? 0;
        if (status === "downloading") {
          store.updateProgress(task.id, progress, Math.round((total * progress) / 100), 6.4 * 1024 * 1024);
        } else if (status === "completed") {
          store.patch(task.id, { status, progress: 100, downloadedBytes: total, completedAt: Date.now() });
        } else if (status === "paused") {
          store.patch(task.id, { status, progress, downloadedBytes: Math.round((total * progress) / 100) });
        }
      }
    });
    await sleep(400);
    await page.screenshot({ path: `${OUT}/transfers.png` });

    await page.locator(".ff-menu-bar__item", { hasText: "Server" }).click();
    await sleep(400);
    await page.screenshot({ path: `${OUT}/servers.png` });

    await browser.close();
  } finally {
    dev.kill();
  }
}

main();
