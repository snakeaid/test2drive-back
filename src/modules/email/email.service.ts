import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly smtp: Transporter;
  private readonly emailAddress: string;
  private readonly logger: Logger;

  public constructor() {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = Number(process.env.EMAIL_HOST);
    const emailLogin = process.env.EMAIL_LOGIN;
    const emailPassword = process.env.EMAIL_PASSWORD;
    this.smtp = createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailLogin,
        pass: emailPassword,
      },
    });
    this.emailAddress = emailLogin;

    this.logger = new Logger(EmailService.name);
  }

  public async sendEmail(subject: string, message: string): Promise<void> {
    this.logger.log('Sending email...');
    this.logger.debug(`Email subject: ${subject}`);
    this.logger.debug(`Email text: ${message}`);

    await this.smtp.sendMail({
      from: this.emailAddress,
      to: this.emailAddress,
      subject: subject,
      html: message,
    });
  }
}
