import "./MenuBar.css";

const MENU_ITEMS = ["File", "View", "Navigation", "Server", "Tools", "Filters", "Help"];

export interface MenuBarProps {
  onServerClick?: () => void;
  onToolsClick?: () => void;
}

export function MenuBar({ onServerClick, onToolsClick }: MenuBarProps) {
  function handlerFor(item: string): (() => void) | undefined {
    if (item === "Server") return onServerClick;
    if (item === "Tools") return onToolsClick;
    return undefined;
  }

  return (
    <div className="ff-menu-bar">
      {MENU_ITEMS.map((item) => (
        <div key={item} className="ff-menu-bar__item" onClick={handlerFor(item)}>
          {item}
        </div>
      ))}
    </div>
  );
}
