import type { Meta, StoryObj } from "@storybook/react-vite";
import { TransfersTableHeader } from "./TransfersTableHeader";

const meta: Meta<typeof TransfersTableHeader> = {
  title: "Molecules/TransfersTableHeader",
  component: TransfersTableHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TransfersTableHeader>;

export const Default: Story = {};
