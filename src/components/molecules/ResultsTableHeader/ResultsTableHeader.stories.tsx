import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ResultsTableHeader } from "./ResultsTableHeader";

const meta: Meta<typeof ResultsTableHeader> = {
  title: "Molecules/ResultsTableHeader",
  component: ResultsTableHeader,
  tags: ["autodocs"],
  args: { onSort: fn() },
};

export default meta;
type Story = StoryObj<typeof ResultsTableHeader>;

export const Default: Story = {};
