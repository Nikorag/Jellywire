import { useState, type FormEvent } from "react";
import { XpButton, XpInput } from "../../atoms";
import { ServerListRow, TitleBar } from "../../molecules";
import type { JellyfinServer } from "../../../types/jellyfin";
import "./ServerManagerDialog.css";

export interface ServerManagerDialogProps {
  servers: JellyfinServer[];
  onAdd: (input: { name: string; baseUrl: string; apiKey: string }) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function ServerManagerDialog({ servers, onAdd, onRemove, onClose }: ServerManagerDialogProps) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !baseUrl.trim() || !apiKey.trim()) return;
    onAdd({ name: name.trim(), baseUrl: baseUrl.trim(), apiKey: apiKey.trim() });
    setName("");
    setBaseUrl("");
    setApiKey("");
  }

  return (
    <div className="ff-server-dialog-overlay" onClick={onClose}>
      <div className="ff-server-dialog" onClick={(e) => e.stopPropagation()}>
        <TitleBar title="Manage Jellyfin Servers" onClose={onClose} />
        <div className="ff-server-dialog__body">
          <form className="ff-server-dialog__form" onSubmit={handleSubmit}>
            <label className="ff-server-dialog__field">
              Display name
              <XpInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Harbour NAS" />
            </label>
            <label className="ff-server-dialog__field">
              Server URL
              <XpInput
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://10.0.1.14:8096"
              />
            </label>
            <label className="ff-server-dialog__field">
              API key
              <XpInput type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </label>
            <XpButton type="submit">Add Server</XpButton>
          </form>

          <div className="ff-server-dialog__list">
            {servers.length === 0 && (
              <p className="ff-server-dialog__empty">
                No servers added yet. Add one above to start aggregating results.
              </p>
            )}
            {servers.map((server) => (
              <ServerListRow key={server.id} server={server} onRemove={onRemove} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
