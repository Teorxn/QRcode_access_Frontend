import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type { AccessHistoryFilters, AccessRecord } from "@/types/history";

export const historyApi = {
  list: (filters?: AccessHistoryFilters) =>
    apiClient.get<AccessRecord[]>(endpoints.accessHistory, {
      query: filters as Record<string, string | number | boolean | null | undefined> | undefined,
    }),
};
