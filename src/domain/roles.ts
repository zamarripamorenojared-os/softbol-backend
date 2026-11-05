export enum SoftbolRole {
  COORDINADOR = 'Coordinador de Torneo',
  ANOTADOR = 'Anotador Oficial / Umpire',
  MANAGER = 'Manager de Equipo',
  JUGADOR = 'Jugador'
}

export interface UserPayload {
  userId: string;
  email: string;
  nombre: string;
  rol: SoftbolRole;
}

