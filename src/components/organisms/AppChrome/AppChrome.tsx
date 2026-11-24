import { MenuBar, SectionTabBar, TitleBar } from "../../molecules";

export interface AppChromeProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onServerClick?: () => void;
  onToolsClick?: () => void;
}

export function AppChrome({ onMinimize, onMaximize, onClose, onServerClick, onToolsClick }: AppChromeProps) {
  return (
    <>
      <TitleBar
        title="Jellywire — Jellyfin Media Retrieval"
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
      <MenuBar onServerClick={onServerClick} onToolsClick={onToolsClick} />
      <SectionTabBar />
    </>
  );
}
