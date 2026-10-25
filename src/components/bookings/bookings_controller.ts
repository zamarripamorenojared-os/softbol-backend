import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { roomsDatabase, buildRoomLinks } from '../rooms/rooms_controller';

export interface IBookingHateoas {
  id: string;
  room_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
  _links?: Record<string, { href: string; method: string; rel?: string }>;
}

export const bookingsDatabase: IBookingHateoas[] = [
  {
    id: 'b8c3d2e1-1111-4000-8000-000000000001',
    room_id: 'a1b2c3d4-0001-4000-8000-000000000001',
    guest_name: 'Roberto Domínguez',
    check_in: '2026-11-01',
    check_out: '2026-11-05',
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  }
];

export const buildBookingLinks = (booking: IBookingHateoas): Record<string, { href: string; method: string; rel?: string }> => {
  const links: Record<string, { href: string; method: string; rel?: string }> = {
    self: { href: `/api/v1/bookings/${booking.id}`, method: 'GET' },
    room: { href: `/api/v1/rooms/${booking.room_id}`, method: 'GET' }
  };

  // Affordances dinámicos condicionados por la máquina de estados:
  // Si está CONFIRMED -> enlaces hacia cancel (DELETE) y process_payment (POST).
  // Si pasa a CANCELLED o COMPLETED -> dichos enlaces desaparecen dinámicamente.
  if (booking.status === 'CONFIRMED') {
    links.cancel = {
      href: `/api/v1/bookings/${booking.id}`,
      method: 'DELETE',
      rel: 'https://pms.uas.edu.mx/rels/cancel-booking'
    };
    links.process_payment = {
      href: `/api/v1/bookings/${booking.id}/payments`,
      method: 'POST',
      rel: 'https://pms.uas.edu.mx/rels/process-payment'
    };
  }

  return links;
};

export class BookingsController {
  // GET /api/v1/bookings
  public getAll = async (req: Request, res: Response): Promise<void> => {
    const list = bookingsDatabase.map((b) => ({
      ...b,
      _links: buildBookingLinks(b)
    }));
    res.status(200).json(list);
  };

  // GET /api/v1/bookings/:id
  public getById = async (req: Request, res: Response): Promise<void> => {
    const booking = bookingsDatabase.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({
        type: 'https://example.com/probs/not-found',
        title: 'Reserva no encontrada',
        status: 404,
        detail: `No existe la reserva con ID ${req.params.id}`,
        instance: req.originalUrl
      });
      return;
    }

    res.status(200).json({
      ...booking,
      _links: buildBookingLinks(booking)
    });
  };

  // POST /api/v1/bookings
  public create = async (req: Request, res: Response): Promise<void> => {
    const { room_id, guest_name, check_in, check_out } = req.body;

    if (!room_id || !guest_name || !check_in || !check_out) {
      res.status(400).json({
        type: 'https://example.com/probs/bad-request',
        title: 'Datos incompletos',
        status: 400,
        detail: 'Los campos room_id, guest_name, check_in y check_out son obligatorios.',
        instance: req.originalUrl
      });
      return;
    }

    const room = roomsDatabase.find((r) => r.id === room_id);
    if (!room) {
      res.status(404).json({
        type: 'https://example.com/probs/not-found',
        title: 'Habitación no encontrada',
        status: 404,
        detail: 'La habitación especificada no existe.',
        instance: req.originalUrl
      });
      return;
    }

    if (room.status !== 'AVAILABLE') {
      res.status(422).json({
        type: 'https://example.com/probs/room-unavailable',
        title: 'Habitación no disponible',
        status: 422,
        detail: `No se puede reservar la habitación porque se encuentra en estado ${room.status}.`,
        instance: req.originalUrl
      });
      return;
    }

    // Actualizar estado de habitación a OCCUPIED
    room.status = 'OCCUPIED';

    const newBooking: IBookingHateoas = {
      id: uuidv4(),
      room_id,
      guest_name,
      check_in,
      check_out,
      status: 'CONFIRMED',
      created_at: new Date().toISOString()
    };

    bookingsDatabase.push(newBooking);
    res.status(201).json({
      ...newBooking,
      _links: buildBookingLinks(newBooking)
    });
  };

  // DELETE /api/v1/bookings/:id (Cancelar reserva)
  public cancel = async (req: Request, res: Response): Promise<void> => {
    const booking = bookingsDatabase.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ status: 404, detail: 'Reserva no encontrada' });
      return;
    }

    if (booking.status !== 'CONFIRMED') {
      res.status(400).json({
        type: 'https://example.com/probs/invalid-action',
        title: 'Acción no permitida',
        status: 400,
        detail: `La reserva ya no puede ser cancelada en su estado actual (${booking.status}).`,
        instance: req.originalUrl
      });
      return;
    }

    // Cambiar estado a CANCELLED (los enlaces cancel y process_payment desaparecerán dinámicamente)
    booking.status = 'CANCELLED';

    // Liberar la habitación
    const room = roomsDatabase.find((r) => r.id === booking.room_id);
    if (room) {
      room.status = 'AVAILABLE';
    }

    res.status(200).json({
      ...booking,
      _links: buildBookingLinks(booking)
    });
  };

  // POST /api/v1/bookings/:id/payments (Procesar pago de reserva)
  public processPayment = async (req: Request, res: Response): Promise<void> => {
    const booking = bookingsDatabase.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ status: 404, detail: 'Reserva no encontrada' });
      return;
    }

    if (booking.status !== 'CONFIRMED') {
      res.status(400).json({
        type: 'https://example.com/probs/payment-not-allowed',
        title: 'Pago no aplicable',
        status: 400,
        detail: 'Solo se pueden procesar pagos para reservas confirmadas.',
        instance: req.originalUrl
      });
      return;
    }

    // Transición a COMPLETED (los enlaces dinámicos desaparecerán)
    booking.status = 'COMPLETED';
    res.status(200).json({
      ...booking,
      _links: buildBookingLinks(booking)
    });
  };
}
