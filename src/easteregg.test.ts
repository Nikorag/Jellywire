import { afterEach, describe, expect, it, vi } from "vitest";
import { EASTER_EGG_SERVER_ID, limewireFiles, maybeGetEasterEggResult } from "./easteregg";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("maybeGetEasterEggResult", () => {
  it("returns null when the roll is 30 or above (~70% of the time)", () => {
    // Math.random() = 0.3 -> roll = floor(0.3 * 100) + 1 = 31
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    expect(maybeGetEasterEggResult()).toBeNull();
  });

  it("returns a fake result when the roll is below 30 (~30% of the time)", () => {
    // Math.random() = 0 -> roll = 1
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = maybeGetEasterEggResult();
    expect(result).not.toBeNull();
  });

  it("triggers on roll 29", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.28); // roll = floor(28) + 1 = 29
    expect(maybeGetEasterEggResult()).not.toBeNull();
  });

  it("does not trigger on roll 30 (the exact boundary)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.295); // roll = floor(29.5) + 1 = 30
    expect(maybeGetEasterEggResult()).toBeNull();
  });

  it("gives the fake result a serverId that never matches a real server", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = maybeGetEasterEggResult();
    expect(result!.serverId).toBe(EASTER_EGG_SERVER_ID);
  });

  it("picks the filename from the limewireFiles list and derives a readable title", () => {
    // First random() call picks the roll (0 -> triggers), second picks the file index (0 -> first file).
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0);
    const result = maybeGetEasterEggResult();
    expect(result!.filename).toBe(limewireFiles[0].filename);
    expect(result!.title).toBe("Linking Park Numb");
  });

  it("parses the fake file size into bytes", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = maybeGetEasterEggResult();
    expect(result!.sizeBytes).toBe(3 * 1024);
  });

  it("gives the result a maximal rating so it sorts to the top by default", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = maybeGetEasterEggResult();
    expect(result!.communityRating).toBe(10);
  });
});
