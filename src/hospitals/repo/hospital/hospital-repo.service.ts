import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';

@Injectable()
export class HospitalRepoService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  async checkLicenseNumberExists(
    licenseNumber: string,
    country: string,
  ): Promise<boolean> {
    return this.hospitalRepository
      .createQueryBuilder('hospital')
      .where('hospital.licenseNumber = :licenseNumber', { licenseNumber })
      .andWhere('hospital.country = :country', { country })
      .getCount()
      .then((count) => count > 0);
  }

  async create(hospital: Omit<Hospital, 'id'>): Promise<Hospital> {
    return this.hospitalRepository.save(hospital);
  }
}
