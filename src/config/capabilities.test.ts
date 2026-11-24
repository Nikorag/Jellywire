import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Regression test for two real bugs found in production testing:
//  1. Scope was attached to the wrong permission identifier (`fs:default`
//     instead of the specific `fs:allow-*` command), so it silently granted
//     nothing and every write was denied.
//  2. `fs:allow-create` was missing entirely — the fs plugin's `create()`
//     command (used to open the destination file for a download) requires
//     its own permission distinct from `write`/`write_file`, and downloads
//     failed with "fs.create not allowed" until it was added.
// This statically checks the capability file so a future edit can't drop
// one of these without a test failing.

const dirname = path.dirname(fileURLToPath(import.meta.url));
const capabilitiesPath = path.join(dirname, "../../src-tauri/capabilities/default.json");

interface ScopedPermission {
  identifier: string;
  allow?: { path?: string; url?: string }[];
}

type Permission = string | ScopedPermission;

function loadPermissions(): Permission[] {
  const raw = readFileSync(capabilitiesPath, "utf-8");
  return JSON.parse(raw).permissions;
}

function findScoped(permissions: Permission[], identifier: string): ScopedPermission | undefined {
  return permissions.find(
    (p): p is ScopedPermission => typeof p === "object" && p.identifier === identifier,
  );
}

describe("src-tauri capabilities/default.json", () => {
  const permissions = loadPermissions();

  it.each(["fs:allow-create", "fs:allow-write", "fs:allow-write-file", "fs:allow-mkdir", "fs:allow-exists"])(
    "grants %s with a non-empty path scope",
    (identifier) => {
      const permission = findScoped(permissions, identifier);
      expect(permission, `${identifier} must be present as a scoped permission object`).toBeDefined();
      expect(permission!.allow?.length).toBeGreaterThan(0);
      for (const entry of permission!.allow!) {
        expect(entry.path).toBeTruthy();
      }
    },
  );

  it("scopes the default download directory ($DOWNLOAD) for every fs write command", () => {
    for (const identifier of ["fs:allow-create", "fs:allow-write", "fs:allow-write-file", "fs:allow-mkdir"]) {
      const permission = findScoped(permissions, identifier)!;
      const paths = permission.allow!.map((a) => a.path);
      expect(paths).toContain("$DOWNLOAD/**");
    }
  });

  it("grants http:default with a non-empty URL scope for the Jellyfin API/download requests", () => {
    const http = findScoped(permissions, "http:default");
    expect(http).toBeDefined();
    expect(http!.allow?.length).toBeGreaterThan(0);
    for (const entry of http!.allow!) {
      expect(entry.url).toBeTruthy();
    }
  });

  it("does not rely on fs:default or fs:scope for write scope (they don't carry it)", () => {
    // fs:default only grants access to Tauri's own app-specific directories;
    // attaching "allow" paths to it (or to a bare "fs:scope" entry alongside
    // unscoped command permissions) is the exact mistake that caused bug #1.
    const fsDefault = findScoped(permissions, "fs:default");
    expect(fsDefault?.allow).toBeUndefined();
  });
});
