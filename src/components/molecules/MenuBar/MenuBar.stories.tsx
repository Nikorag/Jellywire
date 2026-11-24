import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MenuBar } from "./MenuBar";

const meta: Meta<typeof MenuBar> = {
  title: "Molecules/MenuBar",
  component: MenuBar,
  tags: ["autodocs"],
  args: { onServerClick: fn(), onToolsClick: fn() },
};

export default meta;
type Story = StoryObj<typeof MenuBar>;

export const Default: Story = {};
