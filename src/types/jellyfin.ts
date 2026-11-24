export type JellyfinServerStatus = "connected" | "connecting" | "error" | "offline";

export interface JellyfinServer {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  status: JellyfinServerStatus;
  lastError?: string;
  addedAt: number;
}

export type MediaKind = "Movie" | "Series" | "Episode" | "Audio" | "MusicAlbum" | "Video" | "Other";

export type MediaCategory = "All Types" | "Audio" | "Movies" | "Shows" | "Photos" | "Books";

export interface SearchResult {
  id: string;
  serverId: string;
  serverName: string;
  itemId: string;
  /** Jellyfin's media title (e.g. "Hospital") — used for descriptive text. */
  title: string;
  /** The actual file name on disk (e.g. "Bluey.2018.S03E07.mp4") — shown in
   *  results/transfers tables, since that's what actually gets downloaded. */
  filename: string;
  subtitle?: string;
  kind: MediaKind;
  year?: number;
  runtimeMinutes?: number;
  sizeBytes?: number;
  bitrateKbps?: number;
  container?: string;
  posterUrl?: string;
  communityRating?: number;
  genres?: string[];
  playCount?: number;
  alreadyDownloaded?: boolean;
}

export type DownloadStatus =
  | "queued"
  | "downloading"
  | "paused"
  | "completed"
  | "failed"
  | "canceled";

export interface DownloadTask {
  id: string;
  result: SearchResult;
  status: DownloadStatus;
  progress: number;
  speedBytesPerSec?: number;
  downloadedBytes: number;
  totalBytes: number;
  destinationPath?: string;
  error?: string;
  startedAt?: number;
  completedAt?: number;
}
