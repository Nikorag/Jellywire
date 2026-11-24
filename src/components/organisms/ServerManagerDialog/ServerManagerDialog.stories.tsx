import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ServerManagerDialog } from "./ServerManagerDialog";
import type { JellyfinServer } from "../../../types/jellyfin";

const servers: JellyfinServer[] = [
  {
    id: "1",
    name: "Harbour NAS",
    baseUrl: "http://10.0.1.14:8096",
    apiKey: "abc",
    status: "connected",
    addedAt: Date.now(),
  },
  {
    id: "2",
    name: "Office Server",
    baseUrl: "https://jellyfin.example.com",
    apiKey: "def",
    status: "error",
    lastError: "Could not reach server",
    addedAt: Date.now(),
  },
];

const meta: Meta<typeof ServerManagerDialog> = {
  title: "Organisms/ServerManagerDialog",
  component: ServerManagerDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { servers, onAdd: fn(), onRemove: fn(), onClose: fn() },
};

export default meta;
type Story = StoryObj<typeof ServerManagerDialog>;

export const WithServers: Story = {};
export const Empty: Story = { args: { servers: [] } };
