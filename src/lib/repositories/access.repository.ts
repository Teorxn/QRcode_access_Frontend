import { mockDb } from "@/lib/mock/database";
import type { AccessHistoryFilters } from "@/types/history";

export interface AccessHistoryItem {
  idRegistro: number;
  fechaHora: string;
  tipoMovimiento: "ENTRADA" | "SALIDA";
  resultado: "EXITOSO" | "FALLIDO";
  qrCodeHash: string;
  employeeId: number;
  employeeName: string;
  employeeDocument: string;
  areaName: string;
  fotoUrl: string | null;
}

export async function listAccessHistory(filters?: AccessHistoryFilters): Promise<AccessHistoryItem[]> {
  const areas = mockDb.getAreas();
  const employees = mockDb.getEmployees();
  const qrCodes = mockDb.getQrCodes();

  let items = mockDb
    .getAccessRecords()
    .map((record): AccessHistoryItem | null => {
      const qr = qrCodes.find((row) => row.idQr === record.idQr);
      if (!qr) return null;

      const employee = employees.find((row) => row.idEmpleado === qr.idEmpleado);
      if (!employee) return null;

      const area = areas.find((row) => row.idArea === employee.idArea);

      return {
        idRegistro: record.idRegistro,
        fechaHora: record.fechaHora,
        tipoMovimiento: record.tipoMovimiento,
        resultado: record.resultado,
        qrCodeHash: qr.codigoHash,
        employeeId: employee.idEmpleado,
        employeeName: `${employee.nombres} ${employee.apellidos}`,
        employeeDocument: employee.numDocumento,
        areaName: area?.nombreArea ?? "Sin area",
        fotoUrl: employee.fotoUrl,
      };
    })
    .filter((row): row is AccessHistoryItem => row !== null)
    .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());

  if (filters?.idArea) {
    items = items.filter((row) => {
      const employee = employees.find((emp) => emp.idEmpleado === row.employeeId);
      return employee?.idArea === filters.idArea;
    });
  }

  if (filters?.idEmpleado) {
    items = items.filter((row) => row.employeeId === filters.idEmpleado);
  }

  if (filters?.idQr) {
    items = items.filter((row) => {
      const qr = qrCodes.find((code) => code.codigoHash === row.qrCodeHash);
      return qr?.idQr === filters.idQr;
    });
  }

  if (filters?.tipoMovimiento) {
    items = items.filter((row) => row.tipoMovimiento === filters.tipoMovimiento);
  }

  if (filters?.resultado) {
    items = items.filter((row) => row.resultado === filters.resultado);
  }

  if (filters?.from) {
    const from = new Date(filters.from).getTime();
    items = items.filter((row) => new Date(row.fechaHora).getTime() >= from);
  }

  if (filters?.to) {
    const to = new Date(filters.to).getTime();
    items = items.filter((row) => new Date(row.fechaHora).getTime() <= to);
  }

  if (filters?.search) {
    const needle = filters.search.trim().toLowerCase();
    if (needle.length > 0) {
      items = items.filter((row) => {
        const haystack = `${row.employeeName} ${row.employeeDocument} ${row.areaName}`.toLowerCase();
        return haystack.includes(needle);
      });
    }
  }

  return items;
}
