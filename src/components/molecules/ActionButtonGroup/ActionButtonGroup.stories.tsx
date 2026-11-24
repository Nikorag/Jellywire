import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ActionButtonGroup } from "./ActionButtonGroup";

const meta: Meta<typeof ActionButtonGroup> = {
  title: "Molecules/ActionButtonGroup",
  component: ActionButtonGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActionButtonGroup>;

export const SearchActions: Story = {
  args: {
    actions: [
      { key: "fetch", icon: "↓", label: "Download", tone: "green", onClick: fn() },
      { key: "browse", icon: "▤", label: "Browse Server", tone: "amber", shape: "rounded", onClick: fn() },
      { key: "stop", icon: "■", label: "Stop Search", tone: "red", onClick: fn() },
      { key: "preview", icon: "▶", label: "Preview", tone: "blue", onClick: fn() },
      { key: "dismiss", icon: "▬", label: "Dismiss", tone: "gray", shape: "rounded", onClick: fn() },
    ],
  },
};

export const TransferActions: Story = {
  args: {
    actions: [
      { key: "cancel", icon: "⊘", label: "Cancel", tone: "gray", onClick: fn() },
      { key: "resume", icon: "↻", label: "Resume", tone: "green", onClick: fn() },
      { key: "pause", icon: "❚❚", label: "Pause", tone: "blue", onClick: fn() },
      { key: "folder", icon: "", label: "Open Folder", tone: "amber", shape: "folder", onClick: fn() },
      { key: "clear", icon: "✕", label: "Clear Inactive", tone: "gray", shape: "rounded", onClick: fn() },
    ],
  },
};
