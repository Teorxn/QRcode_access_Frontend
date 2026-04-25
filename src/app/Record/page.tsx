"use client";

import React, { useEffect, useState } from "react";
import { listAccessHistory, listAreas } from "@/lib/repositories";
import type { AccessHistoryItem } from "@/lib/repositories/access.repository";
import type { Area } from "@/types/area";

export default function Record() {
  const [rows, setRows] = useState<AccessHistoryItem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "EXITOSO" | "FALLIDO"
  >("all");

  useEffect(() => {
    async function loadAreas(): Promise<void> {
      const areaRows = await listAreas();
      setAreas(areaRows);
    }

    void loadAreas();
  }, []);

  useEffect(() => {
    async function loadHistory(): Promise<void> {
      const records = await listAccessHistory({
        search,
        idArea: selectedArea === "all" ? undefined : Number(selectedArea),
        resultado: selectedStatus === "all" ? undefined : selectedStatus,
      });

      setRows(records);
    }

    void loadHistory();
  }, [search, selectedArea, selectedStatus]);

  const getInitials = (fullName: string): string => {
    const parts = fullName.split(" ").filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  };

  const formatDate = (dateIso: string): string =>
    new Date(dateIso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateIso: string): string =>
    new Date(dateIso).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <>
      <header className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-[#1b254b]">
          Historial de Accesos
        </h1>
        <p className="text-sm text-[#8f9bba]">
          Registro completo de ingresos y salidas del personal
        </p>
      </header>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 font-bold text-[#1b254b]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filtros
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8f9bba]">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a3aed0]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o documento..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e2e8f0] focus:outline-none focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] text-sm text-[#1b254b]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8f9bba]">Área</label>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-[#e2e8f0] focus:outline-none focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] text-sm text-[#1b254b] bg-white"
              >
                <option value="all">Todas las áreas</option>
                {areas.map((area) => (
                  <option key={area.idArea} value={area.idArea}>
                    {area.nombreArea}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#a3aed0]">
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
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8f9bba]">Estado</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value as "all" | "EXITOSO" | "FALLIDO",
                  )
                }
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-[#e2e8f0] focus:outline-none focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] text-sm text-[#1b254b] bg-white"
              >
                <option value="all">Todos</option>
                <option value="EXITOSO">Aprobado</option>
                <option value="FALLIDO">Denegado</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#a3aed0]">
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
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Meta Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm text-[#8f9bba]">
          Mostrando{" "}
          <span className="font-bold text-[#1b254b]">{rows.length}</span>{" "}
          registros
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#1b254b] font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            PDF
          </button>
          <button className="flex items-center gap-2 bg-[#05cd99] hover:bg-[#04b688] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Excel
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f4f7fe] text-[#1b254b] text-sm font-bold sticky top-0 bg-white z-10">
                <th className="py-4 px-6">Empleado</th>
                <th className="py-4 px-6">Área</th>
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-6">Hora</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6">Estado</th>
              </tr>
            </thead>
            <tbody className="text-[#1b254b]">
              {rows.map((record) => (
                <tr
                  key={record.idRegistro}
                  className="border-b border-[#f4f7fe] hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e1e9ff] text-[#1d3ebd] text-xs font-bold flex items-center justify-center">
                        {getInitials(record.employeeName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[0.95rem]">
                          {record.employeeName}
                        </span>
                        <span className="text-xs text-[#8f9bba]">
                          {record.employeeDocument}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{record.areaName}</td>
                  <td className="py-4 px-6 text-sm">
                    <div className="flex items-center gap-2 text-[#8f9bba]">
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
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(record.fechaHora)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {formatTime(record.fechaHora)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e1e9ff] text-[#4318ff]">
                      {record.tipoMovimiento}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {record.resultado === "EXITOSO" ? (
                      <div className="flex items-center gap-2 font-bold text-[#05cd99] text-sm">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Aprobado
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold text-[#e31a1a] text-sm">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          Denegado
                        </div>
                        <span className="text-xs text-[#8f9bba]">
                          Validación no autorizada
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-6 text-center text-sm text-[#8f9bba]"
                  >
                    No hay registros que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
