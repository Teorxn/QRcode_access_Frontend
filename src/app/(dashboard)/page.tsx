"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getDashboardStats,
  getDashboardTrend,
  getRecentAccesses,
} from "@/lib/repositories";
import type { DashboardTrendPoint } from "@/lib/repositories/dashboard.repository";
import type { DashboardStats } from "@/types/scan";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrosHoy: 0,
    entradasHoy: 0,
    salidasHoy: 0,
    fallidosHoy: 0,
    empleadosActivos: 0,
    tiempoPromedioValidacionMs: 0,
  });
  const [chartData, setChartData] = useState<DashboardTrendPoint[]>([]);
  const [recentAccesses, setRecentAccesses] = useState<
    Awaited<ReturnType<typeof getRecentAccesses>>
  >([]);

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      const [nextStats, nextTrend, nextRecent] = await Promise.all([
        getDashboardStats(),
        getDashboardTrend(),
        getRecentAccesses(),
      ]);

      setStats(nextStats);
      setChartData(nextTrend);
      setRecentAccesses(nextRecent);
    }

    void loadDashboard();
  }, []);

  const maxBarHeight = useMemo(() => {
    const peak = Math.max(
      1,
      ...chartData.map((row) => Math.max(row.entradas, row.salidas)),
    );

    return peak;
  }, [chartData]);

  const getBarHeight = (value: number): string =>
    `${(value / maxBarHeight) * 100}%`;

  const formatHour = (dateIso: string): string =>
    new Date(dateIso).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-[#1b254b]">Dashboard</h1>
        <p className="text-sm text-[#8f9bba]">
          Resumen de actividad del sistema de acceso QR
        </p>
      </header>

      {/* 4 Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#8f9bba]">
              Total Ingresos Hoy
            </span>
            <span className="text-3xl font-bold text-[#1b254b]">
              {stats.entradasHoy}
            </span>
            <span className="text-xs font-semibold text-[#4318ff]">
              Registros exitosos de entrada
            </span>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f4f7fe] text-[#4318ff]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#8f9bba]">
              Empleados Presentes
            </span>
            <span className="text-3xl font-bold text-[#1b254b]">
              {stats.empleadosActivos}
            </span>
            <span className="text-xs font-semibold text-[#05cd99]">
              Activos en el sistema
            </span>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ebfbf5] text-[#05cd99]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#8f9bba]">
              Accesos Rechazados
            </span>
            <span className="text-3xl font-bold text-[#1b254b]">
              {stats.fallidosHoy}
            </span>
            <span className="text-xs font-semibold text-[#e31a1a]">
              Registros fallidos hoy
            </span>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#fde8e8] text-[#e31a1a]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#8f9bba]">
              Tiempo Promedio
            </span>
            <span className="text-3xl font-bold text-[#1b254b]">
              {(stats.tiempoPromedioValidacionMs / 1000).toFixed(1)}s
            </span>
            <span className="text-xs font-semibold text-[#8624db]">
              Por validación
            </span>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f4e8fd] text-[#8624db]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 gap-5 min-h-95 xl:grid-cols-[2fr_1fr]">
        {/* Chart Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1b254b]">
                Tendencias de Ingreso
              </h2>
              <p className="text-sm text-[#8f9bba] mt-1">
                Ingresos y salidas por hora
              </p>
            </div>
            <div className="text-sm font-semibold text-[#05cd99] flex items-center gap-1">
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
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              {stats.totalRegistrosHoy} registros hoy
            </div>
          </div>

          <div className="grow flex flex-col relative pl-8 pb-8 mt-2">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-[#a3aed0]">
              <span>{maxBarHeight}</span>
              <span>{Math.ceil(maxBarHeight * 0.75)}</span>
              <span>{Math.ceil(maxBarHeight * 0.5)}</span>
              <span>{Math.ceil(maxBarHeight * 0.25)}</span>
              <span>0</span>
            </div>
            <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between z-1">
              <div className="w-full h-px border-t border-dashed border-[#e2e8f0]"></div>
              <div className="w-full h-px border-t border-dashed border-[#e2e8f0]"></div>
              <div className="w-full h-px border-t border-dashed border-[#e2e8f0]"></div>
              <div className="w-full h-px border-t border-dashed border-[#e2e8f0]"></div>
              <div className="w-full h-px border-t border-[#cbd5e1]"></div>
            </div>

            <div className="absolute left-8 right-0 top-0 bottom-8 flex justify-around items-end z-2 px-2">
              {chartData.map((d) => (
                <div
                  key={d.time}
                  className="flex gap-1 h-full items-end relative"
                >
                  <div
                    className="w-3.5 bg-[#2b4592] rounded-t transition-[height] duration-300"
                    style={{ height: getBarHeight(d.entradas) }}
                  ></div>
                  <div
                    className="w-3.5 bg-[#05cd99] rounded-t transition-[height] duration-300"
                    style={{ height: getBarHeight(d.salidas) }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="absolute left-8 right-0 bottom-0 h-8 flex justify-around items-center text-xs text-[#a3aed0] px-2">
              {chartData.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-auto pt-5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#1b254b]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2b4592]"></div>
              ingresos
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#1b254b]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#05cd99]"></div>
              salidas
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-[#1b254b] mb-6">
            Accesos Recientes
          </h2>
          <div className="flex flex-col">
            {recentAccesses.map((entry, index) => {
              const isLast = index === recentAccesses.length - 1;
              const isApproved = entry.resultado === "EXITOSO";

              return (
                <div
                  key={entry.idRegistro}
                  className={`flex justify-between items-center py-4 ${
                    isLast ? "" : "border-b border-[#f4f7fe]"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[0.95rem] text-[#1b254b]">
                      {entry.employeeName}
                    </span>
                    <span className="text-sm text-[#8f9bba]">
                      {entry.areaName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm text-[#8f9bba]">
                      {formatHour(entry.fechaHora)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        isApproved
                          ? "bg-[#ebfbf5] text-[#05cd99]"
                          : "bg-[#fde8e8] text-[#e31a1a]"
                      }`}
                    >
                      {isApproved ? "Aprobado" : "Denegado"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
