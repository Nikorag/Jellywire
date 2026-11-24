import { describe, expect, it } from "vitest";
import { formatBytes, formatRuntime, formatSpeed } from "./format";

describe("formatBytes", () => {
  it("renders an em dash for missing or zero sizes", () => {
    expect(formatBytes(undefined)).toBe("—");
    expect(formatBytes(0)).toBe("—");
    expect(formatBytes(-5)).toBe("—");
  });

  it("renders whole bytes without decimals", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("scales up through KB/MB/GB", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(5_241_000)).toBe("5.0 MB");
    expect(formatBytes(4_812_224_000)).toBe("4.5 GB");
  });
});

describe("formatSpeed", () => {
  it("renders an em dash for missing or zero speed", () => {
    expect(formatSpeed(undefined)).toBe("—");
    expect(formatSpeed(0)).toBe("—");
  });

  it("appends /s to a formatted byte size", () => {
    expect(formatSpeed(1024)).toBe("1.0 KB/s");
  });
});

describe("formatRuntime", () => {
  it("renders an em dash for missing or zero runtime", () => {
    expect(formatRuntime(undefined)).toBe("—");
    expect(formatRuntime(0)).toBe("—");
  });

  it("renders minutes only under an hour", () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("renders hours and minutes over an hour", () => {
    expect(formatRuntime(136)).toBe("2h 16m");
  });
});
