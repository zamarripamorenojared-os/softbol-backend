import * as nodemailer from 'nodemailer';
import Queue from 'bull';

export class NotificationUtil {
  private static transporter: nodemailer.Transporter;
  private static emailQueue = new Queue('emailQueue', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

  constructor(config?: any) {
    if (config) {
      NotificationUtil.transporter = nodemailer.createTransport({
        host: config.smtp_host || process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: config.smtp_port || Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: config.smtp_user || process.env.SMTP_USER || 'ethereal_user',
          pass: config.smtp_pass || process.env.SMTP_PASS || 'ethereal_pass'
        }
      });
    } else if (!NotificationUtil.transporter) {
      NotificationUtil.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'ethereal_user',
          pass: process.env.SMTP_PASS || 'ethereal_pass'
        }
      });
    }
  }

  // Encolamiento asíncrono no bloqueante
  public static async enqueueEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await NotificationUtil.emailQueue.add({
        to,
        subject,
        body
      });
    } catch (error: any) {
      console.error(`[ERROR] Fallo al encolar email => ${error.message}`);
    }
  }

  // Envío directo para acciones críticas (ej. Forgot Password)
  public static async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      if (!NotificationUtil.transporter) {
        new NotificationUtil();
      }
      const mailOptions = {
        from: 'no-reply@pms.com',
        to,
        subject,
        html: body
      };
      const status = await NotificationUtil.transporter.sendMail(mailOptions);
      return !!status.messageId;
    } catch (error: any) {
      console.error(`[ERROR] Fallo al enviar email => ${error.message}`);
      return false;
    }
  }
}
