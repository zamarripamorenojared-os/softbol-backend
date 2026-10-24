import { Response, NextFunction } from 'express';
import { ProjectService, ProjectServiceTransaction } from './projects_service';
import { AuthenticatedRequest } from '../../utils/auth_util';

export class ProjectController {
  private projectService = new ProjectService();
  private transactionService = new ProjectServiceTransaction();

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user?.userId || req.user?.user_id || 'system-user';
      const newProject = await this.projectService.createProject(req.body, ownerId);
      res.status(201).json({
        statusCode: 201,
        status: 'success',
        message: 'Proyecto creado exitosamente',
        data: newProject
      });
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(409).json({
          statusCode: 409,
          status: 'error',
          message: 'Conflicto: Ya existe un proyecto registrado con ese nombre'
        });
        return;
      }
      next(error);
    }
  };

  public createWithAtomicTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.user?.userId || req.user?.user_id || 'system-user';
      const newProject = await this.transactionService.createProjectWithDefaultTask(req.body, ownerId);
      res.status(201).json({
        statusCode: 201,
        status: 'success',
        message: 'Proyecto y tarea inicial creados atómicamente',
        data: newProject
      });
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(409).json({
          statusCode: 409,
          status: 'error',
          message: 'Conflicto: Ya existe un proyecto registrado con ese nombre'
        });
        return;
      }
      next(error);
    }
  };

  public getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await this.projectService.getAllProjectsCustom(req.query);
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: projects
      });
    } catch (error) {
      next(error);
    }
  };

  public getOne = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      if (!project) {
        res.status(404).json({
          statusCode: 404,
          status: 'error',
          message: 'El identificador UUID de proyecto no existe en PostgreSQL'
        });
        return;
      }
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: project
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const success = await this.projectService.deleteProject(req.params.id);
      if (!success) {
        res.status(404).json({
          statusCode: 404,
          status: 'error',
          message: 'Proyecto no encontrado'
        });
        return;
      }
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: 'Proyecto eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };
}
