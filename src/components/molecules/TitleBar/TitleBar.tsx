import logo from "../../../assets/logo.png";
import "./TitleBar.css";

export interface TitleBarProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

async function defaultMinimize() {
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().minimize();
}

async function defaultToggleMaximize() {
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().toggleMaximize();
}

async function defaultClose() {
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().close();
}

export function TitleBar({ title, onMinimize, onMaximize, onClose }: TitleBarProps) {
  return (
    <div className="ff-title-bar" data-tauri-drag-region>
      <img src={logo} className="ff-title-bar__icon" alt="" />
      <div className="ff-title-bar__text">{title}</div>
      <div className="ff-title-bar__spacer" data-tauri-drag-region />
      <div className="ff-title-bar__controls">
        <button
          type="button"
          className="ff-title-bar__btn ff-title-bar__btn--min"
          onClick={() => void (onMinimize ? onMinimize() : defaultMinimize())}
          aria-label="Minimize"
        >
          <span className="ff-title-bar__btn-glyph ff-title-bar__btn-glyph--min" />
        </button>
        <button
          type="button"
          className="ff-title-bar__btn ff-title-bar__btn--max"
          onClick={() => void (onMaximize ? onMaximize() : defaultToggleMaximize())}
          aria-label="Maximize"
        >
          <span className="ff-title-bar__btn-glyph ff-title-bar__btn-glyph--max" />
        </button>
        <button
          type="button"
          className="ff-title-bar__btn ff-title-bar__btn--close"
          onClick={() => void (onClose ? onClose() : defaultClose())}
          aria-label="Close"
        >
          <span className="ff-title-bar__btn-glyph ff-title-bar__btn-glyph--close" />
        </button>
      </div>
    </div>
  );
}
