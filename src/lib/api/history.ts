import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type { AccessHistoryFilters, AccessHistoryItem } from "@/types/history";

export const historyApi = {
  list: (filters?: AccessHistoryFilters) =>
    apiClient.get<AccessHistoryItem[]>(endpoints.accessHistory, {
      query: filters as Record<string, string | number | boolean | null | undefined> | undefined,
    }),
};
