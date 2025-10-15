import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateById(id: number, payload: Partial<Doctor>): Promise<Doctor> {
    await this.doctorRepository.update(id, payload);
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async deleteById(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return await this.doctorRepository.remove(doctor);
  }
}
