import { AppDataSource } from './db';
import { Project } from '../components/projects/projects_entity';

export class ProjectsUtil {
  public static async getProjectMemberEmails(projectId: string): Promise<string[]> {
    try {
      const projectRepo = AppDataSource.getRepository(Project);
      const project = await projectRepo.findOne({
        where: { project_id: projectId },
        relations: ['owner']
      });
      if (!project) return [];
      const emails: string[] = [];
      if (project.owner && project.owner.email) {
        emails.push(project.owner.email);
      }
      return emails;
    } catch {
      return [];
    }
  }
}
