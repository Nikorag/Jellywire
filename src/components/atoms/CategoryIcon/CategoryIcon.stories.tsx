import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryIcon } from "./CategoryIcon";

const meta: Meta<typeof CategoryIcon> = {
  title: "Atoms/CategoryIcon",
  component: CategoryIcon,
  tags: ["autodocs"],
  args: { category: "Audio" },
  argTypes: {
    category: {
      control: "select",
      options: ["All Types", "Audio", "Movies", "Shows", "Photos", "Books"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryIcon>;

export const Default: Story = {};

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, background: "#ece9d8", padding: 8 }}>
      <CategoryIcon category="All Types" />
      <CategoryIcon category="Audio" />
      <CategoryIcon category="Movies" />
      <CategoryIcon category="Shows" />
      <CategoryIcon category="Photos" />
      <CategoryIcon category="Books" />
    </div>
  ),
};
