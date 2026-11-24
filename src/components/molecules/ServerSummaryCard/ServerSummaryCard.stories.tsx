import type { Meta, StoryObj } from "@storybook/react-vite";
import { ServerSummaryCard } from "./ServerSummaryCard";

const meta: Meta<typeof ServerSummaryCard> = {
  title: "Molecules/ServerSummaryCard",
  component: ServerSummaryCard,
  tags: ["autodocs"],
  args: {
    tone: "green",
    headline: "Harbour NAS + 1 more",
    host: "http://10.0.1.14:8096",
    detail: "2 of 2 servers online",
  },
};

export default meta;
type Story = StoryObj<typeof ServerSummaryCard>;

export const AllConnected: Story = {};

export const PartialOutage: Story = {
  args: { tone: "gray", headline: "Harbour NAS + 1 more", detail: "1 of 2 servers online" },
};

export const NoServers: Story = {
  args: { tone: "gray", headline: "No servers added", host: "—", detail: "0 of 0 servers online" },
};
