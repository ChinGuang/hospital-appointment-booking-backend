import { Injectable, NotFoundException } from '@nestjs/common';
import { Argon2Utils } from '../common/utils/argon2';
import { HospitalRepoService } from '../hospitals/repo/hospital/hospital-repo.service';
import { RoleService } from '../role/role.service';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { CreateStaffReq, CreateStaffRes } from './dto/create-staff.dto';
import {
  ViewStaffByIdRes,
  ViewStaffsReq,
  ViewStaffsRes,
} from './dto/view-staff.dto';
import { StaffRepoService } from './repo/staff-repo.service';

@Injectable()
export class StaffService {
  constructor(
    private readonly userService: UserService,
    private readonly staffRepoService: StaffRepoService,
    private readonly roleService: RoleService,
    private readonly hospitalRepoService: HospitalRepoService,
  ) {}

  async createStaff(
    payload: CreateStaffReq,
    hospitalId: number,
  ): Promise<CreateStaffRes> {
    const role = await this.roleService.getRoleById(payload.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const hospital = await this.hospitalRepoService.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    const hashedPassword = await Argon2Utils.hashPassword(payload.password);
    const user = await this.userService.createUser({
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
      userType: UserType.STAFF,
    });
    await this.staffRepoService.createStaff({
      userId: user.id,
      user: user,
      hospital,
      role,
    });
    return {
      message: 'Staff created successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        hospitalId: hospital.id,
      },
    };
  }

  async viewStaff(id: number, hospitalId: number): Promise<ViewStaffByIdRes> {
    const staff = await this.staffRepoService.getStaffByUserId(id);
    if (!staff || staff.hospital.id !== hospitalId) {
      throw new NotFoundException('Staff not found');
    }
    return {
      message: 'Staff found successfully',
      data: {
        id: staff.userId,
        username: staff.user.username,
        email: staff.user.email,
        userType: staff.user.userType,
        hospitalId: staff.hospital.id,
      },
    };
  }

  async viewStaffs(
    query: ViewStaffsReq,
    hospitalId: number,
  ): Promise<ViewStaffsRes> {
    const { page, limit, search } = query;
    const staffs = await this.staffRepoService.getStaffsByHospitalId(
      hospitalId,
      page,
      limit,
      search,
    );
    return {
      message: 'Staffs found successfully',
      data: staffs.map((staff) => ({
        id: staff.userId,
        username: staff.user.username,
        email: staff.user.email,
        userType: staff.user.userType,
        hospitalId: staff.hospital.id,
      })),
    };
  }
}
