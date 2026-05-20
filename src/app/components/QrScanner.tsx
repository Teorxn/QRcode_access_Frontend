"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  paused?: boolean;
}

export default function QrScanner({
  onScanSuccess,
  onScanError,
  paused = false,
}: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start / stop scanner with auto camera detection
  useEffect(() => {
    if (!containerRef.current) return;

    const elementId = "qr-scanner-region";

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(elementId);
    }

    const scanner = scannerRef.current;

    if (paused) {
      if (isRunning) {
        try {
          scanner.stop();
          setIsRunning(false);
        } catch {
          // scanner already stopped or not running
        }
      }
      return;
    }

    async function startScanner(): Promise<void> {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => { onScanSuccess(decodedText); },
          (errorMessage) => { onScanError?.(errorMessage); },
        );
        setIsRunning(true);
        setCameraError(null);
      } catch {
        // Fallback: enumerate cameras and try the first available
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            await scanner.start(
              devices[0].id,
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => { onScanSuccess(decodedText); },
              (errorMessage) => { onScanError?.(errorMessage); },
            );
            setIsRunning(true);
            setCameraError(null);
          } else {
            setCameraError("No se encontraron cámaras disponibles.");
          }
        } catch (fallbackErr) {
          setCameraError(
            `Error al iniciar la cámara: ${(fallbackErr as Error).message || "desconocido"}`,
          );
        }
      }
    }

    if (!isRunning) {
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        try {
          scanner.stop();
        } catch {
          // scanner already stopped or not running
        }
        scannerRef.current = null;
        setIsRunning(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <div className="w-full flex flex-col items-center gap-4">

      {/* Scanner viewport */}
      <div
        ref={containerRef}
        className="relative w-full max-w-xl aspect-square bg-[#0f172a] rounded-2xl overflow-hidden"
      >
        {/* Viewfinder corner borders */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-[#3b82f6] rounded-tl-lg z-10 pointer-events-none"></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-[#3b82f6] rounded-tr-lg z-10 pointer-events-none"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-[#3b82f6] rounded-bl-lg z-10 pointer-events-none"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-[#3b82f6] rounded-br-lg z-10 pointer-events-none"></div>

        {/* Scanning line animation */}
        {isRunning && (
          <div className="absolute inset-x-6 z-10 pointer-events-none animate-scan-line">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"></div>
          </div>
        )}

        {/* html5-qrcode renders the video here */}
        <div
          id="qr-scanner-region"
          className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full [&>video]:scale-x-[-1]"
        ></div>

        {/* Error or loading overlay */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a]/90 z-20 p-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e31a1a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <line x1="2" y1="2" x2="22" y2="22"></line>
            </svg>
            <p className="text-white text-sm mt-4 text-center">{cameraError}</p>
          </div>
        )}

        {!isRunning && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] z-20">
            <svg
              className="animate-pulse"
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
            <p className="text-[#64748b] text-sm mt-3">
              Iniciando cámara...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
