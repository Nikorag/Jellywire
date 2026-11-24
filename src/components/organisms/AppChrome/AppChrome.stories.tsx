import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AppChrome } from "./AppChrome";

const meta: Meta<typeof AppChrome> = {
  title: "Organisms/AppChrome",
  component: AppChrome,
  tags: ["autodocs"],
  args: { onMinimize: fn(), onMaximize: fn(), onClose: fn(), onServerClick: fn(), onToolsClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppChrome>;

export const Default: Story = {};
