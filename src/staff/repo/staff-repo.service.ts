import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class StaffRepoService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async createStaff(payload: Staff): Promise<Staff> {
    return this.staffRepository.save(payload);
  }

  async getStaffByUserId(userId: number): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { userId },
      relations: ['role', 'role.permissions'],
    });
  }
}
