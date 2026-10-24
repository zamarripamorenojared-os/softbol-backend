import { Express, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ProjectController } from './projects_controller';
import { authorize } from '../../utils/auth_util';

export const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del proyecto es obligatorio')
    .isLength({ min: 3, max: 60 }).withMessage('El nombre debe contener entre 3 y 60 caracteres'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('La fecha de inicio debe tener un formato ISO8601 válido'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('La fecha de fin debe tener un formato ISO8601 válido')
    .custom((endDate, { req }) => {
      const start = req.body.startDate || req.body.start_time;
      if (start && new Date(endDate) <= new Date(start)) {
        throw new Error('La fecha de fin debe ser estrictamente posterior a la fecha de inicio');
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        statusCode: 400,
        status: 'fail',
        message: 'Error de validación en los datos de entrada',
        errors: errors.array()
      });
      return;
    }
    next();
  }
];

export class ProjectRoutes {
  private baseEndPoint = '/api/projects';

  constructor(app: Express) {
    const controller = new ProjectController();

    app.post(
      `${this.baseEndPoint}/transaccion-atomica`,
      authorize,
      validateCreateProject,
      controller.createWithAtomicTransaction
    );

    app.route(this.baseEndPoint)
      .get(authorize, controller.getAll)
      .post(authorize, validateCreateProject, controller.create);

    app.route(`${this.baseEndPoint}/:id`)
      .get(authorize, controller.getOne)
      .delete(authorize, controller.delete);
  }
}
