import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarRating } from "./StarRating";

const meta: Meta<typeof StarRating> = {
  title: "Atoms/StarRating",
  component: StarRating,
  tags: ["autodocs"],
  args: { stars: 4 },
  argTypes: { stars: { control: { type: "range", min: 0, max: 5 } } },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true, stars: 5 } };
export const AllLevels: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <StarRating key={n} stars={n} />
      ))}
    </div>
  ),
};
