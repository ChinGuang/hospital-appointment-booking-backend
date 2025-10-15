import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Doctor } from '../../entities/doctor.entity';

@Injectable()
export class DoctorRepoService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(payload: Omit<Doctor, 'id'>): Promise<Doctor> {
    return this.doctorRepository.save(payload);
  }

  async find(options: { page: number; limit: number }, hospitalId?: number) {
    const { page, limit } = options;
    const whereCondition: FindOptionsWhere<Doctor> = {};
    if (hospitalId) {
      whereCondition.hospital = {
        id: hospitalId,
      };
    }
    return await this.doctorRepository.find({
      where: whereCondition,
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findById(id: number): Promise<Doctor | null> {
    return await this.doctorRepository.findOneBy({ id });
  }
}
