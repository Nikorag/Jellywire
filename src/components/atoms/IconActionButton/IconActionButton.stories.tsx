import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconActionButton } from "./IconActionButton";

const meta: Meta<typeof IconActionButton> = {
  title: "Atoms/IconActionButton",
  component: IconActionButton,
  tags: ["autodocs"],
  args: { icon: "↓", label: "Download", tone: "green", onClick: fn() },
  argTypes: {
    tone: { control: "select", options: ["green", "amber", "red", "blue", "gray"] },
    shape: { control: "select", options: ["circle", "rounded", "folder"] },
  },
};

export default meta;
type Story = StoryObj<typeof IconActionButton>;

export const Download: Story = {};
export const Browse: Story = { args: { icon: "▤", label: "Browse Server", tone: "amber", shape: "rounded" } };
export const Stop: Story = { args: { icon: "■", label: "Stop Search", tone: "red" } };
export const Preview: Story = { args: { icon: "▶", label: "Preview", tone: "blue" } };
export const Dismiss: Story = { args: { icon: "▬", label: "Dismiss", tone: "gray", shape: "rounded" } };
export const Disabled: Story = { args: { disabled: true } };

export const FullActionRow: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <IconActionButton icon="↓" label="Download" tone="green" />
      <IconActionButton icon="▤" label="Browse Server" tone="amber" shape="rounded" />
      <IconActionButton icon="■" label="Stop Search" tone="red" />
      <IconActionButton icon="▶" label="Preview" tone="blue" />
      <IconActionButton icon="▬" label="Dismiss" tone="gray" shape="rounded" />
    </div>
  ),
};
