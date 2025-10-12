import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  type RegisterReq,
  RegisterReqZodType,
  RegisterResDto,
} from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(RegisterReqZodType))
  @Post('register')
  async register(@Body() body: RegisterReq): Promise<RegisterResDto> {
    return this.authService.register(body);
  }
}
