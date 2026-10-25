import { Express } from 'express';
import { RoomsController } from './rooms_controller';
import { authorize } from '../../utils/auth_util';
import { deprecationMiddleware } from '../../middlewares/deprecation.middleware';

export class RoomRoutes {
  private controller: RoomsController;

  constructor(app: Express) {
    this.controller = new RoomsController();
    this.initRoutes(app);
  }

  private initRoutes(app: Express): void {
    // API v1 con middleware de deprecación y cabeceras Sunset/Deprecation (RFC 8594)
    app.get('/api/v1/rooms', deprecationMiddleware, this.controller.getAll);
    app.get('/api/v1/rooms/:id', deprecationMiddleware, this.controller.getById);
    app.post('/api/v1/rooms', authorize, this.controller.create);
    app.post('/api/v1/rooms/:id/checkout', authorize, this.controller.checkout);
    app.post('/api/v1/rooms/:id/finish-maintenance', authorize, this.controller.finishMaintenance);

    // API v2: Versión evolucionada del recurso
    app.get('/api/v2/rooms', this.controller.getV2);

    // Rutas legacy de retrocompatibilidad
    app.get('/rooms', deprecationMiddleware, this.controller.getAll);
    app.post('/rooms', authorize, this.controller.create);
  }
}
