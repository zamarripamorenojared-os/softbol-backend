import { Router } from 'express';
import { SoftbolAuthController } from '../components/softbol/softbol_auth.controller';
import { authenticateJWT } from '../middlewares/softbol_rbac.middleware';

export class SoftbolAuthRoutes {
  constructor(router: Router) {
    router.post('/auth/register', SoftbolAuthController.register);
    router.post('/auth/login', SoftbolAuthController.login);
    router.get('/auth/me', authenticateJWT, SoftbolAuthController.me);
    router.post('/auth/refresh-token', SoftbolAuthController.refreshToken);
  }
}

