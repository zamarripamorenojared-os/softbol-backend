import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SoftbolRole, UserPayload } from '../domain/roles';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_softbol_jwt_token_key_2026_uas';

export interface AuthenticatedSoftbolRequest extends Request {
  user?: UserPayload;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Unauthorized',
      status: 401,
      detail: 'Cabecera Authorization ausente o formato Bearer inválido'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Unauthorized',
      status: 401,
      detail: 'Token JWT expirado o con firma no válida'
    });
  }
};

export const requireRoles = (allowedRoles: SoftbolRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as UserPayload | undefined;
    if (!user) {
      res.status(401).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Unauthorized',
        status: 401,
        detail: 'Usuario no autenticado'
      });
      return;
    }

    if (!allowedRoles.includes(user.rol)) {
      res.status(403).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Forbidden',
        status: 403,
        detail: `Acceso denegado: Se requiere uno de los siguientes roles [${allowedRoles.join(', ')}]`
      });
      return;
    }

    next();
  };
};

