import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailWithoutTemplate({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    const result = (await this.mailerService.sendMail({
      to,
      subject,
      text,
    })) as unknown;
    console.log(JSON.stringify(result));
  }
}
