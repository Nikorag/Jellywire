import "./StatusDot.css";

export type StatusDotTone = "green" | "gray" | "red";

export interface StatusDotProps {
  tone?: StatusDotTone;
  pulse?: boolean;
}

export function StatusDot({ tone = "green", pulse = true }: StatusDotProps) {
  return (
    <span
      className={["ff-status-dot", `ff-status-dot--${tone}`, pulse ? "ff-status-dot--pulse" : ""]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
