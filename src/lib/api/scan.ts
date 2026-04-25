import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type {
  DashboardStats,
  ScanValidationInput,
  ScanValidationResult,
} from "@/types/scan";

export const scanApi = {
  validate: (payload: ScanValidationInput) =>
    apiClient.post<ScanValidationResult, ScanValidationInput>(endpoints.scanValidate, payload),

  getDashboardStats: () => apiClient.get<DashboardStats>(endpoints.dashboardStats),
};
