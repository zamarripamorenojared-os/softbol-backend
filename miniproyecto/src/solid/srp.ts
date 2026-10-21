export class Task {
  constructor(public title: string, public id: string = `tsk-${Date.now()}`) {}
}

export interface ITaskRepository {
  save(task: Task): Promise<void>;
}

export interface INotificationService {
  notifyTaskCreated(task: Task, userEmail: string): Promise<void>;
}

export class TaskValidator {
  static validateTitle(title: string): void {
    if (!title || title.length < 3) {
      throw new Error("El título de la tarea debe tener al menos 3 caracteres.");
    }
  }
}

export class TaskServiceGood {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService: INotificationService
  ) {}

  async createTask(title: string, userEmail: string): Promise<Task> {
    TaskValidator.validateTitle(title);
    const task = new Task(title);
    await this.taskRepository.save(task);
    await this.notificationService.notifyTaskCreated(task, userEmail);
    return task;
  }
}
