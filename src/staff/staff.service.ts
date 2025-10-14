import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async getStaffByUserId(userId: number): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { userId },
      relations: ['role', 'role.permissions'],
    });
  }
}
