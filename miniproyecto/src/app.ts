import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Routes } from './routes';
import { DatabaseUtil } from './utils/db';

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

// Registrar rutas del sistema PMS
new Routes(app);

// Inicializar conexión a la base de datos
new DatabaseUtil();

export { app };
export default app;
