import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Routes } from './routes';
import { DatabaseUtil } from './utils/db';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Montaje del Endpoint Interactivo Swagger UI y especificación JSON OpenAPI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

// Registrar rutas del sistema PMS
new Routes(app);

// Inicializar conexión a la base de datos
new DatabaseUtil();

export { app };
export default app;
