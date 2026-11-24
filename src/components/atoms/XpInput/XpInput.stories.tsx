import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { XpInput } from "./XpInput";

const meta: Meta<typeof XpInput> = {
  title: "Atoms/XpInput",
  component: XpInput,
  tags: ["autodocs"],
  args: { placeholder: "paper compass", onChange: fn() },
  parameters: { backgrounds: { default: "panel" } },
};

export default meta;
type Story = StoryObj<typeof XpInput>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "Aurora Fields" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked" } };
