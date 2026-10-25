import { Express } from 'express';
import { GuestsController } from './guests_controller';
import { authorize } from '../../utils/auth_util';

export class GuestRoutes {
  private controller: GuestsController;

  constructor(app: Express) {
    this.controller = new GuestsController();
    this.initRoutes(app);
  }

  private initRoutes(app: Express): void {
    app.get('/api/v1/guests', authorize, this.controller.getAll);
    app.get('/api/v1/guests/:id', authorize, this.controller.getById);
    app.post('/api/v1/guests', authorize, this.controller.create);
  }
}
