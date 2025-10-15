import { Injectable, NotFoundException } from '@nestjs/common';
import { Argon2Utils } from '../common/utils/argon2';
import { HospitalRepoService } from '../hospitals/repo/hospital/hospital-repo.service';
import { RoleService } from '../role/role.service';
import { UserType } from '../users/enums/user.enum';
import { UserService } from '../users/user.service';
import { CreateStaffReq, CreateStaffRes } from './dto/create-staff.dto';
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
    const hashedPassword = await Argon2Utils.hashPassword(payload.password);
    const user = await this.userService.createUser({
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
      userType: UserType.STAFF,
    });
    const role = await this.roleService.getRoleById(payload.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const hospital = await this.hospitalRepoService.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    await this.staffRepoService.createStaff({
      ...payload,
      userId: user.id,
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
}
