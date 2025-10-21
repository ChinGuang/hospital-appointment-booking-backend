import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'),
          port: +configService.getOrThrow<string>('SMTP_PORT'),
          tls: {
            rejectUnauthorized: false,
          },
          // For Test Environment
          secure: false,

          // For Production Environment
          // secure: true,
          // auth: {
          //   user: configService.getOrThrow<string>('SMTP_USER'),
          //   pass: configService.getOrThrow<string>('SMTP_APP_PASSWORD'),
          // },
        },
        defaults: {
          from: configService.getOrThrow<string>('DEFAULT_SENDER_EMAIL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
