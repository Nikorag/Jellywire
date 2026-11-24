import type { InputHTMLAttributes } from "react";
import "./XpInput.css";

export type XpInputProps = InputHTMLAttributes<HTMLInputElement>;

export function XpInput({ className, ...rest }: XpInputProps) {
  return <input className={["ff-xp-input", className].filter(Boolean).join(" ")} {...rest} />;
}
