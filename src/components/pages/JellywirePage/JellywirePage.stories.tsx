import type { Meta, StoryObj } from "@storybook/react-vite";
import { JellywirePage } from "./JellywirePage";

const meta: Meta<typeof JellywirePage> = {
  title: "Pages/JellywirePage",
  component: JellywirePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof JellywirePage>;

export const Default: Story = {};
