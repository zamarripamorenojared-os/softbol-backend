import { Express } from 'express';
import { body } from 'express-validator';
import { UsersController } from './users_controller';
import { validate } from '../../utils/validator';
import { authorize } from '../../utils/auth_util';

export const validUserInput = [
  body('fullname').trim().notEmpty().withMessage('El nombre completo es obligatorio'),
  body('username').trim().notEmpty().isLength({ min: 4, max: 30 }).withMessage('El usuario debe tener entre 4 y 30 caracteres'),
  body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('password')
    .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres')
    .isStrongPassword({ minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    .withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo especial'),
  body('role_ids').optional().isArray().withMessage('Debe proporcionar un arreglo de UUIDs de roles válidos')
];

export class UserRoutes {
  private baseEndPoint = '/api/users';

  constructor(app: Express) {
    const controller = new UsersController();

    /**
     * @openapi
     * /api/v1/auth/login:
     *   post:
     *     summary: Inicio de sesión de usuario y obtención de token JWT
     *     description: Autentica las credenciales del usuario y genera un token JWT Bearer necesario para operar los endpoints protegidos.
     *     tags:
     *       - Autenticación
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginInput'
     *     responses:
     *       200:
     *         description: Autenticación exitosa. Retorna el token JWT.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       401:
     *         description: Credenciales incorrectas o usuario no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorRFC7807'
     */
    // Endpoints públicos de login
    app.post(`${this.baseEndPoint}/login`, controller.login);
    app.post('/api/v1/auth/login', controller.login);
    app.post('/auth/login', controller.login);
    app.post(`${this.baseEndPoint}/forgot-password`, controller.forgotPassword);
    app.post(this.baseEndPoint, validate(validUserInput), controller.addHandler);

    // Endpoints protegidos con JWT
    app.route(this.baseEndPoint)
      .get(authorize, controller.getAllHandler);

    app.route(`${this.baseEndPoint}/:id`)
      .get(authorize, controller.getOneHandler)
      .put(authorize, controller.updateHandler)
      .delete(authorize, controller.deleteHandler);
  }
}
