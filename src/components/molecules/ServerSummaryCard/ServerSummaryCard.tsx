import { StatusDot } from "../../atoms";
import type { StatusDotTone } from "../../atoms/StatusDot/StatusDot";
import "./ServerSummaryCard.css";

export interface ServerSummaryCardProps {
  tone: StatusDotTone;
  headline: string;
  host: string;
  detail: string;
}

export function ServerSummaryCard({ tone, headline, host, detail }: ServerSummaryCardProps) {
  return (
    <div className="ff-server-summary">
      <div className="ff-server-summary__header">Server</div>
      <div className="ff-server-summary__body">
        <div className="ff-server-summary__headline-row">
          <StatusDot tone={tone} pulse={tone === "green"} />
          <span className="ff-server-summary__headline">{headline}</span>
        </div>
        <div className="ff-server-summary__detail">{host}</div>
        <div className="ff-server-summary__detail">{detail}</div>
      </div>
    </div>
  );
}
