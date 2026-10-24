import { DataSource, QueryRunner } from 'typeorm';
import { TaskEntity, TaskStatus } from '../entities/task.entity';
import { ProjectEntity } from '../entities/project.entity';

export class TaskTransactionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Asigna una tarea a un proyecto asegurando que no se exceda el límite de tareas activas.
   * Utiliza nivel SERIALIZABLE para evitar el sesgo de escritura (Write Skew).
   */
  public async assignTaskWithLimit(
    projectId: string,
    title: string,
    assignedUserId: string
  ): Promise<TaskEntity> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Iniciar transacción con nivel de aislamiento SERIALIZABLE
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1. Verificar invariante de negocio: Máximo 5 tareas en progreso por proyecto
      const activeTasksCount = await queryRunner.manager.count(TaskEntity, {
        where: {
          project: { id: projectId },
          status: TaskStatus.IN_PROGRESS
        }
      });

      if (activeTasksCount >= 5) {
        throw new Error('Límite alcanzado: El proyecto ya posee 5 tareas activas en progreso.');
      }

      // 2. Crear y guardar la nueva tarea
      const newTask = queryRunner.manager.create(TaskEntity, {
        title,
        status: TaskStatus.IN_PROGRESS,
        project: { id: projectId } as ProjectEntity,
        assignedUser: { id: assignedUserId }
      });

      const savedTask = await queryRunner.manager.save(newTask);

      // 3. Confirmar la transacción
      await queryRunner.commitTransaction();
      return savedTask;
    } catch (error) {
      // Revertir todos los cambios en caso de fallo
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el QueryRunner al pool de conexiones
      await queryRunner.release();
    }
  }
}
