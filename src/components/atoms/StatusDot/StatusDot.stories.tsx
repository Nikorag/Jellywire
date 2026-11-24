import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "./StatusDot";

const meta: Meta<typeof StatusDot> = {
  title: "Atoms/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  args: { tone: "green" },
  argTypes: { tone: { control: "select", options: ["green", "gray", "red"] } },
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Connected: Story = {};
export const Offline: Story = { args: { tone: "gray", pulse: false } };
export const Error: Story = { args: { tone: "red", pulse: false } };
