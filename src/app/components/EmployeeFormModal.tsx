"use client";

import React, { useState } from "react";
import { employeesApi } from "@/lib/api";
import type { Area } from "@/types/area";
import type { DocumentType, Employee } from "@/types/employee";
import Modal from "@/app/components/Modal";

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
  areas: Area[];
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
];

type FormErrors = Partial<Record<string, string>>;

export default function EmployeeFormModal({
  open,
  onClose,
  onSuccess,
  employee,
  areas,
}: EmployeeFormModalProps) {
  const isEditing = employee !== null;

  const [tipoDocumento, setTipoDocumento] = useState<DocumentType>(employee?.tipoDocumento ?? "CC");
  const [numDocumento, setNumDocumento] = useState(employee?.numDocumento ?? "");
  const [nombres, setNombres] = useState(employee?.nombres ?? "");
  const [apellidos, setApellidos] = useState(employee?.apellidos ?? "");
  const [cargo, setCargo] = useState(employee?.cargo ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [idArea, setIdArea] = useState<number | "">(employee?.idArea ?? "");
  const [activo, setActivo] = useState(employee?.activo ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!numDocumento.trim()) newErrors.numDocumento = "El número de documento es obligatorio";
    if (!nombres.trim()) newErrors.nombres = "Los nombres son obligatorios";
    if (!apellidos.trim()) newErrors.apellidos = "Los apellidos son obligatorios";
    if (idArea === "") newErrors.idArea = "Debe seleccionar un área";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "El email no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await employeesApi.update(String(employee!.idEmpleado), {
          numDocumento: numDocumento.trim(),
          tipoDocumento,
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          cargo: cargo.trim() || null,
          email: email.trim() || null,
          idArea: idArea as number,
          activo,
        });
      } else {
        await employeesApi.create({
          numDocumento: numDocumento.trim(),
          tipoDocumento,
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          cargo: cargo.trim() || null,
          email: email.trim() || null,
          idArea: idArea as number,
          activo,
        });
      }
      onSuccess();
      onClose();
    } catch {
      alert("Error al guardar el empleado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Empleado" : "Registrar Nuevo Empleado"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">Tipo Documento</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value as DocumentType)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">
              N° Documento <span className="text-red-500">*</span>
            </label>
            <input
              value={numDocumento}
              onChange={(e) => setNumDocumento(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
              placeholder="123456789"
            />
            {errors.numDocumento && <span className="text-xs text-red-500">{errors.numDocumento}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
              placeholder="Carlos"
            />
            {errors.nombres && <span className="text-xs text-red-500">{errors.nombres}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
              placeholder="Mendoza"
            />
            {errors.apellidos && <span className="text-xs text-red-500">{errors.apellidos}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">Cargo</label>
            <input
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
              placeholder="Desarrollador"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1b254b]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
              placeholder="carlos@email.com"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#1b254b]">
            Área <span className="text-red-500">*</span>
          </label>
          <select
            value={idArea}
            onChange={(e) => setIdArea(Number(e.target.value))}
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1b254b] focus:outline-none focus:border-[#4318ff]"
          >
            <option value="">Seleccione un área</option>
            {areas.map((area) => (
              <option key={area.idArea} value={area.idArea}>
                {area.nombreArea}
              </option>
            ))}
          </select>
          {errors.idArea && <span className="text-xs text-red-500">{errors.idArea}</span>}
        </div>

        {isEditing && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-4 h-4 text-[#1d3ebd] border-[#e2e8f0] rounded"
            />
            <label htmlFor="activo" className="text-sm text-[#1b254b]">Empleado activo</label>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#1b254b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#1d3ebd] rounded-lg hover:bg-[#183196] transition-colors disabled:opacity-50"
          >
            {submitting ? "Guardando..." : isEditing ? "Guardar Cambios" : "Registrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
