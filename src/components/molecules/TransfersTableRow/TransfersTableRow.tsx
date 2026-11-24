import { CategoryIcon, StripedProgressBar } from "../../atoms";
import { categoryForKind } from "../../../lib/jellyfinClient";
import { formatBytes, formatSpeed } from "../../../lib/format";
import type { DownloadTask } from "../../../types/jellyfin";
import "./TransfersTableRow.css";

const STATUS_LABEL: Record<DownloadTask["status"], string> = {
  queued: "Queued",
  downloading: "Downloading",
  paused: "Paused",
  completed: "Complete",
  failed: "Failed",
  canceled: "Canceled",
};

function formatEta(task: DownloadTask): string {
  if (task.status !== "downloading" || !task.speedBytesPerSec) return "—";
  const remaining = task.totalBytes - task.downloadedBytes;
  if (remaining <= 0) return "—";
  const seconds = Math.round(remaining / task.speedBytesPerSec);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export interface TransfersTableRowProps {
  task: DownloadTask;
  index: number;
}

export function TransfersTableRow({ task, index }: TransfersTableRowProps) {
  const category = categoryForKind(task.result.kind);
  const isActive = task.status === "downloading" || task.status === "queued";

  return (
    <div className={["ff-transfers-row", index % 2 ? "ff-transfers-row--alt" : ""].join(" ")}>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--name">
        <CategoryIcon category={category} />
        <span className="ff-transfers-row__name">{task.result.filename}</span>
      </div>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--right">
        {formatBytes(task.totalBytes)}
      </div>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--status">
        {task.status === "failed" && task.error ? task.error : STATUS_LABEL[task.status]}
      </div>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--progress">
        <StripedProgressBar percent={task.progress} />
      </div>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--right">
        {isActive ? formatSpeed(task.speedBytesPerSec) : "—"}
      </div>
      <div className="ff-transfers-row__cell ff-transfers-row__cell--right">{formatEta(task)}</div>
    </div>
  );
}
