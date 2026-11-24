import type { MediaCategory, JellyfinServer, MediaKind, SearchResult } from "../types/jellyfin";

interface JellyfinApiMediaSource {
  Size?: number;
  Bitrate?: number;
  Container?: string;
  Path?: string;
  Name?: string;
}

interface JellyfinApiItem {
  Id: string;
  Name: string;
  Type: string;
  ProductionYear?: number;
  RunTimeTicks?: number;
  CommunityRating?: number;
  SeriesName?: string;
  Album?: string;
  ArtistItems?: { Name: string }[];
  MediaSources?: JellyfinApiMediaSource[];
  ImageTags?: { Primary?: string };
  Genres?: string[];
  UserData?: { PlayCount?: number; Played?: boolean };
}

interface JellyfinSearchResponse {
  Items: JellyfinApiItem[];
  TotalRecordCount: number;
}

const KIND_MAP: Record<string, MediaKind> = {
  Movie: "Movie",
  Series: "Series",
  Episode: "Episode",
  Audio: "Audio",
  MusicAlbum: "MusicAlbum",
  Video: "Video",
};

function toMediaKind(type: string): MediaKind {
  return KIND_MAP[type] ?? "Other";
}

const CATEGORY_KINDS: Record<Exclude<MediaCategory, "All Types">, MediaKind[]> = {
  Audio: ["Audio", "MusicAlbum"],
  Movies: ["Movie"],
  // Series items are virtual containers with no downloadable file; only their
  // Episode children have media sources, so "Shows" surfaces episodes.
  Shows: ["Episode"],
  Photos: [],
  Books: [],
};

export function matchesCategory(kind: MediaKind, category: MediaCategory): boolean {
  if (category === "All Types") return true;
  return CATEGORY_KINDS[category].includes(kind);
}

export function categoryForKind(kind: MediaKind): MediaCategory {
  if (kind === "Audio" || kind === "MusicAlbum") return "Audio";
  if (kind === "Movie") return "Movies";
  if (kind === "Series" || kind === "Episode") return "Shows";
  return "All Types";
}

function ticksToMinutes(ticks?: number): number | undefined {
  if (!ticks) return undefined;
  return Math.round(ticks / 600_000_000);
}

// The Jellyfin item "Name" is the media's display title (e.g. "Hospital"),
// not the file on disk — the actual filename comes from the media source's
// path. Falls back to a reconstructed name only if the server didn't return one.
function deriveFilename(item: JellyfinApiItem, source: JellyfinApiMediaSource | undefined): string {
  if (source?.Path) {
    const segments = source.Path.split(/[/\\]/);
    const base = segments[segments.length - 1];
    if (base) return base;
  }
  const ext = source?.Container?.split(",")[0];
  const base = source?.Name ?? item.Name;
  return ext ? `${base}.${ext}` : base;
}

export function buildImageUrl(server: JellyfinServer, itemId: string): string | undefined {
  return `${server.baseUrl}/Items/${itemId}/Images/Primary?maxWidth=300&api_key=${server.apiKey}`;
}

export function buildDownloadUrl(server: JellyfinServer, itemId: string): string {
  return `${server.baseUrl}/Items/${itemId}/Download?api_key=${server.apiKey}`;
}

export function buildStreamUrl(server: JellyfinServer, result: Pick<SearchResult, "itemId" | "kind">): string {
  const endpoint = result.kind === "Audio" || result.kind === "MusicAlbum" ? "Audio" : "Videos";
  return `${server.baseUrl}/${endpoint}/${result.itemId}/stream?static=true&api_key=${server.apiKey}`;
}

export async function pingServer(server: JellyfinServer): Promise<void> {
  const res = await fetch(`${server.baseUrl}/System/Info?api_key=${server.apiKey}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }
}

const CONTAINER_CHILD_TYPE: Record<string, string> = {
  Series: "Episode",
  Season: "Episode",
  MusicAlbum: "Audio",
};

const ITEM_FIELDS = "MediaSources,ProductionYear,CommunityRating,Genres,UserData";

async function fetchItems(
  server: JellyfinServer,
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<JellyfinApiItem[]> {
  const res = await fetch(`${server.baseUrl}/Items?${params.toString()}`, { signal });
  if (!res.ok) {
    throw new Error(`Search failed on ${server.name}: ${res.status}`);
  }
  const data = (await res.json()) as JellyfinSearchResponse;
  return data.Items;
}

// Series and Seasons are virtual containers with no file of their own —
// searching "Bluey" should surface every episode of the show, not the
// non-downloadable show/season entry itself. Same idea for MusicAlbum -> Audio.
async function expandContainer(
  server: JellyfinServer,
  item: JellyfinApiItem,
  signal?: AbortSignal,
): Promise<JellyfinApiItem[]> {
  const childType = CONTAINER_CHILD_TYPE[item.Type];
  if (!childType) return [];

  const params = new URLSearchParams({
    parentId: item.Id,
    recursive: "true",
    includeItemTypes: childType,
    fields: ITEM_FIELDS,
    limit: "500",
    api_key: server.apiKey,
  });
  return fetchItems(server, params, signal);
}

export async function searchServer(
  server: JellyfinServer,
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    recursive: "true",
    includeItemTypes: "Movie,Series,Season,Episode,Audio,MusicAlbum,Video",
    fields: ITEM_FIELDS,
    limit: "100",
    api_key: server.apiKey,
  });
  if (query.trim()) {
    params.set("searchTerm", query.trim());
  } else {
    params.set("sortBy", "DateCreated");
    params.set("sortOrder", "Descending");
  }

  const topLevel = await fetchItems(server, params, signal);

  const leaves: JellyfinApiItem[] = [];
  const expansions: Promise<JellyfinApiItem[]>[] = [];
  for (const item of topLevel) {
    if (CONTAINER_CHILD_TYPE[item.Type]) {
      expansions.push(expandContainer(server, item, signal));
    } else {
      leaves.push(item);
    }
  }
  const expanded = (await Promise.all(expansions)).flat();

  const uniqueById = new Map<string, JellyfinApiItem>();
  for (const item of [...leaves, ...expanded]) {
    uniqueById.set(item.Id, item);
  }

  // Whatever slipped through (containers with no media file, etc.) gets
  // dropped here so only genuinely downloadable files are ever returned.
  return Array.from(uniqueById.values())
    .filter((item) => Boolean(item.MediaSources?.[0]?.Size))
    .map((item) => {
      const source = item.MediaSources?.[0];
      return {
        id: `${server.id}:${item.Id}`,
        serverId: server.id,
        serverName: server.name,
        itemId: item.Id,
        title: item.Name,
        filename: deriveFilename(item, source),
        subtitle: item.SeriesName ?? item.Album ?? item.ArtistItems?.map((a) => a.Name).join(", "),
        kind: toMediaKind(item.Type),
        year: item.ProductionYear,
        runtimeMinutes: ticksToMinutes(item.RunTimeTicks),
        sizeBytes: source?.Size,
        bitrateKbps: source?.Bitrate ? Math.round(source.Bitrate / 1000) : undefined,
        container: source?.Container,
        posterUrl: item.ImageTags?.Primary ? buildImageUrl(server, item.Id) : undefined,
        communityRating: item.CommunityRating,
        genres: item.Genres,
        playCount: item.UserData?.PlayCount,
        alreadyDownloaded: item.UserData?.Played,
      } satisfies SearchResult;
    });
}

export async function searchAllServers(
  servers: JellyfinServer[],
  query: string,
  signal?: AbortSignal,
): Promise<{ results: SearchResult[]; errors: { server: JellyfinServer; error: Error }[] }> {
  const settled = await Promise.allSettled(
    servers.map(async (server) => ({ server, results: await searchServer(server, query, signal) })),
  );

  const results: SearchResult[] = [];
  const errors: { server: JellyfinServer; error: Error }[] = [];

  for (let i = 0; i < settled.length; i++) {
    const outcome = settled[i];
    if (outcome.status === "fulfilled") {
      results.push(...outcome.value.results);
    } else {
      errors.push({ server: servers[i], error: outcome.reason as Error });
    }
  }

  return { results, errors };
}
