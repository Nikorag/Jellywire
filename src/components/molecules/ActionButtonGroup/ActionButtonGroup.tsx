import type { ReactNode } from "react";
import { IconActionButton } from "../../atoms";
import type { IconActionShape, IconActionTone } from "../../atoms/IconActionButton/IconActionButton";
import "./ActionButtonGroup.css";

export interface ActionButtonSpec {
  key: string;
  icon: ReactNode;
  label: string;
  tone: IconActionTone;
  shape?: IconActionShape;
  onClick: () => void;
  disabled?: boolean;
}

export interface ActionButtonGroupProps {
  actions: ActionButtonSpec[];
}

export function ActionButtonGroup({ actions }: ActionButtonGroupProps) {
  return (
    <div className="ff-action-group">
      {actions.map((action) => (
        <IconActionButton
          key={action.key}
          icon={action.icon}
          label={action.label}
          tone={action.tone}
          shape={action.shape}
          onClick={action.onClick}
          disabled={action.disabled}
        />
      ))}
    </div>
  );
}
