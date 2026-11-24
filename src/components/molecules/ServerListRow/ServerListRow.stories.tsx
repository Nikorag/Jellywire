import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ServerListRow } from "./ServerListRow";
import type { JellyfinServer } from "../../../types/jellyfin";

const baseServer: JellyfinServer = {
  id: "1",
  name: "Harbour NAS",
  baseUrl: "http://10.0.1.14:8096",
  apiKey: "abc123",
  status: "connected",
  addedAt: Date.now(),
};

const meta: Meta<typeof ServerListRow> = {
  title: "Molecules/ServerListRow",
  component: ServerListRow,
  tags: ["autodocs"],
  args: { server: baseServer, onRemove: fn() },
};

export default meta;
type Story = StoryObj<typeof ServerListRow>;

export const Connected: Story = {};
export const Connecting: Story = { args: { server: { ...baseServer, status: "connecting" } } };
export const ErrorState: Story = {
  args: { server: { ...baseServer, status: "error", lastError: "Connection refused" } },
};
