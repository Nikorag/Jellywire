import type { ButtonHTMLAttributes } from "react";
import "./XpButton.css";

export type XpButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function XpButton({ className, children, ...rest }: XpButtonProps) {
  return (
    <button className={["ff-xp-button", className].filter(Boolean).join(" ")} type="button" {...rest}>
      {children}
    </button>
  );
}
