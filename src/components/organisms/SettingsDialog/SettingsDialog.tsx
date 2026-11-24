import { useState } from "react";
import { XpButton } from "../../atoms";
import { TitleBar } from "../../molecules";
import "./SettingsDialog.css";

export interface SettingsDialogProps {
  downloadDirectory: string | null;
  defaultDirectory: string;
  onChooseFolder: () => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export function SettingsDialog({
  downloadDirectory,
  defaultDirectory,
  onChooseFolder,
  onResetToDefault,
  onClose,
}: SettingsDialogProps) {
  const [showResetHint, setShowResetHint] = useState(false);

  return (
    <div className="ff-settings-dialog-overlay" onClick={onClose}>
      <div className="ff-settings-dialog" onClick={(e) => e.stopPropagation()}>
        <TitleBar title="Settings" onClose={onClose} />
        <div className="ff-settings-dialog__body">
          <div className="ff-settings-dialog__section">
            <div className="ff-settings-dialog__label">Save downloaded files to:</div>
            <div className="ff-settings-dialog__path">{downloadDirectory ?? defaultDirectory}</div>
            {!downloadDirectory && <div className="ff-settings-dialog__hint">Using default location</div>}
            <div className="ff-settings-dialog__actions">
              <XpButton onClick={onChooseFolder}>Choose Folder...</XpButton>
              <XpButton
                onClick={() => {
                  onResetToDefault();
                  setShowResetHint(true);
                }}
                disabled={!downloadDirectory}
              >
                Reset to Default
              </XpButton>
            </div>
            {showResetHint && !downloadDirectory && (
              <div className="ff-settings-dialog__hint">Reset to the default Downloads folder.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
