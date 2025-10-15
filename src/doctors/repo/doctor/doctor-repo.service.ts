import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../entities/doctor.entity';

@Injectable()
export class DoctorRepoService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctor(payload: Omit<Doctor, 'id'>): Promise<Doctor> {
    return this.doctorRepository.save(payload);
  }
}
