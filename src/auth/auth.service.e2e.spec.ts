import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import Docker from 'dockerode';
import * as mysql from 'mysql2/promise';

import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from '../common/services/auth-jwt/auth-jwt.service';
import { User } from '../users/entities/user.entity';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';

// Helper function to wait for MySQL to be ready
async function waitForMySQL(maxAttempts = 30, delay = 1000): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const testConnection = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3307,
        user: 'nestuser',
        password: 'nestpass',
        database: 'testdb',
      });
      await testConnection.end();
      return; // MySQL is ready
    } catch {
      if (i === maxAttempts - 1) {
        throw new Error(`MySQL not ready after ${maxAttempts} attempts`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

describe('AuthService (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let docker: Docker;
  let container: Docker.Container;

  beforeAll(async () => {
    docker = new Docker();

    // Clean up any existing test container
    try {
      const existingContainer = docker.getContainer('testdb');
      if (
        await existingContainer
          .inspect()
          .then((inspect) => inspect.State.Running)
      ) {
        await existingContainer.stop();
      }
      container = existingContainer;
    } catch {
      try {
        // Ensure the image exists (engines don't auto-pull on create)
        const image = 'mysql:8.0';
        await new Promise<void>((resolve, reject) => {
          void docker.pull(image, (err, stream) => {
            if (err) return reject(new Error(String(err)));
            docker.modem.followProgress(stream, (err2: Error) =>
              err2 ? reject(err2) : resolve(),
            );
          });
        });
      } catch (err) {
        console.error('Error pulling MySQL image:', err);
      }
      container = await docker.createContainer({
        Image: 'mysql:8.0',
        name: 'testdb',
        HostConfig: {
          PortBindings: { '3306/tcp': [{ HostPort: '3307' }] },
        },
        Env: [
          'MYSQL_ROOT_PASSWORD=root123',
          'MYSQL_DATABASE=testdb',
          'MYSQL_USER=nestuser',
          'MYSQL_PASSWORD=nestpass',
        ],
      });
    }

    await container.start();
    await waitForMySQL();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3307,
          username: 'nestuser',
          password: 'nestpass',
          database: 'testdb',
          entities: [User],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: 'test_jwt_secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [UserService, AuthService, AuthJwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
  }, 60000);

  afterAll(async () => {
    try {
      if (app) {
        await app.close();
      }
    } catch (error) {
      console.error('Error closing app:', error);
    }
    try {
      if (container) {
        await container.stop();
        await container.remove();
      }
    } catch (error) {
      console.error('Error cleaning up container:', error);
    }
  }, 30000);

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return success message', async () => {
      const res = await authService.register({
        username: 'e2e_auth_user',
        email: 'e2e_auth_user@example.com',
        password: 'e2epass123',
      });
      expect(res).toEqual({ message: 'User created successfully' });

      // Ensure user is in DB
      const user = await userService.getUser({ username: 'e2e_auth_user' });
      expect(user).toBeDefined();
      expect(user!.email).toBe('e2e_auth_user@example.com');
    });

    it('should throw BadRequestException for duplicate username/email', async () => {
      // Create user first
      const result = await authService.register({
        username: 'dup_user',
        email: 'dup_user@example.com',
        password: 'dup123pass',
      });

      expect(result).toStrictEqual({
        message: 'User created successfully',
      });

      await expect(
        authService.register({
          username: 'dup_user',
          email: 'dup_user@example.com',
          password: 'something',
        }),
      ).rejects.toThrow(/already exists/);
    });
  });

  describe('login', () => {
    const loginUser = {
      username: 'login_user',
      email: 'login_user@example.com',
      password: 'loginuserpass',
    };

    beforeEach(async () => {
      // Clear test user if exists and create anew
      const existing = await userService.getUser({
        username: loginUser.username,
      });
      if (!existing) {
        await authService.register(loginUser);
      }
    });

    it('should login successfully with correct username/password', async () => {
      const res = await authService.login({
        username: 'login_user',
        password: 'loginuserpass',
      });
      expect(res).toHaveProperty('message', 'Login successful');
      expect(res).toHaveProperty('token');
      expect(typeof res.token).toBe('string');
      expect(res.token.length).toBeGreaterThan(10);
    });

    it('should login successfully with email as username', async () => {
      const res = await authService.login({
        username: 'login_user@example.com',
        password: 'loginuserpass',
      });
      expect(res).toHaveProperty('message', 'Login successful');
      expect(res).toHaveProperty('token');
    });

    it('should throw BadRequestException for wrong password', async () => {
      await expect(
        authService.login({
          username: 'login_user',
          password: 'wrongpass',
        }),
      ).rejects.toThrow('Invalid password');
    });

    it('should throw BadRequestException for nonexistent user', async () => {
      await expect(
        authService.login({
          username: 'no_such_user',
          password: 'irrelevant',
        }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('refreshToken', () => {
    const userPayload = {
      userId: 1,
      username: 'testuser',
      email: 'testuser@gmail.com',
      userType: UserType.PATIENT,
    };
    it('should return a new JWT token with valid user payload', () => {
      const res = authService.refreshToken(userPayload);
      expect(res).toHaveProperty('message', 'Token refreshed successfully');
      expect(res).toHaveProperty('token');
      expect(typeof res.token).toBe('string');
      expect(res.token.length).toBeGreaterThan(10);
    });
  });
});
