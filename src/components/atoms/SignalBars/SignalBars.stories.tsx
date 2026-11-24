import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignalBars } from "./SignalBars";

const meta: Meta<typeof SignalBars> = {
  title: "Atoms/SignalBars",
  component: SignalBars,
  tags: ["autodocs"],
  args: { activeBars: 4 },
  argTypes: { activeBars: { control: { type: "range", min: 0, max: 5 } } },
};

export default meta;
type Story = StoryObj<typeof SignalBars>;

export const Excellent: Story = { args: { activeBars: 5 } };
export const Weak: Story = { args: { activeBars: 1 } };
export const None: Story = { args: { activeBars: 0 } };
