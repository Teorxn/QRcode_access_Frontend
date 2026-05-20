import { apiClient } from "@/lib/http/api-client";
import type { QrCode } from "@/types/qr";

export const qrApi = {
  getByEmployee: (employeeId: string | number) =>
    apiClient.get<QrCode>(`/qr/${employeeId}`),

  generateForEmployee: (employeeId: string | number) =>
    apiClient.post<QrCode>(`/qr/generar/${employeeId}`),
};
