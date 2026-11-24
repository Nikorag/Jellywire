import { StatusDot, XpButton } from "../../atoms";
import type { StatusDotTone } from "../../atoms/StatusDot/StatusDot";
import type { JellyfinServer } from "../../../types/jellyfin";
import "./ServerListRow.css";

const TONE_BY_STATUS: Record<JellyfinServer["status"], StatusDotTone> = {
  connected: "green",
  connecting: "gray",
  error: "red",
  offline: "gray",
};

export interface ServerListRowProps {
  server: JellyfinServer;
  onRemove: (id: string) => void;
}

export function ServerListRow({ server, onRemove }: ServerListRowProps) {
  return (
    <div className="ff-server-row">
      <StatusDot tone={TONE_BY_STATUS[server.status]} pulse={server.status === "connecting"} />
      <div className="ff-server-row__info">
        <div className="ff-server-row__name">{server.name}</div>
        <div className="ff-server-row__host">{server.baseUrl}</div>
        {server.lastError && <div className="ff-server-row__error">{server.lastError}</div>}
      </div>
      <XpButton onClick={() => onRemove(server.id)}>Remove</XpButton>
    </div>
  );
}
