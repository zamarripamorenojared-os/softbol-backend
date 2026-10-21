import { AppDataSource } from '../../utils/db';
import { Project } from './projects_entity';
import { User } from '../users/users_entity';
import { Task } from '../tasks/tasks_entity';

export class ProjectService {
  private projectRepo = AppDataSource.getRepository(Project);

  public async createProject(projectData: Partial<Project>, ownerId: string): Promise<Project> {
    const project = this.projectRepo.create({
      ...projectData,
      owner: { user_id: ownerId } as User,
      owner_id: ownerId
    });
    return await this.projectRepo.save(project);
  }

  public async getProjectById(projectId: string): Promise<Project | null> {
    return await this.projectRepo.findOne({
      where: { project_id: projectId },
      relations: ['owner', 'tasks']
    });
  }

  public async deleteProject(projectId: string): Promise<boolean> {
    const result = await this.projectRepo.delete(projectId);
    return (result.affected ?? 0) > 0;
  }

  public async getAllProjectsCustom(queryParams: any = {}): Promise<Project[]> {
    const qb = this.projectRepo.createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.tasks', 'task')
      .select([
        'project.project_id',
        'project.name',
        'project.description',
        'project.status',
        'project.created_at',
        'owner.user_id',
        'owner.username',
        'owner.email',
        'task.task_id',
        'task.name',
        'task.status'
      ]);

    if (queryParams.status) {
      qb.andWhere('project.status = :status', { status: queryParams.status });
    }

    if (queryParams.search) {
      qb.andWhere('project.name ILIKE :search', { search: `%${queryParams.search}%` });
    }

    qb.orderBy('project.created_at', 'DESC');
    return await qb.getMany();
  }
}

export class ProjectServiceTransaction {
  public async createProjectWithDefaultTask(projectData: any, ownerId: string): Promise<Project> {
    const queryRunner = AppDataSource.createQueryRunner();

    // 1. Conexión e inicio explícito de la transacción SQL
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Inserción de la entidad Proyecto
      const project = queryRunner.manager.create(Project, {
        ...projectData,
        owner: { user_id: ownerId },
        owner_id: ownerId
      });
      const savedProject = await queryRunner.manager.save(project);

      // 3. Inserción de la Tarea Inicial por Defecto
      const defaultTask = queryRunner.manager.create(Task, {
        name: `Planificación Inicial - ${savedProject.name}`,
        description: 'Tarea generada automáticamente al crear el proyecto',
        status: 'pending',
        priority: 'high',
        project: savedProject,
        project_id: savedProject.project_id,
        assignedUser: { user_id: ownerId },
        user_id: ownerId
      });
      await queryRunner.manager.save(defaultTask);

      // 4. Confirmación atómica de todos los cambios
      await queryRunner.commitTransaction();
      return savedProject;
    } catch (error) {
      // 5. Reversión completa en caso de cualquier excepción
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 6. Liberación obligatoria del cliente del pool de conexiones
      await queryRunner.release();
    }
  }
}
