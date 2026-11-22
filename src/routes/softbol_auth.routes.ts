import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { SoftbolAuthController } from '../components/softbol/softbol_auth.controller';
import { authenticateJWT } from '../middlewares/softbol_rbac.middleware';

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Máximo 5 intentos por minuto
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    type: 'https://tools.ietf.org/html/rfc7807',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Demasiadas peticiones desde esta IP. Intente de nuevo más tarde.'
  }
});

export class SoftbolAuthRoutes {
  constructor(router: Router) {
    router.post('/auth/register', SoftbolAuthController.register);
    router.post('/auth/login', authLimiter, SoftbolAuthController.login);
    router.get('/auth/me', authenticateJWT, SoftbolAuthController.me);
    router.post('/auth/refresh-token', SoftbolAuthController.refreshToken);
  }
}

