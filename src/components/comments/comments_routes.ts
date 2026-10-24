import { Express } from 'express';
import { CommentController } from './comments_controller';
import { authorize } from '../../utils/auth_util';

export class CommentRoutes {
  private baseEndPoint = '/api/comments';

  constructor(app: Express) {
    const controller = new CommentController();

    app.route(this.baseEndPoint)
      .get(authorize, controller.getAll)
      .post(authorize, controller.create);

    app.route(`${this.baseEndPoint}/:id`)
      .get(authorize, controller.getOne)
      .delete(authorize, controller.delete);
  }
}
