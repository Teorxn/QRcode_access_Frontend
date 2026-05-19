import { historyApi } from "@/lib/api";
import type { AccessHistoryFilters, AccessHistoryItem } from "@/types/history";

export type { AccessHistoryItem } from "@/types/history";

export async function listAccessHistory(
  filters?: AccessHistoryFilters,
): Promise<AccessHistoryItem[]> {
  return historyApi.list(filters);
}
