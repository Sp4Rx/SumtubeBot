import { QueryClient } from "@tanstack/react-query";

// Simple query client for static marketing page
// No API calls needed - just for potential future use
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Static data doesn't change
      retry: false,
    },
  },
});
