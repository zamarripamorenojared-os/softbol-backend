import { Response, NextFunction } from 'express';
import { AppDataSource } from '../../utils/db';
import { Comments } from './comments_entity';
import { AuthenticatedRequest } from '../../utils/auth_util';

export class CommentController {
  private commentRepo = AppDataSource.getRepository(Comments);

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { comment, task_id } = req.body;
      const userId = req.user?.userId || req.user?.user_id || 'system-user';

      const newComment = this.commentRepo.create({
        comment,
        task_id,
        user_id: userId
      });

      const saved = await this.commentRepo.save(newComment);
      res.status(201).json({
        statusCode: 201,
        status: 'success',
        message: 'Comentario agregado exitosamente',
        data: saved
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comments = await this.commentRepo.find({
        where: req.query,
        relations: ['user', 'task']
      });
      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: comments
      });
    } catch (error) {
      next(error);
    }
  };

  public getOne = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comment = await this.commentRepo.findOne({
        where: { comment_id: req.params.id },
        relations: ['user', 'task']
      });
      if (!comment) {
        res.status(404).json({ statusCode: 404, status: 'error', message: 'Comentario no encontrado' });
        return;
      }
      res.status(200).json({ statusCode: 200, status: 'success', data: comment });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.commentRepo.delete(req.params.id);
      if (result.affected === 0) {
        res.status(404).json({ statusCode: 404, status: 'error', message: 'Comentario no encontrado' });
        return;
      }
      res.status(200).json({ statusCode: 200, status: 'success', message: 'Comentario eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  };
}
