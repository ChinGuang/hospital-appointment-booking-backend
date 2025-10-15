import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepoModule } from '../permissions/permission-repo.module';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionRepoModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
