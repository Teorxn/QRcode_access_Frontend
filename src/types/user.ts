export type SystemUserRole = "admin" | "operador" | "visor";

export interface SystemUser {
  idUsuario: number;
  username: string;
  rol: SystemUserRole;
  nombreCompleto: string;
  activo: boolean;
  ultimoAcceso: string | null;
}

export interface CreateSystemUserInput {
  username: string;
  password: string;
  rol: SystemUserRole;
  nombreCompleto: string;
  activo?: boolean;
}

export interface UpdateSystemUserInput {
  username?: string;
  password?: string;
  rol?: SystemUserRole;
  nombreCompleto?: string;
  activo?: boolean;
}
