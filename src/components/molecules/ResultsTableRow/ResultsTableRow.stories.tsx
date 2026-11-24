import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ResultsTableRow } from "./ResultsTableRow";
import type { SearchResult } from "../../../types/jellyfin";

const baseResult: SearchResult = {
  id: "srv1:1",
  serverId: "srv1",
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
};

const meta: Meta<typeof ResultsTableRow> = {
  title: "Molecules/ResultsTableRow",
  component: ResultsTableRow,
  tags: ["autodocs"],
  args: { result: baseResult, category: "Audio", selected: false, onSelect: fn(), onFetch: fn() },
};

export default meta;
type Story = StoryObj<typeof ResultsTableRow>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const AlreadyDownloaded: Story = {
  args: { result: { ...baseResult, alreadyDownloaded: true } },
};
export const Movie: Story = {
  args: {
    category: "Movies",
    result: {
      ...baseResult,
      title: "Blue Harbor (2019) — 1080p Remux",
      filename: "Blue.Harbor.2019.1080p.REMUX.mkv",
      kind: "Movie",
      sizeBytes: 4_812_224_000,
      bitrateKbps: 8500,
      container: "mkv",
      communityRating: 9,
      playCount: 6,
    },
  },
};
