import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
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

  async getStaffsByHospitalId(
    hospitalId: number,
    page: number,
    limit: number,
    search?: string,
  ): Promise<Staff[]> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff');
    queryBuilder
      .leftJoinAndSelect('staff.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('staff.user', 'user')
      .where('staff.hospital.id = :hospitalId', { hospitalId });

    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('staff.userId', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    return queryBuilder.getMany();
  }

  async updateStaff(id: number, role: Role): Promise<Staff> {
    return this.staffRepository.save({ id, role });
  }
}
