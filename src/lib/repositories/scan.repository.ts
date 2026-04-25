import { mockDb } from "@/lib/mock/database";
import type { ScanValidationInput, ScanValidationResult } from "@/types/scan";

export async function validateAccess(payload: ScanValidationInput): Promise<ScanValidationResult> {
  const qr = mockDb.getQrCodes().find((row) => row.codigoHash === payload.codigoHash);

  if (!qr) {
    return {
      permitido: false,
      resultado: "FALLIDO",
      mensaje: "QR no reconocido",
    };
  }

  const employee = mockDb.getEmployees().find((row) => row.idEmpleado === qr.idEmpleado);

  if (!qr.activo || !employee || !employee.activo) {
    const registro = mockDb.appendAccessRecord({
      idQr: qr.idQr,
      tipoMovimiento: payload.tipoMovimiento,
      resultado: "FALLIDO",
    });

    return {
      permitido: false,
      resultado: "FALLIDO",
      mensaje: "Acceso denegado: empleado o QR inactivo",
      empleado: employee,
      registro,
    };
  }

  const registro = mockDb.appendAccessRecord({
    idQr: qr.idQr,
    tipoMovimiento: payload.tipoMovimiento,
    resultado: "EXITOSO",
  });

  return {
    permitido: true,
    resultado: "EXITOSO",
    mensaje: "Acceso validado correctamente",
    empleado: employee,
    registro,
  };
}

export async function getDemoQrCodes(): Promise<{ validQrCode: string; invalidQrCode: string }> {
  const valid = mockDb.getQrCodes().find((row) => row.activo);

  return {
    validQrCode: valid?.codigoHash ?? "",
    invalidQrCode: "QR-INVALIDO-DEMO-0000",
  };
}
