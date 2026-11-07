import { Request, Response, NextFunction } from 'express';

export interface CreateTorneoDTO {
  nombre: string;
  temporada: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface CreateCategoriaDTO {
  nombre: string;
  genero: 'Varonil' | 'Femenil' | 'Mixto' | string;
  limite_edad?: number;
}

export interface CreateEquipoDTO {
  nombre: string;
  abreviatura?: string;
  torneo_id?: string;
  categoria_id?: string;
}

export interface CreateJugadorDTO {
  nombre: string;
  equipo_id: string;
  numero_dorsal?: number;
  posicion?: string;
}

export interface CreateJuegoDTO {
  torneo_id: string;
  equipo_local_id: string;
  equipo_visitante_id: string;
  fecha_juego: string;
  campo?: string;
}

export const validateTorneoDTO = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, temporada } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
    res.status(400).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Bad Request',
      status: 400,
      detail: 'El campo nombre es obligatorio y debe tener al menos 3 caracteres'
    });
    return;
  }
  next();
};

export const validateEquipoDTO = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
    res.status(400).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Bad Request',
      status: 400,
      detail: 'El campo nombre del equipo es obligatorio'
    });
    return;
  }
  next();
};
