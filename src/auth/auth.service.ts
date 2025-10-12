import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { LoginReq, LoginRes } from './dto/login.dto';
import { RegisterReq, RegisterRes } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(body: RegisterReq): Promise<RegisterRes> {
    const isExists = await this.userService.checkUsernameOrEmailExists(
      body.username,
      body.email,
    );
    if (isExists) {
      throw new BadRequestException('Username or email already exists');
    }

    await this.userService.createUser({
      ...body,
      userType: UserType.PATIENT,
    });
    return {
      message: 'User created successfully',
    };
  }

  async login(body: LoginReq): Promise<LoginRes> {
    const user = await this.userService.getUser(
      { username: body.username, password: body.password },
      { email: body.username, password: body.password },
    );
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
    return {
      message: 'Login successful',
      token: '1234567890',
    };
  }
}
