import type { SelectHTMLAttributes } from "react";
import "./XpSelect.css";

export type XpSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function XpSelect({ className, children, ...rest }: XpSelectProps) {
  return (
    <select className={["ff-xp-select", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </select>
  );
}
