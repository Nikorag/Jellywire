import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SearchSidebar } from "./SearchSidebar";

const meta: Meta<typeof SearchSidebar> = {
  title: "Organisms/SearchSidebar",
  component: SearchSidebar,
  tags: ["autodocs"],
  args: {
    category: "All Types",
    onCategoryChange: fn(),
    queryValues: { title: "", artist: "", collection: "", genre: "", minQuality: "0", onlyOffline: false },
    genres: ["Indie", "Drama", "Documentary", "Score"],
    onQueryChange: fn(),
    onSearch: fn(),
    serverTone: "green",
    serverHeadline: "Harbour NAS + 1 more",
    serverHost: "http://10.0.1.14:8096",
    serverDetail: "2 of 2 servers online",
  },
  parameters: { backgrounds: { default: "panel" } },
};

export default meta;
type Story = StoryObj<typeof SearchSidebar>;

export const Default: Story = {};
