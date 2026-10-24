import { Response, NextFunction } from 'express';
import { TaskService } from './tasks_service';
import { AuthenticatedRequest } from '../../utils/auth_util';
import { ProjectsUtil } from '../../utils/projects_util';
import { NotificationUtil } from '../../utils/notification_util';

export class TaskController {
  private taskService = new TaskService();

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { project_id, user_id, ...taskData } = req.body;
      const assignedUserId = user_id || req.user?.userId || req.user?.user_id;

      if (!project_id) {
        res.status(400).json({
          statusCode: 400,
          status: 'fail',
          message: 'El identificador del proyecto (project_id) es obligatorio'
        });
        return;
      }

      const newTask = await this.taskService.createTask(taskData, project_id, assignedUserId);

      // Recuperar los miembros del proyecto para notificar asíncronamente con BullMQ
      try {
        const memberEmails = await ProjectsUtil.getProjectMemberEmails(project_id);
        for (const email of memberEmails) {
          await NotificationUtil.enqueueEmail(
            email,
            `Nueva Tarea Creada: ${newTask.name}`,
            `<p>Hola, se ha creado la tarea <b>${newTask.name}</b> en tu proyecto.</p>`
          );
        }
      } catch (err) {
        console.error('Error al encolar notificación de tarea:', err);
      }

      res.status(201).json({
        statusCode: 201,
        status: 'success',
        message: 'Tarea creada exitosamente',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks(req.query);
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  };

  public getOne = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({
          statusCode: 404,
          status: 'error',
          message: 'El identificador UUID de tarea no existe en PostgreSQL'
        });
        return;
      }
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: task
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.body;
      const updated = await this.taskService.updateTaskStatus(req.params.id, status);
      if (!updated) {
        res.status(404).json({
          statusCode: 404,
          status: 'error',
          message: 'Tarea no encontrada'
        });
        return;
      }
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: 'Estado de tarea actualizado correctamente',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const success = await this.taskService.deleteTask(req.params.id);
      if (!success) {
        res.status(404).json({
          statusCode: 404,
          status: 'error',
          message: 'Tarea no encontrada'
        });
        return;
      }
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: 'Tarea eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };
}
