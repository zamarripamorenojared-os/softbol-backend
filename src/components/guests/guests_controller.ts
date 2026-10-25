import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface IGuest {
  id: string;
  full_name: string;
  email: string;
  document_id: string;
  phone: string;
  created_at: string;
  _links?: Record<string, { href: string; method?: string }>;
}

export const guestsDatabase: IGuest[] = [
  {
    id: 'g7f6e5d4-3333-4000-8000-000000000001',
    full_name: 'María Elena González',
    email: 'maria.gonzalez@example.com',
    document_id: 'INE-9876543210',
    phone: '+52 669 987 6543',
    created_at: new Date().toISOString()
  }
];

export const buildGuestLinks = (guest: IGuest): Record<string, { href: string; method?: string }> => ({
  self: { href: `/api/v1/guests/${guest.id}`, method: 'GET' },
  bookings: { href: `/api/v1/bookings?guest_id=${guest.id}`, method: 'GET' }
});

export class GuestsController {
  // GET /api/v1/guests
  public getAll = async (req: Request, res: Response): Promise<void> => {
    const list = guestsDatabase.map((g) => ({
      ...g,
      _links: buildGuestLinks(g)
    }));
    res.status(200).json(list);
  };

  // GET /api/v1/guests/:id
  public getById = async (req: Request, res: Response): Promise<void> => {
    const guest = guestsDatabase.find((g) => g.id === req.params.id);
    if (!guest) {
      res.status(404).json({
        type: 'https://example.com/probs/not-found',
        title: 'Huésped no encontrado',
        status: 404,
        detail: `No se encontró registro para el huésped ${req.params.id}`,
        instance: req.originalUrl
      });
      return;
    }

    res.status(200).json({
      ...guest,
      _links: buildGuestLinks(guest)
    });
  };

  // POST /api/v1/guests
  public create = async (req: Request, res: Response): Promise<void> => {
    const { full_name, email, document_id, phone } = req.body;

    if (!full_name || !email || !document_id) {
      res.status(400).json({
        type: 'https://example.com/probs/bad-request',
        title: 'Datos requeridos faltantes',
        status: 400,
        detail: 'full_name, email y document_id son campos obligatorios.',
        instance: req.originalUrl
      });
      return;
    }

    const newGuest: IGuest = {
      id: uuidv4(),
      full_name,
      email,
      document_id,
      phone: phone || '',
      created_at: new Date().toISOString()
    };

    guestsDatabase.push(newGuest);
    res.status(201).json({
      ...newGuest,
      _links: buildGuestLinks(newGuest)
    });
  };
}
