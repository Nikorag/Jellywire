import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { XpButton } from "./XpButton";

const meta: Meta<typeof XpButton> = {
  title: "Atoms/XpButton",
  component: XpButton,
  tags: ["autodocs"],
  args: { children: "Search", onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof XpButton>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
