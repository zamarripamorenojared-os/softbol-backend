import { AppDataSource } from '../../utils/db';
import { Task } from './tasks_entity';

export class TaskService {
  private taskRepo = AppDataSource.getRepository(Task);

  public async createTask(taskData: Partial<Task>, projectId: string, assignedUserId: string): Promise<Task> {
    const task = this.taskRepo.create({
      ...taskData,
      project: { project_id: projectId },
      project_id: projectId,
      assignedUser: { user_id: assignedUserId },
      user_id: assignedUserId
    });
    return await this.taskRepo.save(task);
  }

  public async updateTaskStatus(taskId: string, status: string): Promise<Task | null> {
    const task = await this.taskRepo.findOneBy({ task_id: taskId });
    if (!task) return null;
    task.status = status;
    return await this.taskRepo.save(task);
  }

  public async getTaskById(taskId: string): Promise<Task | null> {
    return await this.taskRepo.findOne({
      where: { task_id: taskId },
      relations: ['project', 'assignedUser', 'comments']
    });
  }

  public async getAllTasks(queryParams: any = {}): Promise<Task[]> {
    return await this.taskRepo.find({
      where: queryParams,
      relations: ['project', 'assignedUser']
    });
  }

  public async deleteTask(taskId: string): Promise<boolean> {
    const result = await this.taskRepo.delete(taskId);
    return (result.affected ?? 0) > 0;
  }
}
