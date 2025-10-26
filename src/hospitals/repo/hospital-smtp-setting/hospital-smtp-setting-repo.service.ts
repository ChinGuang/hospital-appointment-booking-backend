import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtils } from 'src/common/utils/crypto';
import { Repository } from 'typeorm';
import { HospitalSmtpSetting } from '../entities/hospital.entity';

@Injectable()
export class HospitalSmtpSettingRepoService {
  constructor(
    @InjectRepository(HospitalSmtpSetting)
    private readonly hospitalSmtpSettingRepository: Repository<HospitalSmtpSetting>,
    private readonly configService: ConfigService,
  ) {
    this.APP_PASSWORD_SECRET = this.configService.getOrThrow(
      'APP_PASSWORD_SECRET',
    );
  }

  private readonly APP_PASSWORD_SECRET: string;

  async create(
    hospitalSmtpSetting: Omit<HospitalSmtpSetting, 'id'>,
  ): Promise<HospitalSmtpSetting> {
    if (hospitalSmtpSetting.appPassword) {
      hospitalSmtpSetting.appPassword = CryptoUtils.encryptAppPassword(
        this.APP_PASSWORD_SECRET,
        hospitalSmtpSetting.appPassword,
      );
    }
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
