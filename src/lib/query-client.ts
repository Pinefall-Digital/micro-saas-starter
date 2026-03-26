import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus during development
        refetchOnWindowFocus: false,
        // Keep data fresh for 60 seconds
        staleTime: 60 * 1000,
      },
    },
  });
}

export function getQueryClient() {
  // Server: always create a new QueryClient
  if (typeof window === "undefined") return makeQueryClient();

  // Browser: reuse the same QueryClient across renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
