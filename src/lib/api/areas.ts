import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type { Area, CreateAreaInput, UpdateAreaInput } from "@/types/area";

export const areasApi = {
  list: () => apiClient.get<Area[]>(endpoints.areas),

  create: (payload: CreateAreaInput) =>
    apiClient.post<Area, CreateAreaInput>(endpoints.areas, payload),

  update: (id: string | number, payload: UpdateAreaInput) =>
    apiClient.put<Area, UpdateAreaInput>(`${endpoints.areas}/${id}`, payload),

  remove: (id: string | number) =>
    apiClient.delete<void>(`${endpoints.areas}/${id}`),
};
