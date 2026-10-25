import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de Obsolescencia y Ciclo de Vida de Software según RFC 8594.
 * Inyecta las cabeceras estándar de la IETF:
 * - Deprecation: @<timestamp>
 * - Sunset: <fecha HTTP RFC 7231>
 */
export const deprecationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // @1761868800 corresponde al timestamp unix aproximado del 31 de octubre de 2026
  res.setHeader('Deprecation', '@1761868800');
  res.setHeader('Sunset', 'Sat, 31 Oct 2026 23:59:59 GMT');
  res.setHeader('Link', '</api/v2/rooms>; rel="successor-version"');
  next();
};
