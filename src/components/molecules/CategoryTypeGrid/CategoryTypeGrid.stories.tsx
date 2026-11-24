import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CategoryTypeGrid } from "./CategoryTypeGrid";

const meta: Meta<typeof CategoryTypeGrid> = {
  title: "Molecules/CategoryTypeGrid",
  component: CategoryTypeGrid,
  tags: ["autodocs"],
  args: { selected: "All Types", onSelect: fn() },
};

export default meta;
type Story = StoryObj<typeof CategoryTypeGrid>;

export const AllTypes: Story = {};
export const AudioSelected: Story = { args: { selected: "Audio" } };
