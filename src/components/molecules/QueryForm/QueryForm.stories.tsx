import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { QueryForm, type QueryFormValues } from "./QueryForm";

const meta: Meta<typeof QueryForm> = {
  title: "Molecules/QueryForm",
  component: QueryForm,
  tags: ["autodocs"],
  args: {
    values: { title: "", artist: "", collection: "", genre: "", minQuality: "0", onlyOffline: false },
    genres: ["Indie", "Drama", "Documentary", "Score"],
    onChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof QueryForm>;

export const Empty: Story = {};

export const Interactive: Story = {
  render: (args) => {
    function Wrapper() {
      const [values, setValues] = useState<QueryFormValues>(args.values);
      return (
        <QueryForm
          {...args}
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      );
    }
    return <Wrapper />;
  },
};
