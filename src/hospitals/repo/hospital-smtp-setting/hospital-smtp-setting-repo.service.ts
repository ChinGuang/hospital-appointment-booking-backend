import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalSmtpSetting } from '../entities/hospital.entity';

@Injectable()
export class HospitalSmtpSettingRepoService {
  constructor(
    @InjectRepository(HospitalSmtpSetting)
    private readonly hospitalSmtpSettingRepository: Repository<HospitalSmtpSetting>,
  ) {}

  async create(
    hospitalSmtpSetting: Omit<HospitalSmtpSetting, 'id'>,
  ): Promise<HospitalSmtpSetting> {
    return this.hospitalSmtpSettingRepository.save(hospitalSmtpSetting);
  }

  async findByHospitalId(id: number): Promise<HospitalSmtpSetting | null> {
    return this.hospitalSmtpSettingRepository.findOne({
      where: {
        hospital: {
          id,
        },
      },
      relations: ['hospital', 'hospital.address'],
    });
  }
}
