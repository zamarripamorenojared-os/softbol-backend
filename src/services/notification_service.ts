import { EmailUtil } from '../utils/email_util';

export class NotificationService {
  public static async notifyTaskAssigned(email: string, taskTitle: string): Promise<boolean> {
    const subject = 'Nueva Tarea Asignada - PMS';
    const html = `<p>Se te ha asignado la tarea: <b>${taskTitle}</b></p>`;
    return await EmailUtil.sendHtmlEmail(email, subject, html);
  }
}
