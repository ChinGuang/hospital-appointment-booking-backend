import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateHospitalReq,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import { AddressRepoService } from './repo/address/address-repo.service';
import { HospitalSmtpSettingRepoService } from './repo/hospital-smtp-setting/hospital-smtp-setting-repo.service';
import { HospitalRepoService } from './repo/hospital/hospital-repo.service';

@Injectable()
export class HospitalService {
  constructor(
    private readonly hospitalRepoService: HospitalRepoService,
    private readonly addressRepoService: AddressRepoService,
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

    const address = await this.addressRepoService.create(payload.address);
    const hospital = await this.hospitalRepoService.create({
      name: payload.name,
      licenseNumber: payload.licenseNumber,
      addressId: address.id,
    });
    if (payload.smtpSetting) {
      await this.hospitalSmtpSettingRepoService.create({
        hospitalId: hospital.id,
        ...payload.smtpSetting,
      });
    }
    return {
      message: 'Hospital created successfully',
      data: {
        id: hospital.id,
        name: hospital.name,
        licenseNumber: hospital.licenseNumber,
        address,
      },
    };
  }
}
