import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthJwtService } from '../common/services/auth-jwt/auth-jwt.service';
import { Argon2Utils } from '../common/utils/argon2';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { LoginReq, LoginRes } from './dto/login.dto';
import { RegisterReq, RegisterRes } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  async register(body: RegisterReq): Promise<RegisterRes> {
    const isExists = await this.userService.checkUsernameOrEmailExists(
      body.username,
      body.email,
    );
    if (isExists) {
      throw new BadRequestException('Username or email already exists');
    }
    const hashedPassword = await Argon2Utils.hashPassword(body.password);

    await this.userService.createUser({
      ...body,
      password: hashedPassword,
      userType: UserType.PATIENT,
    });
    return {
      message: 'User created successfully',
    };
  }

  async login(body: LoginReq): Promise<LoginRes> {
    const user = await this.userService.getUser(
      { username: body.username },
      { email: body.username },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await Argon2Utils.verifyPassword(
      user.password,
      body.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const token = this.authJwtService.sign({
      userId: user.id,
      username: user.username,
      email: user.email,
      userType: user.userType,
    });
    return {
      message: 'Login successful',
      token,
    };
  }
}
