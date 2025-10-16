import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../role/entities/role.entity';
import { Staff } from '../entities/staff.entity';
import { StaffRepoService } from './staff-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Role, Permission])],
  providers: [StaffRepoService],
  exports: [StaffRepoService],
})
export class StaffRepoModule {}
