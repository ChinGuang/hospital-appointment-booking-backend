import { Module } from '@nestjs/common';
import { HospitalRepoModule } from '../hospitals/repo/hospital/hospital-repo.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../users/user.module';
import { StaffRepoModule } from './repo/staff-repo.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [StaffRepoModule, UserModule, RoleModule, HospitalRepoModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
