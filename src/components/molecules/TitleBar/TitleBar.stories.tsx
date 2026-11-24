import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TitleBar } from "./TitleBar";

const meta: Meta<typeof TitleBar> = {
  title: "Molecules/TitleBar",
  component: TitleBar,
  tags: ["autodocs"],
  args: {
    title: "Jellywire — Jellyfin Media Retrieval",
    onMinimize: fn(),
    onMaximize: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TitleBar>;

export const Default: Story = {};
