import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { IServerConfig } from './utils/config';
import config from '../server_config.json';
import { Routes } from './routes';
import { DatabaseUtil } from './utils/db';

export class ExpressServer {
  public static server: any = null;
  public server_config: IServerConfig = config;

  constructor() {
    const port = this.server_config.port ?? 3000;
    const app: Express = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', (req: Request, res: Response) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PMS Backend API - Proyecto</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #1e293b; border-radius: 16px; padding: 36px; max-width: 600px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
            h1 { color: #38bdf8; margin-top: 0; font-size: 26px; }
            p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
            .badge { display: inline-block; background: #059669; color: #ecfdf5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
            .endpoints { background: #0f172a; padding: 16px; border-radius: 8px; margin-top: 20px; border: 1px solid #334155; }
            .endpoints h3 { margin-top: 0; color: #e2e8f0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            ul { list-style: none; padding-left: 0; margin-bottom: 0; }
            li { padding: 6px 0; font-family: monospace; font-size: 13px; color: #cbd5e1; }
            .method { color: #38bdf8; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">● SERVIDOR ACTIVO</span>
            <h1>PMS Backend API en Línea</h1>
            <p>El servidor backend modular con arquitectura limpia, autenticación JWT, RBAC y TypeORM está funcionando correctamente en el puerto 3000.</p>
            <div class="endpoints">
              <h3>Endpoints disponibles:</h3>
              <ul>
                <li><span class="method">GET</span> /ping &rarr; Respuesta pong de salud</li>
                <li><span class="method">POST</span> /api/users/login &rarr; Autenticación JWT</li>
                <li><span class="method">GET/POST</span> /api/roles &rarr; Gestión de roles</li>
                <li><span class="method">GET/POST</span> /api/projects &rarr; Gestión de proyectos</li>
                <li><span class="method">GET/POST</span> /api/tasks &rarr; Gestión de tareas</li>
                <li><span class="method">GET/POST</span> /api/comments &rarr; Gestión de comentarios</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `);
    });

    app.get('/ping', (req: Request, res: Response) => {
      res.send('pong');
    });

    // Conectar rutas centralizadas
    const routes = new Routes(app);
    if (routes) {
      console.log('Server Routes started for server');
    }

    // Conectar base de datos
    new DatabaseUtil();

    ExpressServer.server = app.listen(port, () => {
      console.log(`Server is running on port ${port} with pid = ${process.pid}`);
    });
  }

  public closeServer(): void {
    if (ExpressServer.server) {
      ExpressServer.server.close(() => {
        console.log('Server closed gracefully');
        process.exit(0);
      });
    }
  }
}
