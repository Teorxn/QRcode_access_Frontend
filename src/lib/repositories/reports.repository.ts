import { reportsApi } from "@/lib/api/reports";
import type { AccessHistoryFilters } from "@/types/history";

export async function exportAccessPdf(filters?: AccessHistoryFilters): Promise<Blob> {
  return reportsApi.exportPdf(filters);
}

export async function exportAccessExcel(filters?: AccessHistoryFilters): Promise<Blob> {
  return reportsApi.exportExcel(filters);
}
