import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from './auth-jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          // JWT "expiresIn" must be a number of seconds OR a string, not always a number
          // Don't coerce to a number; just use string or the default as string (e.g. '3600s')
          expiresIn: configService.get('JWT_EXPIRES_IN') ?? '3600s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
