import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthUserGuard } from '../common/guards/auth-user.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  AuthenticateResZodType,
  type AuthenticateRes,
} from './dto/authenticate.dto';
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

  @UseGuards(AuthUserGuard)
  @Post('authenticate')
  authenticate(@Req() req: { user: unknown }): AuthenticateRes {
    try {
      return AuthenticateResZodType.parse(req.user);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
