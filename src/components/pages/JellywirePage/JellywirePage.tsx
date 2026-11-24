import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { openPath, openUrl } from "@tauri-apps/plugin-opener";
import { open as openFolderDialog } from "@tauri-apps/plugin-dialog";
import { JellywireWindow } from "../../templates/JellywireWindow/JellywireWindow";
import { ResultsPanel, SearchSidebar, ServerManagerDialog, SettingsDialog } from "../../organisms";
import type { QueryFormValues } from "../../molecules/QueryForm/QueryForm";
import type { ResultSortKey } from "../../molecules/ResultsTableHeader/ResultsTableHeader";
import type { ActionButtonSpec } from "../../molecules/ActionButtonGroup/ActionButtonGroup";
import { useServerStore } from "../../../store/serverStore";
import { useDownloadStore } from "../../../store/downloadStore";
import { useSettingsStore } from "../../../store/settingsStore";
import { buildStreamUrl, matchesCategory, pingServer, searchAllServers } from "../../../lib/jellyfinClient";
import { cancelDownload, pauseDownload, retryDownload, startDownload } from "../../../lib/downloadManager";
import { getDefaultDownloadsFolder, getDownloadsFolder } from "../../../lib/downloadEngine";
import { formatBytes } from "../../../lib/format";
import { maybeGetEasterEggResult } from "../../../easteregg";
import type { JellyfinServer, MediaCategory, SearchResult } from "../../../types/jellyfin";
import downloadIcon from "../../../assets/action-icons/download.png";
import browseServerIcon from "../../../assets/action-icons/browse-server.png";
import stopIcon from "../../../assets/action-icons/stop.png";
import previewIcon from "../../../assets/action-icons/preview.png";
import dismissIcon from "../../../assets/action-icons/dismiss.png";
import resumeIcon from "../../../assets/action-icons/resume.png";
import openFolderIcon from "../../../assets/action-icons/open-folder.png";
import clearIcon from "../../../assets/action-icons/clear.png";

const DEFAULT_GENRES = ["Indie", "Drama", "Documentary", "Score", "Action", "Comedy"];

interface SortState {
  key: ResultSortKey;
  dir: 1 | -1;
}

function compareBy(key: ResultSortKey, a: SearchResult, b: SearchResult): number {
  switch (key) {
    case "quality":
      return (a.communityRating ?? 0) - (b.communityRating ?? 0);
    case "plays":
      return (a.playCount ?? 0) - (b.playCount ?? 0);
    case "name":
      return a.title.localeCompare(b.title);
    case "type":
      return (a.container ?? "").localeCompare(b.container ?? "");
    case "size":
      return (a.sizeBytes ?? 0) - (b.sizeBytes ?? 0);
    case "bitrate":
      return (a.bitrateKbps ?? 0) - (b.bitrateKbps ?? 0);
    default:
      return 0;
  }
}

export function JellywirePage() {
  const [category, setCategory] = useState<MediaCategory>("All Types");
  const [queryValues, setQueryValues] = useState<QueryFormValues>({
    title: "",
    artist: "",
    collection: "",
    genre: "",
    minQuality: "0",
    onlyOffline: false,
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [easterEggResult, setEasterEggResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({ key: "quality", dir: -1 });
  const [showServerDialog, setShowServerDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [defaultDownloadDir, setDefaultDownloadDir] = useState("");

  const searchAbortRef = useRef<AbortController | null>(null);

  const servers = useServerStore((s) => s.servers);
  const addServer = useServerStore((s) => s.addServer);
  const removeServer = useServerStore((s) => s.removeServer);
  const setServerStatus = useServerStore((s) => s.setServerStatus);

  const downloads = useDownloadStore((s) => s.downloads);
  const enqueue = useDownloadStore((s) => s.enqueue);
  const clearInactive = useDownloadStore((s) => s.clearInactive);

  const downloadDirectory = useSettingsStore((s) => s.downloadDirectory);
  const setDownloadDirectory = useSettingsStore((s) => s.setDownloadDirectory);

  useEffect(() => {
    void getDefaultDownloadsFolder().then(setDefaultDownloadDir);
  }, []);

  const handleChooseFolder = useCallback(() => {
    void openFolderDialog({ directory: true, defaultPath: downloadDirectory ?? defaultDownloadDir }).then(
      (picked) => {
        if (typeof picked === "string") setDownloadDirectory(picked);
      },
    );
  }, [downloadDirectory, defaultDownloadDir, setDownloadDirectory]);

  const handleResetDownloadDirectory = useCallback(() => {
    setDownloadDirectory(null);
  }, [setDownloadDirectory]);

  const connectServer = useCallback(
    (server: JellyfinServer) => {
      pingServer(server)
        .then(() => setServerStatus(server.id, "connected"))
        .catch((err: Error) => setServerStatus(server.id, "error", err.message));
    },
    [setServerStatus],
  );

  const handleAddServer = useCallback(
    (input: { name: string; baseUrl: string; apiKey: string }) => {
      const server = addServer(input);
      connectServer(server);
    },
    [addServer, connectServer],
  );

  // Servers persist across launches (see serverStore) but their connection
  // status doesn't — reconnect to each one restored from the last session.
  useEffect(() => {
    useServerStore.getState().servers.forEach(connectServer);
  }, [connectServer]);

  const genres = useMemo(() => {
    const found = new Set<string>();
    results.forEach((r) => r.genres?.forEach((g) => found.add(g)));
    return found.size > 0 ? Array.from(found).sort() : DEFAULT_GENRES;
  }, [results]);

  const filteredSortedResults = useMemo(() => {
    // Note: `queryValues.title` is only ever used as the server-side
    // searchTerm (see runSearch) — it is deliberately NOT re-applied as a
    // client-side filter here. Re-filtering by title broke show/season
    // expansion: searching "Bluey" server-side correctly expands the show
    // into all of its episodes (e.g. "Hospital", "Fruitbat"), but those
    // episode titles don't contain the word "Bluey", so a client-side title
    // filter using the same search text would silently discard every
    // expanded episode and only leave the handful of items whose own title
    // happened to match.
    let list = results.filter((r) => matchesCategory(r.kind, category));

    const artistQ = queryValues.artist.trim().toLowerCase();
    if (artistQ) list = list.filter((r) => (r.subtitle ?? "").toLowerCase().includes(artistQ));

    const collectionQ = queryValues.collection.trim().toLowerCase();
    if (collectionQ) list = list.filter((r) => (r.subtitle ?? "").toLowerCase().includes(collectionQ));

    if (queryValues.genre) list = list.filter((r) => r.genres?.includes(queryValues.genre));

    const minQ = parseInt(queryValues.minQuality, 10) || 0;
    if (minQ > 0) list = list.filter((r) => Math.round((r.communityRating ?? 0) / 2) >= minQ);

    if (queryValues.onlyOffline) list = list.filter((r) => !r.alreadyDownloaded);

    const sorted = [...list].sort((a, b) => compareBy(sort.key, a, b) * sort.dir);
    return easterEggResult ? [easterEggResult, ...sorted] : sorted;
  }, [results, category, queryValues, sort, easterEggResult]);

  const selectedResult = useMemo(
    () => filteredSortedResults.find((r) => r.id === selectedId) ?? null,
    [filteredSortedResults, selectedId],
  );

  const runSearch = useCallback(async () => {
    if (servers.length === 0) return;
    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    setIsSearching(true);
    setSelectedId(null);

    const { results: found } = await searchAllServers(servers, queryValues.title, controller.signal);
    if (controller.signal.aborted) return;
    setResults(found);
    setEasterEggResult(maybeGetEasterEggResult());
    setIsSearching(false);
    searchAbortRef.current = null;
  }, [servers, queryValues.title]);

  const stopSearch = useCallback(() => {
    searchAbortRef.current?.abort();
    searchAbortRef.current = null;
    setIsSearching(false);
  }, []);

  const dismissResults = useCallback(() => {
    setResults([]);
    setEasterEggResult(null);
    setSelectedId(null);
  }, []);

  const handleFetch = useCallback(
    (result: SearchResult) => {
      const task = enqueue(result);
      if (task) startDownload(task.id, result);
    },
    [enqueue],
  );

  const handlePreview = useCallback(() => {
    if (!selectedResult) return;
    const server = servers.find((s) => s.id === selectedResult.serverId);
    if (!server) return;
    const url = buildStreamUrl(server, selectedResult);
    const label = `preview-${selectedResult.itemId}-${Date.now()}`;
    void import("@tauri-apps/api/webviewWindow").then(({ WebviewWindow }) => {
      new WebviewWindow(label, {
        url,
        title: selectedResult.title,
        width: 960,
        height: 600,
        center: true,
      });
    });
  }, [selectedResult, servers]);

  const handleBrowseServer = useCallback(() => {
    const server = servers.find((s) => s.id === selectedResult?.serverId) ?? servers[0];
    if (server) void openUrl(server.baseUrl);
  }, [servers, selectedResult]);

  const handleOpenFolder = useCallback(() => {
    void getDownloadsFolder().then((folder) => openPath(folder));
  }, []);

  const handleQueryChange = useCallback(
    <K extends keyof QueryFormValues>(key: K, value: QueryFormValues[K]) => {
      setQueryValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSort = useCallback((key: ResultSortKey) => {
    setSort((prev) => ({ key, dir: prev.key === key ? (prev.dir === 1 ? -1 : 1) : -1 }));
  }, []);

  const connected = servers.filter((s) => s.status === "connected");
  const activeBars = servers.length === 0 ? 0 : Math.max(1, Math.round((connected.length / servers.length) * 5));
  const connectionLabel =
    servers.length === 0
      ? "Connection: Offline"
      : connected.length === servers.length
        ? "Connection: Excellent"
        : connected.length > 0
          ? "Connection: Fair"
          : "Connection: Poor";

  const downloadingTasks = downloads.filter((d) => d.status === "downloading");
  const queuedOrDownloading = downloads.filter((d) => d.status === "queued" || d.status === "downloading");
  const pausedTasks = downloads.filter((d) => d.status === "paused");
  const inactiveTasks = downloads.filter(
    (d) => d.status === "completed" || d.status === "failed" || d.status === "canceled",
  );
  const totalSpeed = downloadingTasks.reduce((sum, t) => sum + (t.speedBytesPerSec ?? 0), 0);
  const downRate = `${downloadingTasks.length} @ ${downloadingTasks.length > 0 ? `${formatBytes(totalSpeed)}/s` : "0 KB/s"}`;

  const statusMessage = selectedResult
    ? `Selected: ${selectedResult.title}`
    : downloadingTasks.length > 0
      ? `${downloadingTasks.length} transfer(s) in progress`
      : "Idle — double-click a result to fetch it";

  const serverTone = servers.length === 0 ? "gray" : connected.length > 0 ? "green" : "red";
  const serverHeadline =
    servers.length === 0 ? "No servers added" : servers[0].name + (servers.length > 1 ? ` + ${servers.length - 1} more` : "");
  const serverHost = servers.length === 0 ? "—" : servers[0].baseUrl;
  const serverDetail = `${connected.length} of ${servers.length} servers online`;

  const tabLabel = `${queryValues.title.trim() || category.toLowerCase()} (${filteredSortedResults.length})`;

  const searchActions: ActionButtonSpec[] = [
    { key: "fetch", icon: <img src={downloadIcon} alt="" />, label: "Download", tone: "green", onClick: () => selectedResult && handleFetch(selectedResult), disabled: !selectedResult },
    { key: "browse", icon: <img src={browseServerIcon} alt="" />, label: "Browse Server", tone: "amber", shape: "rounded", onClick: handleBrowseServer, disabled: servers.length === 0 },
    { key: "stop", icon: <img src={stopIcon} alt="" />, label: "Stop Search", tone: "red", onClick: stopSearch, disabled: !isSearching },
    { key: "preview", icon: <img src={previewIcon} alt="" />, label: "Preview", tone: "blue", onClick: handlePreview, disabled: !selectedResult },
    { key: "dismiss", icon: <img src={dismissIcon} alt="" />, label: "Dismiss", tone: "gray", shape: "rounded", onClick: dismissResults, disabled: results.length === 0 },
  ];

  const transferActions: ActionButtonSpec[] = [
    {
      key: "cancel",
      icon: <img src={stopIcon} alt="" />,
      label: "Cancel",
      tone: "gray",
      onClick: () => queuedOrDownloading.forEach((t) => cancelDownload(t.id)),
      disabled: queuedOrDownloading.length === 0,
    },
    {
      key: "resume",
      icon: <img src={resumeIcon} alt="" />,
      label: "Resume",
      tone: "green",
      onClick: () => pausedTasks.forEach((t) => retryDownload(t.id)),
      disabled: pausedTasks.length === 0,
    },
    {
      key: "pause",
      icon: "❚❚",
      label: "Pause",
      tone: "blue",
      onClick: () => downloadingTasks.forEach((t) => pauseDownload(t.id)),
      disabled: downloadingTasks.length === 0,
    },
    {
      key: "folder",
      icon: <img src={openFolderIcon} alt="" />,
      label: "Open Folder",
      tone: "amber",
      shape: "folder",
      onClick: handleOpenFolder,
    },
    {
      key: "clear",
      icon: <img src={clearIcon} alt="" />,
      label: "Clear Inactive",
      tone: "gray",
      shape: "rounded",
      onClick: clearInactive,
      disabled: inactiveTasks.length === 0,
    },
  ];

  return (
    <>
      <JellywireWindow
        onServerClick={() => setShowServerDialog(true)}
        onToolsClick={() => setShowSettingsDialog(true)}
        sidebar={
          <SearchSidebar
            category={category}
            onCategoryChange={setCategory}
            queryValues={queryValues}
            genres={genres}
            onQueryChange={handleQueryChange}
            onSearch={runSearch}
            serverTone={serverTone}
            serverHeadline={serverHeadline}
            serverHost={serverHost}
            serverDetail={serverDetail}
          />
        }
        results={
          <ResultsPanel
            tabLabel={tabLabel}
            results={filteredSortedResults}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onFetch={handleFetch}
            onSort={handleSort}
            onCloseTab={dismissResults}
            actions={searchActions}
            isSearching={isSearching}
          />
        }
        transfers={downloads}
        onClearFinished={clearInactive}
        transferActions={transferActions}
        connectionLabel={connectionLabel}
        activeBars={activeBars}
        downRate={downRate}
        upRate="0 @ 0 KB/s"
        statusMessage={statusMessage}
      />

      {showServerDialog && (
        <ServerManagerDialog
          servers={servers}
          onAdd={handleAddServer}
          onRemove={removeServer}
          onClose={() => setShowServerDialog(false)}
        />
      )}

      {showSettingsDialog && (
        <SettingsDialog
          downloadDirectory={downloadDirectory}
          defaultDirectory={defaultDownloadDir}
          onChooseFolder={handleChooseFolder}
          onResetToDefault={handleResetDownloadDirectory}
          onClose={() => setShowSettingsDialog(false)}
        />
      )}
    </>
  );
}
