import type { Meta, StoryObj } from "@storybook/react-vite";
import { TransfersTableRow } from "./TransfersTableRow";
import type { DownloadTask } from "../../../types/jellyfin";

const baseTask: DownloadTask = {
  id: "t1",
  result: {
    id: "srv1:1",
    serverId: "srv1",
    serverName: "Harbour NAS",
    itemId: "1",
    title: "Blue Harbor (2019)",
    filename: "Blue.Harbor.2019.1080p.REMUX.mkv",
    kind: "Movie",
    sizeBytes: 4_812_224_000,
  },
  status: "downloading",
  progress: 61,
  downloadedBytes: 2_935_456_640,
  totalBytes: 4_812_224_000,
  speedBytesPerSec: 11_400_000,
};

const meta: Meta<typeof TransfersTableRow> = {
  title: "Molecules/TransfersTableRow",
  component: TransfersTableRow,
  tags: ["autodocs"],
  args: { task: baseTask, index: 0 },
};

export default meta;
type Story = StoryObj<typeof TransfersTableRow>;

export const Downloading: Story = {};
export const Complete: Story = { args: { task: { ...baseTask, status: "completed", progress: 100 } } };
export const Failed: Story = {
  args: { task: { ...baseTask, status: "failed", error: "Connection lost" } },
};
export const Queued: Story = { args: { task: { ...baseTask, status: "queued", progress: 0 } } };
