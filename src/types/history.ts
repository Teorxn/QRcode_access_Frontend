export type AccessMovement = "ENTRADA" | "SALIDA";
export type AccessResult = "EXITOSO" | "FALLIDO";

export interface AccessRecord {
  idRegistro: number;
  idQr: number;
  fechaHora: string;
  tipoMovimiento: AccessMovement;
  resultado: AccessResult;
}

export interface AccessHistoryItem {
  idRegistro: number;
  fechaHora: string;
  tipoMovimiento: AccessMovement;
  resultado: AccessResult;
  qrCodeHash: string;
  employeeId: number;
  employeeName: string;
  employeeDocument: string;
  areaName: string;
  fotoUrl: string | null;
}

export interface AccessHistoryFilters {
  search?: string;
  idArea?: number;
  idEmpleado?: number;
  idQr?: number;
  tipoMovimiento?: AccessMovement;
  resultado?: AccessResult;
  from?: string;
  to?: string;
}
