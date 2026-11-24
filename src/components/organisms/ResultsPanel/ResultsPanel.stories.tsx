import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ResultsPanel } from "./ResultsPanel";
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

const meta: Meta<typeof ResultsPanel> = {
  title: "Organisms/ResultsPanel",
  component: ResultsPanel,
  tags: ["autodocs"],
  args: {
    tabLabel: "all types (2)",
    results,
    selectedId: null,
    onSelect: fn(),
    onFetch: fn(),
    onSort: fn(),
    onCloseTab: fn(),
    actions: [
      { key: "fetch", icon: "↓", label: "Download", tone: "green", onClick: fn() },
      { key: "browse", icon: "▤", label: "Browse Server", tone: "amber", shape: "rounded", onClick: fn() },
      { key: "stop", icon: "■", label: "Stop Search", tone: "red", onClick: fn() },
      { key: "preview", icon: "▶", label: "Preview", tone: "blue", onClick: fn() },
      { key: "dismiss", icon: "▬", label: "Dismiss", tone: "gray", shape: "rounded", onClick: fn() },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof ResultsPanel>;

export const WithResults: Story = {};
export const Selected: Story = { args: { selectedId: "1" } };
export const Searching: Story = { args: { isSearching: true } };
export const NoResults: Story = { args: { results: [] } };
