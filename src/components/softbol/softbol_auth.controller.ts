import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SoftbolRole, UserPayload } from '../../domain/roles';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_softbol_jwt_token_key_2026_uas';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_softbol_token_key_2026_uas';

// Simulación de persistencia en memoria (para desacoplamiento y compatibilidad)
const usuariosDB: Map<string, any> = new Map([
  [
    'coordinador@softbol.uas.edu.mx',
    {
      id: 'usr-coord-01',
      email: 'coordinador@softbol.uas.edu.mx',
      nombre: 'Coordinador General de Liga',
      passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
      rol: SoftbolRole.COORDINADOR
    }
  ],
  [
    'smoke_test@uas.edu.mx',
    {
      id: 'usr-smoke-01',
      email: 'smoke_test@uas.edu.mx',
      nombre: 'Usuario Prueba Humo',
      passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      rol: SoftbolRole.COORDINADOR
    }
  ]
]);

export class SoftbolAuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password || !nombre) {
      res.status(400).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Bad Request',
        status: 400,
        detail: 'Los campos email, password y nombre son requeridos para el registro'
      });
      return;
    }

    if (usuariosDB.has(email)) {
      res.status(409).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Conflict',
        status: 409,
        detail: 'El correo electrónico ya se encuentra registrado en la plataforma'
      });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const assignedRole = Object.values(SoftbolRole).includes(rol) ? rol : SoftbolRole.JUGADOR;

    const nuevoUsuario = {
      id: `usr-${Date.now()}`,
      email,
      nombre,
      passwordHash,
      rol: assignedRole
    };

    usuariosDB.set(email, nuevoUsuario);

    res.status(201).json({
      message: 'Usuario registrado exitosamente en SoftbolApp',
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol
      }
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Bad Request',
        status: 400,
        detail: 'Credenciales incompletas: email y password son requeridos'
      });
      return;
    }

    const usuario = usuariosDB.get(email);
    if (!usuario) {
      res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Unauthorized',
        status: 401,
        detail: 'Credenciales inválidas: correo no registrado'
      });
      return;
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValido) {
      res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Unauthorized',
        status: 401,
        detail: 'Credenciales inválidas: contraseña incorrecta'
      });
      return;
    }

    const payload: UserPayload = {
      userId: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: usuario.id }, REFRESH_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      usuario: payload
    });
  }

  public static async me(req: any, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Unauthorized',
        status: 401,
        detail: 'Autenticación requerida'
      });
      return;
    }

    res.status(200).json({
      usuario: req.user
    });
  }

  public static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Bad Request',
        status: 400,
        detail: 'El campo refreshToken es requerido'
      });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '24h' });

      res.status(200).json({
        token: newToken,
        tokenType: 'Bearer',
        expiresIn: 86400
      });
    } catch (err) {
      res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Unauthorized',
        status: 401,
        detail: 'Refresh token inválido o expirado'
      });
    }
  }
}

