import areasData from "../../../data/areas.json";
import empleadosData from "../../../data/empleados.json";
import codigosQrData from "../../../data/codigos_qr.json";
import registrosAccesoData from "../../../data/registros_acceso.json";
import usuariosSistemaData from "../../../data/usuarios_sistema.json";
import type { Area } from "@/types/area";
import type { Employee } from "@/types/employee";
import type { AccessMovement, AccessRecord, AccessResult } from "@/types/history";
import type { QrCode } from "@/types/qr";
import type { SystemUser, SystemUserRole } from "@/types/user";

type RawArea = {
  id_area: number;
  nombre_area: string;
  descripcion: string | null;
  activa: boolean;
};

type RawEmployee = {
  id_empleado: number;
  num_documento: string;
  tipo_documento: "CC" | "CE" | "PASAPORTE";
  nombres: string;
  apellidos: string;
  email: string | null;
  cargo: string | null;
  id_area: number;
  id_usuario: number | null;
  foto_url: string | null;
  activo: boolean;
  fecha_registro: string;
};

type RawQrCode = {
  id_qr: number;
  id_empleado: number;
  codigo_hash: string;
  fecha_generacion: string;
  activo: boolean;
};

type RawAccessRecord = {
  id_registro: number;
  id_qr: number;
  fecha_hora: string;
  tipo_movimiento: AccessMovement;
  resultado: AccessResult;
};

type RawSystemUser = {
  id_usuario: number;
  username: string;
  password_hash: string;
  rol: SystemUserRole;
  nombre_completo: string;
  activo: boolean;
  ultimo_acceso: string | null;
};

const areas = (areasData as RawArea[]).map((row) => ({
  idArea: row.id_area,
  nombreArea: row.nombre_area,
  descripcion: row.descripcion,
  activa: row.activa,
}));

const employees = (empleadosData as RawEmployee[]).map((row) => ({
  idEmpleado: row.id_empleado,
  numDocumento: row.num_documento,
  tipoDocumento: row.tipo_documento,
  nombres: row.nombres,
  apellidos: row.apellidos,
  email: row.email,
  cargo: row.cargo,
  idArea: row.id_area,
  idUsuario: row.id_usuario,
  fotoUrl: row.foto_url,
  activo: row.activo,
  fechaRegistro: row.fecha_registro,
}));

const qrCodes = (codigosQrData as RawQrCode[]).map((row) => ({
  idQr: row.id_qr,
  idEmpleado: row.id_empleado,
  codigoHash: row.codigo_hash,
  fechaGeneracion: row.fecha_generacion,
  activo: row.activo,
}));

const initialAccessRecords = (registrosAccesoData as RawAccessRecord[]).map((row) => ({
  idRegistro: row.id_registro,
  idQr: row.id_qr,
  fechaHora: row.fecha_hora,
  tipoMovimiento: row.tipo_movimiento,
  resultado: row.resultado,
}));

const systemUsers = (usuariosSistemaData as RawSystemUser[]).map((row) => ({
  idUsuario: row.id_usuario,
  username: row.username,
  rol: row.rol,
  nombreCompleto: row.nombre_completo,
  activo: row.activo,
  ultimoAcceso: row.ultimo_acceso,
}));

let accessRecordsState: AccessRecord[] = [...initialAccessRecords];

function getNextAccessRecordId(records: AccessRecord[]): number {
  return records.reduce((max, row) => Math.max(max, row.idRegistro), 0) + 1;
}

export const mockDb = {
  getAreas: (): Area[] => [...areas],
  getEmployees: (): Employee[] => [...employees],
  getQrCodes: (): QrCode[] => [...qrCodes],
  getAccessRecords: (): AccessRecord[] => [...accessRecordsState],
  getSystemUsers: (): SystemUser[] => [...systemUsers],
  appendAccessRecord: (payload: {
    idQr: number;
    tipoMovimiento: AccessMovement;
    resultado: AccessResult;
    fechaHora?: string;
  }): AccessRecord => {
    const next: AccessRecord = {
      idRegistro: getNextAccessRecordId(accessRecordsState),
      idQr: payload.idQr,
      fechaHora: payload.fechaHora ?? new Date().toISOString(),
      tipoMovimiento: payload.tipoMovimiento,
      resultado: payload.resultado,
    };

    accessRecordsState = [next, ...accessRecordsState];
    return next;
  },
};
