import { mockDb } from "@/lib/mock/database";
import type { DocumentType, Employee } from "@/types/employee";

export interface EmployeeRepositoryFilters {
  search?: string;
  idArea?: number;
  activo?: boolean;
  tipoDocumento?: DocumentType;
}

export interface EmployeeListItem {
  employee: Employee;
  fullName: string;
  areaName: string;
  estadoLabel: "Activo" | "Inactivo";
  qrActivo: boolean;
}

export async function listEmployees(filters?: EmployeeRepositoryFilters): Promise<EmployeeListItem[]> {
  const areas = mockDb.getAreas();
  const qrCodes = mockDb.getQrCodes();

  let items: EmployeeListItem[] = mockDb.getEmployees().map((employee) => {
    const area = areas.find((row) => row.idArea === employee.idArea);
    const qr = qrCodes.find((row) => row.idEmpleado === employee.idEmpleado);

    return {
      employee,
      fullName: `${employee.nombres} ${employee.apellidos}`,
      areaName: area?.nombreArea ?? "Sin area",
      estadoLabel: employee.activo ? "Activo" : "Inactivo",
      qrActivo: qr?.activo ?? false,
    };
  });

  if (filters?.idArea) {
    items = items.filter((row) => row.employee.idArea === filters.idArea);
  }

  if (filters?.activo !== undefined) {
    items = items.filter((row) => row.employee.activo === filters.activo);
  }

  if (filters?.tipoDocumento) {
    items = items.filter((row) => row.employee.tipoDocumento === filters.tipoDocumento);
  }

  if (filters?.search) {
    const needle = filters.search.trim().toLowerCase();
    if (needle.length > 0) {
      items = items.filter((row) => {
        const haystack = `${row.fullName} ${row.employee.numDocumento} ${row.areaName}`.toLowerCase();
        return haystack.includes(needle);
      });
    }
  }

  return items;
}
