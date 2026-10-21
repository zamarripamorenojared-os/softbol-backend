import nodemailer from 'nodemailer';

export class EmailUtil {
  public static async sendHtmlEmail(to: string, subject: string, html: string): Promise<boolean> {
    return sendMail(to, subject, html);
  }
}

export const sendMail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
      }
    });

    const info = await transporter.sendMail({
      from: '"Sistema PMS" <no-reply@pms-system.com>',
      to,
      subject,
      html
    });

    console.log('Mensaje de correo enviado: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    return false;
  }
};
