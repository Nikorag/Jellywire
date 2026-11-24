import type { Meta, StoryObj } from "@storybook/react-vite";
import { StripedProgressBar } from "./StripedProgressBar";

const meta: Meta<typeof StripedProgressBar> = {
  title: "Atoms/StripedProgressBar",
  component: StripedProgressBar,
  tags: ["autodocs"],
  args: { percent: 42 },
  argTypes: { percent: { control: { type: "range", min: 0, max: 100 } } },
};

export default meta;
type Story = StoryObj<typeof StripedProgressBar>;

export const Default: Story = {};
export const Complete: Story = { args: { percent: 100 } };
export const Empty: Story = { args: { percent: 0 } };
