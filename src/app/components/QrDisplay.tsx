"use client";

import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrDisplayProps {
  hash: string;
  employeeName: string;
  onClose: () => void;
}

export default function QrDisplay({ hash, employeeName, onClose }: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && hash) {
      QRCode.toCanvas(canvasRef.current, hash, {
        width: 280,
        margin: 2,
        color: { dark: "#1b254b", light: "#ffffff" },
      });
    }
  }, [hash]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-5 shadow-xl max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="self-end text-[#8f9bba] hover:text-[#1b254b] transition-colors"
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <canvas ref={canvasRef} className="rounded-lg" />
        <p className="text-sm font-semibold text-[#1b254b]">{employeeName}</p>
        <p className="text-xs text-[#8f9bba] break-all text-center max-w-full">
          {hash}
        </p>
      </div>
    </div>
  );
}
