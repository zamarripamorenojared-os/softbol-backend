import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Routes } from './routes';
import { DatabaseUtil } from './utils/db';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

import path from 'path';
import YAML from 'yamljs';

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargar especificación canónica OpenAPI YAML
let openapiDoc = swaggerSpec;
try {
  const yamlPath = path.resolve(__dirname, '../docs/openapi.yaml');
  const loadedYaml = YAML.load(yamlPath);
  if (loadedYaml) {
    openapiDoc = loadedYaml;
  }
} catch (e) {
  // Fallback
}

// Montaje del Endpoint Interactivo Swagger UI y especificación JSON OpenAPI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.get('/api/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openapiDoc);
});
app.get('/docs/openapi.yaml', (req: Request, res: Response) => {
  const yamlFile = path.resolve(__dirname, '../docs/openapi.yaml');
  res.sendFile(yamlFile);
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
