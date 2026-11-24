import "./StripedProgressBar.css";

export interface StripedProgressBarProps {
  percent: number;
}

export function StripedProgressBar({ percent }: StripedProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="ff-striped-progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="ff-striped-progress__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
