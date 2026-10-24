export interface TaskEntity {
  id?: string;
  task_id?: string;
  name: string;
  description: string;
  status?: string;
}

export interface ITaskRepository {
  create(task: TaskEntity): Promise<TaskEntity>;
  findById(id: string): Promise<TaskEntity | null>;
}

export class TaskRepository implements ITaskRepository {
  private tasks: Map<string, TaskEntity> = new Map();

  public async create(task: TaskEntity): Promise<TaskEntity> {
    const id = task.id || task.task_id || `tsk-${Date.now()}`;
    const saved = { ...task, id, task_id: id };
    this.tasks.set(id, saved);
    return saved;
  }

  public async findById(id: string): Promise<TaskEntity | null> {
    return this.tasks.get(id) || null;
  }
}
