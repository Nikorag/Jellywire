import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SettingsDialog } from "./SettingsDialog";

const meta: Meta<typeof SettingsDialog> = {
  title: "Organisms/SettingsDialog",
  component: SettingsDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    downloadDirectory: null,
    defaultDirectory: "/Users/jamie/Downloads/Jellywire",
    onChooseFolder: fn(),
    onResetToDefault: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SettingsDialog>;

export const DefaultLocation: Story = {};

export const CustomLocation: Story = {
  args: { downloadDirectory: "/Volumes/Media Drive/Jellywire Downloads" },
};
