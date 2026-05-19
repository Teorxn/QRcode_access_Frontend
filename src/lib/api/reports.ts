import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type { AccessHistoryFilters } from "@/types/history";

export const reportsApi = {
  exportPdf: (filters?: AccessHistoryFilters) =>
    apiClient.download(endpoints.reportsAccessPdf, {
      query: filters as Record<string, string | number | boolean | null | undefined>,
    }),

  exportExcel: (filters?: AccessHistoryFilters) =>
    apiClient.download(endpoints.reportsAccessExcel, {
      query: filters as Record<string, string | number | boolean | null | undefined>,
    }),
};
