import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Argon2Utils } from '../common/utils/argon2';
import { RoleService } from '../role/role.service';
import { StaffRepoService } from '../staff/repo/staff-repo.service';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import {
  CreateHospitalReq,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import {
  ReadHospitalByIdRes,
  ReadHospitalsReq,
  ReadHospitalsRes,
} from './dto/read-hospital.dto';
import {
  UpdateHospitalReq,
  UpdateHospitalRes,
} from './dto/update-hospital.dto';
import { HospitalSmtpSettingRepoService } from './repo/hospital-smtp-setting/hospital-smtp-setting-repo.service';
import { HospitalRepoService } from './repo/hospital/hospital-repo.service';

@Injectable()
export class HospitalService {
  constructor(
    private readonly hospitalRepoService: HospitalRepoService,
    private readonly hospitalSmtpSettingRepoService: HospitalSmtpSettingRepoService,
    private readonly userService: UserService,
    private readonly staffService: StaffRepoService,
    private readonly roleService: RoleService,
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
    const hashedPassword = await Argon2Utils.hashPassword(
      payload.admin.password,
    );
    const adminStaff = await this.userService.createUser({
      username: payload.admin.username,
      email: payload.admin.email,
      password: hashedPassword,
      userType: UserType.STAFF,
    });
    const defaultRole = await this.roleService.getDefaultStaffRole();
    await this.staffService.createStaff({
      userId: adminStaff.id,
      hospital,
      role: defaultRole,
    });
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

  async readHospitals(payload: ReadHospitalsReq): Promise<ReadHospitalsRes> {
    const page = payload.page && payload.page > 0 ? payload.page : 1;
    const limit = payload.limit && payload.limit > 0 ? payload.limit : 10;
    const skip = (page - 1) * limit;

    const hospitals = await this.hospitalRepoService.find({
      skip,
      take: limit,
    });
    return {
      message: 'Hospitals fetched successfully',
      data: hospitals,
    };
  }

  async updateHospital(
    id: number,
    payload: UpdateHospitalReq,
  ): Promise<UpdateHospitalRes> {
    const hospital = await this.hospitalRepoService.updateById(id, payload);
    return {
      message: 'Hospital updated successfully',
      data: hospital,
    };
  }
}
