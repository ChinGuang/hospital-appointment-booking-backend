import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtService } from '../common/services/auth-jwt/auth-jwt.service';
import { Argon2Utils } from '../common/utils/argon2';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { RegisterReq } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let authJwtService: Partial<Record<keyof AuthJwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      checkUsernameOrEmailExists: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
    };

    authJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: AuthJwtService, useValue: authJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('AuthService defined', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
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

      expect(userService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'newuser',
          email: 'newuser@example.com',
          userType: UserType.PATIENT,
        }),
      );
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
        NotFoundException,
      );
      expect(userService.getUser).toHaveBeenCalledWith(
        { username: 'testuser' },
        { email: 'testuser' },
      );
    });

    it('should throw BadRequestException if password is invalid', async () => {
      userService.getUser!.mockResolvedValue(user);
      // Mock Argon2Utils.verifyPassword to return false
      jest.spyOn(Argon2Utils, 'verifyPassword').mockResolvedValue(false);

      await expect(authService.login(loginReq)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return message and jwt token on successful login', async () => {
      userService.getUser!.mockResolvedValue(user);
      authJwtService.sign!.mockReturnValue('mocked.jwt.token');
      // Mock Argon2Utils.verifyPassword to return true
      jest.spyOn(Argon2Utils, 'verifyPassword').mockResolvedValue(true);
      const result = await authService.login(loginReq);

      expect(authJwtService.sign).toHaveBeenCalledWith({
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

  describe('refreshToken', () => {
    it('should return a new token', () => {
      const userPayload = {
        userId: 1,
        username: 'testuser',
        email: 'testuser@gmail.com',
        userType: UserType.PATIENT,
      };
      authJwtService.sign!.mockReturnValue('new.mocked.jwt.token');

      const result = authService.refreshToken(userPayload);

      expect(authJwtService.sign).toHaveBeenCalledWith(userPayload);
      expect(result).toEqual({
        message: 'Token refreshed successfully',
        token: 'new.mocked.jwt.token',
      });
    });
  });
});
