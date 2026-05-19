import type { SystemUserRole } from "@/types/user";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    idUsuario: number;
    username: string;
    rol: SystemUserRole;
    nombreCompleto: string;
  };
}

export interface AuthUser {
  idUsuario: number;
  username: string;
  rol: SystemUserRole;
  nombreCompleto: string;
}
