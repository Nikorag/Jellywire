import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconActionButton.css";

export type IconActionTone = "green" | "amber" | "red" | "blue" | "gray";
export type IconActionShape = "circle" | "rounded" | "folder";

export interface IconActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  tone?: IconActionTone;
  shape?: IconActionShape;
}

export function IconActionButton({
  icon,
  label,
  tone = "gray",
  shape = "circle",
  className,
  ...rest
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      className={["ff-icon-action", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span
        className={[
          "ff-icon-action__glyph",
          `ff-icon-action__glyph--${tone}`,
          `ff-icon-action__glyph--${shape}`,
        ].join(" ")}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
