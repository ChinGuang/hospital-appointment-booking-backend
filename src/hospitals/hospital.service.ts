import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHospitalReq,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import { ReadHospitalByIdRes } from './dto/read-hospital.dto';
import { HospitalSmtpSettingRepoService } from './repo/hospital-smtp-setting/hospital-smtp-setting-repo.service';
import { HospitalRepoService } from './repo/hospital/hospital-repo.service';

@Injectable()
export class HospitalService {
  constructor(
    private readonly hospitalRepoService: HospitalRepoService,
    private readonly hospitalSmtpSettingRepoService: HospitalSmtpSettingRepoService,
  ) {}

  async createHospital(payload: CreateHospitalReq): Promise<CreateHospitalRes> {
    const isHospitalExists =
      await this.hospitalRepoService.checkLicenseNumberExists(
        payload.licenseNumber,
        payload.address.country,
      );
    if (isHospitalExists) {
      throw new BadRequestException(
        'Hospital with same license number already exists',
      );
    }

    const hospital = await this.hospitalRepoService.create({
      name: payload.name,
      licenseNumber: payload.licenseNumber,
      address: payload.address,
    });
    if (payload.smtpSetting) {
      await this.hospitalSmtpSettingRepoService.create({
        hospital,
        ...payload.smtpSetting,
      });
    }
    return {
      message: 'Hospital created successfully',
      data: {
        id: hospital.id,
        name: hospital.name,
        licenseNumber: hospital.licenseNumber,
        address: hospital.address,
      },
    };
  }

  async readHospitalById(id: number): Promise<ReadHospitalByIdRes> {
    const hospital = await this.hospitalRepoService.findById(id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return {
      message: 'Hospital fetched successfully',
      data: hospital,
    };
  }
}
