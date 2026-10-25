import { Express } from 'express';
import { BookingsController } from './bookings_controller';
import { authorize } from '../../utils/auth_util';

export class BookingRoutes {
  private controller: BookingsController;

  constructor(app: Express) {
    this.controller = new BookingsController();
    this.initRoutes(app);
  }

  private initRoutes(app: Express): void {
    app.get('/api/v1/bookings', authorize, this.controller.getAll);
    app.get('/api/v1/bookings/:id', authorize, this.controller.getById);
    app.post('/api/v1/bookings', authorize, this.controller.create);
    app.delete('/api/v1/bookings/:id', authorize, this.controller.cancel);
    app.post('/api/v1/bookings/:id/payments', authorize, this.controller.processPayment);
  }
}
