export interface QrCode {
  idQr: number;
  idEmpleado: number;
  codigoHash: string;
  fechaGeneracion: string;
  activo: boolean;
}

export interface CreateQrCodeInput {
  idEmpleado: number;
  codigoHash: string;
}

export interface UpdateQrCodeInput {
  activo?: boolean;
}
