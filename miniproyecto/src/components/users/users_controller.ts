import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users_service';
import { Users } from './users_entity';
import { bcryptCompare, encryptString, SERVER_CONST } from '../../utils/common';
import { hasPermission } from '../../utils/auth_util';
import { CacheUtil } from '../../utils/cache_util';
import { UsersUtil } from '../../utils/users_util';
import { sendMail } from '../../utils/email_util';

export { UsersUtil };

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  /**
   * Inicio de sesión y generación de tokens (login)
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const service = new UsersService();
    const result = await service.findAll({ email });

    if (!result.data || (result.data as Users[]).length === 0) {
      res.status(404).json({ statusCode: 404, status: 'error', message: 'Correo electrónico no encontrado' });
      return;
    }

    const user = (result.data as Users[])[0];
    const isPasswordValid = await bcryptCompare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ statusCode: 400, status: 'error', message: 'Contraseña incorrecta' });
      return;
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email, username: user.username },
      SERVER_CONST.JWTSECRET,
      { expiresIn: SERVER_CONST.ACCESS_TOKEN_EXPIRY_TIME_SECONDS }
    );

    const refreshToken = jwt.sign(
      { user_id: user.user_id, email: user.email, username: user.username },
      SERVER_CONST.JWTSECRET,
      { expiresIn: SERVER_CONST.REFRESH_TOKEN_EXPIRY_TIME_SECONDS }
    );

    res.status(200).json({
      statusCode: 200,
      status: 'success',
      data: { accessToken, refreshToken }
    });
  };

  /**
   * Registro de nuevo usuario (User Onboarding)
   */
  public addHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = { ...req.body };
      if (userData.password) {
        userData.password = await encryptString(userData.password);
      }
      if (userData.role_ids && !userData.role_id && userData.role_ids.length > 0) {
        userData.role_id = userData.role_ids[0];
      }
      const result = await this.service.create(userData);
      if (result.statusCode === 201 && result.data) {
        delete (result.data as any).password;
      }
      res.status(result.statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, status: 'error', message: error.message });
    }
  };

  /**
   * Listar usuarios con validación de permisos y sanitización de contraseñas
   */
  public getAllHandler = async (req: Request, res: Response): Promise<void> => {
    if (!hasPermission(req.user?.rights, 'get_all_users')) {
      res.status(403).json({ statusCode: 403, status: 'error', message: 'No tiene permisos para consultar usuarios' });
      return;
    }

    const service = new UsersService();
    const result = await service.findAll(req.query);

    if (result.statusCode === 200 && Array.isArray(result.data)) {
      result.data.forEach((user: any) => delete user.password);
    }

    res.status(result.statusCode).json(result);
  };

  /**
   * Consulta de usuario por ID con lectura previa de caché (Cache-Aside)
   */
  public getOneHandler = async (req: Request, res: Response): Promise<void> => {
    if (!hasPermission(req.user?.rights, 'get_details_user')) {
      res.status(403).json({ statusCode: 403, status: 'error', message: 'No autorizado' });
      return;
    }

    const userId = req.params.id;

    // 1. Intentar recuperar desde caché de Redis
    const userFromCache = await CacheUtil.get('User', userId);
    if (userFromCache) {
      res.status(200).json({ statusCode: 200, status: 'success', data: userFromCache });
      return;
    }

    // 2. Fallo de Caché (Cache Miss): consultar base de datos PostgreSQL
    const service = new UsersService();
    const result = await service.findOne(userId);
    if (result.statusCode === 200 && result.data) {
      delete (result.data as any).password;
      // 3. Almacenar resultado en caché para futuras peticiones
      await CacheUtil.set('User', userId, result.data);
    }

    res.status(result.statusCode).json(result);
  };

  public getDetailsHandler = async (req: Request, res: Response): Promise<void> => {
    return this.getOneHandler(req, res);
  };

  /**
   * Actualización de usuario
   */
  public updateHandler = async (req: Request, res: Response): Promise<void> => {
    if (!hasPermission(req.user?.rights, 'edit_user')) {
      res.status(403).json({ statusCode: 403, status: 'error', message: 'No tiene permisos para actualizar usuarios' });
      return;
    }

    const userId = req.params.id;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await encryptString(updateData.password);
    }

    const result = await this.service.update(userId, updateData);
    if (result.statusCode === 200 && result.data) {
      delete (result.data as any).password;
      await CacheUtil.set('User', userId, result.data);
    }

    res.status(result.statusCode).json(result);
  };

  /**
   * Eliminación de usuario con invalidación automática de caché
   */
  public deleteHandler = async (req: Request, res: Response): Promise<void> => {
    if (!hasPermission(req.user?.rights, 'delete_user')) {
      res.status(403).json({ statusCode: 403, status: 'error', message: 'No autorizado' });
      return;
    }

    const userId = req.params.id;
    const service = new UsersService();
    const result = await service.delete(userId);

    if (result.statusCode === 200) {
      await CacheUtil.remove('User', userId);
    }

    res.status(result.statusCode).json(result);
  };

  /**
   * Flujo de olvido de contraseña
   */
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const user = await UsersUtil.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ statusCode: 404, status: 'error', message: 'Correo electrónico no registrado' });
      return;
    }

    const resetToken = jwt.sign({ email: user.email }, SERVER_CONST.JWTSECRET, { expiresIn: '1h' });
    const resetLink = `http://127.0.0.1:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      to: email,
      subject: 'Recuperación de Contraseña - Sistema PMS',
      html: `
        <h2>Hola ${user.fullname || user.username},</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar (válido por 1 hora):</p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
      `
    };

    const emailSent = await sendMail(mailOptions.to, mailOptions.subject, mailOptions.html);
    if (emailSent) {
      res.status(200).json({ statusCode: 200, status: 'success', message: 'Enlace de recuperación enviado al correo electrónico' });
    } else {
      res.status(500).json({ statusCode: 500, status: 'error', message: 'Fallo al enviar el correo de recuperación' });
    }
  };
}
