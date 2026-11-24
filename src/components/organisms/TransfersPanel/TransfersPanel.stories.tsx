import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TransfersPanel } from "./TransfersPanel";
import type { DownloadTask } from "../../../types/jellyfin";

const tasks: DownloadTask[] = [
  {
    id: "t1",
    result: {
      id: "1",
      serverId: "s1",
      serverName: "Harbour NAS",
      itemId: "1",
      title: "Paper Compass",
      filename: "Joff Bush - Aurora Fields - Paper Compass.mp3",
      kind: "Audio",
      sizeBytes: 5_241_000,
    },
    status: "completed",
    progress: 100,
    downloadedBytes: 5_241_000,
    totalBytes: 5_241_000,
  },
  {
    id: "t2",
    result: {
      id: "2",
      serverId: "s1",
      serverName: "Harbour NAS",
      itemId: "2",
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
  },
];

const meta: Meta<typeof TransfersPanel> = {
  title: "Organisms/TransfersPanel",
  component: TransfersPanel,
  tags: ["autodocs"],
  args: {
    tasks,
    onClearFinished: fn(),
    actions: [
      { key: "cancel", icon: "⊘", label: "Cancel", tone: "gray", onClick: fn() },
      { key: "resume", icon: "↻", label: "Resume", tone: "green", onClick: fn() },
      { key: "pause", icon: "❚❚", label: "Pause", tone: "blue", onClick: fn() },
      { key: "folder", icon: "", label: "Open Folder", tone: "amber", shape: "folder", onClick: fn() },
      { key: "clear", icon: "✕", label: "Clear Inactive", tone: "gray", shape: "rounded", onClick: fn() },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof TransfersPanel>;

export const WithTransfers: Story = {};
export const Empty: Story = { args: { tasks: [] } };
