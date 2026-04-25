import type { Employee } from "@/types/employee";
import type { AccessMovement, AccessRecord, AccessResult } from "@/types/history";

export interface ScanValidationInput {
  codigoHash: string;
  tipoMovimiento: AccessMovement;
}

export interface ScanValidationResult {
  permitido: boolean;
  resultado: AccessResult;
  mensaje: string;
  empleado?: Employee;
  registro?: AccessRecord;
}

export interface DashboardStats {
  totalRegistrosHoy: number;
  entradasHoy: number;
  salidasHoy: number;
  fallidosHoy: number;
  empleadosActivos: number;
  tiempoPromedioValidacionMs: number;
}
