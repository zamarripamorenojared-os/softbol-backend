import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { IServerConfig } from './utils/config';
import config from '../server_config.json';
import { Routes } from './routes';
import { DatabaseUtil } from './utils/db';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

import path from 'path';
import YAML from 'yamljs';

export class ExpressServer {
  public static server: any = null;
  public server_config: IServerConfig = config;

  constructor() {
    const port = this.server_config.port ?? 3000;
    const app: Express = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Cargar especificación canónica OpenAPI YAML
    let openapiDoc = swaggerSpec;
    try {
      const yamlPath = path.resolve(__dirname, '../../docs/openapi.yaml');
      const loadedYaml = YAML.load(yamlPath);
      if (loadedYaml) {
        openapiDoc = loadedYaml;
      }
    } catch (e) {
      // Fallback a swaggerSpec programático
    }

    // Montaje del Endpoint Interactivo Swagger UI y especificación OpenAPI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
    app.get('/api/docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(openapiDoc);
    });
    app.get('/api/docs-json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(openapiDoc);
    });
    app.get('/docs/openapi.yaml', (req: Request, res: Response) => {
      const yamlFile = path.resolve(__dirname, '../../docs/openapi.yaml');
      res.sendFile(yamlFile);
    });

    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        name: 'SoftbolApp API',
        version: '0.1.0',
        documentation: '/api/docs',
        status: 'online'
      });
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
