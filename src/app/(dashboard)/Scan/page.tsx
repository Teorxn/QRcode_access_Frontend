"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  getDashboardStats,
  getDemoQrCodes,
  validateAccess,
} from "@/lib/repositories";
import type { ScanValidationResult } from "@/types/scan";
import QrScanner from "@/app/components/QrScanner";

export default function Scan() {
  const [qrInput, setQrInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scansToday, setScansToday] = useState(0);
  const [scannerPaused, setScannerPaused] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const [demoCodes, setDemoCodes] = useState({
    validQrCode: "",
    invalidQrCode: "",
  });
  const [lastResult, setLastResult] = useState<ScanValidationResult | null>(
    null,
  );

  useEffect(() => {
    async function loadData(): Promise<void> {
      const [stats, codes] = await Promise.all([
        getDashboardStats(),
        getDemoQrCodes(),
      ]);
      setScansToday(stats.totalRegistrosHoy);
      setDemoCodes(codes);
      setQrInput(codes.validQrCode);
    }

    void loadData();
  }, []);

  const handleValidate = useCallback(
    async (
      tipoMovimiento: "ENTRADA" | "SALIDA",
      customCode?: string,
    ) => {
      const code = customCode ?? qrInput;
      if (!code.trim()) return;

      setIsSubmitting(true);
      setScannerPaused(true);

      const result = await validateAccess({
        codigoHash: code,
        tipoMovimiento,
      });

      setLastResult(result);
      const stats = await getDashboardStats();
      setScansToday(stats.totalRegistrosHoy);
      setIsSubmitting(false);

      // Resume scanner after 3 seconds so the user can see the result
      setTimeout(() => {
        setScannerPaused(false);
        setLastResult(null);
      }, 3000);
    },
    [qrInput],
  );

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      if (isSubmitting || scannerPaused) return;
      setQrInput(decodedText);
      void handleValidate("ENTRADA", decodedText);
    },
    [isSubmitting, scannerPaused, handleValidate],
  );

  return (
    <>
      <header className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-[#1b254b]">
          Escáner de Código QR
        </h1>
        <p className="text-sm text-[#8f9bba]">
          Posicione el código QR frente a la cámara para validar el acceso
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Column: Camera Viewfinder */}
        <div className="grow bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center">
          {/* Toggle: Camera vs Manual */}
          <div className="w-full max-w-xl flex gap-2 mb-6">
            <button
              onClick={() => setUseManualInput(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !useManualInput
                  ? "bg-[#4318ff] text-white"
                  : "bg-[#f4f7fe] text-[#8f9bba] hover:bg-[#e9ecf5]"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
                Cámara en vivo
              </span>
            </button>
            <button
              onClick={() => setUseManualInput(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                useManualInput
                  ? "bg-[#4318ff] text-white"
                  : "bg-[#f4f7fe] text-[#8f9bba] hover:bg-[#e9ecf5]"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                Ingreso manual
              </span>
            </button>
          </div>

          {/* Camera mode */}
          {!useManualInput && (
            <QrScanner
              onScanSuccess={handleScanSuccess}
              paused={scannerPaused}
            />
          )}

          {/* Manual mode */}
          {useManualInput && (
            <>
              <div className="relative w-full max-w-xl aspect-square bg-[#0f172a] rounded-2xl flex items-center justify-center mb-6">
                {/* Viewfinder borders */}
                <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-[#3b82f6] rounded-tl-lg"></div>
                <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-[#3b82f6] rounded-tr-lg"></div>
                <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-[#3b82f6] rounded-bl-lg"></div>
                <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-[#3b82f6] rounded-br-lg"></div>

                {/* Camera Icon */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>

              <div className="w-full max-w-xl mb-4">
                <label className="text-sm font-medium text-[#8f9bba] mb-2 block">
                  Código QR (hash)
                </label>
                <textarea
                  value={qrInput}
                  onChange={(event) => setQrInput(event.target.value)}
                  rows={3}
                  className="w-full border border-[#e2e8f0] rounded-lg p-3 text-xs text-[#1b254b] focus:outline-none focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                <button
                  onClick={() => handleValidate("ENTRADA")}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#05cd99] hover:bg-[#04b688] transition-colors text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                >
                  Simular Acceso Válido
                </button>
                <button
                  onClick={() =>
                    handleValidate("ENTRADA", demoCodes.invalidQrCode)
                  }
                  disabled={isSubmitting}
                  className="flex-1 bg-[#e31a1a] hover:bg-[#cc1717] transition-colors text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                >
                  Simular Acceso Denegado
                </button>
              </div>
            </>
          )}

          {/* Status message */}
          <p className="text-sm text-[#8f9bba] mt-4">
            {isSubmitting
              ? "Validando código..."
              : scannerPaused
                ? "Mostrando resultado..."
                : useManualInput
                  ? "Listo para validar"
                  : "Escaneando..."}
          </p>

          {/* Result feedback */}
          {lastResult && (
            <div
              className={`w-full max-w-xl mt-5 rounded-lg border p-4 transition-all ${
                lastResult.resultado === "EXITOSO"
                  ? "bg-[#ebfbf5] border-[#c8f5e8]"
                  : "bg-[#fde8e8] border-[#f5c8c8]"
              }`}
            >
              <div className="flex items-center gap-3">
                {lastResult.resultado === "EXITOSO" ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#05cd99"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e31a1a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
                <div>
                  <div className="text-sm font-bold text-[#1b254b]">
                    {lastResult.resultado === "EXITOSO"
                      ? "Acceso Aprobado"
                      : "Acceso Denegado"}
                  </div>
                  <div className="text-xs text-[#475569] mt-1">
                    {lastResult.mensaje}
                  </div>
                  {lastResult.empleadoNombre && (
                    <div className="text-xs text-[#475569] mt-1">
                      Empleado: {lastResult.empleadoNombre}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Instructions */}
        <div className="w-full xl:w-80 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#1b254b]">Instrucciones</h2>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#e1e9ff] text-[#4318ff] font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#1b254b] text-[0.95rem]">
                  Preparar código QR
                </span>
                <span className="text-xs text-[#8f9bba]">
                  El empleado debe mostrar su código QR de acceso
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#e1e9ff] text-[#4318ff] font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#1b254b] text-[0.95rem]">
                  Posicionar código
                </span>
                <span className="text-xs text-[#8f9bba]">
                  Centrar el código dentro del marco de escaneo
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#e1e9ff] text-[#4318ff] font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#1b254b] text-[0.95rem]">
                  Validación automática
                </span>
                <span className="text-xs text-[#8f9bba]">
                  El sistema validará el acceso automáticamente
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-[#f4f7fe] rounded-xl p-5 border border-[#e2e8f0]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#4318ff] font-medium text-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                  <rect x="7" y="7" width="10" height="10" rx="1"></rect>
                </svg>
                Escaneos hoy
              </div>
              <span className="text-2xl font-bold text-[#1b254b]">
                {scansToday}
              </span>
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] text-xs text-[#64748b] break-all">
            <div className="font-semibold text-[#1b254b] mb-1">
              Hash demo válido
            </div>
            {demoCodes.validQrCode || "Cargando..."}
          </div>
        </div>
      </div>
    </>
  );
}
