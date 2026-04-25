import { listAccessHistory } from "@/lib/repositories/access.repository";
import { mockDb } from "@/lib/mock/database";
import type { DashboardStats } from "@/types/scan";

export interface DashboardTrendPoint {
  time: string;
  entradas: number;
  salidas: number;
}

export type DashboardRecentAccess = Awaited<ReturnType<typeof listAccessHistory>>[number];

function isToday(dateIso: string): boolean {
  const date = new Date(dateIso);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function hourLabel(dateIso: string): string {
  return new Date(dateIso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const recordsToday = mockDb.getAccessRecords().filter((row) => isToday(row.fechaHora));

  return {
    totalRegistrosHoy: recordsToday.length,
    entradasHoy: recordsToday.filter((row) => row.tipoMovimiento === "ENTRADA").length,
    salidasHoy: recordsToday.filter((row) => row.tipoMovimiento === "SALIDA").length,
    fallidosHoy: recordsToday.filter((row) => row.resultado === "FALLIDO").length,
    empleadosActivos: mockDb.getEmployees().filter((row) => row.activo).length,
    tiempoPromedioValidacionMs: 8300,
  };
}

export async function getDashboardTrend(): Promise<DashboardTrendPoint[]> {
  const recordsToday = mockDb
    .getAccessRecords()
    .filter((row) => isToday(row.fechaHora))
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

  const groups = new Map<string, DashboardTrendPoint>();

  recordsToday.forEach((row) => {
    const key = hourLabel(row.fechaHora);
    const current = groups.get(key) ?? { time: key, entradas: 0, salidas: 0 };

    if (row.tipoMovimiento === "ENTRADA") {
      current.entradas += 1;
    }

    if (row.tipoMovimiento === "SALIDA") {
      current.salidas += 1;
    }

    groups.set(key, current);
  });

  const result = Array.from(groups.values());

  if (result.length > 0) {
    return result;
  }

  return [
    { time: "06:00", entradas: 0, salidas: 0 },
    { time: "08:00", entradas: 0, salidas: 0 },
    { time: "10:00", entradas: 0, salidas: 0 },
    { time: "12:00", entradas: 0, salidas: 0 },
    { time: "14:00", entradas: 0, salidas: 0 },
  ];
}

export async function getRecentAccesses(limit = 4): Promise<DashboardRecentAccess[]> {
  const rows = await listAccessHistory();
  return rows.slice(0, limit);
}
