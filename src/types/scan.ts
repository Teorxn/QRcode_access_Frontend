import type { AccessMovement, AccessResult } from "@/types/history";

export interface ScanValidationInput {
  codigoHash: string;
  tipoMovimiento: AccessMovement;
}

export interface ScanValidationResult {
  permitido: boolean;
  resultado: AccessResult;
  mensaje: string;
  empleadoNombre?: string;
  empleadoDocumento?: string;
  areaNombre?: string;
  fechaHora: string;
}

export interface DashboardStats {
  totalRegistrosHoy: number;
  entradasHoy: number;
  salidasHoy: number;
  fallidosHoy: number;
  empleadosActivos: number;
  tiempoPromedioValidacionMs: number;
}
