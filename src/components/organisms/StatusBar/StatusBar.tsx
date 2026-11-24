import { SignalBars } from "../../atoms";
import "./StatusBar.css";

export interface StatusBarProps {
  connectionLabel: string;
  activeBars: number;
  downRate: string;
  upRate: string;
  statusMessage: string;
}

export function StatusBar({ connectionLabel, activeBars, downRate, upRate, statusMessage }: StatusBarProps) {
  return (
    <div className="ff-status-bar">
      <SignalBars activeBars={activeBars} />
      <span>{connectionLabel}</span>
      <span className="ff-status-bar__divider" />
      <span className="ff-status-bar__down">{"▼"} {downRate}</span>
      <span className="ff-status-bar__up">{"▲"} {upRate}</span>
      <span className="ff-status-bar__divider" />
      <span className="ff-status-bar__message">{statusMessage}</span>
      <div className="ff-status-bar__fill" />
      <div className="ff-status-bar__player ff-status-bar__player--disabled" title="Coming soon">
        Jellywire Player <span className="ff-status-bar__player-controls">{"◀ ▶ ❚❚ ■"}</span>
      </div>
    </div>
  );
}
