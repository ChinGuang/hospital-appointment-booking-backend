import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginReqZodType, type LoginReq, type LoginRes } from './dto/login.dto';
import {
  RegisterReqZodType,
  RegisterRes,
  type RegisterReq,
} from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(RegisterReqZodType))
  @Post('register')
  async register(@Body() body: RegisterReq): Promise<RegisterRes> {
    return this.authService.register(body);
  }

  @UsePipes(new ZodValidationPipe(LoginReqZodType))
  @Post('login')
  async login(@Body() body: LoginReq): Promise<LoginRes> {
    return this.authService.login(body);
  }
}
