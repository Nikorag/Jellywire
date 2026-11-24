import { test, expect } from "@playwright/test";

// Regression test for a reported bug: searching for a show (e.g. "Bluey")
// was only returning 4 results instead of every individual episode file.
// Requires a real Jellyfin server's credentials in `.env.local`:
//   JELLYFIN_URL=https://your-server
//   JELLYFIN_API_KEY=your-api-key
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local present — the test below will skip itself.
}

const JELLYFIN_URL = process.env.JELLYFIN_URL;
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY;

test("searching a show expands it into every individual episode, not just a handful of top-level matches", async ({
  page,
}) => {
  test.skip(
    !JELLYFIN_URL || !JELLYFIN_API_KEY,
    "Requires JELLYFIN_URL and JELLYFIN_API_KEY in .env.local to run against a real Jellyfin server",
  );

  await page.goto("/");
  await expect(page.getByText("Jellywire — Jellyfin Media Retrieval")).toBeVisible();

  // Open the Server dialog via the menu bar and add the real test server.
  await page.locator(".ff-menu-bar__item", { hasText: "Server" }).click();
  await page.getByLabel("Display name").fill("E2E Test Server");
  await page.getByLabel("Server URL").fill(JELLYFIN_URL!);
  await page.getByLabel("API key").fill(JELLYFIN_API_KEY!);
  await page.getByRole("button", { name: "Add Server" }).click();
  await page.locator(".ff-server-dialog-overlay").getByRole("button", { name: "Close" }).click();

  // Search for a show that is known to have many episodes.
  await page.getByLabel("Title").fill("Bluey");
  await page.getByRole("button", { name: "Search", exact: true }).click();

  const rows = page.locator(".ff-results-row");

  // Give the search (top-level query + per-show episode expansion, all real
  // network calls) plenty of time, then assert we got far more than the 4
  // results the bug report described.
  await expect
    .poll(async () => rows.count(), { timeout: 30_000, intervals: [500, 1000, 2000] })
    .toBeGreaterThan(4);

  const finalCount = await rows.count();
  console.log(`"Bluey" search returned ${finalCount} individual result rows`);

  // The real library this was tested against has 150+ Bluey episodes plus a
  // handful of movie/audio matches — 4 would mean the show never expanded.
  expect(finalCount).toBeGreaterThan(20);

  // The name column shows the actual filename, not the episode title, so
  // confirm the bulk of the expanded rows are genuinely Bluey files on disk
  // (this only happens if the parentId expansion query actually ran).
  const filenames = await page.locator(".ff-results-row__name").allTextContents();
  const blueyFileCount = filenames.filter((f) => f.toLowerCase().includes("bluey")).length;
  expect(blueyFileCount).toBeGreaterThan(20);
});
