import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface IHateoasLink {
  href: string | null;
  method?: string;
  rel?: string;
}

export interface IRoomHateoas {
  id: string;
  room_number: string;
  type: string;
  price_per_night: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  created_at: string;
  _links?: Record<string, IHateoasLink>;
}

export const roomsDatabase: IRoomHateoas[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    room_number: '101',
    type: 'STANDARD',
    price_per_night: 850.0,
    capacity: 2,
    status: 'AVAILABLE',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    room_number: '201',
    type: 'SUITE',
    price_per_night: 1600.0,
    capacity: 4,
    status: 'OCCUPIED',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    room_number: '301',
    type: 'DELUXE',
    price_per_night: 2200.0,
    capacity: 3,
    status: 'MAINTENANCE',
    created_at: new Date().toISOString()
  }
];

export const buildRoomLinks = (room: IRoomHateoas): Record<string, IHateoasLink> => {
  const links: Record<string, IHateoasLink> = {
    self: { href: `/api/v1/rooms/${room.id}`, method: 'GET' }
  };

  // Affordances dinámicos condicionados por la máquina de estados
  if (room.status === 'AVAILABLE') {
    links.book = {
      href: `/api/v1/bookings`,
      method: 'POST',
      rel: 'https://pms.uas.edu.mx/rels/book'
    };
  } else if (room.status === 'OCCUPIED') {
    links.checkout = {
      href: `/api/v1/rooms/${room.id}/checkout`,
      method: 'POST',
      rel: 'https://pms.uas.edu.mx/rels/checkout'
    };
  } else if (room.status === 'MAINTENANCE') {
    // Si está en mantenimiento, omitir reserva y proveer finalizar mantenimiento
    links['finish-maintenance'] = {
      href: `/api/v1/rooms/${room.id}/finish-maintenance`,
      method: 'POST',
      rel: 'https://pms.uas.edu.mx/rels/finish-maintenance'
    };
  }

  return links;
};

export class RoomsController {
  // GET /api/v1/rooms con Paginación Navegable (first, prev, next, last)
  public getAll = async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
    const totalItems = roomsDatabase.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedItems = roomsDatabase.slice(startIndex, startIndex + limit);

    const dataWithLinks = paginatedItems.map((room) => ({
      ...room,
      _links: buildRoomLinks(room)
    }));

    const baseUrl = '/api/v1/rooms';
    res.status(200).json({
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
      data: dataWithLinks,
      _links: {
        self: { href: `${baseUrl}?page=${page}&limit=${limit}` },
        first: { href: `${baseUrl}?page=1&limit=${limit}` },
        prev: { href: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null },
        next: { href: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null },
        last: { href: `${baseUrl}?page=${totalPages}&limit=${limit}` }
      }
    });
  };

  // GET /api/v1/rooms/:id
  public getById = async (req: Request, res: Response): Promise<void> => {
    const room = roomsDatabase.find((r) => r.id === req.params.id);
    if (!room) {
      res.status(404).json({
        type: 'https://example.com/probs/not-found',
        title: 'Habitación no encontrada',
        status: 404,
        detail: `No se encontró ninguna habitación con el ID ${req.params.id}`,
        instance: req.originalUrl
      });
      return;
    }

    res.status(200).json({
      ...room,
      _links: buildRoomLinks(room)
    });
  };

  // POST /api/v1/rooms
  public create = async (req: Request, res: Response): Promise<void> => {
    const { room_number, type, price_per_night, capacity, status } = req.body;

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

    const newRoom: IRoomHateoas = {
      id: uuidv4(),
      room_number,
      type,
      price_per_night: Number(price_per_night),
      capacity: Number(capacity),
      status: status || 'AVAILABLE',
      created_at: new Date().toISOString()
    };

    roomsDatabase.push(newRoom);
    res.status(201).json({
      ...newRoom,
      _links: buildRoomLinks(newRoom)
    });
  };

  // POST /api/v1/rooms/:id/checkout
  public checkout = async (req: Request, res: Response): Promise<void> => {
    const room = roomsDatabase.find((r) => r.id === req.params.id);
    if (!room) {
      res.status(404).json({
        type: 'https://example.com/probs/not-found',
        title: 'Habitación no encontrada',
        status: 404,
        detail: 'ID inexistente.',
        instance: req.originalUrl
      });
      return;
    }

    if (room.status !== 'OCCUPIED') {
      res.status(400).json({
        type: 'https://example.com/probs/invalid-state-transition',
        title: 'Transición inválida',
        status: 400,
        detail: `Solo se puede realizar check-out en habitaciones con estado OCCUPIED. Estado actual: ${room.status}`,
        instance: req.originalUrl
      });
      return;
    }

    // Transición a AVAILABLE
    room.status = 'AVAILABLE';
    res.status(200).json({
      ...room,
      _links: buildRoomLinks(room)
    });
  };

  // POST /api/v1/rooms/:id/finish-maintenance
  public finishMaintenance = async (req: Request, res: Response): Promise<void> => {
    const room = roomsDatabase.find((r) => r.id === req.params.id);
    if (!room) {
      res.status(404).json({ status: 404, detail: 'Habitación no encontrada' });
      return;
    }

    room.status = 'AVAILABLE';
    res.status(200).json({
      ...room,
      _links: buildRoomLinks(room)
    });
  };

  // GET /api/v2/rooms (Versión 2 de Evolución - Precios desglosados en moneda e impuestos)
  public getV2 = async (req: Request, res: Response): Promise<void> => {
    const v2Data = roomsDatabase.map((room) => {
      const taxRate = 0.16; // IVA 16%
      const basePrice = room.price_per_night;
      const taxAmount = Number((basePrice * taxRate).toFixed(2));
      const totalPrice = Number((basePrice + taxAmount).toFixed(2));

      return {
        id: room.id,
        room_number: room.room_number,
        type: room.type,
        pricing: {
          currency: 'MXN',
          base_price: basePrice,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total_price: totalPrice
        },
        capacity: room.capacity,
        status: room.status,
        _links: buildRoomLinks(room)
      };
    });

    res.status(200).json(v2Data);
  };
}
