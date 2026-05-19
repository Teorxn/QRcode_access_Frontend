import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import type {
  CreateEmployeeInput,
  DocumentType,
  Employee,
  UpdateEmployeeInput,
} from "@/types/employee";

export type EmployeeFilters = {
  search?: string;
  idArea?: number;
  activo?: boolean;
  tipoDocumento?: DocumentType;
};

export const employeesApi = {
  list: (filters?: EmployeeFilters) =>
    apiClient.get<Employee[]>(endpoints.employees, {
      query: filters as Record<string, string | number | boolean | null | undefined> | undefined,
    }),

  byId: (id: string) => apiClient.get<Employee>(`${endpoints.employees}/${id}`),

  create: (payload: CreateEmployeeInput) =>
    apiClient.post<Employee, CreateEmployeeInput>(endpoints.employees, payload),

  update: (id: string, payload: UpdateEmployeeInput) =>
    apiClient.put<Employee, UpdateEmployeeInput>(`${endpoints.employees}/${id}`, payload),

  remove: (id: string) => apiClient.delete<void>(`${endpoints.employees}/${id}`),
};
