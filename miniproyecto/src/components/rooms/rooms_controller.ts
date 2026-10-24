import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface IRoom {
  id: string;
  room_number: string;
  type: string;
  price_per_night: number;
  capacity: number;
  status: string;
  created_at: string;
}

// Almacén en memoria de habitaciones con datos iniciales
export const roomsDb: IRoom[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    room_number: '101',
    type: 'STANDARD',
    price_per_night: 850.0,
    capacity: 2,
    status: 'DISPONIBLE',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    room_number: '201',
    type: 'SUITE',
    price_per_night: 1600.0,
    capacity: 4,
    status: 'DISPONIBLE',
    created_at: new Date().toISOString()
  }
];

export class RoomsController {
  // GET /api/v1/rooms y /rooms
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(roomsDb);
    } catch (error) {
      res.status(500).json({
        type: 'https://example.com/probs/server-error',
        title: 'Error interno del servidor',
        status: 500,
        detail: 'No se pudieron recuperar las habitaciones.',
        instance: req.originalUrl
      });
    }
  };

  // POST /api/v1/rooms y /rooms
  public create = async (req: Request, res: Response): Promise<void> => {
    const { room_number, type, price_per_night, capacity, status } = req.body;

    // Validación según RFC 7807 (422 Unprocessable Entity)
    if (!room_number || !type || price_per_night === undefined || capacity === undefined) {
      res.status(422).json({
        type: 'https://example.com/probs/validation-error',
        title: 'Entidad no procesable',
        status: 422,
        detail: 'Los campos room_number, type, price_per_night y capacity son obligatorios.',
        instance: req.originalUrl
      });
      return;
    }

    if (typeof price_per_night !== 'number' || price_per_night <= 0) {
      res.status(422).json({
        type: 'https://example.com/probs/invalid-price',
        title: 'Precio inválido',
        status: 422,
        detail: 'El precio por noche debe ser un número estrictamente positivo mayor a 0.',
        instance: req.originalUrl
      });
      return;
    }

    // Verificar unicidad de número de habitación
    const exists = roomsDb.find((r) => r.room_number === room_number);
    if (exists) {
      res.status(422).json({
        type: 'https://example.com/probs/room-conflict',
        title: 'Número de habitación duplicado',
        status: 422,
        detail: `La habitación con el número ${room_number} ya se encuentra registrada en el sistema.`,
        instance: req.originalUrl
      });
      return;
    }

    const newRoom: IRoom = {
      id: uuidv4(),
      room_number,
      type,
      price_per_night: Number(price_per_night),
      capacity: Number(capacity),
      status: status || 'DISPONIBLE',
      created_at: new Date().toISOString()
    };

    roomsDb.push(newRoom);
    res.status(201).json(newRoom);
  };
}
