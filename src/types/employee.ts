export type DocumentType = "CC" | "CE" | "PASAPORTE";

export interface Employee {
  idEmpleado: number;
  numDocumento: string;
  tipoDocumento: DocumentType;
  nombres: string;
  apellidos: string;
  email: string | null;
  cargo: string | null;
  idArea: number;
  idUsuario: number | null;
  fotoUrl: string | null;
  activo: boolean;
  fechaRegistro: string;
}

export interface CreateEmployeeInput {
  numDocumento: string;
  tipoDocumento: DocumentType;
  nombres: string;
  apellidos: string;
  email?: string | null;
  cargo?: string | null;
  idArea: number;
  idUsuario?: number | null;
  fotoUrl?: string | null;
  activo?: boolean;
}

export interface UpdateEmployeeInput {
  numDocumento?: string;
  tipoDocumento?: DocumentType;
  nombres?: string;
  apellidos?: string;
  email?: string | null;
  cargo?: string | null;
  idArea?: number;
  idUsuario?: number | null;
  fotoUrl?: string | null;
  activo?: boolean;
}
