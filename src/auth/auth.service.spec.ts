import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { RegisterReq } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      checkUsernameOrEmailExists: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const registerDto: RegisterReq = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should throw BadRequestException if username/email exists', async () => {
      userService.checkUsernameOrEmailExists!.mockResolvedValue(true);

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.checkUsernameOrEmailExists).toHaveBeenCalledWith(
        'newuser',
        'newuser@example.com',
      );
    });

    it('should create user and return message if username/email not exists', async () => {
      userService.checkUsernameOrEmailExists!.mockResolvedValue(false);
      userService.createUser!.mockResolvedValue({
        id: 1,
        ...registerDto,
        userType: UserType.PATIENT,
      });

      const res = await authService.register(registerDto);

      expect(userService.createUser).toHaveBeenCalledWith({
        ...registerDto,
        userType: UserType.PATIENT,
      });
      expect(res).toEqual({ message: 'User created successfully' });
    });
  });

  describe('login', () => {
    const loginReq = {
      username: 'testuser',
      password: 'secret123',
    };

    const user = {
      id: 2,
      username: 'testuser',
      email: 'user@email.com',
      userType: UserType.PATIENT,
    };

    it('should throw BadRequestException if user not found', async () => {
      userService.getUser!.mockResolvedValue(undefined);

      await expect(authService.login(loginReq)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.getUser).toHaveBeenCalledWith(
        { username: 'testuser', password: 'secret123' },
        { email: 'testuser', password: 'secret123' },
      );
    });

    it('should return message and jwt token on successful login', async () => {
      userService.getUser!.mockResolvedValue(user);
      jwtService.sign!.mockReturnValue('mocked.jwt.token');

      const result = await authService.login(loginReq);

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      });

      expect(result).toEqual({
        message: 'Login successful',
        token: 'mocked.jwt.token',
      });
    });
  });
});
