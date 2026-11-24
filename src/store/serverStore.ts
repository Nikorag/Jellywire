import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { JellyfinServer, JellyfinServerStatus } from "../types/jellyfin";

interface ServerStoreState {
  servers: JellyfinServer[];
  addServer: (input: { name: string; baseUrl: string; apiKey: string }) => JellyfinServer;
  removeServer: (id: string) => void;
  setServerStatus: (id: string, status: JellyfinServerStatus, lastError?: string) => void;
}

export const useServerStore = create<ServerStoreState>()(
  persist(
    (set) => ({
      servers: [],
      addServer: ({ name, baseUrl, apiKey }) => {
        const server: JellyfinServer = {
          id: uuid(),
          name,
          baseUrl: baseUrl.replace(/\/+$/, ""),
          apiKey,
          status: "connecting",
          addedAt: Date.now(),
        };
        set((state) => ({ servers: [...state.servers, server] }));
        return server;
      },
      removeServer: (id) =>
        set((state) => ({ servers: state.servers.filter((s) => s.id !== id) })),
      setServerStatus: (id, status, lastError) =>
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, status, lastError } : s,
          ),
        })),
    }),
    {
      name: "jellywire-servers",
      // Status/lastError are transient — reconnect from scratch on every
      // launch rather than trusting whatever was last observed.
      partialize: (state) => ({
        servers: state.servers.map(({ id, name, baseUrl, apiKey, addedAt }) => ({
          id,
          name,
          baseUrl,
          apiKey,
          addedAt,
          status: "connecting" as const,
        })),
      }),
    },
  ),
);
