import type { InputHTMLAttributes, ReactNode } from "react";
import "./XpCheckbox.css";

export interface XpCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

export function XpCheckbox({ label, id, ...rest }: XpCheckboxProps) {
  return (
    <label className="ff-xp-checkbox" htmlFor={id}>
      <input type="checkbox" id={id} {...rest} />
      <span>{label}</span>
    </label>
  );
}
