import { PropsWithChildren } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { MSS } from "app/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: MSS.oneDay,
    },
  },
});
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
