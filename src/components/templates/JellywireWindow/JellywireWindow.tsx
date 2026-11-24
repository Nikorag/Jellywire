import type { ReactNode } from "react";
import { AppChrome, StatusBar, TransfersPanel } from "../../organisms";
import type { ActionButtonSpec } from "../../molecules/ActionButtonGroup/ActionButtonGroup";
import type { DownloadTask } from "../../../types/jellyfin";
import "./JellywireWindow.css";

export interface JellywireWindowProps {
  onServerClick?: () => void;
  onToolsClick?: () => void;
  sidebar: ReactNode;
  results: ReactNode;
  transfers: DownloadTask[];
  onClearFinished: () => void;
  transferActions: ActionButtonSpec[];
  connectionLabel: string;
  activeBars: number;
  downRate: string;
  upRate: string;
  statusMessage: string;
}

export function JellywireWindow({
  onServerClick,
  onToolsClick,
  sidebar,
  results,
  transfers,
  onClearFinished,
  transferActions,
  connectionLabel,
  activeBars,
  downRate,
  upRate,
  statusMessage,
}: JellywireWindowProps) {
  return (
    <div className="ff-window">
      <AppChrome onServerClick={onServerClick} onToolsClick={onToolsClick} />

      <div className="ff-window__body">
        {sidebar}
        {results}
      </div>

      <TransfersPanel tasks={transfers} onClearFinished={onClearFinished} actions={transferActions} />

      <StatusBar
        connectionLabel={connectionLabel}
        activeBars={activeBars}
        downRate={downRate}
        upRate={upRate}
        statusMessage={statusMessage}
      />
    </div>
  );
}
