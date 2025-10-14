import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Role, Permission])],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
