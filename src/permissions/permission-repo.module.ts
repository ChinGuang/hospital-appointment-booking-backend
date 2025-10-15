import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRepoService } from './permission-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionRepoService],
  exports: [PermissionRepoService],
})
export class PermissionRepoModule {}
