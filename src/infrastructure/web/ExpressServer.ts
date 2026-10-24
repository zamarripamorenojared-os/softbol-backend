import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { TaskController } from '../../adapters/controllers/TaskController';
import { CreateTaskUseCase } from '../../use-cases/CreateTaskUseCase';
import { TypeORMTaskRepository } from '../../adapters/repositories/TypeORMTaskRepository';
import { cleanDataSource } from '../database/TypeORMConfig';
import { TaskOrmEntity } from '../database/entities/TaskOrmEntity';

export function createCleanApp(): Express {
  const app = express();
  app.use(bodyParser.json());

  const repo = cleanDataSource.getRepository(TaskOrmEntity);
  const taskRepo = new TypeORMTaskRepository(repo);
  const useCase = new CreateTaskUseCase(taskRepo);
  const controller = new TaskController(useCase);

  app.post('/api/clean-tasks', (req, res) => controller.create(req, res));
  return app;
}
