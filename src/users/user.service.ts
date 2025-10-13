import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkUsernameOrEmailExists(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    return user !== null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUser(...query: FindOptionsWhere<User>[]): Promise<User | null> {
    return this.userRepository.findOne({ where: query });
  }
}
