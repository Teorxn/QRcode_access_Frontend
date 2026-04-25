export interface Area {
  idArea: number;
  nombreArea: string;
  descripcion: string | null;
  activa: boolean;
}

export interface CreateAreaInput {
  nombreArea: string;
  descripcion?: string | null;
  activa?: boolean;
}

export interface UpdateAreaInput {
  nombreArea?: string;
  descripcion?: string | null;
  activa?: boolean;
}
