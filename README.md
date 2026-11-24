# Jellywire

A LimeWire-style desktop client for aggregating and downloading media across multiple Jellyfin servers, built with Tauri, React, and Vite.

## Development

```bash
npm install
npm run tauri dev    # run the desktop app
npm run storybook     # browse the atomic design component library
```

## Architecture

- `src/components/{atoms,molecules,organisms,templates,pages}` — atomic design component library, each with Storybook stories
- `src/store` — Zustand stores for connected Jellyfin servers and the download queue
- `src/lib/jellyfinClient.ts` — Jellyfin REST API client and multi-server search aggregation
- `src/lib/downloadEngine.ts` / `src/lib/downloadManager.ts` — streams downloads to disk via the Tauri HTTP and filesystem plugins
- `src-tauri` — Tauri (Rust) shell with the `http`, `fs`, and `opener` plugins

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
# Jellywire
