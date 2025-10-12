import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
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
}
