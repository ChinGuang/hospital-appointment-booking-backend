import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserType } from './enums/user.enum';
import { UserService } from './user.service';

const mockUser = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashedpassword',
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('checkUsernameOrEmailExists', () => {
    it('should return true if user with username exists', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const exists = await service.checkUsernameOrEmailExists(
        'john_doe',
        'other@example.com',
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'john_doe' }, { email: 'other@example.com' }],
      });
      expect(exists).toBe(true);
    });

    it('should return true if user with email exists', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const exists = await service.checkUsernameOrEmailExists(
        'someone',
        'john@example.com',
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'someone' }, { email: 'john@example.com' }],
      });
      expect(exists).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      const exists = await service.checkUsernameOrEmailExists(
        'someone',
        'noone@example.com',
      );
      expect(exists).toBe(false);
    });
  });

  describe('createUser', () => {
    it('should save and return the created user', async () => {
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.createUser({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
        userType: UserType.PATIENT,
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
        userType: UserType.PATIENT,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should return user that matches the query', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.getUser({ username: 'john_doe' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'john_doe' }],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.getUser({ username: 'nouser' });
      expect(result).toBeNull();
    });
  });
});
