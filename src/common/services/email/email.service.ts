import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailWithoutTemplate({
    from,
    to,
    subject,
    text,
  }: {
    from?: string;
    to: string;
    subject: string;
    text: string;
  }) {
    await this.mailerService.sendMail({
      from,
      to,
      subject,
      text,
    });
  }
}
