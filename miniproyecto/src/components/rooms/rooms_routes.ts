import { Express } from 'express';
import { RoomsController } from './rooms_controller';
import { authorize } from '../../utils/auth_util';

export class RoomRoutes {
  private controller: RoomsController;

  constructor(app: Express) {
    this.controller = new RoomsController();
    this.initRoutes(app);
  }

  private initRoutes(app: Express): void {
    /**
     * @openapi
     * /api/v1/rooms:
     *   get:
     *     summary: Obtener listado de habitaciones
     *     description: Recupera el catálogo completo de habitaciones registradas en el sistema PMS.
     *     tags:
     *       - Habitaciones
     *     responses:
     *       200:
     *         description: Catálogo de habitaciones obtenido exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/RoomResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorRFC7807'
     */
    app.get('/api/v1/rooms', this.controller.getAll);
    app.get('/rooms', this.controller.getAll);

    /**
     * @openapi
     * /api/v1/rooms:
     *   post:
     *     summary: Registrar una nueva habitación
     *     description: Crea una nueva habitación en el inventario hotelero del sistema PMS. Requiere autenticación con token JWT mediante cabecera Bearer.
     *     tags:
     *       - Habitaciones
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       description: Datos necesarios para la creación de la habitación
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RoomInput'
     *     responses:
     *       201:
     *         description: Habitación creada y registrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RoomResponse'
     *       401:
     *         description: No autorizado. Cabecera Authorization Bearer faltante o token inválido.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorRFC7807'
     *       403:
     *         description: Prohibido. El usuario no cuenta con privilegios de administrador para gestionar habitaciones.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorRFC7807'
     *       422:
     *         description: Entidad no procesable. Faltan campos requeridos o el precio/capacidad no cumplen las restricciones de validación.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorRFC7807'
     */
    app.post('/api/v1/rooms', authorize, this.controller.create);
    app.post('/rooms', authorize, this.controller.create);
  }
}
