"use client";

import React, { useEffect, useMemo, useState } from "react";
import { listAreas, listEmployees } from "@/lib/repositories";
import type { Area } from "@/types/area";
import type { EmployeeListItem } from "@/lib/repositories/employees.repository";

export default function Employees() {
  const [rows, setRows] = useState<EmployeeListItem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    async function loadAreas(): Promise<void> {
      const areaRows = await listAreas();
      setAreas(areaRows);
    }

    void loadAreas();
  }, []);

  useEffect(() => {
    async function loadEmployees(): Promise<void> {
      const result = await listEmployees({
        search,
        idArea: selectedArea === "all" ? undefined : Number(selectedArea),
        activo:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
              ? true
              : false,
      });

      setRows(result);
    }

    void loadEmployees();
  }, [search, selectedArea, selectedStatus]);

  const totalActivos = useMemo(
    () => rows.filter((row) => row.employee.activo).length,
    [rows],
  );

  const getInitials = (fullName: string): string => {
    const parts = fullName.split(" ").filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  };

  return (
    <>
      <header className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-[#1b254b]">
          Gestión de Empleados
        </h1>
        <p className="text-sm text-[#8f9bba]">
          Administre el registro y códigos QR de los empleados
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div className="relative w-full max-w-md">
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
            placeholder="Buscar por nombre, documento o área..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e2e8f0] focus:outline-none focus:border-[#4318ff] focus:ring-1 focus:ring-[#4318ff] text-sm text-[#1b254b]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <select
              value={selectedArea}
              onChange={(event) => setSelectedArea(event.target.value)}
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1b254b] py-2.5 pl-3 pr-9 rounded-lg text-sm min-w-40"
            >
              <option value="all">Todas las áreas</option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 px-2 flex items-center pointer-events-none text-[#a3aed0]">
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

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
              className="appearance-none bg-white border border-[#e2e8f0] text-[#1b254b] py-2.5 pl-3 pr-9 rounded-lg text-sm min-w-36"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <div className="absolute inset-y-0 right-0 px-2 flex items-center pointer-events-none text-[#a3aed0]">
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

          <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#1b254b] font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-[#1d3ebd] hover:bg-[#183196] text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Registrar Nuevo
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm text-[#8f9bba] px-1">
        Mostrando{" "}
        <span className="font-bold text-[#1b254b]">{rows.length}</span>{" "}
        empleados, de los cuales
        <span className="font-bold text-[#1b254b]"> {totalActivos}</span> están
        activos.
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f4f7fe] text-[#1b254b] text-sm font-bold">
                <th className="py-4 px-6">Empleado</th>
                <th className="py-4 px-6">Documento</th>
                <th className="py-4 px-6">Área</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#1b254b]">
              {rows.map((row) => (
                <tr
                  key={row.employee.idEmpleado}
                  className="border-b border-[#f4f7fe] hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e1e9ff] text-[#1d3ebd] text-xs font-bold flex items-center justify-center">
                        {getInitials(row.fullName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[0.95rem]">
                          {row.fullName}
                        </span>
                        <span className="text-xs text-[#8f9bba]">
                          {row.employee.cargo ?? "Sin cargo"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {row.employee.tipoDocumento} {row.employee.numDocumento}
                  </td>
                  <td className="py-4 px-6 text-sm">{row.areaName}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.employee.activo
                          ? "bg-[#ebfbf5] text-[#05cd99]"
                          : "bg-[#f4f7fe] text-[#8f9bba]"
                      }`}
                    >
                      {row.estadoLabel}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-[#4318ff] hover:text-[#3412cb] transition-colors"
                        title="Ver QR"
                      >
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
                          <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                          <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                          <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                          <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                          <rect
                            x="7"
                            y="7"
                            width="10"
                            height="10"
                            rx="1"
                          ></rect>
                        </svg>
                      </button>
                      <button
                        className="text-[#8f9bba] hover:text-[#1b254b] transition-colors"
                        title="Editar"
                      >
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="text-[#e31a1a] hover:text-[#cc1717] transition-colors"
                        title="Eliminar"
                      >
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
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-6 text-center text-sm text-[#8f9bba]"
                  >
                    No hay empleados que coincidan con los filtros
                    seleccionados.
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
