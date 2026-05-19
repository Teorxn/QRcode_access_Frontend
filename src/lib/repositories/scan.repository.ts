import { employeesApi, qrApi, scanApi } from "@/lib/api";
import type { ScanValidationInput, ScanValidationResult } from "@/types/scan";

export async function validateAccess(payload: ScanValidationInput): Promise<ScanValidationResult> {
  return scanApi.validate(payload);
}

export async function getDemoQrCodes(): Promise<{ validQrCode: string; invalidQrCode: string }> {
  try {
    const employees = await employeesApi.list({ activo: true });
    const selected = employees[0];

    if (!selected) {
      return { validQrCode: "", invalidQrCode: "QR-INVALIDO-DEMO-0000" };
    }

    const qr = await qrApi.getByEmployee(selected.idEmpleado);

    return {
      validQrCode: qr.codigoHash ?? "",
      invalidQrCode: "QR-INVALIDO-DEMO-0000",
    };
  } catch {
    return { validQrCode: "", invalidQrCode: "QR-INVALIDO-DEMO-0000" };
  }
}
