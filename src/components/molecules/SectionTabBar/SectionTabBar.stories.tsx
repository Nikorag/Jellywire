import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionTabBar } from "./SectionTabBar";

const meta: Meta<typeof SectionTabBar> = {
  title: "Molecules/SectionTabBar",
  component: SectionTabBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionTabBar>;

export const Default: Story = {};
