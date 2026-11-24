import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { XpCheckbox } from "./XpCheckbox";

const meta: Meta<typeof XpCheckbox> = {
  title: "Atoms/XpCheckbox",
  component: XpCheckbox,
  tags: ["autodocs"],
  args: { label: "Hide items already downloaded", onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof XpCheckbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
