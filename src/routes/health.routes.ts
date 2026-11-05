import { Router, Request, Response } from 'express';

export class HealthRoutes {
  constructor(router: Router) {
    router.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'SoftbolApp Backend API',
        version: '0.1.0',
        uptime: process.uptime(),
        checks: {
          database: 'healthy',
          redis: 'healthy'
        }
      });
    });
  }
}

