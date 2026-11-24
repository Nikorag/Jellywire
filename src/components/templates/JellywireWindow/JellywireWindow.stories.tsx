import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { JellywireWindow } from "./JellywireWindow";
import { SearchSidebar } from "../../organisms/SearchSidebar/SearchSidebar";
import { ResultsPanel } from "../../organisms/ResultsPanel/ResultsPanel";
import type { SearchResult } from "../../../types/jellyfin";

const results: SearchResult[] = [
  {
    id: "1",
    serverId: "s1",
    serverName: "Harbour NAS",
    itemId: "1",
    title: "Aurora Fields — Paper Compass",
    filename: "Joff Bush - Aurora Fields - Paper Compass.mp3",
    kind: "Audio",
    sizeBytes: 5_241_000,
    bitrateKbps: 320,
    container: "mp3",
    communityRating: 10,
    playCount: 41,
    alreadyDownloaded: true,
  },
  {
    id: "2",
    serverId: "s1",
    serverName: "Harbour NAS",
    itemId: "2",
    title: "Blue Harbor (2019) — 1080p Remux",
    filename: "Blue.Harbor.2019.1080p.REMUX.mkv",
    kind: "Movie",
    sizeBytes: 4_812_224_000,
    bitrateKbps: 8500,
    container: "mkv",
    communityRating: 9,
    playCount: 6,
  },
];

const meta: Meta<typeof JellywireWindow> = {
  title: "Templates/JellywireWindow",
  component: JellywireWindow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    sidebar: (
      <SearchSidebar
        category="All Types"
        onCategoryChange={fn()}
        queryValues={{ title: "", artist: "", collection: "", genre: "", minQuality: "0", onlyOffline: false }}
        genres={["Indie", "Drama", "Documentary", "Score"]}
        onQueryChange={fn()}
        onSearch={fn()}
        serverTone="green"
        serverHeadline="Harbour NAS + 1 more"
        serverHost="http://10.0.1.14:8096"
        serverDetail="2 of 2 servers online"
      />
    ),
    results: (
      <ResultsPanel
        tabLabel="all types (2)"
        results={results}
        selectedId={null}
        onSelect={fn()}
        onFetch={fn()}
        onSort={fn()}
        onCloseTab={fn()}
        actions={[
          { key: "fetch", icon: "↓", label: "Download", tone: "green", onClick: fn() },
          { key: "browse", icon: "▤", label: "Browse Server", tone: "amber", shape: "rounded", onClick: fn() },
          { key: "stop", icon: "■", label: "Stop Search", tone: "red", onClick: fn() },
          { key: "preview", icon: "▶", label: "Preview", tone: "blue", onClick: fn() },
          { key: "dismiss", icon: "▬", label: "Dismiss", tone: "gray", shape: "rounded", onClick: fn() },
        ]}
      />
    ),
    transfers: [],
    onClearFinished: fn(),
    transferActions: [
      { key: "cancel", icon: "⊘", label: "Cancel", tone: "gray", onClick: fn() },
      { key: "resume", icon: "↻", label: "Resume", tone: "green", onClick: fn() },
      { key: "pause", icon: "❚❚", label: "Pause", tone: "blue", onClick: fn() },
      { key: "folder", icon: "", label: "Open Folder", tone: "amber", shape: "folder", onClick: fn() },
      { key: "clear", icon: "✕", label: "Clear Inactive", tone: "gray", shape: "rounded", onClick: fn() },
    ],
    connectionLabel: "Connection: Excellent",
    activeBars: 4,
    downRate: "0 @ 0 KB/s",
    upRate: "0 @ 0 KB/s",
    statusMessage: "Idle — double-click a result to fetch it",
  },
};

export default meta;
type Story = StoryObj<typeof JellywireWindow>;

export const Default: Story = {};
