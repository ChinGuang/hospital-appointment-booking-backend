import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { CryptoUtils } from 'src/common/utils/crypto';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    this.SMTP_HOST = this.configService.getOrThrow('SMTP_HOST');
    this.SMTP_PORT = this.configService.getOrThrow('SMTP_PORT');
    this.SMTP_SECURE = this.configService.getOrThrow('SMTP_SECURE') === 'true';
    this.SMTP_DEFAULT_EMAIL = this.configService.get('SMTP_USER');
    this.SMTP_APP_PASSWORD = this.configService.get('SMTP_APP_PASSWORD');
    this.APP_PASSWORD_SECRET = this.configService.getOrThrow(
      'APP_PASSWORD_SECRET',
    );
  }
  private readonly SMTP_HOST: string;
  private readonly SMTP_PORT: number;
  private readonly SMTP_SECURE: boolean;
  private readonly SMTP_DEFAULT_EMAIL: string | undefined;
  private readonly SMTP_APP_PASSWORD: string | undefined;
  private readonly APP_PASSWORD_SECRET: string;

  async sendEmail(payload: {
    sender: {
      email?: string;
      appPassword?: string;
    };
    mail: {
      to: string;
      subject: string;
      text: string;
    };
  }): Promise<void> {
    const authUser = payload.sender.email ?? this.SMTP_DEFAULT_EMAIL;
    const authPass = payload.sender.appPassword ?? this.SMTP_APP_PASSWORD;
    if (!authUser || !authPass) {
      throw new Error('SMTP authentication credentials are required');
    }

    const transporter = nodemailer.createTransport({
      host: this.SMTP_HOST,
      port: this.SMTP_PORT,
      secure: this.SMTP_SECURE,
      auth: {
        user: authUser,
        pass: CryptoUtils.decryptAppPassword(
          this.APP_PASSWORD_SECRET,
          authPass,
        ),
      },
    });
    try {
      const info = await transporter.sendMail({
        from: authUser,
        to: payload.mail.to,
        subject: payload.mail.subject,
        text: payload.mail.text,
      });
      console.log(`Email Info: `, JSON.stringify(info));
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
