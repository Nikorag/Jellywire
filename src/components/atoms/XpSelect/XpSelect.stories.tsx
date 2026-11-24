import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { XpSelect } from "./XpSelect";

const meta: Meta<typeof XpSelect> = {
  title: "Atoms/XpSelect",
  component: XpSelect,
  tags: ["autodocs"],
  args: { onChange: fn() },
};

export default meta;
type Story = StoryObj<typeof XpSelect>;

export const Genre: Story = {
  render: (args) => (
    <XpSelect {...args}>
      <option value="">(any)</option>
      <option value="Indie">Indie</option>
      <option value="Drama">Drama</option>
      <option value="Documentary">Documentary</option>
      <option value="Score">Score</option>
    </XpSelect>
  ),
};

export const MinimumQuality: Story = {
  render: (args) => (
    <XpSelect {...args}>
      <option value="0">Any</option>
      <option value="3">3 stars and up</option>
      <option value="4">4 stars and up</option>
      <option value="5">5 stars only</option>
    </XpSelect>
  ),
};
