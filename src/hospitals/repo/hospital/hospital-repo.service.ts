import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepoCreateHospitalPayload } from '../../models/hospital.interface';
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

  async create(hospital: RepoCreateHospitalPayload): Promise<Hospital> {
    return this.hospitalRepository.save(hospital);
  }

  async findById(id: number): Promise<Hospital | null> {
    return this.hospitalRepository.findOne({
      where: { id },
      relations: ['address'],
    });
  }

  async find(payload: { skip?: number; take?: number }): Promise<Hospital[]> {
    const { skip = 0, take = 10 } = payload;
    return this.hospitalRepository.find({
      skip,
      take,
      relations: ['address'],
    });
  }

  async updateById(id: number, update: Partial<Hospital>): Promise<Hospital> {
    await this.hospitalRepository.update(id, update);
    const updatedHospital = await this.hospitalRepository.findOne({
      where: { id },
      relations: ['address'],
    });
    if (!updatedHospital) {
      throw new Error('Hospital not found after update');
    }
    return updatedHospital;
  }
}
