import "./SignalBars.css";

export interface SignalBarsProps {
  activeBars?: number;
}

const HEIGHTS = [4, 6, 8, 10, 11];

export function SignalBars({ activeBars = 4 }: SignalBarsProps) {
  return (
    <span className="ff-signal-bars">
      {HEIGHTS.map((height, index) => (
        <span
          key={height}
          className="ff-signal-bars__bar"
          style={{ height, background: index < activeBars ? "var(--ff-green)" : "#c9c5b4" }}
        />
      ))}
    </span>
  );
}
