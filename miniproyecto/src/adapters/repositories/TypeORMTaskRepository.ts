import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task } from '../../domain/entities/Task';
import { Repository } from 'typeorm';
import { TaskOrmEntity } from '../../infrastructure/database/entities/TaskOrmEntity';

export class TypeORMTaskRepository implements ITaskRepository {
  constructor(private readonly typeOrmRepo: Repository<TaskOrmEntity>) {}

  async save(task: Task): Promise<void> {
    const ormEntity = this.typeOrmRepo.create({
      id: task.id,
      title: task.title,
      projectId: task.projectId,
      assignedUserId: task.assignedUserId,
      status: task.status,
      createdAt: task.createdAt
    });
    await this.typeOrmRepo.save(ormEntity);
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.typeOrmRepo.findOneBy({ id });
    if (!found) return null;
    return new Task(
      found.id,
      found.title,
      found.projectId,
      found.assignedUserId,
      found.status as any,
      found.createdAt
    );
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const list = await this.typeOrmRepo.findBy({ projectId });
    return list.map(
      (item) =>
        new Task(
          item.id,
          item.title,
          item.projectId,
          item.assignedUserId,
          item.status as any,
          item.createdAt
        )
    );
  }
}
