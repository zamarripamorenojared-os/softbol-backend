import { Express } from 'express';
import { TaskController } from './tasks_controller';
import { authorize } from '../../utils/auth_util';

export class TaskRoutes {
  private baseEndPoint = '/api/tasks';

  constructor(app: Express) {
    const controller = new TaskController();

    app.route(this.baseEndPoint)
      .get(authorize, controller.getAll)
      .post(authorize, controller.create);

    app.route(`${this.baseEndPoint}/:id`)
      .get(authorize, controller.getOne)
      .delete(authorize, controller.delete);

    app.put(`${this.baseEndPoint}/:id/status`, authorize, controller.updateStatus);
  }
}
