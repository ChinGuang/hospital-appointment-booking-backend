import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import Docker from 'dockerode';
import * as mysql from 'mysql2/promise';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { UserType } from './user.enum';

// Helper function to wait for MySQL to be ready
async function waitForMySQL(maxAttempts = 30, delay = 1000): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`Attempt ${i + 1} to connect to MySQL...`);
      // Now try with the test user/database
      const testConnection = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3307,
        user: 'nestuser',
        password: 'nestpass',
        database: 'testdb',
      });

      console.log('Test database connection successful!');
      await testConnection.end();
      return; // MySQL is ready
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Connection attempt ${i + 1} failed:`, error.message);
      } else {
        console.log(`Connection attempt ${i + 1} failed:`, error);
      }
      if (i === maxAttempts - 1) {
        throw new Error(`MySQL not ready after ${maxAttempts} attempts`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

describe('UserService (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let docker: Docker;
  let container: Docker.Container;

  // Increase timeout for Docker operations
  beforeAll(async () => {
    //use docker to create a test db
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
      // Container doesn't exist, continue
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

    // Wait for MySQL to be ready
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
          // Add these options for better test performance
          logging: false,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  }, 60000); // Increase timeout to 60 seconds for Docker setup

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
  }, 30000); // Increase timeout to 30 seconds

  it('should be defined', () => {
    expect(userService).toBeDefined();
  }, 10000);

  it('should create a user and validate with test db', async () => {
    const user = await userService.createUser({
      username: 'e2e_user',
      email: 'e2e@example.com',
      password: 'password123',
      userType: UserType.PATIENT,
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe('e2e_user');
    expect(user.email).toBe('e2e@example.com');

    // Should be able to retrieve user from DB
    const fetchedUser = await userService.getUser({ email: 'e2e@example.com' });
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser!.username).toBe('e2e_user');
  }, 15000);
});
