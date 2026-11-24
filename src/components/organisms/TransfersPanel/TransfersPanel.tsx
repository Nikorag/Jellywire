import { ActionButtonGroup, TransfersTableHeader, TransfersTableRow } from "../../molecules";
import type { ActionButtonSpec } from "../../molecules/ActionButtonGroup/ActionButtonGroup";
import type { DownloadTask } from "../../../types/jellyfin";
import "./TransfersPanel.css";

export interface TransfersPanelProps {
  tasks: DownloadTask[];
  onClearFinished: () => void;
  actions: ActionButtonSpec[];
}

export function TransfersPanel({ tasks, onClearFinished, actions }: TransfersPanelProps) {
  return (
    <div className="ff-transfers-panel">
      <div className="ff-transfers-panel__header">
        <span className="ff-transfers-panel__title">Transfers ({tasks.length})</span>
        <span className="ff-transfers-panel__links">
          <a href="#" onClick={(e) => { e.preventDefault(); onClearFinished(); }}>
            Clear Finished
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Options
          </a>
        </span>
      </div>
      <div className="ff-transfers-panel__table">
        <TransfersTableHeader />
        <div className="ff-transfers-panel__rows">
          {tasks.length === 0 && (
            <div className="ff-transfers-panel__empty">No active transfers. Double-click a result to fetch it.</div>
          )}
          {tasks.map((task, index) => (
            <TransfersTableRow key={task.id} task={task} index={index} />
          ))}
        </div>
      </div>
      <div className="ff-transfers-panel__actions">
        <ActionButtonGroup actions={actions} />
      </div>
    </div>
  );
}
