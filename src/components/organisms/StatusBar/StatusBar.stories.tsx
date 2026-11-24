import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBar } from "./StatusBar";

const meta: Meta<typeof StatusBar> = {
  title: "Organisms/StatusBar",
  component: StatusBar,
  tags: ["autodocs"],
  args: {
    connectionLabel: "Connection: Excellent",
    activeBars: 4,
    downRate: "1 @ 11.4 MB/s",
    upRate: "0 @ 0 KB/s",
    statusMessage: "Idle — double-click a result to fetch it",
  },
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

export const Idle: Story = {};
export const ActiveTransfer: Story = {
  args: { statusMessage: "1 transfer(s) in progress" },
};
export const Selected: Story = {
  args: { statusMessage: "Selected: Blue Harbor (2019) — 1080p Remux" },
};
