import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { StaffModule } from '../staff/staff.module';
import { UserModule } from '../users/user.module';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { HospitalSmtpSettingRepoModule } from './repo/hospital-smtp-setting/hospital-smtp-setting-repo.module';
import { HospitalRepoModule } from './repo/hospital/hospital-repo.module';

@Module({
  imports: [
    HospitalRepoModule,
    HospitalSmtpSettingRepoModule,
    StaffModule,
    RoleModule,
    UserModule,
  ],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
